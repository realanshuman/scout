import { redirect } from 'next/navigation';
import { getSessionUser } from './session';
import { hasActiveSubscription } from './subscription';
import { hasDatabase } from './db';
import { getDashboardData, type DashboardData } from './dashboard-data';

/**
 * Loads the signed-in user and their dashboard data for any dashboard page.
 * Enforces the same gate as the layout (auth + active subscription) so each
 * route is safe on its own. When no database is configured (local preview)
 * it falls back to letting the page render with whatever data exists.
 */
export async function loadDashboard(): Promise<{ user: { id: string; name: string; email: string }; data: DashboardData | null }> {
  const user = await getSessionUser();
  if (!user) {
    if (hasDatabase) redirect('/signin');
    return { user: { id: 'preview', name: 'Preview', email: '' }, data: null };
  }
  if (hasDatabase && !(await hasActiveSubscription(user.id))) redirect('/paywall');

  const data = await getDashboardData(user);
  return { user, data };
}
