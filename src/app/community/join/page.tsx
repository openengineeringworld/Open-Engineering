'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { College, Community } from '@/types/database';

export default function JoinCommunityPage() {
  const [colleges, setColleges] = useState<(College & { community?: Community })[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  
  // Form states
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCollegeId, setSelectedCollegeId] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      // Check auth status
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        // If logged in, check if already in a community
        const { data: membership } = await supabase
          .from('community_members')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (membership) {
          router.push('/dashboard/my-community');
          return;
        }
      }

      await loadColleges();
    }
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadColleges() {
    setLoading(true);
    // Fetch all colleges and their communities
    const { data } = await supabase
      .from('colleges')
      .select('*, community:communities(*)')
      .order('name');

    if (data) {
      // Map and filter so we only store colleges that have APPROVED communities
      const mapped = data
        .map((c) => {
          const comms = Array.isArray(c.community) ? c.community : (c.community ? [c.community] : []);
          const approvedComm = comms.find((comm: any) => comm.status === 'approved');
          return {
            ...c,
            community: approvedComm || null,
          };
        })
        // Only keep colleges with approved communities
        .filter((c) => c.community !== null);
      
      setColleges(mapped as any);
    }
    setLoading(false);
  }

  // Extract unique districts from approved colleges
  const districts = useMemo(() => {
    const distSet = new Set<string>();
    colleges.forEach((c) => {
      const d = c.district;
      if (d) distSet.add(d);
    });
    return Array.from(distSet).sort();
  }, [colleges]);

  // Filter colleges based on district
  const filteredColleges = useMemo(() => {
    if (!selectedDistrict) return [];
    return colleges.filter((c) => c.district === selectedDistrict);
  }, [colleges, selectedDistrict]);

  // Find the selected college community details
  const selectedCollege = useMemo(() => {
    return colleges.find((c) => c.id === selectedCollegeId);
  }, [colleges, selectedCollegeId]);

  // Handle logged-in join request
  async function handleLoggedInJoin() {
    if (!userId || !selectedCollege?.community) return;
    setSubmitting(true);
    setError('');

    const { error: joinError } = await supabase
      .from('community_members')
      .insert({
        user_id: userId,
        community_id: selectedCollege.community.id,
        role: 'member',
        status: 'pending'
      });

    if (joinError) {
      setError(joinError.message);
      setSubmitting(false);
      return;
    }

    // Update user profile college_id
    await supabase
      .from('profiles')
      .update({ college_id: selectedCollege.id, is_profile_complete: true })
      .eq('id', userId);

    setSuccess('Join request submitted! Awaiting approval from the Campus Admin.');
    setTimeout(() => {
      router.push('/dashboard');
      router.refresh();
    }, 2500);
  }

  // Handle signup & join request for non-logged in users
  async function handleSignUpAndJoin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedCollege?.community) return;
    setSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const fullName = (formData.get('full_name') as string).trim();
    const email = (formData.get('email') as string).trim();
    const password = formData.get('password') as string;
    const branch = (formData.get('branch') as string).trim();
    const year = (formData.get('year') as string).trim();

    // 1. Sign up user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
      setSubmitting(false);
      return;
    }

    const newUserId = signUpData.user?.id;
    if (!newUserId) {
      setError('Registration succeeded but user profile could not be initialized.');
      setSubmitting(false);
      return;
    }

    try {
      // 2. Insert community membership (pending approval)
      const { error: joinError } = await supabase
        .from('community_members')
        .insert({
          user_id: newUserId,
          community_id: selectedCollege.community.id,
          role: 'member',
          status: 'pending'
        });

      if (joinError) {
        throw new Error(joinError.message);
      }

      // 3. Update profiles table with academic info & mark complete
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          college_id: selectedCollege.id,
          branch,
          year,
          city: selectedCollege.city,
          state: selectedCollege.state || 'Assam',
          is_profile_complete: true
        })
        .eq('id', newUserId);

      if (profileError) {
        throw new Error(profileError.message);
      }

      setSuccess('Account created and join request submitted! Awaiting approval from the Campus Admin.');
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during setup.');
      setSubmitting(false);
    }
  }

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
          <span className="badge badge-primary mb-3">Campus Chapter</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
            Join College <span className="gradient-text">Community</span>
          </h1>
          <p className="text-text-muted text-sm font-normal">
            Select your college and request access to join the student engineering chapter.
          </p>
        </div>

        {success && (
          <div className="neu-card p-6 text-center mb-8 border border-purple-300/60 shadow-[8px_8px_20px_rgba(147,51,234,0.14),-8px_-8px_20px_#ffffff]">
            <div className="w-14 h-14 neu-convex rounded-2xl flex items-center justify-center text-purple-700 mx-auto mb-3 border border-white/80 shadow-sm animate-bounce">
              ⏳
            </div>
            <h3 className="text-xl font-extrabold text-slate-950 mb-2">Request Submitted!</h3>
            <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed max-w-md mx-auto">
              {success}
            </p>
          </div>
        )}

        {error && (
          <div className="neu-card p-4 text-center mb-6 border border-rose-300 bg-rose-50/50">
            <p className="text-rose-900 text-xs font-bold">{error}</p>
          </div>
        )}

        {!success && (
          <div className="space-y-6 neu-card p-6 sm:p-8 border border-purple-300/40 shadow-[8px_8px_20px_rgba(147,51,234,0.12),-8px_-8px_20px_#ffffff]">
            <span className="text-[10px] font-black text-purple-700 uppercase tracking-widest block border-b border-purple-200/40 pb-1 mb-4">
              1. Choose Campus
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  College District (Assam)
                </label>
                {loading ? (
                  <div className="skeleton h-11 rounded-xl" />
                ) : (
                  <select
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      setSelectedCollegeId('');
                    }}
                    required
                    className="neu-input py-3.5 px-4 text-xs sm:text-sm border border-purple-200/60 text-slate-900 bg-[#eef0f8] w-full font-medium"
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Select College / University
                </label>
                <select
                  value={selectedCollegeId}
                  onChange={(e) => setSelectedCollegeId(e.target.value)}
                  disabled={!selectedDistrict || loading}
                  required
                  className="neu-input py-3.5 px-4 text-xs sm:text-sm border border-purple-200/60 text-slate-900 bg-[#eef0f8] w-full disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <option value="">
                    {!selectedDistrict ? 'Select district first' : 'Select College'}
                  </option>
                  {filteredColleges.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedCollege && (
              <div className="mt-2 text-xs font-semibold text-purple-700 bg-purple-50 p-3.5 rounded-xl border border-purple-200/50">
                🚀 Selected chapter has <strong>{selectedCollege.community?.member_count || 0}</strong> active member(s).
              </div>
            )}

            {/* Form for logged in users */}
            {userId && selectedCollegeId && (
              <div className="pt-6 border-t border-purple-200/30">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleLoggedInJoin}
                  className="w-full btn btn-primary py-4 shadow-[4px_4px_14px_rgba(147,51,234,0.2),-4px_-4px_14px_#ffffff] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <span>{submitting ? 'Submitting Request...' : 'Submit Join Request'}</span>
                </button>
              </div>
            )}

            {/* Form for non-logged in users (Signup & Join) */}
            {!userId && selectedCollegeId && (
              <form onSubmit={handleSignUpAndJoin} className="space-y-6 pt-4 border-t border-purple-200/30 animate-fade-in">
                <span className="text-[10px] font-black text-purple-700 uppercase tracking-widest block border-b border-purple-200/40 pb-1">
                  2. Personal & Academic Details
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="full_name" className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input 
                      id="full_name" 
                      name="full_name" 
                      required 
                      className="neu-input py-3.5 px-4 text-xs sm:text-sm text-slate-900 border border-purple-200/60" 
                      placeholder="e.g. Rahul Sharma" 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input 
                      id="email" 
                      name="email" 
                      type="email" 
                      required 
                      className="neu-input py-3.5 px-4 text-xs sm:text-sm text-slate-900 border border-purple-200/60" 
                      placeholder="rahul@example.com" 
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      className="neu-input py-3.5 px-4 !pr-12 text-xs sm:text-sm text-slate-900 border border-purple-200/60"
                      placeholder="Min 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-purple-700 font-bold text-xs"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                      Branch / Dept
                    </label>
                    <input
                      name="branch"
                      required
                      placeholder="e.g. CSE, Mechanical..."
                      className="neu-input py-3.5 px-4 text-xs sm:text-sm border border-purple-200/60 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                      Year of Study
                    </label>
                    <select
                      name="year"
                      required
                      className="neu-input py-3.5 px-4 text-xs sm:text-sm border border-purple-200/60 text-slate-900 bg-[#eef0f8] font-medium"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="btn btn-primary w-full py-4 shadow-[4px_4px_14px_rgba(147,51,234,0.2),-4px_-4px_14px_#ffffff] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <span>{submitting ? 'Registering & Submitting Request...' : 'Sign Up & Request to Join'}</span>
                </button>
              </form>
            )}

            {!selectedCollegeId && (
              <div className="text-center py-6 text-slate-500 text-xs font-semibold bg-slate-50 border border-slate-200/40 rounded-2xl">
                District selection will filter available college chapters.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
