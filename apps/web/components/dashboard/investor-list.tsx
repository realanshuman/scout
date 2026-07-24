'use client';

import { useMemo, useState, useTransition } from 'react';
import type { InvestorMatch } from '@/lib/dashboard-data';
import { FitBadge, Badge } from '@/components/dashboard/ui';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { toggleSavedAction, setStatusAction } from '@/app/dashboard/actions';

type Filter = 'all' | 'saved' | 'email' | 'new' | 'contacted';
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'saved', label: 'Saved' },
  { key: 'email', label: 'Has email' },
  { key: 'new', label: 'Not contacted' },
  { key: 'contacted', label: 'Contacted' },
];

const STATUS_TONE: Record<string, 'muted' | 'green' | 'neutral'> = {
  new: 'muted',
  contacted: 'green',
  passed: 'neutral',
};
const STATUS_LABEL: Record<string, string> = {
  new: 'Not contacted',
  contacted: 'Contacted',
  passed: 'Passed',
};

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function InvestorList({ investors }: { investors: InvestorMatch[] }) {
  const [items, setItems] = useState(investors);
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<InvestorMatch | null>(null);
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter((inv) => {
      if (filter === 'saved' && !inv.saved) return false;
      if (filter === 'email' && !inv.email) return false;
      if (filter === 'new' && inv.status === 'contacted') return false;
      if (filter === 'contacted' && inv.status !== 'contacted') return false;
      if (query) {
        const hay = `${inv.firm} ${inv.partner ?? ''} ${inv.sectors} ${inv.stages}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
  }, [items, filter, q]);

  function patch(id: string | undefined, fields: Partial<InvestorMatch>) {
    if (!id) return;
    setItems((list) => list.map((i) => (i.id === id ? { ...i, ...fields } : i)));
    setOpen((o) => (o && o.id === id ? { ...o, ...fields } : o));
  }

  function onSave(inv: InvestorMatch) {
    const next = !inv.saved;
    patch(inv.id, { saved: next });
    startTransition(async () => {
      const res = await toggleSavedAction(inv.id!, next);
      if (!res.ok) {
        patch(inv.id, { saved: !next });
        toast(res.error ?? 'Could not update.', 'error');
      }
    });
  }

  function onStatus(inv: InvestorMatch, status: 'new' | 'contacted' | 'passed') {
    const prev = inv.status ?? 'new';
    patch(inv.id, { status });
    startTransition(async () => {
      const res = await setStatusAction(inv.id!, status);
      if (!res.ok) {
        patch(inv.id, { status: prev });
        toast(res.error ?? 'Could not update.', 'error');
      } else {
        toast(status === 'contacted' ? 'Marked as contacted.' : 'Status updated.');
      }
    });
  }

  async function copyDraft(inv: InvestorMatch) {
    const text = `Subject: ${inv.outreachSubject}\n\n${inv.outreachBody ?? ''}`;
    try {
      await navigator.clipboard.writeText(text);
      toast('Draft copied to clipboard.');
    } catch {
      toast('Could not copy. Select and copy manually.', 'error');
    }
  }

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                filter === f.key
                  ? 'border-signal bg-signal/10 text-moss'
                  : 'border-ink/12 text-mist hover:border-ink/25 hover:text-ink'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="sm:w-56">
          <Input
            type="search"
            placeholder="Search investors…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-10"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/15 bg-card/50 py-14 text-center">
          <p className="font-medium">No investors match this view.</p>
          <p className="mt-1 text-sm text-mist">Try a different filter or clear your search.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((inv) => (
            <article key={inv.id ?? inv.firm} className="rounded-2xl border border-ink/[0.09] bg-card p-5 transition-shadow hover:shadow-soft sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-mist">#{inv.rank}</span>
                    <h2 className="truncate text-lg font-semibold tracking-[-0.01em]">{inv.firm}</h2>
                    <Badge tone={STATUS_TONE[inv.status ?? 'new']}>{STATUS_LABEL[inv.status ?? 'new']}</Badge>
                  </div>
                  {inv.partner && <p className="mt-0.5 text-sm text-mist">{inv.partner} · Partner</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => onSave(inv)}
                    disabled={pending}
                    aria-pressed={inv.saved}
                    aria-label={inv.saved ? 'Unsave' : 'Save'}
                    className={`grid h-9 w-9 place-items-center rounded-full border transition ${
                      inv.saved ? 'border-signal/40 bg-signal/10 text-moss' : 'border-ink/12 text-mist hover:text-ink'
                    }`}
                  >
                    <BookmarkIcon filled={Boolean(inv.saved)} />
                  </button>
                  <FitBadge fit={inv.fit} />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {[inv.stages, inv.check, inv.sectors].filter(Boolean).map((t) => (
                  <span key={t} className="rounded-lg bg-paper px-2.5 py-1 text-xs font-medium text-ink/70">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-ink/[0.06] bg-paper/60 p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-moss">Why matched</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/80">{inv.why}</p>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-mist">
                  {inv.email ? inv.email : <span className="italic">Email not public</span>}
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={inv.status ?? 'new'}
                    onChange={(e) => onStatus(inv, e.target.value as 'new' | 'contacted' | 'passed')}
                    disabled={pending}
                    className="h-9 cursor-pointer rounded-full border border-ink/12 bg-card px-3 text-sm font-medium text-ink outline-none transition hover:border-ink/25 focus:border-moss"
                  >
                    <option value="new">Not contacted</option>
                    <option value="contacted">Contacted</option>
                    <option value="passed">Passed</option>
                  </select>
                  <Button variant="secondary" size="sm" onClick={() => setOpen(inv)}>
                    View draft
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Draft modal */}
      <Dialog
        open={Boolean(open)}
        onClose={() => setOpen(null)}
        title={open ? `Draft for ${open.firm}` : ''}
        description={open?.partner ? `Personalized for ${open.partner}` : 'Personalized intro'}
        size="lg"
        footer={
          open ? (
            <>
              <Button variant="ghost" onClick={() => setOpen(null)}>
                Close
              </Button>
              <Button variant="secondary" onClick={() => copyDraft(open)}>
                Copy
              </Button>
              {open.email && (
                <a
                  href={`mailto:${open.email}?subject=${encodeURIComponent(open.outreachSubject)}&body=${encodeURIComponent(open.outreachBody ?? '')}`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-signal px-5 text-[15px] font-semibold text-[#0c1512] transition hover:brightness-105"
                  onClick={() => onStatus(open, 'contacted')}
                >
                  Open in email
                </a>
              )}
            </>
          ) : null
        }
      >
        {open && (
          <div className="space-y-3">
            <div className="rounded-xl border border-ink/10 bg-paper/60 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-mist">Subject</p>
              <p className="mt-1 font-medium">{open.outreachSubject}</p>
            </div>
            <div className="rounded-xl border border-ink/10 bg-paper/60 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-mist">Message</p>
              <pre className="mt-1 whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink/90">
                {open.outreachBody}
              </pre>
            </div>
            <p className="text-xs text-mist">
              Want changes? Ask Scout on WhatsApp: “rewrite the {open.firm} email to be shorter.”
            </p>
          </div>
        )}
      </Dialog>
    </div>
  );
}
