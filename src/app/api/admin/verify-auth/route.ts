import { NextResponse } from 'next/server';
import { checkAdminSession } from '@/lib/adminAuth';

export async function GET() {
  const isAuthenticated = await checkAdminSession();
  if (!isAuthenticated) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}
