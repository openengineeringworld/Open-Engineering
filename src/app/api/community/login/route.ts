import { NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createAmbassadorToken } from '@/lib/ambassadorAuth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createAdminClient(supabaseUrl, serviceRoleKey);

    let applicationRecord: any = null;
    let matchedCommunityId: string | null = null;
    let leaderName: string = '';

    // 1. Check community_applications table
    try {
      const { data: apps } = await supabase
        .from('community_applications')
        .select('*')
        .ilike('leader_email', cleanEmail);

      if (apps && apps.length > 0) {
        // Find application matching password
        const appMatch = apps.find(
          (app: any) => app.password && app.password.trim() === cleanPassword
        );
        if (appMatch) {
          applicationRecord = appMatch;
          leaderName = appMatch.leader_name || '';
        }
      }
    } catch (e) {
      console.warn('Error querying community_applications table:', e);
    }

    // 2. Fallback check in contact_submissions table if not matched above
    if (!applicationRecord) {
      try {
        const { data: submissions } = await supabase
          .from('contact_submissions')
          .select('*')
          .ilike('email', cleanEmail)
          .ilike('subject', 'Community Application:%');

        if (submissions && submissions.length > 0) {
          for (const sub of submissions) {
            try {
              const parsed = JSON.parse(sub.message);
              if (parsed.password && parsed.password.trim() === cleanPassword) {
                applicationRecord = {
                  id: sub.id,
                  leader_name: parsed.leader_name || sub.name,
                  leader_email: cleanEmail,
                  college_full_name: parsed.college_full_name,
                  college_short_name: parsed.college_short_name,
                  community_name: parsed.community_name,
                  whatsapp_link: parsed.whatsapp_link,
                  leader_phone: parsed.leader_phone,
                  status: 'approved',
                  community_id: parsed.community_id
                };
                leaderName = applicationRecord.leader_name;
                if (parsed.community_id) {
                  matchedCommunityId = parsed.community_id;
                }
                break;
              }
            } catch (err) {
              // Not JSON
            }
          }
        }
      } catch (err) {
        console.warn('Error querying contact_submissions fallback:', err);
      }
    }

    if (!applicationRecord) {
      return NextResponse.json(
        { error: 'Invalid email or password. Please verify the details you entered during community registration.' },
        { status: 401 }
      );
    }

    // 3. Resolve associated community ID from communities table if not found yet
    if (!matchedCommunityId) {
      const commName = applicationRecord.community_name;
      const collegeShort = applicationRecord.college_short_name;
      const collegeFull = applicationRecord.college_full_name;

      const { data: comms } = await supabase
        .from('communities')
        .select('id, name, college:colleges(name)');

      if (comms && comms.length > 0) {
        const found = comms.find((c: any) => {
          if (commName && c.name?.toLowerCase() === commName.toLowerCase()) return true;
          if (collegeShort && c.name?.toLowerCase().includes(collegeShort.toLowerCase())) return true;
          if (collegeFull && c.college?.name?.toLowerCase() === collegeFull.toLowerCase()) return true;
          return false;
        });

        if (found) {
          matchedCommunityId = found.id;
        } else {
          matchedCommunityId = comms[0].id;
        }
      }
    }

    // 4. Create Ambassador Session Token and set cookie
    const token = createAmbassadorToken({
      email: cleanEmail,
      communityId: matchedCommunityId || undefined,
      applicationId: applicationRecord.id,
      leaderName: leaderName,
      createdAt: Date.now()
    });

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      redirect: '/community/dashboard',
      communityId: matchedCommunityId
    });

    response.cookies.set('ambassador_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });

    return response;
  } catch (error: any) {
    console.error('Error in ambassador login:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
