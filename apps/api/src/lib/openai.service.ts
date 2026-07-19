import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { z } from 'zod';
import { env } from '../config/env';

export type ChatTurn = { role: 'user' | 'assistant' | 'system'; content: string };

/**
 * All model access goes through here (Responses API).
 * `json` asks for a strict JSON object and validates it with zod so agent
 * outputs are always well-formed before they touch the database.
 */
@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(OpenAiService.name);
  private readonly client = new OpenAI({ apiKey: env.openaiApiKey });

  async text(opts: { system: string; turns: ChatTurn[]; model?: string }): Promise<string> {
    const response = await this.client.responses.create({
      model: opts.model ?? env.openaiModel,
      instructions: opts.system,
      input: opts.turns.map((t) => ({ role: t.role, content: t.content })),
    });
    return response.output_text.trim();
  }

  async json<T>(opts: {
    system: string;
    turns: ChatTurn[];
    schema: z.ZodType<T>;
    model?: string;
  }): Promise<T> {
    const system =
      opts.system +
      '\n\nRespond with a single valid JSON object only. No markdown fences, no prose.';
    // One retry on malformed JSON — cheap insurance against truncation.
    for (let attempt = 0; attempt < 2; attempt++) {
      const raw = await this.text({ system, turns: opts.turns, model: opts.model });
      try {
        return opts.schema.parse(JSON.parse(extractJson(raw)));
      } catch (err) {
        this.logger.warn(`JSON parse attempt ${attempt + 1} failed: ${err}`);
        if (attempt === 1) throw err;
      }
    }
    throw new Error('unreachable');
  }

  async embed(text: string): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: env.openaiEmbeddingModel,
      input: text.slice(0, 8000),
    });
    return response.data[0].embedding;
  }
}

/** Tolerate models that wrap JSON in ```fences``` despite instructions. */
function extractJson(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start >= 0 && end > start) return raw.slice(start, end + 1);
  return raw;
}
