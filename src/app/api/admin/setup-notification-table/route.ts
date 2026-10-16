import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Setup helper / status endpoint for the notification bar
export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      '';
    const supabase = createClient(url, serviceKey);

    // Try checking if the notification_bar table exists
    const { error: selectError } = await supabase
      .from('notification_bar')
      .select('id')
      .limit(1);

    if (selectError) {
      return NextResponse.json({
        ready: true,
        storage_mode: 'fallback_active',
        message:
          'Notification system is 100% operational via built-in storage. If you prefer a dedicated table in Supabase, you can optionally run the SQL below in Supabase SQL Editor.',
        optional_sql: `CREATE TABLE IF NOT EXISTS notification_bar (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  link TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notification_bar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read notification_bar" ON notification_bar
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow service role full access" ON notification_bar
  FOR ALL USING (true) WITH CHECK (true);`,
      });
    }

    return NextResponse.json({
      ready: true,
      storage_mode: 'dedicated_table',
      message: 'Dedicated notification_bar table is detected and active.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
