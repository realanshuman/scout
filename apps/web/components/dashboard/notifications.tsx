'use client';

import { useState, useTransition } from 'react';
import { useToast } from '@/components/ui/toast';
import { saveNotificationsAction } from '@/app/dashboard/actions';

interface Prefs {
  emailReport: boolean;
  notifyNewMatches: boolean;
  weeklyNudge: boolean;
}

function Switch({
  on,
  disabled,
  onClick,
}: {
  on: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={onClick}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-60 ${
        on ? 'bg-signal' : 'bg-ink/15'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
          on ? 'left-[22px]' : 'left-0.5'
        }`}
      />
    </button>
  );
}

const ROWS: { key: keyof Prefs; label: string; hint: string }[] = [
  { key: 'emailReport', label: 'Email me my report', hint: 'A copy of your investor report and outreach, sent to your inbox.' },
  { key: 'notifyNewMatches', label: 'Notify me about new matches', hint: 'When Scout finds new investors that fit, it messages you on WhatsApp.' },
  { key: 'weeklyNudge', label: 'Weekly fundraising nudge', hint: 'A gentle check-in on your raise progress.' },
];

export function NotificationSettings({ initial }: { initial: Prefs }) {
  const [prefs, setPrefs] = useState<Prefs>(initial);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  function toggle(key: keyof Prefs) {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    startTransition(async () => {
      const res = await saveNotificationsAction(next);
      if (!res.ok) {
        setPrefs(prefs); // revert
        toast(res.error ?? 'Could not save.', 'error');
      } else {
        toast('Preferences saved.');
      }
    });
  }

  return (
    <div className="divide-y divide-ink/[0.08]">
      {ROWS.map((row) => (
        <div key={row.key} className="flex items-center justify-between gap-4 py-3.5">
          <div className="min-w-0">
            <p className="text-sm font-medium">{row.label}</p>
            <p className="mt-0.5 text-sm text-mist">{row.hint}</p>
          </div>
          <Switch on={prefs[row.key]} disabled={pending} onClick={() => toggle(row.key)} />
        </div>
      ))}
    </div>
  );
}
