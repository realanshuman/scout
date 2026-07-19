import { Body, Controller, Get, HttpCode, Logger, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { env } from '../config/env';
import { ConversationService } from '../conversation/conversation.service';

interface WebhookPayload {
  entry?: {
    changes?: {
      value?: {
        messages?: {
          id: string;
          from: string;
          type: string;
          text?: { body: string };
        }[];
        contacts?: { profile?: { name?: string }; wa_id: string }[];
      };
    }[];
  }[];
}

@Controller('webhooks/whatsapp')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);

  constructor(private readonly conversation: ConversationService) {}

  /** Meta webhook verification handshake. */
  @Get()
  verify(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    if (mode === 'subscribe' && token === env.whatsappVerifyToken) {
      return res.status(200).send(challenge);
    }
    return res.sendStatus(403);
  }

  /**
   * Inbound messages. Meta requires a fast 200 — processing happens in the
   * background and replies are sent asynchronously.
   */
  @Post()
  @HttpCode(200)
  receive(@Body() payload: WebhookPayload): { ok: true } {
    for (const entry of payload.entry ?? []) {
      for (const change of entry.changes ?? []) {
        const value = change.value;
        const name = value?.contacts?.[0]?.profile?.name;
        for (const msg of value?.messages ?? []) {
          if (msg.type !== 'text' || !msg.text?.body) continue;
          this.conversation
            .handleInbound({
              waMessageId: msg.id,
              fromPhone: msg.from,
              text: msg.text.body,
              profileName: name,
            })
            .catch((err) => this.logger.error(`inbound handling failed: ${err?.stack ?? err}`));
        }
      }
    }
    return { ok: true };
  }
}
