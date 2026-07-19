import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { env } from '../config/env';
import { MemoryService } from '../memory/memory.service';

/** Stripe checkout for unlocking the full investor report. */
@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly stripe = new Stripe(env.stripeSecretKey);

  constructor(private readonly memory: MemoryService) {}

  /** Creates a checkout session + locked report row; returns the payment URL. */
  async createCheckout(startupId: string): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: env.stripePriceId, quantity: 1 }],
      success_url: `${env.webPublicUrl}/thanks`,
      cancel_url: `${env.webPublicUrl}/#pricing`,
      metadata: { startup_id: startupId },
    });
    await this.memory.createReport(startupId, session.id);
    if (!session.url) throw new Error('Stripe returned no checkout URL');
    return session.url;
  }

  /** Verifies webhook signature; returns the reportId to deliver, if any. */
  async handleWebhook(rawBody: Buffer, signature: string): Promise<string | null> {
    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      env.stripeWebhookSecret,
    );
    if (event.type !== 'checkout.session.completed') return null;

    const session = event.data.object as Stripe.Checkout.Session;
    const report = await this.memory.reportByStripeSession(session.id);
    if (!report) {
      this.logger.warn(`no report found for stripe session ${session.id}`);
      return null;
    }
    if (report.status === 'unlocked') return null; // idempotent on retries
    return report.id;
  }
}
