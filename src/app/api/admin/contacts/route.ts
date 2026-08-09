import { NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { checkAdminSession } from '@/lib/adminAuth';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createAdminClient(supabaseUrl, serviceRoleKey);
}

// GET /api/admin/contacts - List all contact submissions from Supabase
export async function GET() {
  try {
    const isAuthenticated = await checkAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    const { data: contacts, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ contacts: contacts || [] });
  } catch (error: any) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch contact submissions' }, { status: 500 });
  }
}

// DELETE /api/admin/contacts - Delete a contact submission from Supabase
export async function DELETE(request: Request) {
  try {
    const isAuthenticated = await checkAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Contact message deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting contact submission:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete contact message' }, { status: 500 });
  }
}
