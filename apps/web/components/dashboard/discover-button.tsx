'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { discoverInvestorsAction } from '@/app/dashboard/actions';

/**
 * Runs live investor discovery (Tavily search + OpenAI ranking) and refreshes
 * the list. Discovery takes a while, so the button shows a working state and
 * the result is reported via a toast.
 */
export function DiscoverButton({
  label = 'Find investors',
  refreshLabel = 'Refresh matches',
  hasExisting = false,
  variant = 'primary',
}: {
  label?: string;
  refreshLabel?: string;
  hasExisting?: boolean;
  variant?: 'primary' | 'secondary';
}) {
  const [pending, startTransition] = useTransition();
  const [working, setWorking] = useState(false);
  const router = useRouter();
  const toast = useToast();

  function run() {
    setWorking(true);
    toast('Scout is researching the web for investors. This takes about a minute.', 'info');
    startTransition(async () => {
      const res = await discoverInvestorsAction();
      setWorking(false);
      if (!res.ok) {
        toast(res.error ?? 'Discovery failed.', 'error');
        return;
      }
      toast(`Found ${res.count} investors matched to your startup.`);
      router.refresh();
    });
  }

  const busy = pending || working;
  return (
    <Button onClick={run} loading={busy} variant={variant}>
      {busy ? 'Researching…' : hasExisting ? refreshLabel : label}
    </Button>
  );
}
