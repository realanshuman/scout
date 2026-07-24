'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { changePassword, deleteUser, signOut } from '@/lib/auth-client';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';

export function ChangePasswordButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const currentPassword = String(form.get('current') ?? '');
    const newPassword = String(form.get('next') ?? '');
    const confirm = String(form.get('confirm') ?? '');
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirm) {
      setError('New passwords don’t match.');
      return;
    }
    startTransition(async () => {
      const res = await changePassword({ currentPassword, newPassword, revokeOtherSessions: true });
      if (res.error) {
        setError(res.error.message ?? 'Could not change password. Check your current password.');
        return;
      }
      toast('Password changed.');
      setOpen(false);
    });
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-sm font-medium text-moss hover:underline">
        Change
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Change password" size="sm">
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Current password">
            <Input name="current" type="password" required autoComplete="current-password" />
          </Field>
          <Field label="New password" hint="At least 8 characters.">
            <Input name="next" type="password" required autoComplete="new-password" />
          </Field>
          <Field label="Confirm new password">
            <Input name="confirm" type="password" required autoComplete="new-password" />
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
              Update password
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}

export function DeleteAccountButton() {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  function onDelete() {
    setError(null);
    startTransition(async () => {
      const res = await deleteUser({});
      if (res.error) {
        setError(res.error.message ?? 'Could not delete your account. Please try again.');
        return;
      }
      toast('Your account has been deleted.', 'info');
      await signOut();
      router.push('/');
      router.refresh();
    });
  }

  return (
    <>
      <Button variant="danger" size="sm" onClick={() => setOpen(true)}>
        Delete account
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete account"
        description="This permanently deletes your account, profile, and investor matches. This cannot be undone."
        size="sm"
      >
        <div className="space-y-4">
          <Field label={'Type DELETE to confirm'}>
            <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="DELETE" invalid={Boolean(error)} />
          </Field>
          {error && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/5 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Keep account
            </Button>
            <Button variant="danger" loading={pending} disabled={confirmText !== 'DELETE'} onClick={onDelete}>
              Delete permanently
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
