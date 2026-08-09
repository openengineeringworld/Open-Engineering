import { NextResponse } from 'next/server';
import { getAdminCredentials, createAdminToken } from '@/lib/adminAuth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const credentials = getAdminCredentials();

    if (username.trim() === credentials.username && password.trim() === credentials.password) {
      const token = createAdminToken(credentials.username);

      const response = NextResponse.json({ success: true, message: 'Authentication successful' });

      response.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid admin username or password' }, { status: 401 });
  } catch (error: any) {
    console.error('Error in admin login:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
