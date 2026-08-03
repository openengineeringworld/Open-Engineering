'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { College, Community } from '@/types/database';

export default function JoinCommunityPage() {
  const [colleges, setColleges] = useState<(College & { community?: Community })[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/signup?redirect=/onboarding');
        return;
      }
      setUserId(user.id);

      // Check if already in a community
      const { data: membership } = await supabase
        .from('community_members')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (membership) {
        router.push('/dashboard/my-community');
        return;
      }

      await loadColleges();
    }
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadColleges() {
    setLoading(true);
    const { data } = await supabase
      .from('colleges')
      .select('*, community:communities(*)')
      .order('name');

    if (data) {
      const mapped = data.map((c) => {
        const comms = Array.isArray(c.community) ? c.community : (c.community ? [c.community] : []);
        const approvedComm = comms.find((comm: any) => comm.status === 'approved');
        return {
          ...c,
          community: approvedComm || null,
        };
      });
      setColleges(mapped as any);
    }
    setLoading(false);
  }

  async function handleJoin(communityId: string) {
    if (!userId) return;
    setJoining(true);
    setError('');

    // Insert with status: 'pending' and role: 'member'
    const { error: joinError } = await supabase
      .from('community_members')
      .insert({ 
        user_id: userId, 
        community_id: communityId,
        role: 'member',
        status: 'pending'
      });

    if (joinError) {
      setError(joinError.message);
      setJoining(false);
      return;
    }

    setSuccess('Join request submitted! Awaiting approval from the Campus Admin.');
    setTimeout(() => {
      router.push('/dashboard/my-community');
      router.refresh();
    }, 2500);
  }

  const filtered = colleges.filter((c) => {
    const name = c.name || '';
    const city = c.city || '';
    const state = c.state || '';
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      city.toLowerCase().includes(search.toLowerCase()) ||
      state.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <section className="section pt-36 pb-24">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-10">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-purple-700 hover:underline mb-4"
          >
            ← Back to Communities
          </Link>
          <br />
          <span className="badge badge-primary mb-3">Community Chapters</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
            Join Your College <span className="gradient-text">Community</span>
          </h1>
          <p className="text-text-muted text-sm font-normal">
            Search for your college community below and request access.
          </p>
        </div>

        {success && (
          <div className="neu-card p-6 text-center mb-8 border border-purple-300/60 shadow-[8px_8px_20px_rgba(147,51,234,0.14),-8px_-8px_20px_#ffffff]">
            <div className="w-14 h-14 neu-convex rounded-2xl flex items-center justify-center text-purple-700 mx-auto mb-3 border border-white/80 shadow-sm">
              ⏳
            </div>
            <h3 className="text-xl font-extrabold text-slate-950 mb-2">Request Submitted!</h3>
            <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed max-w-md mx-auto">
              {success}
            </p>
            <div className="mt-4 pt-4 border-t border-purple-200/40">
              <span className="badge badge-warning text-xs">● Status: Pending Admin Approval</span>
            </div>
          </div>
        )}

        {error && (
          <div className="neu-card p-4 text-center mb-6 border border-rose-300 bg-rose-50/50">
            <p className="text-rose-900 text-xs font-bold">{error}</p>
          </div>
        )}

        {/* Search Input with Vector SVG */}
        <div className="relative mb-6">
          <svg className="w-5 h-5 text-purple-600 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="neu-input !pl-12 pr-5 py-4 rounded-xl text-sm w-full outline-none text-slate-800 border border-purple-200/60"
            placeholder="Search for your college name, city, or state..."
          />
        </div>

        {/* College list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-20 rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-8">
              {filtered.length > 0 ? (
                filtered.map((college) => (
                  <div key={college.id} className="neu-card p-5 flex items-center justify-between border border-purple-300/40 shadow-[4px_4px_12px_rgba(147,51,234,0.1),-4px_-4px_12px_#ffffff]">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{college.name}</h3>
                      <p className="text-text-muted text-xs font-normal mt-0.5">
                        📍 {college.city}, {college.state}
                        {college.community && (
                          <span className="text-purple-700 font-bold"> · {college.community.member_count} Members</span>
                        )}
                      </p>
                    </div>
                    {college.community ? (
                      <button
                        onClick={() => handleJoin(college.community!.id)}
                        disabled={joining}
                        className="py-2.5 px-5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-[3px_3px_10px_rgba(0,0,0,0.3),-3px_-3px_10px_#ffffff] hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
                      >
                        {joining ? '...' : 'Request to Join'}
                      </button>
                    ) : (
                      <Link
                        href={`/community/create?collegeId=${college.id}&district=${encodeURIComponent(college.district || '')}`}
                        className="py-2.5 px-4 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-700 font-extrabold text-[11px] hover:scale-[1.02] active:scale-[0.98] transition-all text-center shrink-0"
                      >
                        Launch Chapter ⚡
                      </Link>
                    )}
                  </div>
                ))
              ) : search ? (
                <div className="text-center py-8 text-text-muted">
                  <p className="mb-2 text-sm font-normal">No college found for &ldquo;{search}&rdquo;</p>
                  <Link
                    href="/community/create"
                    className="text-primary font-bold hover:underline text-xs"
                  >
                    Launch a new campus chapter here →
                  </Link>
                </div>
              ) : null}
            </div>

            {/* Link to Create Community */}
            <div className="text-center mb-4">
              <Link
                href="/community/create"
                className="text-xs font-bold text-purple-800 hover:text-purple-950 transition-colors underline"
              >
                Can't find your college? Click here to launch a new chapter →
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
