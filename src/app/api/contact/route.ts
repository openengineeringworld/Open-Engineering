import { NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    const supabase = createAdminClient(supabaseUrl, serviceRoleKey);

    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim()
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting contact submission:', error);
      throw error;
    }

    return NextResponse.json({ success: true, submission: data });
  } catch (error: any) {
    console.error('API Contact Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to submit contact message.' },
      { status: 500 }
    );
  }
}
