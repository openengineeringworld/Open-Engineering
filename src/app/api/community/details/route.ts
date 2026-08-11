import { NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Community ID is required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createAdminClient(supabaseUrl, serviceRoleKey);

    // 1. Fetch community record by ID or slug/name
    let commData: any = null;

    // Try exact ID match
    const { data: commById } = await supabase
      .from('communities')
      .select('*, college:colleges(*)')
      .eq('id', id)
      .maybeSingle();

    if (commById) {
      commData = commById;
    } else {
      // Try searching by name or slug match
      const nameFromSlug = id.replace(/[-_]/g, ' ');
      const { data: comms } = await supabase
        .from('communities')
        .select('*, college:colleges(*)');
      
      if (comms && comms.length > 0) {
        commData = comms.find((c: any) => 
          c.id === id ||
          c.name?.toLowerCase() === nameFromSlug.toLowerCase() ||
          c.name?.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase() ||
          c.college?.name?.toLowerCase() === nameFromSlug.toLowerCase()
        ) || null;
      }
    }

    let whatsappLink: string | null = (commData as any)?.whatsapp_link || null;
    let leaderName: string | null = null;

    // Try extracting from description if embedded
    if (commData?.description) {
      const leadMatch = commData.description.match(/Lead:\s*([^.(,@]+)/i);
      if (leadMatch && leadMatch[1]) {
        leaderName = leadMatch[1].trim();
      }
      const urlMatch = commData.description.match(/(https:\/\/(chat\.whatsapp\.com|wa\.me|whatsapp\.com)\/[^\s)]+)/i);
      if (urlMatch && urlMatch[1]) {
        whatsappLink = urlMatch[1];
      }
    }

    // 2. Fetch from community_applications table
    try {
      const { data: apps } = await supabase
        .from('community_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (apps && apps.length > 0) {
        let matchedApp = apps.find((app: any) =>
          (commData?.id && app.id === commData.id) ||
          (commData?.name && app.community_name?.toLowerCase() === commData.name.toLowerCase()) ||
          (commData?.college?.name && app.college_full_name?.toLowerCase() === commData.college.name.toLowerCase()) ||
          (id && app.community_name?.toLowerCase().includes(id.toLowerCase()))
        );

        if (matchedApp) {
          if (matchedApp.whatsapp_link) whatsappLink = matchedApp.whatsapp_link;
          if (matchedApp.leader_name) leaderName = matchedApp.leader_name;
        }
      }
    } catch (e) {
      console.warn('Error fetching community_applications in details route:', e);
    }

    // 3. Fallback check contact_submissions table
    if (!whatsappLink || !leaderName) {
      try {
        const { data: subs } = await supabase
          .from('contact_submissions')
          .select('message')
          .ilike('subject', 'Community Application:%')
          .order('created_at', { ascending: false });

        if (subs && subs.length > 0) {
          for (const sub of subs) {
            try {
              const parsed = JSON.parse(sub.message);
              const isMatch =
                (commData?.id && parsed.community_id === commData.id) ||
                (commData?.name && parsed.community_name?.toLowerCase() === commData.name.toLowerCase()) ||
                (commData?.college?.name && parsed.college_full_name?.toLowerCase() === commData.college.name.toLowerCase()) ||
                (id && parsed.community_name?.toLowerCase().includes(id.toLowerCase()));

              if (isMatch) {
                if (!whatsappLink && parsed.whatsapp_link) whatsappLink = parsed.whatsapp_link;
                if (!leaderName && parsed.leader_name) leaderName = parsed.leader_name;
                break;
              }
            } catch {
              // Not JSON
            }
          }
        }
      } catch (err) {
        console.warn('Error fetching contact_submissions fallback in details route:', err);
      }
    }

    return NextResponse.json({
      success: true,
      community: commData,
      whatsapp_link: whatsappLink,
      leader_name: leaderName
    });
  } catch (error: any) {
    console.error('Error fetching community details:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
