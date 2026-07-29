import { ScoutMark } from '@/components/logo';

/**
 * The hero visual for /newsletter: a mockup of the Sunday email as it lands
 * in an inbox. Built from real product UI rather than stock photography, so
 * the picture and the promise are the same thing.
 *
 * The rows deliberately mix an India fund (quoted in rupees and dollars),
 * a US fund and a global syndicate, because founders reading this are in
 * Bengaluru and San Francisco in roughly equal numbers.
 */

const ROWS = [
  {
    n: '01',
    firm: 'Riverbend Capital',
    partner: 'Neha Shah',
    where: 'Bengaluru',
    stage: 'Pre-seed → Seed',
    cheque: '₹2Cr – ₹12Cr',
    thesis: 'Payments and lending infra. Wants merchants live, not a pilot.',
  },
  {
    n: '02',
    firm: 'Foundry 9',
    partner: 'Tom Alvarez',
    where: 'San Francisco',
    stage: 'Pre-seed',
    cheque: '$150K – $1M',
    thesis: 'First cheque into vertical SaaS with early revenue. Moves fast.',
  },
  {
    n: '03',
    firm: 'Meridian Angels',
    partner: '40+ operator angels',
    where: 'London · global',
    stage: 'Pre-seed',
    cheque: '$25K – $150K',
    thesis: 'Ex-operators who bring customers along with the cheque.',
  },
];

export function NewsletterIssueCard({ rows = 3 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-[#fdfcf9] text-[#111a16] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)] ring-1 ring-black/5">
      {/* Email client chrome */}
      <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#f3f1ec] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate text-[11px] font-medium text-black/40">Inbox</span>
      </div>

      {/* Sender line */}
      <div className="flex items-start gap-3 px-5 pt-5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-signal/12">
          <ScoutMark className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <p className="truncate text-[13px] font-semibold">Scout</p>
            <span className="shrink-0 text-[11px] text-black/35">Sun, 9:02 AM</span>
          </div>
          <p className="truncate text-[11px] text-black/40">
            hello@scout.email · to you
          </p>
        </div>
      </div>

      {/* Subject */}
      <div className="px-5 pb-4 pt-4">
        <p className="font-display text-[19px] leading-snug tracking-tight sm:text-[21px]">
          Ten investors writing cheques this week
        </p>
        <p className="mt-1 text-[12px] text-black/45">
          Issue 14 · fintech, vertical SaaS and dev tools
        </p>
      </div>

      {/* Investor rows */}
      <div className="divide-y divide-black/[0.06] border-t border-black/[0.06]">
        {ROWS.slice(0, rows).map((r) => (
          <div key={r.firm} className="flex gap-3 px-5 py-3.5">
            <span className="mt-[3px] font-display text-[13px] text-black/25">{r.n}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <p className="text-[14px] font-semibold tracking-[-0.01em]">{r.firm}</p>
                <span className="text-[12px] text-black/45">{r.partner}</span>
                <span className="text-[12px] text-black/30">· {r.where}</span>
              </div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-black/60">{r.thesis}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded-md bg-black/[0.05] px-2 py-0.5 text-[11px] font-medium text-black/55">
                  {r.stage}
                </span>
                <span className="rounded-md bg-signal/15 px-2 py-0.5 text-[11px] font-semibold text-moss">
                  {r.cheque}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer of the email */}
      <div className="border-t border-black/[0.06] bg-[#f7f5f0] px-5 py-3">
        <p className="text-[11.5px] text-black/40">+ seven more, with how to reach each one</p>
      </div>
    </div>
  );
}
