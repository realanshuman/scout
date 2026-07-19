/**
 * Seeds the investor knowledge base and computes embeddings.
 *
 *   pnpm --filter @scout/api seed:investors
 *
 * The bundled dataset is FICTIONAL sample data so the pipeline works
 * end-to-end out of the box. Replace data/investors.seed.json with your
 * curated real-world investor dataset — same shape — before launch.
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { env } from '../src/config/env';

interface SeedInvestor {
  firm: string;
  partner?: string;
  email?: string;
  linkedin?: string;
  website?: string;
  countries: string[];
  stages: string[];
  sectors: string[];
  check_min_usd?: number;
  check_max_usd?: number;
  thesis?: string;
  partner_interests?: string;
  recent_investments?: { company: string; round?: string; year?: number }[];
  portfolio?: string[];
}

async function main() {
  const file = process.argv[2] ?? join(__dirname, '..', 'data', 'investors.seed.json');
  const investors: SeedInvestor[] = JSON.parse(readFileSync(file, 'utf8'));
  const supabase = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });
  const openai = new OpenAI({ apiKey: env.openaiApiKey });

  console.log(`Seeding ${investors.length} investors from ${file}...`);

  for (const inv of investors) {
    const embeddingText = [
      `Firm: ${inv.firm}`,
      inv.partner ? `Partner: ${inv.partner}` : '',
      `Stages: ${inv.stages.join(', ')}`,
      `Sectors: ${inv.sectors.join(', ')}`,
      `Geographies: ${inv.countries.join(', ')}`,
      inv.thesis ? `Thesis: ${inv.thesis}` : '',
      inv.partner_interests ? `Partner interests: ${inv.partner_interests}` : '',
      inv.portfolio?.length ? `Portfolio: ${inv.portfolio.join(', ')}` : '',
      inv.recent_investments?.length
        ? `Recent investments: ${inv.recent_investments.map((r) => r.company).join(', ')}`
        : '',
    ]
      .filter(Boolean)
      .join('\n');

    const embedding = (
      await openai.embeddings.create({
        model: env.openaiEmbeddingModel,
        input: embeddingText,
      })
    ).data[0].embedding;

    // Upsert on (firm, partner) so re-running the seed refreshes rows.
    const { data: existing } = await supabase
      .from('investors')
      .select('id')
      .eq('firm', inv.firm)
      .eq('partner', inv.partner ?? '')
      .maybeSingle();

    const row = { ...inv, embedding, updated_at: new Date().toISOString() };
    const { error } = existing
      ? await supabase.from('investors').update(row).eq('id', existing.id)
      : await supabase.from('investors').insert(row);

    if (error) {
      console.error(`  ✗ ${inv.firm}: ${error.message}`);
      process.exitCode = 1;
    } else {
      console.log(`  ✓ ${inv.firm}${inv.partner ? ` (${inv.partner})` : ''}`);
    }
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
