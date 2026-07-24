'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { startCheckout } from '@/app/paywall/actions';

export function PaywallCTA({ pending = false }: { pending?: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function onContinue() {
    setLoading(true);
    const res = await startCheckout();
    if (res.ok && res.url) {
      window.location.href = res.url;
      return;
    }
    setLoading(false);
    toast(res.error ?? 'Could not start checkout.', 'error');
  }

  return (
    <div className="space-y-3">
      {pending && (
        <p className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          We haven&apos;t confirmed your payment yet. If you just paid, give it a moment and
          refresh, or continue below.
        </p>
      )}
      <Button onClick={onContinue} loading={loading} size="lg" fullWidth>
        {loading ? 'Taking you to checkout…' : 'Continue to checkout'}
      </Button>
      <button
        onClick={() => router.refresh()}
        className="w-full text-center text-sm text-mist transition hover:text-ink"
      >
        Already paid? Refresh
      </button>
    </div>
  );
}
