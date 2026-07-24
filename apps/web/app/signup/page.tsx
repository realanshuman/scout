import { redirect } from 'next/navigation';

/**
 * Public sign-up is disabled. Accounts are provisioned through Scout's
 * onboarding (WhatsApp / after payment), so this route just sends people to
 * sign in.
 */
export default function SignUpPage() {
  redirect('/signin');
}
