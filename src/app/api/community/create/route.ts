import { NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      collegeFullName,
      shortName,
      leaderName,
      leaderEmail,
      leaderPhone,
      whatsappLink,
      additionalNotes
    } = body;

    if (!collegeFullName || !shortName || !leaderName || !leaderEmail || !leaderPhone || !whatsappLink) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    const supabase = createAdminClient(supabaseUrl, serviceRoleKey);
    const communityName = `Open Engineering ${shortName.trim().toUpperCase()}`;

    // 1. Find existing college or insert new college in colleges table
    let collegeId: string | null = null;
    const { data: existingColleges } = await supabase
      .from('colleges')
      .select('id')
      .ilike('name', collegeFullName.trim());

    if (existingColleges && existingColleges.length > 0) {
      collegeId = existingColleges[0].id;
    } else {
      const { data: newCollege, error: colError } = await supabase
        .from('colleges')
        .insert({
          name: collegeFullName.trim(),
          city: 'N/A',
          state: 'India'
        })
        .select()
        .single();

      if (colError) throw colError;
      collegeId = newCollege.id;
    }

    // 2. Check if a community already exists for this college
    const { data: existingComm } = await supabase
      .from('communities')
      .select('id')
      .eq('college_id', collegeId)
      .maybeSingle();

    let commRecord = null;
    const commPayload = {
      college_id: collegeId,
      name: communityName,
      description: `Lead: ${leaderName.trim()}`,
      status: 'pending',
      member_count: 1
    };

    if (existingComm) {
      const { data: updatedComm, error: commErr } = await supabase
        .from('communities')
        .update(commPayload)
        .eq('id', existingComm.id)
        .select()
        .single();
      if (commErr) throw commErr;
      commRecord = updatedComm;
    } else {
      const { data: insertedComm, error: commErr } = await supabase
        .from('communities')
        .insert(commPayload)
        .select()
        .single();
      if (commErr) throw commErr;
      commRecord = insertedComm;
    }

    // 3. Save application details in community_applications table (if exists) and contact_submissions table
    try {
      await supabase.from('community_applications').insert({
        college_full_name: collegeFullName.trim(),
        college_short_name: shortName.trim(),
        community_name: communityName,
        leader_name: leaderName.trim(),
        leader_email: leaderEmail.trim(),
        leader_phone: leaderPhone.trim(),
        whatsapp_link: whatsappLink.trim(),
        additional_notes: additionalNotes ? additionalNotes.trim() : null,
        status: 'pending'
      });
    } catch (e) {
      console.warn('Could not insert to community_applications table:', e);
    }

    await supabase.from('contact_submissions').insert({
      name: leaderName.trim(),
      email: leaderEmail.trim(),
      subject: `Community Application: ${communityName}`,
      message: JSON.stringify({
        college_full_name: collegeFullName.trim(),
        college_short_name: shortName.trim(),
        community_name: communityName,
        leader_name: leaderName.trim(),
        leader_email: leaderEmail.trim(),
        leader_phone: leaderPhone.trim(),
        whatsapp_link: whatsappLink.trim(),
        additional_notes: additionalNotes ? additionalNotes.trim() : '',
        community_id: commRecord?.id
      })
    });

    return NextResponse.json({
      success: true,
      community: commRecord
    });
  } catch (error: any) {
    console.error('Error creating community:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
