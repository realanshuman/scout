/**
 * Dashboard data.
 *
 * For now this returns realistic sample data so the UI is complete and
 * demoable. To wire real data, replace the body of `getDashboardData` with a
 * lookup that maps the signed-in user (by email) to their startup + investor
 * matches in Supabase — this is the one place that needs to change.
 */

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
  saved?: boolean;
}

export interface DashboardData {
  founder: Founder;
  startup: StartupProfile;
  reportStatus: 'ready' | 'generating';
  investors: InvestorMatch[];
  agent: {
    whatsappConnected: boolean;
    whatsappNumber: string;
    lastActive: string;
    emailReport: boolean;
    notifyNewMatches: boolean;
  };
}

const SAMPLE: DashboardData = {
  founder: { name: 'Jordan Rivera', email: 'jordan@loop.ai' },
  startup: {
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
  },
  reportStatus: 'ready',
  investors: [
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
      saved: true,
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
    },
  ],
  agent: {
    whatsappConnected: true,
    whatsappNumber: '+1 (555) 018-2245',
    lastActive: '2 hours ago',
    emailReport: true,
    notifyNewMatches: true,
  },
};

export async function getDashboardData(): Promise<DashboardData> {
  return SAMPLE;
}

export function formatUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1000)}k`;
  return `$${n}`;
}
