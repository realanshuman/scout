import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

// Better Auth needs the Node runtime (it uses the pg driver).
export const runtime = 'nodejs';

export const { GET, POST } = toNextJsHandler(auth);
