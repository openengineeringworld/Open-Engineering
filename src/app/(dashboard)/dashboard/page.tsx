import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Get user's community membership
  const { data: membership } = await supabase
    .from('community_members')
    .select('*, community:communities(*, college:colleges(*))')
    .eq('user_id', user.id)
    .maybeSingle();

  // Get recent posts from community
  let recentPosts: any[] | null = null;
  if (membership?.community_id) {
    const { data } = await supabase
      .from('posts')
      .select('*, author:profiles(full_name, profile_image)')
      .eq('community_id', membership.community_id)
      .order('created_at', { ascending: false })
      .limit(3);
    recentPosts = data;
  }

  // Get upcoming events
  let upcomingEvents: any[] | null = null;
  if (membership?.community_id) {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('community_id', membership.community_id)
      .gte('event_date', new Date().toISOString())
      .order('event_date')
      .limit(3);
    upcomingEvents = data;
  }

  const community = membership?.community as any;

  if (community?.status === 'pending') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12">
        <div className="neu-card p-8 sm:p-10 max-w-xl text-center border border-purple-300/60 shadow-[12px_12px_28px_rgba(147,51,234,0.16),-12px_-12px_28px_#ffffff] space-y-6">
          <div className="w-16 h-16 neu-convex rounded-2xl flex items-center justify-center text-amber-600 font-black text-3xl mx-auto border border-white/80 shadow-sm animate-pulse">
            ⚡
          </div>
          <span className="badge badge-warning">● Pending Admin Verification</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
            Awaiting Admin Approval
          </h2>
          <p className="text-slate-700 text-sm font-medium leading-relaxed">
            Your registration for the college chapter <span className="font-extrabold text-purple-700">&ldquo;{community.college?.name}&rdquo;</span> is currently being reviewed by Open Engineering Admins.
          </p>
          <p className="text-text-muted text-xs font-normal">
            Once approved, your college chapter will go live and you will have full access to discussions, shared resources, events, and member channels.
          </p>
        </div>
      </div>
    );
  }

  if (membership?.status === 'pending') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12">
        <div className="neu-card p-8 sm:p-10 max-w-xl text-center border border-purple-300/60 shadow-[12px_12px_28px_rgba(147,51,234,0.16),-12px_-12px_28px_#ffffff] space-y-6">
          <div className="w-16 h-16 neu-convex rounded-2xl flex items-center justify-center text-purple-700 font-black text-3xl mx-auto border border-white/80 shadow-sm animate-pulse">
            ⏳
          </div>
          <span className="badge badge-warning">● Pending Campus Approval</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
            Awaiting Approval
          </h2>
          <p className="text-slate-700 text-sm font-medium leading-relaxed">
            Your request to join the college chapter <span className="font-extrabold text-purple-700">&ldquo;{community?.name}&rdquo;</span> is pending approval from the Campus Admin.
          </p>
          <p className="text-text-muted text-xs font-normal">
            Once approved, you will have full access to discussions, shared resources, events, and member channels.
          </p>
        </div>
      </div>
    );
  }

  if (profile?.status === 'pending') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12">
        <div className="neu-card p-8 sm:p-10 max-w-xl text-center border border-purple-300/60 shadow-[12px_12px_28px_rgba(147,51,234,0.16),-12px_-12px_28px_#ffffff] space-y-6">
          <div className="w-16 h-16 neu-convex rounded-2xl flex items-center justify-center text-amber-600 font-black text-3xl mx-auto border border-white/80 shadow-sm animate-pulse">
            ⏳
          </div>
          <span className="badge badge-warning">● Pending Verification</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
            Awaiting Verification
          </h2>
          <p className="text-slate-700 text-sm font-medium leading-relaxed">
            Your account is currently pending verification by Open Engineering Admins.
          </p>
          <p className="text-text-muted text-xs font-normal">
            Once verified, your profile status will be activated and you will gain full access to the platform.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="neu-card p-8 border border-purple-300/40 shadow-[8px_8px_20px_rgba(147,51,234,0.12),-8px_-8px_20px_#ffffff]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-16 h-16 neu-convex rounded-2xl flex items-center justify-center text-purple-700 font-black text-2xl border border-white/80 shadow-sm shrink-0">
            {profile?.full_name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black mb-1">
              Welcome back, <span className="gradient-text">{profile?.full_name || 'Student'}</span>
            </h1>
            <p className="text-text-muted text-sm font-normal">Here&apos;s what&apos;s happening in your engineering community.</p>
          </div>
        </div>
      </div>

      {/* Profile completion prompt */}
      {!profile?.is_profile_complete && (
        <div className="neu-card p-6 border border-amber-300/50 shadow-[6px_6px_16px_rgba(245,158,11,0.1),-6px_-6px_16px_#ffffff]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 neu-convex rounded-2xl flex items-center justify-center text-amber-600 border border-white/80 shadow-sm shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-sm text-slate-900 mb-0.5">Complete your profile</h3>
              <p className="text-text-muted text-xs font-normal">Add your college, branch, and other details to unlock full community features.</p>
            </div>
            <Link href="/onboarding" className="py-2.5 px-5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0">
              Complete Profile
            </Link>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="neu-card p-6 border border-purple-300/40 shadow-[6px_6px_16px_rgba(147,51,234,0.1),-6px_-6px_16px_#ffffff]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 neu-convex rounded-xl flex items-center justify-center text-purple-600 border border-white/80">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-text-muted text-xs font-bold uppercase tracking-wider">Community</p>
          </div>
          <p className="text-lg font-black text-slate-900">
            {community ? community.name : 'Not Joined'}
          </p>
          {community?.college && (
            <p className="text-text-muted text-xs mt-1 font-normal">
              {community.college.city}, {community.college.state}
            </p>
          )}
        </div>

        <div className="neu-card p-6 border border-purple-300/40 shadow-[6px_6px_16px_rgba(147,51,234,0.1),-6px_-6px_16px_#ffffff]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 neu-convex rounded-xl flex items-center justify-center text-indigo-600 border border-white/80">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <p className="text-text-muted text-xs font-bold uppercase tracking-wider">Members</p>
          </div>
          <p className="text-lg font-black gradient-text">
            {community?.member_count || 0}
          </p>
        </div>

        <div className="neu-card p-6 border border-purple-300/40 shadow-[6px_6px_16px_rgba(147,51,234,0.1),-6px_-6px_16px_#ffffff]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 neu-convex rounded-xl flex items-center justify-center text-emerald-600 border border-white/80">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <p className="text-text-muted text-xs font-bold uppercase tracking-wider">Your Role</p>
          </div>
          <p className="text-lg font-black capitalize text-slate-900">
            {membership?.role || '—'}
          </p>
        </div>
      </div>

      {/* No community - Join CTA */}
      {!membership && (
        <div className="neu-card p-10 text-center border border-purple-300/40 shadow-[8px_8px_20px_rgba(147,51,234,0.12),-8px_-8px_20px_#ffffff]">
          <div className="w-16 h-16 neu-convex rounded-2xl flex items-center justify-center text-purple-700 mx-auto mb-4 border border-white/80 shadow-sm">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-2">Join a Community</h3>
          <p className="text-text-muted text-sm mb-6 font-normal max-w-md mx-auto">
            Connect with your college peers by joining or creating a campus chapter.
          </p>
          <Link href="/onboarding" className="py-3.5 px-8 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm shadow-[4px_4px_14px_rgba(0,0,0,0.35),-4px_-4px_14px_#ffffff] hover:scale-[1.02] active:scale-[0.98] transition-all inline-block">
            Join Community
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      {membership && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/dashboard/my-community" className="neu-card p-5 border border-purple-300/30 hover:border-purple-400/50 hover:scale-[1.01] transition-all group">
            <div className="w-10 h-10 neu-convex rounded-xl flex items-center justify-center text-purple-600 border border-white/80 mb-3 group-hover:shadow-md transition-shadow">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-0.5">Community Feed</h4>
            <p className="text-text-muted text-xs font-normal">View posts & discussions</p>
          </Link>

          <Link href="/dashboard/profile" className="neu-card p-5 border border-purple-300/30 hover:border-purple-400/50 hover:scale-[1.01] transition-all group">
            <div className="w-10 h-10 neu-convex rounded-xl flex items-center justify-center text-indigo-600 border border-white/80 mb-3 group-hover:shadow-md transition-shadow">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-0.5">Edit Profile</h4>
            <p className="text-text-muted text-xs font-normal">Update your details</p>
          </Link>

          <Link href="/dashboard/my-community" className="neu-card p-5 border border-purple-300/30 hover:border-purple-400/50 hover:scale-[1.01] transition-all group">
            <div className="w-10 h-10 neu-convex rounded-xl flex items-center justify-center text-emerald-600 border border-white/80 mb-3 group-hover:shadow-md transition-shadow">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-0.5">Browse Resources</h4>
            <p className="text-text-muted text-xs font-normal">Shared PDFs, links & files</p>
          </Link>
        </div>
      )}

      {/* Recent Posts */}
      {recentPosts && recentPosts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-slate-900">Recent Posts</h2>
            <Link href="/dashboard/my-community" className="text-purple-700 text-xs font-bold hover:underline">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div key={post.id} className="neu-card p-5 border border-purple-300/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 neu-convex rounded-xl flex items-center justify-center text-purple-700 text-xs font-black border border-white/80">
                    {(post.author as { full_name?: string })?.full_name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">{(post.author as { full_name?: string })?.full_name}</p>
                    <p className="text-text-muted text-[10px] font-normal">{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-text-muted text-sm line-clamp-2 font-normal">{post.content}</p>
                <div className="flex items-center gap-4 mt-3 text-text-muted text-xs font-bold">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-rose-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    {post.like_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    {post.comment_count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      {upcomingEvents && upcomingEvents.length > 0 && (
        <div>
          <h2 className="text-base font-black text-slate-900 mb-4">Upcoming Events</h2>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="neu-card p-5 flex items-center gap-4 border border-purple-300/30">
                <div className="w-14 h-14 neu-convex rounded-xl flex flex-col items-center justify-center text-purple-700 border border-white/80 shrink-0">
                  <span className="text-base font-black">{new Date(event.event_date).toLocaleDateString('en', { day: 'numeric' })}</span>
                  <span className="text-[10px] uppercase font-bold">{new Date(event.event_date).toLocaleDateString('en', { month: 'short' })}</span>
                </div>
                <div>
                  <p className="font-extrabold text-sm text-slate-900">{event.title}</p>
                  <p className="text-text-muted text-xs font-normal flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {event.location || 'Online'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
