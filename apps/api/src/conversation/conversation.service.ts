import { Injectable, Logger } from '@nestjs/common';
import { OpenAiService, ChatTurn } from '../lib/openai.service';
import { MemoryService, ConversationRow, UserRow } from '../memory/memory.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { PipelineService } from '../pipeline/pipeline.service';
import { PaymentsService } from '../payments/payments.service';
import { InterviewTurnSchema, missingFields } from './profile';
import {
  GREETING,
  RESEARCH_STARTED,
  STILL_RESEARCHING,
  assistantSystemPrompt,
  interviewSystemPrompt,
} from './prompts';
import { env } from '../config/env';

export interface InboundMessage {
  waMessageId: string;
  fromPhone: string;
  text: string;
  profileName?: string;
}

/**
 * The conversation agent: routes every inbound WhatsApp message based on the
 * founder's stage in the journey (interview → researching → preview →
 * assistant) and produces the reply.
 */
@Injectable()
export class ConversationService {
  private readonly logger = new Logger(ConversationService.name);

  constructor(
    private readonly openai: OpenAiService,
    private readonly memory: MemoryService,
    private readonly whatsapp: WhatsappService,
    private readonly pipeline: PipelineService,
    private readonly payments: PaymentsService,
  ) {}

  async handleInbound(msg: InboundMessage): Promise<void> {
    const user = await this.memory.upsertUser(msg.fromPhone, msg.profileName);
    const conversation = await this.memory.activeConversation(user.id);

    const isNew = await this.memory.recordInbound(conversation.id, msg.waMessageId, msg.text);
    if (!isNew) return; // webhook redelivery

    switch (conversation.stage) {
      case 'interview':
        return this.handleInterview(user, conversation, msg.text);
      case 'researching':
        return this.handleResearching(user, conversation);
      case 'preview':
        return this.handlePreview(user, conversation, msg.text);
      case 'unlocked':
      case 'assistant':
        return this.handleAssistant(user, conversation, msg.text);
    }
  }

  // ── interview ─────────────────────────────────────────────────────

  private async handleInterview(
    user: UserRow,
    conversation: ConversationRow,
    text: string,
  ): Promise<void> {
    const history = await this.memory.history(conversation.id);

    // Very first contact: deterministic greeting per the product script.
    if (!history.some((m) => m.role === 'assistant')) {
      await this.reply(user, conversation, GREETING);
      return;
    }

    const startup = await this.memory.startupForConversation(user.id, conversation.id);
    const turn = await this.openai.json({
      system: interviewSystemPrompt(startup.profile),
      turns: history as ChatTurn[],
      schema: InterviewTurnSchema,
    });

    const merged = await this.memory.mergeProfile(
      startup.id,
      (turn.profile_updates ?? {}) as typeof startup.profile,
    );

    if (turn.interview_complete && missingFields(merged).length === 0) {
      await this.memory.markProfileComplete(startup.id);
      await this.memory.setStage(conversation.id, 'researching');
      await this.reply(user, conversation, `${turn.reply}\n\n${RESEARCH_STARTED}`);
      await this.pipeline.enqueueResearch(startup.id);
      return;
    }

    await this.reply(user, conversation, turn.reply);
  }

  // ── researching ───────────────────────────────────────────────────

  private async handleResearching(user: UserRow, conversation: ConversationRow): Promise<void> {
    const startup = await this.memory.latestStartupForUser(user.id);
    const research = startup ? await this.memory.latestResearch(startup.id) : null;

    if (startup && research?.status === 'failed') {
      await this.reply(user, conversation, `Retrying your research now — give me a few minutes. 🔁`);
      await this.pipeline.enqueueResearch(startup.id);
      return;
    }
    await this.reply(user, conversation, STILL_RESEARCHING);
  }

  // ── preview / paywall ─────────────────────────────────────────────

  private async handlePreview(
    user: UserRow,
    conversation: ConversationRow,
    text: string,
  ): Promise<void> {
    const startup = await this.memory.latestStartupForUser(user.id);
    if (!startup) {
      await this.reply(user, conversation, STILL_RESEARCHING);
      return;
    }
    // Whatever they say at this stage, the useful answer is the unlock link —
    // but let the assistant answer questions too, with the link appended.
    const wantsLink = /unlock|pay|link|report|buy|price/i.test(text);
    // A fresh session each time keeps links unexpired; the webhook is
    // idempotent so duplicate sessions are harmless.
    const checkoutUrl = await this.payments.createCheckout(startup.id);
    if (wantsLink) {
      await this.reply(
        user,
        conversation,
        `Here you go — unlock your full investor report (all matches + personalized outreach for each):\n\n₹999 / $29 → ${checkoutUrl}`,
      );
      return;
    }
    const answer = await this.assistantAnswer(user, conversation, text, startup.id);
    await this.reply(
      user,
      conversation,
      `${answer}\n\n(Your full report is ready whenever you are: ${checkoutUrl})`,
    );
  }

  // ── assistant ─────────────────────────────────────────────────────

  private async handleAssistant(
    user: UserRow,
    conversation: ConversationRow,
    text: string,
  ): Promise<void> {
    const startup = await this.memory.latestStartupForUser(user.id);
    const answer = await this.assistantAnswer(user, conversation, text, startup?.id);
    await this.reply(user, conversation, answer);
  }

  private async assistantAnswer(
    user: UserRow,
    conversation: ConversationRow,
    text: string,
    startupId?: string,
  ): Promise<string> {
    const history = await this.memory.history(conversation.id);
    const startup = startupId ? await this.memory.startupById(startupId) : null;
    const research = startupId ? await this.memory.latestResearch(startupId) : null;
    const matches = startupId ? await this.memory.matchesForStartup(startupId, 20) : [];

    const topInvestors = matches
      .map((m) => {
        const inv = m.investors;
        if (!inv) return null;
        return `${m.rank}. ${inv.firm}${inv.partner ? ` (${inv.partner})` : ''} — ${m.why_matched}${inv.email ? ` — ${inv.email}` : ''}${m.outreach ? `\n   Drafted outreach subject: "${m.outreach.subject}"` : ''}`;
      })
      .filter(Boolean)
      .join('\n');

    return this.openai.text({
      system: assistantSystemPrompt({
        profile: startup?.profile ?? {},
        researchSummary: research?.startup_summary,
        topInvestors: topInvestors || null,
      }),
      turns: history as ChatTurn[],
      model: env.openaiModel,
    });
  }

  private async reply(user: UserRow, conversation: ConversationRow, text: string): Promise<void> {
    await this.whatsapp.sendText(user.wa_phone, text);
    await this.memory.recordOutbound(conversation.id, text);
  }
}
