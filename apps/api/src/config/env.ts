/** Typed access to environment variables with sane defaults for dev. */
export const env = {
  get port(): number {
    return Number(process.env.API_PORT ?? 4000);
  },
  get apiPublicUrl(): string {
    return process.env.API_PUBLIC_URL ?? `http://localhost:${this.port}`;
  },
  get webPublicUrl(): string {
    return process.env.WEB_PUBLIC_URL ?? 'http://localhost:3000';
  },

  get openaiApiKey(): string {
    return required('OPENAI_API_KEY');
  },
  get openaiModel(): string {
    return process.env.OPENAI_MODEL ?? 'gpt-5.5';
  },
  get openaiFastModel(): string {
    return process.env.OPENAI_FAST_MODEL ?? this.openaiModel;
  },
  get openaiEmbeddingModel(): string {
    return process.env.OPENAI_EMBEDDING_MODEL ?? 'text-embedding-3-small';
  },

  get supabaseUrl(): string {
    return required('SUPABASE_URL');
  },
  get supabaseServiceRoleKey(): string {
    return required('SUPABASE_SERVICE_ROLE_KEY');
  },

  get whatsappPhoneNumberId(): string {
    return required('WHATSAPP_PHONE_NUMBER_ID');
  },
  get whatsappAccessToken(): string {
    return required('WHATSAPP_ACCESS_TOKEN');
  },
  get whatsappVerifyToken(): string {
    return process.env.WHATSAPP_VERIFY_TOKEN ?? 'scout-verify-token';
  },

  get tavilyApiKey(): string | undefined {
    return process.env.TAVILY_API_KEY;
  },
  get firecrawlApiKey(): string | undefined {
    return process.env.FIRECRAWL_API_KEY;
  },

  get stripeSecretKey(): string {
    return required('STRIPE_SECRET_KEY');
  },
  get stripeWebhookSecret(): string {
    return required('STRIPE_WEBHOOK_SECRET');
  },
  get stripePriceId(): string {
    return required('STRIPE_PRICE_ID');
  },

  get redisUrl(): string | undefined {
    return process.env.REDIS_URL;
  },
};

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
