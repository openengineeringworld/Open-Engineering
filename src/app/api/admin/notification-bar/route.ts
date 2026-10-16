import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkAdminSession } from '@/lib/adminAuth';

// Service-role client for admin operations & reliable fallback access
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';
  return createClient(url, serviceKey);
}

interface NotificationData {
  id: string;
  text: string;
  link: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Fallback helper to get notification from contact_submissions
async function getFallbackNotification(supabase: any, requireActive: boolean): Promise<NotificationData | null> {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('subject', 'system_notification_bar')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;

    const parsed = JSON.parse(data.message);
    if (requireActive && !parsed.is_active) {
      return null;
    }
    return {
      id: data.id || 'system_notification_bar',
      text: parsed.text,
      link: parsed.link,
      is_active: parsed.is_active !== false,
      created_at: data.created_at,
      updated_at: parsed.updated_at || data.created_at,
    };
  } catch {
    return null;
  }
}

// Fallback helper to save notification to contact_submissions
async function saveFallbackNotification(
  supabase: any,
  data: { id?: string; text: string; link: string; is_active: boolean }
): Promise<NotificationData> {
  const payload = {
    text: data.text,
    link: data.link,
    is_active: data.is_active,
    updated_at: new Date().toISOString(),
  };

  // Clean up previous fallback records to keep it tidy
  try {
    await supabase
      .from('contact_submissions')
      .delete()
      .eq('subject', 'system_notification_bar');
  } catch {}

  const { data: inserted, error } = await supabase
    .from('contact_submissions')
    .insert({
      name: 'System Setting',
      email: 'admin@openeng.in',
      subject: 'system_notification_bar',
      message: JSON.stringify(payload),
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: inserted.id,
    text: data.text,
    link: data.link,
    is_active: data.is_active,
    created_at: inserted.created_at,
    updated_at: payload.updated_at,
  };
}

// GET — fetch the notification (public or admin preview)
export async function GET(req: NextRequest) {
  try {
    const supabase = getServiceClient();
    const { searchParams } = new URL(req.url);
    const getAll = searchParams.get('all') === 'true';

    // 1. Try querying primary notification_bar table
    try {
      let query = supabase
        .from('notification_bar')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1);

      if (!getAll) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query.maybeSingle();

      if (!error && data) {
        return NextResponse.json({ notification: data });
      }

      if (!error && !data) {
        // Table exists but no records found
        // Also check fallback in case migration happened or fallback has data
        const fallback = await getFallbackNotification(supabase, !getAll);
        return NextResponse.json({ notification: fallback || null });
      }
    } catch {
      // Table query failed, fall through to fallback
    }

    // 2. Query fallback table
    const fallback = await getFallbackNotification(supabase, !getAll);
    return NextResponse.json({ notification: fallback });
  } catch {
    return NextResponse.json({ notification: null });
  }
}

// POST — admin: create or replace notification
export async function POST(req: NextRequest) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { text, link, is_active } = body;

    if (!text || !link) {
      return NextResponse.json({ error: 'Text and link are required' }, { status: 400 });
    }

    const supabase = getServiceClient();
    const activeState = is_active !== false;

    // 1. Try primary notification_bar table
    try {
      // Deactivate all existing notifications first
      await supabase
        .from('notification_bar')
        .update({ is_active: false })
        .eq('is_active', true);

      const { data, error } = await supabase
        .from('notification_bar')
        .insert({
          text,
          link,
          is_active: activeState,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (!error && data) {
        // Also update fallback mirror
        try {
          await saveFallbackNotification(supabase, { text, link, is_active: activeState });
        } catch {}
        return NextResponse.json({ notification: data });
      }
    } catch {
      // Primary table error, fallback will handle below
    }

    // 2. Fallback to contact_submissions
    const fallbackResult = await saveFallbackNotification(supabase, {
      text,
      link,
      is_active: activeState,
    });

    return NextResponse.json({ notification: fallbackResult });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to save notification' },
      { status: 500 }
    );
  }
}

// PUT — admin: update existing notification (toggle status, edit text/link)
export async function PUT(req: NextRequest) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, text, link, is_active } = body;

    const supabase = getServiceClient();
    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    if (text !== undefined) updateData.text = text;
    if (link !== undefined) updateData.link = link;
    if (is_active !== undefined) updateData.is_active = is_active;

    // 1. Try primary table
    if (id && id !== 'system_notification_bar') {
      try {
        const { data, error } = await supabase
          .from('notification_bar')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          // Mirror to fallback
          try {
            await saveFallbackNotification(supabase, {
              text: data.text,
              link: data.link,
              is_active: data.is_active,
            });
          } catch {}
          return NextResponse.json({ notification: data });
        }
      } catch {}
    }

    // 2. Fallback update
    const current = await getFallbackNotification(supabase, false);
    const updated = await saveFallbackNotification(supabase, {
      id,
      text: text !== undefined ? text : (current?.text || ''),
      link: link !== undefined ? link : (current?.link || ''),
      is_active: is_active !== undefined ? is_active : (current?.is_active ?? true),
    });

    return NextResponse.json({ notification: updated });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to update notification' },
      { status: 500 }
    );
  }
}

// DELETE — admin: delete notification
export async function DELETE(req: NextRequest) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const supabase = getServiceClient();

    // Delete from primary table
    if (id && id !== 'system_notification_bar') {
      try {
        await supabase.from('notification_bar').delete().eq('id', id);
      } catch {}
    }

    // Delete from fallback
    try {
      await supabase
        .from('contact_submissions')
        .delete()
        .eq('subject', 'system_notification_bar');
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to delete notification' },
      { status: 500 }
    );
  }
}
