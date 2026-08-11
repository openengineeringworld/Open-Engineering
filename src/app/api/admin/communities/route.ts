import { NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { checkAdminSession } from '@/lib/adminAuth';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createAdminClient(supabaseUrl, serviceRoleKey);
}

// GET /api/admin/communities - List all community requests & details
export async function GET() {
  try {
    const isAuthenticated = await checkAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    // Fetch communities with associated colleges
    const { data: communities, error: commError } = await supabase
      .from('communities')
      .select('*, college:colleges(*)')
      .order('created_at', { ascending: false });

    if (commError) {
      throw commError;
    }

    // 1. Fetch community_applications table metadata if present
    const appMap = new Map();
    try {
      const { data: appRows } = await supabase
        .from('community_applications')
        .select('*');

      if (appRows) {
        appRows.forEach((app: any) => {
          if (app.community_name) appMap.set(app.community_name.toLowerCase(), app);
          if (app.leader_email) appMap.set(app.leader_email.toLowerCase(), app);
          if (app.id) appMap.set(app.id, app);
        });
      }
    } catch (e) {
      console.warn('Could not fetch community_applications:', e);
    }

    // 2. Fetch contact submissions for application metadata fallback
    const { data: submissions } = await supabase
      .from('contact_submissions')
      .select('*')
      .ilike('subject', 'Community Application:%');

    const submissionMap = new Map();
    if (submissions) {
      submissions.forEach((sub) => {
        try {
          const parsed = JSON.parse(sub.message);
          const appObj = { ...parsed, submission_id: sub.id };
          if (parsed.community_id) {
            submissionMap.set(parsed.community_id, appObj);
          }
          if (parsed.community_name) {
            submissionMap.set(parsed.community_name.toLowerCase(), appObj);
          }
          if (parsed.leader_email) {
            submissionMap.set(parsed.leader_email.toLowerCase(), appObj);
          }
        } catch {
          // If message is plain text, keep fallback
        }
      });
    }

    // Merge community objects with application details
    const enrichedCommunities = (communities || []).map((comm) => {
      let appData =
        submissionMap.get(comm.id) ||
        appMap.get(comm.name.toLowerCase()) ||
        submissionMap.get(comm.name.toLowerCase()) ||
        null;

      // If both sources exist, merge them (appMap takes precedence for missing fields)
      const fromAppTable = appMap.get(comm.name.toLowerCase());
      if (fromAppTable && appData) {
        appData = { ...appData, ...fromAppTable };
      }

      return {
        ...comm,
        application_details: appData
      };
    });

    return NextResponse.json({ communities: enrichedCommunities });
  } catch (error: any) {
    console.error('Error fetching admin communities:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch communities' }, { status: 500 });
  }
}

// PUT /api/admin/communities - Edit community details or verify/approve/reject status
export async function PUT(request: Request) {
  try {
    const isAuthenticated = await checkAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      status,
      name,
      description,
      member_count,
      college_id,
      college_name,
      college_full_name,
      college_short_name,
      college_city,
      college_state,
      college_district,
      leader_name,
      leader_email,
      leader_phone,
      whatsapp_link,
      additional_notes,
      password
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Community ID is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const actualCollegeFullName = (college_full_name || college_name || '').trim();

    // 1. Update community fields
    const updatePayload: Record<string, any> = {};
    if (status !== undefined) updatePayload.status = status;
    if (name !== undefined) updatePayload.name = name.trim();
    if (description !== undefined) {
      updatePayload.description = description.trim();
    } else if (leader_name) {
      updatePayload.description = `Lead: ${leader_name.trim()}`;
    }
    if (member_count !== undefined) updatePayload.member_count = Number(member_count);

    let updatedCommunity = null;
    if (Object.keys(updatePayload).length > 0) {
      const { data, error } = await supabase
        .from('communities')
        .update(updatePayload)
        .eq('id', id)
        .select('*, college:colleges(*)')
        .single();

      if (error) throw error;
      updatedCommunity = data;
    }

    // 2. Update college fields
    const targetCollegeId = college_id || updatedCommunity?.college_id;
    if (targetCollegeId && (actualCollegeFullName || college_city || college_state || college_district)) {
      const collegePayload: Record<string, any> = {};
      if (actualCollegeFullName) collegePayload.name = actualCollegeFullName;
      if (college_city !== undefined) collegePayload.city = college_city.trim();
      if (college_state !== undefined) collegePayload.state = college_state.trim();
      if (college_district !== undefined) collegePayload.district = college_district.trim();

      const { error: colErr } = await supabase
        .from('colleges')
        .update(collegePayload)
        .eq('id', targetCollegeId);

      if (colErr) console.error('Error updating college details:', colErr);
    }

    // 3. Update community_applications table if fields provided
    try {
      const appPayload: Record<string, any> = {};
      if (actualCollegeFullName) appPayload.college_full_name = actualCollegeFullName;
      if (college_short_name !== undefined) appPayload.college_short_name = college_short_name.trim();
      if (name !== undefined) appPayload.community_name = name.trim();
      if (leader_name !== undefined) appPayload.leader_name = leader_name.trim();
      if (leader_email !== undefined) appPayload.leader_email = leader_email.trim();
      if (leader_phone !== undefined) appPayload.leader_phone = leader_phone.trim();
      if (whatsapp_link !== undefined) appPayload.whatsapp_link = whatsapp_link.trim();
      if (additional_notes !== undefined) appPayload.additional_notes = additional_notes.trim();
      if (password !== undefined) appPayload.password = password.trim();
      if (status !== undefined) appPayload.status = status;

      if (Object.keys(appPayload).length > 0) {
        // Try update matching community_name or leader_email
        const { data: existingApp } = await supabase
          .from('community_applications')
          .select('id')
          .or(`community_name.ilike.${name || ''},leader_email.ilike.${leader_email || ''}`)
          .maybeSingle();

        if (existingApp) {
          await supabase
            .from('community_applications')
            .update(appPayload)
            .eq('id', existingApp.id);
        } else {
          await supabase
            .from('community_applications')
            .insert({
              ...appPayload,
              college_full_name: actualCollegeFullName || 'N/A',
              college_short_name: college_short_name || 'N/A',
              community_name: name || updatedCommunity?.name || 'Community',
              leader_name: leader_name || 'N/A',
              leader_email: leader_email || 'N/A',
              leader_phone: leader_phone || 'N/A',
              whatsapp_link: whatsapp_link || '',
              password: password || '123456'
            });
        }
      }
    } catch (appErr) {
      console.warn('Could not update community_applications table:', appErr);
    }

    // 4. Update contact_submissions fallback JSON payload
    try {
      const { data: submissions } = await supabase
        .from('contact_submissions')
        .select('*')
        .ilike('subject', 'Community Application:%');

      let targetSub = null;
      if (submissions && submissions.length > 0) {
        targetSub = submissions.find((sub: any) => {
          try {
            const parsed = JSON.parse(sub.message);
            if (parsed.community_id === id) return true;
            if (name && parsed.community_name?.toLowerCase() === name.toLowerCase()) return true;
            if (leader_email && parsed.leader_email?.toLowerCase() === leader_email.toLowerCase()) return true;
          } catch {}
          return false;
        });
      }

      if (targetSub) {
        let parsedMessage: Record<string, any> = {};
        try {
          parsedMessage = JSON.parse(targetSub.message);
        } catch {}

        const updatedMessage = {
          ...parsedMessage,
          community_id: id,
          college_full_name: actualCollegeFullName || parsedMessage.college_full_name,
          college_short_name: college_short_name !== undefined ? college_short_name.trim() : parsedMessage.college_short_name,
          community_name: name ? name.trim() : parsedMessage.community_name,
          leader_name: leader_name ? leader_name.trim() : parsedMessage.leader_name,
          leader_email: leader_email ? leader_email.trim() : parsedMessage.leader_email,
          leader_phone: leader_phone ? leader_phone.trim() : parsedMessage.leader_phone,
          whatsapp_link: whatsapp_link !== undefined ? whatsapp_link.trim() : parsedMessage.whatsapp_link,
          additional_notes: additional_notes !== undefined ? additional_notes.trim() : parsedMessage.additional_notes,
          password: password ? password.trim() : parsedMessage.password,
          status: status || parsedMessage.status || 'approved'
        };

        await supabase
          .from('contact_submissions')
          .update({
            name: leader_name ? leader_name.trim() : targetSub.name,
            email: leader_email ? leader_email.trim() : targetSub.email,
            subject: `Community Application: ${updatedMessage.community_name}`,
            message: JSON.stringify(updatedMessage)
          })
          .eq('id', targetSub.id);
      }
    } catch (subErr) {
      console.warn('Could not update contact_submissions fallback:', subErr);
    }

    // Refetch final record with application details
    const { data: finalCommunity } = await supabase
      .from('communities')
      .select('*, college:colleges(*)')
      .eq('id', id)
      .single();

    // Re-construct updated application_details
    const finalAppDetails = {
      college_full_name: actualCollegeFullName,
      college_short_name: college_short_name,
      community_name: name,
      leader_name: leader_name,
      leader_email: leader_email,
      leader_phone: leader_phone,
      whatsapp_link: whatsapp_link,
      additional_notes: additional_notes,
      password: password,
      status: status
    };

    return NextResponse.json({
      success: true,
      community: {
        ...(finalCommunity || updatedCommunity),
        application_details: finalAppDetails
      }
    });
  } catch (error: any) {
    console.error('Error updating community:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update community' }, { status: 500 });
  }
}

// DELETE /api/admin/communities - Delete a community request
export async function DELETE(request: Request) {
  try {
    const isAuthenticated = await checkAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Community ID is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('communities')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Community deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting community:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete community' }, { status: 500 });
  }
}
