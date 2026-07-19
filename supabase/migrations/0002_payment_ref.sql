-- Payments moved from Stripe to Dodo Payments: make the payment reference
-- column provider-agnostic. It now stores the Dodo checkout session id.

alter table reports rename column stripe_session_id to payment_ref;

drop index if exists reports_stripe_session_idx;
create unique index if not exists reports_payment_ref_idx
  on reports (payment_ref) where payment_ref is not null;
