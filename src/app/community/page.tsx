import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren, { StaggerItem } from '@/components/animations/StaggerChildren';
import type { Metadata } from 'next';
import CommunitiesList from './CommunitiesList';

export const metadata: Metadata = {
  title: 'Community',
  description: 'Join college-wise engineering communities. Connect, share, and grow with fellow engineers.',
};

const communityFeatures = [
  {
    title: 'Discussion Feed',
    desc: 'Post ideas, comment, and engage with peers',
    icon: (
      <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: 'Announcements',
    desc: 'Stay informed on college & tech news',
    icon: (
      <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
  },
  {
    title: 'Peer Members',
    desc: 'Find and connect with fellow engineers',
    icon: (
      <svg className="w-8 h-8 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Resource Vault',
    desc: 'Share codebase links, PDFs & resources',
    icon: (
      <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Events & Hackathons',
    desc: 'Join college hackathons & tech events',
    icon: (
      <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default async function CommunityPage() {
  const supabase = await createClient();

  const { data: communities } = await supabase
    .from('communities')
    .select('*, college:colleges(*)')
    .or('status.eq.approved,status.is.null')
    .order('member_count', { ascending: false });

  return (
    <>
      {/* Hero */}
      <section className="section pt-36 pb-16 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <span className="badge badge-primary mb-4">Engineering Hubs</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
              Your College, Your <span className="gradient-text">Community</span>
            </h1>
            <p className="text-text-muted text-lg leading-relaxed mb-8 font-normal">
              Every engineering college has its dedicated hub. Join yours to connect with peers, 
              share resources, discuss ideas, and collaborate on real-world projects.
            </p>
            <Link
              href="/onboarding"
              className="py-4 px-8 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 shadow-[4px_4px_14px_rgba(0,0,0,0.35),-4px_-4px_14px_#ffffff] hover:shadow-[6px_6px_18px_rgba(0,0,0,0.5),-6px_-6px_18px_#ffffff] hover:scale-[1.02] active:scale-[0.98] transition-all group/btn"
            >
              <span>Join Your College Community</span>
              <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Community Features */}
      <section className="section-sm pb-20">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <span className="badge badge-primary mb-3">Hub Features</span>
            <h2 className="text-3xl font-extrabold">
              What You Get in <span className="gradient-text">Community</span>
            </h2>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {communityFeatures.map((f) => (
              <StaggerItem key={f.title}>
                <div className="neu-card p-6 text-center h-full border border-purple-300/40 shadow-[6px_6px_16px_rgba(147,51,234,0.12),-6px_-6px_16px_#ffffff] flex flex-col items-center justify-between group">
                  <div className="w-14 h-14 neu-convex rounded-2xl p-2.5 flex items-center justify-center border border-purple-300/40 shadow-[4px_4px_10px_rgba(147,51,234,0.15),-4px_-4px_10px_#ffffff] mb-4">
                    {f.icon}
                  </div>
                  <h3 className="font-extrabold text-sm mb-1 text-text group-hover:text-primary transition-colors">{f.title}</h3>
                  <p className="text-text-muted text-xs leading-relaxed font-normal">{f.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Active Communities List */}
      <section className="section-sm pb-24">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <span className="badge badge-primary mb-3">Live Hubs</span>
            <h2 className="text-3xl font-extrabold mb-3">
              Active <span className="gradient-text">College Hubs</span>
            </h2>
            <p className="text-text-muted text-sm font-normal">
              {communities && communities.length > 0
                ? `${communities.length} college communities actively building together`
                : 'Be the first to pioneer a community for your college!'}
            </p>
          </FadeIn>

          {communities && communities.length > 0 ? (
            <CommunitiesList initialCommunities={communities} />
          ) : (
            <FadeIn className="text-center py-12">
              <div className="neu-card p-10 max-w-md mx-auto border border-purple-300/40 shadow-[8px_8px_20px_rgba(147,51,234,0.12),-8px_-8px_20px_#ffffff]">
                <div className="w-16 h-16 neu-convex rounded-2xl p-3 flex items-center justify-center border border-purple-300/40 mx-auto mb-5 shadow-sm">
                  <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0v-4m0 4h4m-4-4l4 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-extrabold mb-2 text-text">No communities registered yet</h3>
                <p className="text-text-muted text-xs leading-relaxed mb-6 font-normal">
                  Be the campus pioneer! Add your engineering college and launch the first hub.
                </p>
                <Link
                  href="/community/join"
                  className="w-full py-3 px-5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center justify-center gap-2 shadow-[4px_4px_12px_rgba(0,0,0,0.35),-4px_-4px_12px_#ffffff] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Create First Community Hub →
                </Link>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </>
  );
}
