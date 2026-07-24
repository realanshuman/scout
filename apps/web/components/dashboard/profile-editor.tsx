'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { StartupProfile } from '@/lib/dashboard-data';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Field, Input, Textarea, Select } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { saveProfileAction } from '@/app/dashboard/actions';

const STAGES = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Growth'];

export function EditProfileButton({
  profile,
  className = '',
  label = 'Edit profile',
}: {
  profile: StartupProfile;
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveProfileAction(form);
      if (!res.ok) {
        setError(res.error ?? 'Could not save.');
        return;
      }
      toast('Profile updated.');
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={className || 'text-sm font-medium text-moss hover:underline'}
      >
        {label}
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Edit startup profile"
        description="This is what your matches and outreach are based on. Keep it sharp."
        size="lg"
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company name">
              <Input name="startupName" defaultValue={profile.name} required placeholder="Loop" />
            </Field>
            <Field label="Website">
              <Input name="website" defaultValue={profile.website} placeholder="loop.ai" />
            </Field>
          </div>
          <Field label="One-liner" hint="One sentence. What do you do?">
            <Input name="oneLiner" defaultValue={profile.oneLiner} maxLength={160} placeholder="An AI copilot for warehouse operations teams." />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Industry">
              <Input name="industry" defaultValue={profile.industry} placeholder="Logistics · AI" />
            </Field>
            <Field label="Stage">
              <Select name="stage" defaultValue={profile.stage || 'Seed'}>
                {STAGES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Location">
              <Input name="country" defaultValue={profile.country} placeholder="United States" />
            </Field>
            <Field label="Business model">
              <Input name="businessModel" defaultValue={profile.businessModel} placeholder="B2B SaaS" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Raising (USD)">
              <Input name="raiseUsd" type="number" min="0" step="1000" defaultValue={profile.raiseUsd || ''} placeholder="2000000" />
            </Field>
            <Field label="MRR (USD)">
              <Input name="mrrUsd" type="number" min="0" step="100" defaultValue={profile.mrrUsd || ''} placeholder="18000" />
            </Field>
          </div>
          <Field label="Traction">
            <Textarea name="traction" rows={2} defaultValue={profile.traction} placeholder="$18k MRR, growing 22% MoM with mid-size 3PLs." />
          </Field>

          {error && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/5 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={pending}>
              Save changes
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
