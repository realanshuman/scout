import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env';

/** Thin wrapper so the rest of the app injects one shared service-role client. */
@Injectable()
export class SupabaseService {
  readonly client: SupabaseClient;

  constructor() {
    this.client = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: { persistSession: false },
    });
  }
}
