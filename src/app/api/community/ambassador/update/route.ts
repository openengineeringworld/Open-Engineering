import { NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { getAmbassadorSession } from '@/lib/ambassadorAuth';

export async function POST(request: Request) {
  try {
    const session = await getAmbassadorSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const body = await request.json();
    const {
      communityId,
      communityName,
      description,
      whatsappLink,
      leaderName,
      leaderPhone,
      leaderEmail,
      collegeFullName,
      collegeAddress
    } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createAdminClient(supabaseUrl, serviceRoleKey);

    const cleanEmail = session.email.toLowerCase();

    // 1. Update communities table if communityId provided
    if (communityId) {
      const commUpdatePayload: any = {};
      if (communityName) commUpdatePayload.name = communityName.trim();
      if (description !== undefined) {
        // Embed lead name and whatsapp link inside description if needed for fallback
        let newDesc = description.trim();
        if (leaderName && !newDesc.includes('Lead:')) {
          newDesc = `${newDesc} (Lead: ${leaderName.trim()})`;
        }
        commUpdatePayload.description = newDesc;
      }

      if (Object.keys(commUpdatePayload).length > 0) {
        const { error: commErr } = await supabase
          .from('communities')
          .update(commUpdatePayload)
          .eq('id', communityId);

        if (commErr) console.warn('Error updating communities table:', commErr);
      }

      // Also update college table if linked
      if (collegeFullName) {
        const { data: commData } = await supabase
          .from('communities')
          .select('college_id')
          .eq('id', communityId)
          .maybeSingle();

        if (commData?.college_id) {
          await supabase
            .from('colleges')
            .update({
              name: collegeFullName.trim(),
              district: collegeAddress ? collegeAddress.trim() : undefined
            })
            .eq('id', commData.college_id);
        }
      }
    }

    // 2. Update community_applications table
    try {
      const appUpdatePayload: any = {};
      if (communityName) appUpdatePayload.community_name = communityName.trim();
      if (collegeFullName) appUpdatePayload.college_full_name = collegeFullName.trim();
      if (leaderName) appUpdatePayload.leader_name = leaderName.trim();
      if (leaderPhone) appUpdatePayload.leader_phone = leaderPhone.trim();
      if (whatsappLink) appUpdatePayload.whatsapp_link = whatsappLink.trim();
      if (collegeAddress !== undefined) appUpdatePayload.additional_notes = collegeAddress.trim();

      if (Object.keys(appUpdatePayload).length > 0) {
        await supabase
          .from('community_applications')
          .update(appUpdatePayload)
          .ilike('leader_email', cleanEmail);
      }
    } catch (e) {
      console.warn('Could not update community_applications table:', e);
    }

    // 3. Insert or update contact_submissions for fallback parity
    try {
      await supabase.from('contact_submissions').insert({
        name: leaderName ? leaderName.trim() : 'Ambassador',
        email: cleanEmail,
        subject: `Community Application: ${communityName || 'Updated Chapter'}`,
        message: JSON.stringify({
          college_full_name: collegeFullName ? collegeFullName.trim() : '',
          community_name: communityName ? communityName.trim() : '',
          leader_name: leaderName ? leaderName.trim() : '',
          leader_email: cleanEmail,
          leader_phone: leaderPhone ? leaderPhone.trim() : '',
          whatsapp_link: whatsappLink ? whatsappLink.trim() : '',
          additional_notes: collegeAddress ? collegeAddress.trim() : '',
          community_id: communityId || session.communityId
        })
      });
    } catch (e) {
      console.warn('Could not insert submission update:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Community page details updated successfully!'
    });
  } catch (error: any) {
    console.error('Error updating ambassador community:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
