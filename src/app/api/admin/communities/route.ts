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

    // Fetch contact submissions for application metadata
    const { data: submissions } = await supabase
      .from('contact_submissions')
      .select('*')
      .ilike('subject', 'Community Application:%');

    // Create lookup map for applications
    const submissionMap = new Map();
    if (submissions) {
      submissions.forEach((sub) => {
        try {
          const parsed = JSON.parse(sub.message);
          if (parsed.community_id) {
            submissionMap.set(parsed.community_id, parsed);
          } else if (parsed.community_name) {
            submissionMap.set(parsed.community_name.toLowerCase(), parsed);
          }
        } catch {
          // If message is plain text, keep fallback
        }
      });
    }

    // Merge community objects with application details
    const enrichedCommunities = (communities || []).map((comm) => {
      let appData = submissionMap.get(comm.id) || submissionMap.get(comm.name.toLowerCase()) || null;
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
      college_city,
      college_state,
      college_district
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Community ID is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // 1. Update community fields if provided
    const updatePayload: Record<string, any> = {};
    if (status !== undefined) updatePayload.status = status;
    if (name !== undefined) updatePayload.name = name.trim();
    if (description !== undefined) updatePayload.description = description.trim();
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

    // 2. Update college fields if college info provided
    if (college_id && (college_name || college_city || college_state || college_district)) {
      const collegePayload: Record<string, any> = {};
      if (college_name !== undefined) collegePayload.name = college_name.trim();
      if (college_city !== undefined) collegePayload.city = college_city.trim();
      if (college_state !== undefined) collegePayload.state = college_state.trim();
      if (college_district !== undefined) collegePayload.district = college_district.trim();

      const { error: colErr } = await supabase
        .from('colleges')
        .update(collegePayload)
        .eq('id', college_id);

      if (colErr) console.error('Error updating college details:', colErr);
    }

    // Refetch final record
    const { data: finalData } = await supabase
      .from('communities')
      .select('*, college:colleges(*)')
      .eq('id', id)
      .single();

    return NextResponse.json({ success: true, community: finalData || updatedCommunity });
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
