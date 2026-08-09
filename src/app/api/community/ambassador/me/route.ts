import { NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { getAmbassadorSession } from '@/lib/ambassadorAuth';

export async function GET() {
  try {
    const session = await getAmbassadorSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createAdminClient(supabaseUrl, serviceRoleKey);

    const cleanEmail = session.email.toLowerCase();

    // 1. Get Application record
    let appData: any = null;
    try {
      const { data: apps } = await supabase
        .from('community_applications')
        .select('*')
        .ilike('leader_email', cleanEmail)
        .order('created_at', { ascending: false });

      if (apps && apps.length > 0) {
        appData = apps[0];
      }
    } catch (e) {
      // Table query error
    }

    // Fallback check contact_submissions
    if (!appData) {
      try {
        const { data: subs } = await supabase
          .from('contact_submissions')
          .select('*')
          .ilike('email', cleanEmail)
          .ilike('subject', 'Community Application:%')
          .order('created_at', { ascending: false });

        if (subs && subs.length > 0) {
          try {
            const parsed = JSON.parse(subs[0].message);
            appData = {
              id: subs[0].id,
              leader_name: parsed.leader_name || subs[0].name,
              leader_email: cleanEmail,
              leader_phone: parsed.leader_phone,
              college_full_name: parsed.college_full_name,
              college_short_name: parsed.college_short_name,
              community_name: parsed.community_name,
              whatsapp_link: parsed.whatsapp_link,
              additional_notes: parsed.additional_notes,
              status: 'approved',
              created_at: subs[0].created_at,
              community_id: parsed.community_id
            };
          } catch {
            // Not JSON
          }
        }
      } catch (err) {
        // Fallback error
      }
    }

    // 2. Get Linked Community record
    let communityData: any = null;
    const targetCommId = session.communityId || appData?.community_id;

    if (targetCommId) {
      const { data: comm } = await supabase
        .from('communities')
        .select('*, college:colleges(*)')
        .eq('id', targetCommId)
        .maybeSingle();
      if (comm) communityData = comm;
    }

    if (!communityData && appData) {
      const commName = appData.community_name;
      const { data: comms } = await supabase
        .from('communities')
        .select('*, college:colleges(*)');

      if (comms && comms.length > 0) {
        communityData = comms.find((c: any) =>
          c.name?.toLowerCase() === commName?.toLowerCase() ||
          c.college?.name?.toLowerCase() === appData.college_full_name?.toLowerCase()
        ) || comms[0];
      }
    }

    return NextResponse.json({
      success: true,
      session,
      ambassador: {
        leaderName: appData?.leader_name || session.leaderName || 'Ambassador',
        leaderEmail: session.email,
        leaderPhone: appData?.leader_phone || '',
        collegeFullName: appData?.college_full_name || communityData?.college?.name || '',
        collegeShortName: appData?.college_short_name || '',
        collegeAddress: appData?.additional_notes || '',
        whatsappLink: appData?.whatsapp_link || '',
        status: appData?.status || 'approved',
        createdAt: appData?.created_at || new Date().toISOString()
      },
      community: communityData
    });
  } catch (error: any) {
    console.error('Error in ambassador me route:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
