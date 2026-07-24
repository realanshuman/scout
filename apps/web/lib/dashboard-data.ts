/**
 * Dashboard data. Reads each signed-in customer's real workspace + investor
 * matches from Neon (see lib/workspace.ts). The DEMO_* constants below are the
 * dataset used to seed the demo account and are the shape everything maps to.
 */
import { getWorkspace, getInvestorMatches } from './workspace';

export interface Founder {
  name: string;
  email: string;
}

export interface StartupProfile {
  name: string;
  website: string;
  oneLiner: string;
  industry: string;
  stage: string;
  country: string;
  raiseUsd: number;
  mrrUsd: number;
  traction: string;
  businessModel: string;
  competitors: string[];
  founders: { name: string; role: string }[];
}

export interface InvestorMatch {
  id?: string;
  rank: number;
  firm: string;
  partner: string | null;
  fit: number;
  stages: string;
  check: string;
  sectors: string;
  why: string;
  email: string | null;
  linkedin: string | null;
  outreachSubject: string;
  outreachBody?: string;
  saved?: boolean;
  status?: 'new' | 'contacted' | 'passed';
}

export interface AgentSettings {
  whatsappConnected: boolean;
  whatsappNumber: string;
  lastActive: string;
  emailReport: boolean;
  notifyNewMatches: boolean;
  weeklyNudge: boolean;
}

export interface DashboardData {
  founder: Founder;
  startup: StartupProfile;
  reportStatus: 'ready' | 'generating';
  investors: InvestorMatch[];
  agent: AgentSettings;
}

// ── Demo dataset (also the seed) ─────────────────────────────────────
export const DEMO_STARTUP: StartupProfile = {
  name: 'Loop',
  website: 'loop.ai',
  oneLiner: 'An AI copilot for warehouse operations teams.',
  industry: 'Logistics · AI',
  stage: 'Seed',
  country: 'United States',
  raiseUsd: 2_000_000,
  mrrUsd: 18_000,
  traction: '$18k MRR, growing 22% month over month with mid-size 3PLs.',
  businessModel: 'B2B SaaS, per-seat with usage tiers.',
  competitors: ['Fulfil', 'ShipBob OS', 'internal tools'],
  founders: [
    { name: 'Jordan Rivera', role: 'CEO' },
    { name: 'Mia Chen', role: 'CTO' },
  ],
};

const draft = (firm: string, name: string, sub: string) =>
  `Hi ${name.split(' ')[0]},\n\nI'm Jordan, founder of Loop, an AI copilot for warehouse operations teams. We're at $18k MRR growing 22% MoM with mid-size 3PLs, and raising a $2M seed.\n\nI'm reaching out because ${firm}'s work with operations and applied-AI companies lines up closely with what we're building. Would you be open to a 20-minute call in the next couple of weeks?\n\nHappy to send the deck ahead of time.\n\nThanks,\nJordan`;

export const DEMO_INVESTORS: InvestorMatch[] = [
  {
    rank: 1,
    firm: 'Northbeam Ventures',
    partner: 'Sarah Lindqvist',
    fit: 94,
    stages: 'Seed – Series A',
    check: '$500K–$3M',
    sectors: 'Dev tools · AI infra',
    why: 'Led two logistics-AI seeds this year and writes publicly about agentic ops. Your warehouse copilot lands right in her thesis.',
    email: 'sarah@northbeam.vc',
    linkedin: 'in/slindqvist',
    outreachSubject: 'Cursor for warehouse ops',
    outreachBody: draft('Northbeam Ventures', 'Sarah Lindqvist', 'Cursor for warehouse ops'),
    saved: true,
    status: 'new',
  },
  {
    rank: 2,
    firm: 'Latitude Labs',
    partner: 'Marcus Bell',
    fit: 91,
    stages: 'Pre-seed – Seed',
    check: '$250K–$1.5M',
    sectors: 'Applied AI · SaaS',
    why: 'Thesis is "AI that owns a full workflow." Backed two vertical copilots in the last year.',
    email: 'marcus@latitude.labs',
    linkedin: 'in/marcusbell',
    outreachSubject: 'AI that owns the warehouse workflow',
    outreachBody: draft('Latitude Labs', 'Marcus Bell', 'AI that owns the warehouse workflow'),
    status: 'new',
  },
  {
    rank: 3,
    firm: 'Kite String Capital',
    partner: 'Dana Osei',
    fit: 88,
    stages: 'Seed',
    check: '$500K–$2M',
    sectors: 'Revenue tooling · Ops',
    why: 'Backs revenue and ops tooling at seed. Portfolio has two 3PL-adjacent companies that don’t compete with you.',
    email: 'dana@kitestring.vc',
    linkedin: 'in/danaosei',
    outreachSubject: 'Ops copilot doing $18k MRR',
    outreachBody: draft('Kite String Capital', 'Dana Osei', 'Ops copilot doing $18k MRR'),
    status: 'contacted',
  },
  {
    rank: 4,
    firm: 'Harborline',
    partner: 'Priya Nair',
    fit: 85,
    stages: 'Seed – Series A',
    check: '$1M–$4M',
    sectors: 'Supply chain · B2B',
    why: 'Supply-chain focused fund. Recently wrote about labor shortages in warehousing, which your product addresses directly.',
    email: null,
    linkedin: 'in/priyanair',
    outreachSubject: 'Warehouses, minus the busywork',
    outreachBody: draft('Harborline', 'Priya Nair', 'Warehouses, minus the busywork'),
    status: 'new',
  },
  {
    rank: 5,
    firm: 'Foundry 9',
    partner: 'Tom Alvarez',
    fit: 82,
    stages: 'Pre-seed – Seed',
    check: '$150K–$1M',
    sectors: 'Vertical SaaS',
    why: 'First-cheque fund for vertical SaaS with early revenue. Your $18k MRR is right in their sweet spot.',
    email: 'tom@foundry9.com',
    linkedin: 'in/tomalvarez',
    outreachSubject: 'Vertical SaaS for 3PLs',
    outreachBody: draft('Foundry 9', 'Tom Alvarez', 'Vertical SaaS for 3PLs'),
    status: 'new',
  },
  {
    rank: 6,
    firm: 'Meridian Angels',
    partner: null,
    fit: 79,
    stages: 'Pre-seed',
    check: '$25K–$150K',
    sectors: 'Operator angels',
    why: 'Operator-angel syndicate with several ex-logistics leaders who angel-invest in ops software.',
    email: 'deals@meridianangels.com',
    linkedin: null,
    outreachSubject: 'Ops software from an operator',
    outreachBody: draft('Meridian Angels', 'the team', 'Ops software from an operator'),
    status: 'new',
  },
];

export const DEMO_AGENT = {
  whatsappConnected: true,
  whatsappNumber: '+1 (555) 018-2245',
  emailReport: true,
  notifyNewMatches: true,
  weeklyNudge: false,
};

/**
 * Real dashboard data for a user. Returns null when the user has no workspace
 * yet (e.g. paid but not provisioned) so callers can show an empty state.
 */
export async function getDashboardData(user: {
  id: string;
  name: string;
  email: string;
}): Promise<DashboardData | null> {
  const ws = await getWorkspace(user.id);
  if (!ws) return null;
  const investors = await getInvestorMatches(user.id);

  return {
    founder: { name: user.name, email: user.email },
    startup: {
      name: ws.startupName ?? 'Your startup',
      website: ws.website ?? '',
      oneLiner: ws.oneLiner ?? '',
      industry: ws.industry ?? '',
      stage: ws.stage ?? '',
      country: ws.country ?? '',
      raiseUsd: Number(ws.raiseUsd ?? 0),
      mrrUsd: Number(ws.mrrUsd ?? 0),
      traction: ws.traction ?? '',
      businessModel: ws.businessModel ?? '',
      competitors: Array.isArray(ws.competitors) ? ws.competitors : [],
      founders: Array.isArray(ws.founders) ? ws.founders : [],
    },
    reportStatus: ws.reportStatus ?? 'ready',
    investors,
    agent: {
      whatsappConnected: ws.whatsappConnected,
      whatsappNumber: ws.whatsappNumber ?? '',
      lastActive: '2 hours ago',
      emailReport: ws.emailReport,
      notifyNewMatches: ws.notifyNewMatches,
      weeklyNudge: ws.weeklyNudge,
    },
  };
}

export function formatUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1000)}k`;
  return `$${n}`;
}
