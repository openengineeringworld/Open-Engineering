import { cookies } from 'next/headers';
import crypto from 'crypto';

const SECRET_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'ambassador-secret-key-open-engineering';

export interface AmbassadorPayload {
  email: string;
  communityId?: string;
  applicationId?: string;
  leaderName?: string;
  createdAt: number;
}

export function createAmbassadorToken(payload: AmbassadorPayload): string {
  const data = JSON.stringify(payload);
  const base64Data = Buffer.from(data).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(base64Data)
    .digest('base64url');

  return `${base64Data}.${signature}`;
}

export function verifyAmbassadorToken(token?: string | null): AmbassadorPayload | null {
  if (!token) return null;
  try {
    const [base64Data, signature] = token.split('.');
    if (!base64Data || !signature) return null;

    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(base64Data)
      .digest('base64url');

    if (signature !== expectedSignature) return null;

    const data = Buffer.from(base64Data, 'base64url').toString('utf8');
    const payload = JSON.parse(data) as AmbassadorPayload;

    // Optional expiration check (30 days)
    const maxAgeMs = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - payload.createdAt > maxAgeMs) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

export async function getAmbassadorSession(): Promise<AmbassadorPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('ambassador_session')?.value;
  return verifyAmbassadorToken(token);
}
