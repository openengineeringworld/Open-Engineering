import { NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { checkAdminSession } from '@/lib/adminAuth';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createAdminClient(supabaseUrl, serviceRoleKey);
}

// GET /api/admin/internships - List all internship applications from Supabase
export async function GET() {
  try {
    const isAuthenticated = await checkAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    const { data: applications, error } = await supabase
      .from('internship_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ applications: applications || [] });
  } catch (error: any) {
    console.error('Error fetching admin internship applications:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch internship applications' }, { status: 500 });
  }
}

// PUT /api/admin/internships - Update approval status of an internship application in Supabase
export async function PUT(request: Request) {
  try {
    const isAuthenticated = await checkAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Application ID and status are required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('internship_applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, application: data });
  } catch (error: any) {
    console.error('Error updating internship application status:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update application status' }, { status: 500 });
  }
}

// DELETE /api/admin/internships - Delete an internship application from Supabase
export async function DELETE(request: Request) {
  try {
    const isAuthenticated = await checkAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('internship_applications')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Application deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting internship application:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete application' }, { status: 500 });
  }
}
