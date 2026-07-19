import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';
import { env } from '../config/env';
import { MemoryService, ReportRow } from '../memory/memory.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { ResearchAgent } from '../agents/research.agent';
import { MatchingAgent } from '../agents/matching.agent';
import { ReportAgent } from '../agents/report.agent';
import { OutreachAgent } from '../agents/outreach.agent';
import { PaymentsService } from '../payments/payments.service';

const QUEUE_NAME = 'scout-pipeline';

/**
 * Orchestrates the post-interview flow:
 *   research → investor matching → preview + paywall → (payment) → full report
 *
 * Jobs run on BullMQ when REDIS_URL is set; otherwise they run in-process so
 * local dev needs no Redis.
 */
@Injectable()
export class PipelineService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PipelineService.name);
  private queue: Queue | null = null;
  private worker: Worker | null = null;

  constructor(
    private readonly memory: MemoryService,
    private readonly whatsapp: WhatsappService,
    private readonly researchAgent: ResearchAgent,
    private readonly matchingAgent: MatchingAgent,
    private readonly reportAgent: ReportAgent,
    private readonly outreachAgent: OutreachAgent,
    private readonly payments: PaymentsService,
  ) {}

  onModuleInit() {
    if (!env.redisUrl) {
      this.logger.warn('REDIS_URL not set — pipeline jobs run in-process');
      return;
    }
    const connection = { url: env.redisUrl } as never;
    this.queue = new Queue(QUEUE_NAME, { connection });
    this.worker = new Worker(
      QUEUE_NAME,
      async (job) => {
        if (job.name === 'research') await this.runResearchPipeline(job.data.startupId);
        if (job.name === 'deliver') await this.runDelivery(job.data.reportId);
      },
      { connection, concurrency: 2 },
    );
    this.worker.on('failed', (job, err) =>
      this.logger.error(`job ${job?.name} failed: ${err.message}`),
    );
  }

  async onModuleDestroy() {
    await this.worker?.close();
    await this.queue?.close();
  }

  async enqueueResearch(startupId: string): Promise<void> {
    if (this.queue) {
      await this.queue.add('research', { startupId }, { attempts: 2, backoff: { type: 'exponential', delay: 30000 } });
    } else {
      this.runResearchPipeline(startupId).catch((err) =>
        this.logger.error(`inline research failed: ${err?.stack ?? err}`),
      );
    }
  }

  async enqueueDelivery(reportId: string): Promise<void> {
    if (this.queue) {
      await this.queue.add('deliver', { reportId }, { attempts: 3, backoff: { type: 'exponential', delay: 15000 } });
    } else {
      this.runDelivery(reportId).catch((err) =>
        this.logger.error(`inline delivery failed: ${err?.stack ?? err}`),
      );
    }
  }

  /** research → matching → preview message with paywall link */
  async runResearchPipeline(startupId: string): Promise<void> {
    const startup = await this.memory.startupById(startupId);
    const user = await this.memory.userById(startup.user_id);
    const researchRow = await this.memory.createResearch(startupId);

    try {
      const research = await this.researchAgent.run(startup.profile);
      await this.memory.saveResearch(researchRow.id, {
        status: 'complete',
        startup_summary: research.startup_summary,
        industry_summary: research.industry_summary,
        strengths: research.strengths,
        weaknesses: research.weaknesses,
        ideal_investor_profile: research.ideal_investor_profile,
        funding_stage: research.funding_stage,
        sources: research.sources,
      });

      const ranked = await this.matchingAgent.run(startup.profile, research);
      if (ranked.length === 0) {
        await this.sendAndRecord(
          user.wa_phone,
          startup.conversation_id,
          `I've finished researching your startup — but I couldn't find strong matches in my investor base for your exact stage and geography yet. I'm expanding coverage; I'll message you as soon as I have a solid list. 🙏`,
        );
        return;
      }

      await this.memory.saveMatches(
        startupId,
        ranked.map((r) => ({
          investor_id: r.investor.id,
          rank: r.rank,
          confidence: r.confidence,
          why_matched: r.why_matched,
        })),
      );

      const matches = await this.memory.matchesForStartup(startupId, 50);
      const checkoutUrl = await this.payments.createCheckout(startupId);
      const preview = this.reportAgent.renderPreview(matches, matches.length, checkoutUrl);
      await this.sendAndRecord(user.wa_phone, startup.conversation_id, preview);
      if (startup.conversation_id) await this.memory.setStage(startup.conversation_id, 'preview');
    } catch (err) {
      this.logger.error(`pipeline failed for startup ${startupId}: ${err}`);
      await this.memory.saveResearch(researchRow.id, { status: 'failed', error: String(err) });
      await this.sendAndRecord(
        user.wa_phone,
        startup.conversation_id,
        `Hit a snag while researching — sorry about that. 😅 Send me any message and I'll retry.`,
      );
      throw err;
    }
  }

  /** After payment: generate outreach, unlock and deliver the full report. */
  async runDelivery(reportId: string): Promise<void> {
    const report = await this.memory.reportById(reportId);
    const startup = await this.memory.startupById(report.startup_id);
    const user = await this.memory.userById(startup.user_id);
    const research = await this.memory.latestResearch(startup.id);
    if (!research) throw new Error(`no research for startup ${startup.id}`);

    const matches = await this.memory.matchesForStartup(startup.id, 50);
    const researchOutput = {
      startup_summary: research.startup_summary ?? '',
      industry_summary: research.industry_summary ?? '',
      strengths: research.strengths ?? [],
      weaknesses: research.weaknesses ?? [],
      ideal_investor_profile: research.ideal_investor_profile ?? '',
      funding_stage: research.funding_stage ?? '',
      sources: research.sources ?? [],
    };

    // Personalized outreach for the top matches (the rest on demand via the
    // assistant, which has full context).
    for (const match of matches.slice(0, 10)) {
      if (match.outreach || !match.investors) continue;
      try {
        const outreach = await this.outreachAgent.generate(
          startup.profile,
          researchOutput,
          match.investors,
          match.why_matched,
        );
        await this.memory.saveOutreach(match.id, outreach);
        match.outreach = outreach;
      } catch (err) {
        this.logger.warn(`outreach generation failed for ${match.investors.firm}: ${err}`);
      }
    }

    const content = this.reportAgent.buildContent(research, matches);
    await this.memory.unlockReport(report.id, content);
    const fullReport = this.reportAgent.renderFullReport(startup, content);
    await this.sendAndRecord(user.wa_phone, startup.conversation_id, fullReport);
    if (startup.conversation_id) await this.memory.setStage(startup.conversation_id, 'assistant');
  }

  private async sendAndRecord(
    phone: string,
    conversationId: string | null,
    text: string,
  ): Promise<void> {
    await this.whatsapp.sendText(phone, text);
    if (conversationId) await this.memory.recordOutbound(conversationId, text);
  }
}
