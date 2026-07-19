import { Injectable, Logger } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import DodoPayments from 'dodopayments';
import { env } from '../config/env';
import { MemoryService } from '../memory/memory.service';

export interface WebhookHeaders {
  id: string;
  timestamp: string;
  signature: string;
}

interface DodoWebhookEvent {
  type: string;
  data?: {
    payload_type?: string;
    payment_id?: string;
    checkout_session_id?: string | null;
    metadata?: Record<string, string>;
  };
}

const TIMESTAMP_TOLERANCE_SECONDS = 5 * 60;

/**
 * Dodo Payments checkout for unlocking the full investor report.
 * Dodo acts as merchant of record, so ₹/$ pricing, GST and invoicing are
 * handled on their side — the price lives on the product in the dashboard.
 */
@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly dodo = new DodoPayments({
    bearerToken: env.dodoApiKey,
    environment: env.dodoEnvironment,
  });

  constructor(private readonly memory: MemoryService) {}

  /** Creates a checkout session + locked report row; returns the payment URL. */
  async createCheckout(startupId: string): Promise<string> {
    const session = await this.dodo.checkoutSessions.create({
      product_cart: [{ product_id: env.dodoProductId, quantity: 1 }],
      return_url: `${env.webPublicUrl}/thanks`,
      metadata: { startup_id: startupId },
    });
    if (!session.checkout_url) throw new Error('Dodo returned no checkout URL');
    await this.memory.createReport(startupId, session.session_id);
    return session.checkout_url;
  }

  /**
   * Verifies the webhook (Standard Webhooks spec: HMAC-SHA256 over
   * "id.timestamp.body" with the base64 secret) and returns the reportId to
   * deliver when the event is a completed payment.
   */
  async handleWebhook(rawBody: Buffer, headers: WebhookHeaders): Promise<string | null> {
    this.verifySignature(rawBody, headers);

    const event = JSON.parse(rawBody.toString('utf8')) as DodoWebhookEvent;
    if (event.type !== 'payment.succeeded') return null;

    const sessionId = event.data?.checkout_session_id;
    if (!sessionId) {
      this.logger.warn(`payment.succeeded without checkout_session_id (payment ${event.data?.payment_id})`);
      return null;
    }
    const report = await this.memory.reportByPaymentRef(sessionId);
    if (!report) {
      this.logger.warn(`no report found for dodo checkout session ${sessionId}`);
      return null;
    }
    if (report.status === 'unlocked') return null; // idempotent on retries
    return report.id;
  }

  private verifySignature(rawBody: Buffer, headers: WebhookHeaders): void {
    if (!headers.id || !headers.timestamp || !headers.signature) {
      throw new Error('missing webhook signature headers');
    }

    const ageSeconds = Math.abs(Date.now() / 1000 - Number(headers.timestamp));
    if (!Number.isFinite(ageSeconds) || ageSeconds > TIMESTAMP_TOLERANCE_SECONDS) {
      throw new Error('webhook timestamp outside tolerance');
    }

    const key = env.dodoWebhookKey;
    const secret = Buffer.from(key.startsWith('whsec_') ? key.slice(6) : key, 'base64');
    const expected = createHmac('sha256', secret)
      .update(`${headers.id}.${headers.timestamp}.${rawBody.toString('utf8')}`)
      .digest('base64');
    const expectedBuf = Buffer.from(expected);

    // Header holds one or more space-separated "v1,<base64sig>" entries.
    const valid = headers.signature.split(' ').some((part) => {
      const [version, sig] = part.split(',');
      if (version !== 'v1' || !sig) return false;
      const sigBuf = Buffer.from(sig);
      return sigBuf.length === expectedBuf.length && timingSafeEqual(sigBuf, expectedBuf);
    });
    if (!valid) throw new Error('invalid webhook signature');
  }
}
