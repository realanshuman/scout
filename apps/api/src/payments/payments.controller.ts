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

@Controller('webhooks/dodo')
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
    @Headers('webhook-id') webhookId: string,
    @Headers('webhook-timestamp') webhookTimestamp: string,
    @Headers('webhook-signature') webhookSignature: string,
  ): Promise<{ received: true }> {
    if (!req.rawBody) throw new BadRequestException('missing body');
    let reportId: string | null;
    try {
      reportId = await this.payments.handleWebhook(req.rawBody, {
        id: webhookId,
        timestamp: webhookTimestamp,
        signature: webhookSignature,
      });
    } catch (err) {
      this.logger.warn(`dodo webhook rejected: ${err}`);
      throw new BadRequestException('invalid webhook');
    }
    if (reportId) await this.pipeline.enqueueDelivery(reportId);
    return { received: true };
  }
}
