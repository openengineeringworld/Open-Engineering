import Link from 'next/link';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren, { StaggerItem } from '@/components/animations/StaggerChildren';
import type { Metadata } from 'next';
import FeaturedCommunitiesSection from '@/components/community/FeaturedCommunitiesSection';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Open Engineering Community | Connect, Build & Collaborate',
  description: 'Join the official Open Engineering Community and college campus chapters. Connect with fellow engineers, work on projects, and access study vaults.',
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
  let initialCommunities: any[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('communities')
      .select('*, college:colleges(*)')
      .eq('status', 'approved');
    if (data) {
      initialCommunities = data;
    }
  } catch (error) {
    console.error('Failed to load communities:', error);
  }

  return (
    <>
      {/* Hero Section */}
      <section className="section pt-36 pb-12 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <span className="badge badge-primary mb-4 px-4 py-1.5 text-xs font-bold shadow-sm inline-flex items-center gap-1.5">
              <span>⚡</span> Pan-India Ecosystem
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-slate-950">
              Welcome to <span className="gradient-text">Open Engineering Community</span>
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* Featured Available Communities Section (Displays 3 featured communities by default, live search filters, link to /community/search) */}
      <FeaturedCommunitiesSection initialCommunities={initialCommunities} limit={3} />

      {/* Community Features */}
      <section className="section-sm pb-20">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-extrabold">
              What You Get in <span className="gradient-text">Open Engineering Community</span>
            </h2>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {communityFeatures.map((f) => (
              <StaggerItem key={f.title}>
                <div className="neu-card p-6 text-center h-full border border-purple-300/40 shadow-[6px_6px_16px_rgba(147,51,234,0.12),-6px_-6px_16px_#ffffff] flex flex-col items-center justify-between group hover:scale-[1.02] transition-all">
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

      {/* Choose Your Path */}
      <section className="section-sm pb-24">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-extrabold mb-3">
              Choose Your <span className="gradient-text">Path</span>
            </h2>
            <p className="text-text-muted text-sm font-normal max-w-xl mx-auto">
              Whether you want to join an existing chapter or launch a brand new community for your college — we have you covered.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Join Community Path */}
            <FadeIn>
              <div className="neu-card p-8 h-full flex flex-col justify-between border border-purple-300/40 shadow-[8px_8px_20px_rgba(147,51,234,0.12),-8px_-8px_20px_#ffffff] hover:shadow-[12px_12px_24px_rgba(147,51,234,0.22),-12px_-12px_24px_#ffffff] transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-16 h-16 neu-convex rounded-2xl p-4 flex items-center justify-center border border-purple-300/40 shadow-sm text-purple-600">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-950">Join Campus Chapter</h3>
                  <p className="text-text-muted text-sm leading-relaxed font-normal">
                    Search and select your college community to request instant membership and unlock college feeds and vaults.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-purple-200/40">
                  <Link
                    href="/community/search"
                    className="w-full py-3.5 px-5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Search & Join Community →
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* Create Community Path */}
            <FadeIn>
              <div className="neu-card p-8 h-full flex flex-col justify-between border border-purple-300/40 shadow-[8px_8px_20px_rgba(147,51,234,0.12),-8px_-8px_20px_#ffffff] hover:shadow-[12px_12px_24px_rgba(147,51,234,0.22),-12px_-12px_24px_#ffffff] transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-16 h-16 neu-convex rounded-2xl p-4 flex items-center justify-center border border-purple-300/40 shadow-sm text-indigo-600">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-950">Launch Campus Chapter</h3>
                  <p className="text-text-muted text-sm leading-relaxed font-normal">
                    Cannot find your college community? Register your college, launch a new chapter, and become the campus admin to lead engineering projects in your college.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-purple-200/40">
                  <Link
                    href="/community/create"
                    className="w-full py-3.5 px-5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Launch Campus Chapter ⚡
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
