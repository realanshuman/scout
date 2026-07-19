import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SupabaseService } from './lib/supabase.service';
import { OpenAiService } from './lib/openai.service';
import { SearchService } from './lib/search.service';
import { MemoryService } from './memory/memory.service';
import { WhatsappService } from './whatsapp/whatsapp.service';
import { WhatsappController } from './whatsapp/whatsapp.controller';
import { ConversationService } from './conversation/conversation.service';
import { ResearchAgent } from './agents/research.agent';
import { MatchingAgent } from './agents/matching.agent';
import { ReportAgent } from './agents/report.agent';
import { OutreachAgent } from './agents/outreach.agent';
import { PipelineService } from './pipeline/pipeline.service';
import { PaymentsService } from './payments/payments.service';
import { PaymentsController } from './payments/payments.controller';

/**
 * Flat module on purpose — the MVP has one bounded context and a single
 * dependency graph; sub-modules can be split out when the app grows.
 */
@Module({
  controllers: [AppController, WhatsappController, PaymentsController],
  providers: [
    SupabaseService,
    OpenAiService,
    SearchService,
    MemoryService,
    WhatsappService,
    ConversationService,
    ResearchAgent,
    MatchingAgent,
    ReportAgent,
    OutreachAgent,
    PipelineService,
    PaymentsService,
  ],
})
export class AppModule {}
