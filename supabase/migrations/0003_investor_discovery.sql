-- Live investor discovery: the investor base can now populate itself from web
-- research instead of a hand-curated seed. Track where each row came from.

alter table investors
  add column if not exists source_url text,
  add column if not exists discovered boolean not null default false,
  add column if not exists last_seen_at timestamptz;

-- Speeds up the upsert-by-identity that discovery uses.
create index if not exists investors_firm_partner_idx
  on investors (lower(firm), lower(coalesce(partner, '')));
