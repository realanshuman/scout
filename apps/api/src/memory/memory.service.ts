import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../lib/supabase.service';
import { StartupProfile } from '../conversation/profile';

export type Stage = 'interview' | 'researching' | 'preview' | 'unlocked' | 'assistant';

export interface UserRow {
  id: string;
  wa_phone: string;
  name: string | null;
}
export interface ConversationRow {
  id: string;
  user_id: string;
  stage: Stage;
}
export interface StartupRow {
  id: string;
  user_id: string;
  conversation_id: string | null;
  name: string | null;
  profile: StartupProfile;
  profile_complete: boolean;
}
export interface ResearchRow {
  id: string;
  startup_id: string;
  status: 'pending' | 'running' | 'complete' | 'failed';
  startup_summary: string | null;
  industry_summary: string | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
  ideal_investor_profile: string | null;
  funding_stage: string | null;
  sources: { url: string; title: string; snippet: string }[] | null;
}
export interface MatchRow {
  id: string;
  startup_id: string;
  investor_id: string;
  rank: number;
  confidence: number;
  why_matched: string;
  outreach: {
    subject: string;
    email: string;
    linkedin_dm: string;
    personalization: string;
  } | null;
  investors?: InvestorRow;
}
export interface InvestorRow {
  id: string;
  firm: string;
  partner: string | null;
  email: string | null;
  linkedin: string | null;
  website: string | null;
  countries: string[];
  stages: string[];
  sectors: string[];
  check_min_usd: number | null;
  check_max_usd: number | null;
  thesis: string | null;
  partner_interests: string | null;
  recent_investments: { company: string; round?: string; year?: number }[] | null;
  portfolio: string[] | null;
  similarity?: number;
}
export interface ReportRow {
  id: string;
  startup_id: string;
  status: 'locked' | 'unlocked';
  payment_ref: string | null;
}

/**
 * The memory agent: every fact learned about a founder is persisted here so
 * they never repeat themselves. All Supabase access for the flow lives in
 * this one service.
 */
@Injectable()
export class MemoryService {
  constructor(private readonly supabase: SupabaseService) {}

  private get db() {
    return this.supabase.client;
  }

  // ── users / conversations ─────────────────────────────────────────

  async upsertUser(waPhone: string, name?: string): Promise<UserRow> {
    const { data, error } = await this.db
      .from('users')
      .upsert({ wa_phone: waPhone, ...(name ? { name } : {}) }, { onConflict: 'wa_phone' })
      .select()
      .single();
    if (error) throw error;
    return data as UserRow;
  }

  async activeConversation(userId: string): Promise<ConversationRow> {
    const { data } = await this.db
      .from('conversations')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) return data as ConversationRow;
    const { data: created, error } = await this.db
      .from('conversations')
      .insert({ user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return created as ConversationRow;
  }

  async setStage(conversationId: string, stage: Stage): Promise<void> {
    const { error } = await this.db
      .from('conversations')
      .update({ stage, updated_at: new Date().toISOString() })
      .eq('id', conversationId);
    if (error) throw error;
  }

  // ── messages ──────────────────────────────────────────────────────

  /** Returns false when the wa_message_id was already stored (webhook retry). */
  async recordInbound(
    conversationId: string,
    waMessageId: string,
    content: string,
  ): Promise<boolean> {
    const { error } = await this.db
      .from('messages')
      .insert({ conversation_id: conversationId, role: 'user', content, wa_message_id: waMessageId });
    if (error) {
      if (error.code === '23505') return false; // duplicate delivery
      throw error;
    }
    return true;
  }

  async recordOutbound(conversationId: string, content: string): Promise<void> {
    const { error } = await this.db
      .from('messages')
      .insert({ conversation_id: conversationId, role: 'assistant', content });
    if (error) throw error;
  }

  async history(conversationId: string, limit = 40) {
    const { data, error } = await this.db
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data as { role: 'user' | 'assistant' | 'system'; content: string }[]).reverse();
  }

  // ── startups ──────────────────────────────────────────────────────

  async startupForConversation(userId: string, conversationId: string): Promise<StartupRow> {
    const { data } = await this.db
      .from('startups')
      .select()
      .eq('conversation_id', conversationId)
      .maybeSingle();
    if (data) return data as StartupRow;
    const { data: created, error } = await this.db
      .from('startups')
      .insert({ user_id: userId, conversation_id: conversationId, profile: {} })
      .select()
      .single();
    if (error) throw error;
    return created as StartupRow;
  }

  async mergeProfile(startupId: string, updates: StartupProfile): Promise<StartupProfile> {
    const { data, error } = await this.db
      .from('startups')
      .select('profile')
      .eq('id', startupId)
      .single();
    if (error) throw error;
    const merged: StartupProfile = { ...(data.profile as StartupProfile) };
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined && value !== null && value !== '') {
        (merged as Record<string, unknown>)[key] = value;
      }
    }
    const { error: updateError } = await this.db
      .from('startups')
      .update({
        profile: merged,
        name: merged.name ?? null,
        website: merged.website ?? null,
        industry: merged.industry ?? null,
        stage: merged.stage ?? null,
        country: merged.country ?? null,
        raise_amount_usd: merged.raise_amount_usd ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', startupId);
    if (updateError) throw updateError;
    return merged;
  }

  async markProfileComplete(startupId: string): Promise<void> {
    const { error } = await this.db
      .from('startups')
      .update({ profile_complete: true, updated_at: new Date().toISOString() })
      .eq('id', startupId);
    if (error) throw error;
  }

  async startupById(startupId: string): Promise<StartupRow> {
    const { data, error } = await this.db.from('startups').select().eq('id', startupId).single();
    if (error) throw error;
    return data as StartupRow;
  }

  async userById(userId: string): Promise<UserRow> {
    const { data, error } = await this.db.from('users').select().eq('id', userId).single();
    if (error) throw error;
    return data as UserRow;
  }

  async latestStartupForUser(userId: string): Promise<StartupRow | null> {
    const { data } = await this.db
      .from('startups')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    return (data as StartupRow) ?? null;
  }

  // ── research ──────────────────────────────────────────────────────

  async createResearch(startupId: string): Promise<ResearchRow> {
    const { data, error } = await this.db
      .from('research')
      .insert({ startup_id: startupId, status: 'running' })
      .select()
      .single();
    if (error) throw error;
    return data as ResearchRow;
  }

  async saveResearch(id: string, fields: Partial<ResearchRow> & { raw?: unknown; error?: string }) {
    const { error } = await this.db
      .from('research')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }

  async latestResearch(startupId: string): Promise<ResearchRow | null> {
    const { data } = await this.db
      .from('research')
      .select()
      .eq('startup_id', startupId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    return (data as ResearchRow) ?? null;
  }

  // ── investors / matches ───────────────────────────────────────────

  async matchInvestors(
    embedding: number[],
    opts: { stage?: string | null; country?: string | null; count?: number },
  ): Promise<InvestorRow[]> {
    const { data, error } = await this.db.rpc('match_investors', {
      query_embedding: embedding,
      match_count: opts.count ?? 100,
      filter_stage: opts.stage ?? null,
      filter_country: opts.country ?? null,
    });
    if (error) throw error;
    return data as InvestorRow[];
  }

  async saveMatches(
    startupId: string,
    matches: { investor_id: string; rank: number; confidence: number; why_matched: string }[],
  ): Promise<void> {
    await this.db.from('investor_matches').delete().eq('startup_id', startupId);
    const { error } = await this.db
      .from('investor_matches')
      .insert(matches.map((m) => ({ ...m, startup_id: startupId })));
    if (error) throw error;
  }

  async matchesForStartup(startupId: string, limit = 50): Promise<MatchRow[]> {
    const { data, error } = await this.db
      .from('investor_matches')
      .select('*, investors(*)')
      .eq('startup_id', startupId)
      .order('rank', { ascending: true })
      .limit(limit);
    if (error) throw error;
    return data as MatchRow[];
  }

  async saveOutreach(matchId: string, outreach: NonNullable<MatchRow['outreach']>): Promise<void> {
    const { error } = await this.db
      .from('investor_matches')
      .update({ outreach })
      .eq('id', matchId);
    if (error) throw error;
  }

  // ── reports ───────────────────────────────────────────────────────

  async createReport(startupId: string, paymentRef: string): Promise<ReportRow> {
    const { data, error } = await this.db
      .from('reports')
      .insert({ startup_id: startupId, payment_ref: paymentRef })
      .select()
      .single();
    if (error) throw error;
    return data as ReportRow;
  }

  async reportById(reportId: string): Promise<ReportRow> {
    const { data, error } = await this.db.from('reports').select().eq('id', reportId).single();
    if (error) throw error;
    return data as ReportRow;
  }

  async reportByPaymentRef(paymentRef: string): Promise<ReportRow | null> {
    const { data } = await this.db
      .from('reports')
      .select()
      .eq('payment_ref', paymentRef)
      .maybeSingle();
    return (data as ReportRow) ?? null;
  }

  async unlockReport(reportId: string, content: unknown): Promise<void> {
    const { error } = await this.db
      .from('reports')
      .update({
        status: 'unlocked',
        content,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', reportId);
    if (error) throw error;
  }
}
