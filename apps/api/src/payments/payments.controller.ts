import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  Logger,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';
import { PipelineService } from '../pipeline/pipeline.service';

@Controller('webhooks/stripe')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly payments: PaymentsService,
    private readonly pipeline: PipelineService,
  ) {}

  @Post()
  @HttpCode(200)
  async handle(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ): Promise<{ received: true }> {
    if (!req.rawBody || !signature) throw new BadRequestException('missing signature');
    let reportId: string | null;
    try {
      reportId = await this.payments.handleWebhook(req.rawBody, signature);
    } catch (err) {
      this.logger.warn(`stripe webhook rejected: ${err}`);
      throw new BadRequestException('invalid webhook');
    }
    if (reportId) await this.pipeline.enqueueDelivery(reportId);
    return { received: true };
  }
}
