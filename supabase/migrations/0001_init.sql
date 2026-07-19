-- Scout MVP schema
-- Run with: supabase db push  (or psql -f)

create extension if not exists "uuid-ossp";
create extension if not exists vector;

-- ────────────────────────────────────────────────────────────────────
-- Users: one row per WhatsApp number that ever messaged Scout
-- ────────────────────────────────────────────────────────────────────
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  wa_phone text not null unique,            -- E.164 WhatsApp number
  name text,
  email text,
  created_at timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────────────
-- Conversations: the founder's session state machine
-- ────────────────────────────────────────────────────────────────────
create type conversation_stage as enum (
  'interview',        -- Scout is interviewing the founder
  'researching',      -- research pipeline is running
  'preview',          -- top-3 preview sent, waiting for payment
  'unlocked',         -- paid; full report delivered
  'assistant'         -- ongoing fundraising assistant chat
);

create table if not exists conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  stage conversation_stage not null default 'interview',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  wa_message_id text,                       -- Meta message id for dedupe
  created_at timestamptz not null default now()
);
create unique index if not exists messages_wa_message_id_idx
  on messages (wa_message_id) where wa_message_id is not null;
create index if not exists messages_conversation_idx
  on messages (conversation_id, created_at);

-- ────────────────────────────────────────────────────────────────────
-- Startups: the structured profile built up during the interview.
-- `profile` is the canonical JSON blob; hot filter fields are lifted
-- into columns for querying.
-- ────────────────────────────────────────────────────────────────────
create table if not exists startups (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  conversation_id uuid references conversations(id) on delete set null,
  name text,
  website text,
  industry text,
  stage text,                               -- pre-seed / seed / series-a ...
  country text,
  raise_amount_usd numeric,
  profile jsonb not null default '{}'::jsonb,
  profile_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists startups_user_idx on startups (user_id);

-- ────────────────────────────────────────────────────────────────────
-- Research: output of the research agent for a startup
-- ────────────────────────────────────────────────────────────────────
create table if not exists research (
  id uuid primary key default uuid_generate_v4(),
  startup_id uuid not null references startups(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'running', 'complete', 'failed')),
  startup_summary text,
  industry_summary text,
  strengths jsonb,                          -- string[]
  weaknesses jsonb,                         -- string[]
  ideal_investor_profile text,
  funding_stage text,
  sources jsonb,                            -- [{url, title, snippet}]
  raw jsonb,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists research_startup_idx on research (startup_id);

-- ────────────────────────────────────────────────────────────────────
-- Investors: the curated knowledge base (the defensible part).
-- Seeded via scripts/seed-investors.ts and grown over time.
-- ────────────────────────────────────────────────────────────────────
create table if not exists investors (
  id uuid primary key default uuid_generate_v4(),
  firm text not null,
  partner text,                             -- lead partner, if person-level row
  email text,
  linkedin text,
  website text,
  countries text[] not null default '{}',   -- where they invest
  stages text[] not null default '{}',      -- pre-seed, seed, series-a...
  sectors text[] not null default '{}',
  check_min_usd numeric,
  check_max_usd numeric,
  thesis text,
  partner_interests text,
  recent_investments jsonb,                 -- [{company, round, year}]
  portfolio jsonb,                          -- [company, ...]
  embedding vector(1536),                   -- embedding of thesis+sectors+portfolio
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists investors_stage_idx on investors using gin (stages);
create index if not exists investors_sector_idx on investors using gin (sectors);
create index if not exists investors_embedding_idx on investors
  using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- Semantic search over the investor base, with hard filters applied first
create or replace function match_investors(
  query_embedding vector(1536),
  match_count int default 100,
  filter_stage text default null,
  filter_country text default null
)
returns table (
  id uuid,
  firm text,
  partner text,
  email text,
  linkedin text,
  website text,
  countries text[],
  stages text[],
  sectors text[],
  check_min_usd numeric,
  check_max_usd numeric,
  thesis text,
  partner_interests text,
  recent_investments jsonb,
  portfolio jsonb,
  similarity float
)
language sql stable as $$
  select
    i.id, i.firm, i.partner, i.email, i.linkedin, i.website,
    i.countries, i.stages, i.sectors, i.check_min_usd, i.check_max_usd,
    i.thesis, i.partner_interests, i.recent_investments, i.portfolio,
    1 - (i.embedding <=> query_embedding) as similarity
  from investors i
  where i.embedding is not null
    and (filter_stage is null or filter_stage = any (i.stages))
    and (filter_country is null
         or filter_country = any (i.countries)
         or 'Global' = any (i.countries))
  order by i.embedding <=> query_embedding
  limit match_count;
$$;

-- ────────────────────────────────────────────────────────────────────
-- Matches: ranked investor list for a startup
-- ────────────────────────────────────────────────────────────────────
create table if not exists investor_matches (
  id uuid primary key default uuid_generate_v4(),
  startup_id uuid not null references startups(id) on delete cascade,
  investor_id uuid not null references investors(id) on delete cascade,
  rank int not null,
  confidence numeric not null,              -- 0..1
  why_matched text not null,
  outreach jsonb,                           -- {subject, email, linkedin_dm, personalization}
  created_at timestamptz not null default now(),
  unique (startup_id, investor_id)
);
create index if not exists matches_startup_idx on investor_matches (startup_id, rank);

-- ────────────────────────────────────────────────────────────────────
-- Reports & payments
-- ────────────────────────────────────────────────────────────────────
create table if not exists reports (
  id uuid primary key default uuid_generate_v4(),
  startup_id uuid not null references startups(id) on delete cascade,
  status text not null default 'locked'
    check (status in ('locked', 'unlocked')),
  content jsonb,                            -- full rendered report sections
  stripe_session_id text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists reports_startup_idx on reports (startup_id);
create unique index if not exists reports_stripe_session_idx
  on reports (stripe_session_id) where stripe_session_id is not null;
