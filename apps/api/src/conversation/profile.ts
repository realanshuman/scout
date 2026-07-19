import { z } from 'zod';

/**
 * The structured JSON built up during the founder interview.
 * Every field is optional — the interview agent fills them in incrementally
 * and never asks about something already present.
 */
export const StartupProfileSchema = z
  .object({
    name: z.string().nullish(),
    website: z.string().nullish(),
    description: z.string().nullish(),
    industry: z.string().nullish(),
    stage: z.string().nullish(), // pre-seed | seed | series-a | series-b+
    country: z.string().nullish(),
    city: z.string().nullish(),
    raise_amount_usd: z.number().nullish(),
    raise_currency_note: z.string().nullish(), // e.g. "founder said ₹4 Cr"
    revenue_usd_annual: z.number().nullish(),
    mrr_usd: z.number().nullish(),
    traction: z.string().nullish(),
    users: z.string().nullish(),
    business_model: z.string().nullish(),
    customers: z.string().nullish(),
    competitors: z.array(z.string()).nullish(),
    deck_url: z.string().nullish(),
    founders: z
      .array(
        z.object({
          name: z.string(),
          role: z.string().nullish(),
          linkedin: z.string().nullish(),
          background: z.string().nullish(),
        }),
      )
      .nullish(),
    team_size: z.number().nullish(),
    goals: z.string().nullish(),
    pain_points: z.string().nullish(),
    why_now: z.string().nullish(),
    roadmap: z.string().nullish(),
    usp: z.string().nullish(),
    notes: z.string().nullish(), // anything interesting that doesn't fit above
  })
  .passthrough();

export type StartupProfile = z.infer<typeof StartupProfileSchema>;

/** Fields the interview must cover before research can start. */
export const REQUIRED_FIELDS: string[] = [
  'name',
  'description',
  'industry',
  'stage',
  'country',
  'raise_amount_usd',
  'traction',
  'business_model',
];

export function missingFields(profile: StartupProfile): string[] {
  return REQUIRED_FIELDS.filter((f) => {
    const v = (profile as Record<string, unknown>)[f];
    return v === undefined || v === null || v === '';
  });
}

/** What the interview agent returns on every turn. */
export const InterviewTurnSchema = z.object({
  reply: z.string(),
  profile_updates: StartupProfileSchema.default({}),
  interview_complete: z.boolean().default(false),
});
export type InterviewTurn = z.infer<typeof InterviewTurnSchema>;
