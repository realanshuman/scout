import { Injectable, Logger } from '@nestjs/common';
import { env } from '../config/env';

/** Outbound messaging via the Meta WhatsApp Business Cloud API. */
@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  /**
   * WhatsApp caps text messages at 4096 chars; long reports are split on
   * paragraph boundaries and sent sequentially.
   */
  async sendText(toPhone: string, text: string): Promise<void> {
    for (const chunk of splitMessage(text)) {
      await this.sendChunk(toPhone, chunk);
    }
  }

  private async sendChunk(toPhone: string, body: string): Promise<void> {
    const url = `https://graph.facebook.com/v21.0/${env.whatsappPhoneNumberId}/messages`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.whatsappAccessToken}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: toPhone,
        type: 'text',
        text: { body, preview_url: true },
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      this.logger.error(`WhatsApp send failed (${res.status}): ${detail}`);
      throw new Error(`WhatsApp send failed: ${res.status}`);
    }
  }
}

export function splitMessage(text: string, limit = 3800): string[] {
  if (text.length <= limit) return [text];
  const chunks: string[] = [];
  let current = '';
  for (const para of text.split('\n\n')) {
    const candidate = current ? `${current}\n\n${para}` : para;
    if (candidate.length > limit && current) {
      chunks.push(current);
      current = para;
    } else if (candidate.length > limit) {
      // single huge paragraph — hard split
      for (let i = 0; i < para.length; i += limit) chunks.push(para.slice(i, i + limit));
      current = '';
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}
