import { cookies } from 'next/headers';
import crypto from 'crypto';

const SECRET_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'admin-secret-key-open-engineering';

export function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME || process.env.admin_username || 'admin';
  const password = process.env.ADMIN_PASSWORD || process.env.admin_password || 'Admin@123';
  return { username, password };
}

export function createAdminToken(username: string): string {
  const { password } = getAdminCredentials();
  const data = `${username}:${password}:${SECRET_KEY}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function isValidAdminToken(token?: string | null): boolean {
  if (!token) return false;
  const { username } = getAdminCredentials();
  const expectedToken = createAdminToken(username);
  return token === expectedToken;
}

export async function checkAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  return isValidAdminToken(token);
}
