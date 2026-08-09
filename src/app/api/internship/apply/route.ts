import { NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      collegeName,
      branch,
      year,
      programId,
      programTitle,
      githubUrl,
      experienceNotes
    } = body;

    if (!fullName || !email || !phone || !collegeName || !programId || !programTitle) {
      return NextResponse.json({ error: 'Missing required application fields.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    const supabase = createAdminClient(supabaseUrl, serviceRoleKey);

    const payload = {
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      college_name: collegeName.trim(),
      branch: branch ? branch.trim() : null,
      year: year ? year.trim() : null,
      program_id: programId,
      program_title: programTitle,
      github_url: githubUrl ? githubUrl.trim() : null,
      experience_notes: experienceNotes ? experienceNotes.trim() : null,
      status: 'pending'
    };

    const { data, error } = await supabase
      .from('internship_applications')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error inserting internship application:', error);
      throw error;
    }

    return NextResponse.json({ success: true, application: data });
  } catch (error: any) {
    console.error('API Internship Application Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to submit internship application.' },
      { status: 500 }
    );
  }
}
