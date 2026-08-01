'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function OnboardingPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<{ collegeName: string } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Redirect unauthenticated user to signup/login first
        router.push('/signup?redirect=/onboarding');
        return;
      }
      setUserId(user.id);
      setLoading(false);
    }
    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userId) return;
    setSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const collegeName = (formData.get('college_name') as string).trim();
    const city = (formData.get('city') as string).trim();
    const state = (formData.get('state') as string).trim();
    const branch = (formData.get('branch') as string).trim();
    const year = (formData.get('year') as string).trim();

    // 1. Update user profile with branch and year
    await supabase
      .from('profiles')
      .update({
        branch,
        year,
        city,
        state,
        is_profile_complete: true,
      })
      .eq('id', userId);

    // 2. Check if college exists
    const { data: existingCollege } = await supabase
      .from('colleges')
      .select('*, community:communities(*)')
      .ilike('name', collegeName)
      .maybeSingle();

    if (existingCollege) {
      const comm = Array.isArray(existingCollege.community) ? existingCollege.community[0] : existingCollege.community;
      if (comm) {
        // Join existing community
        await supabase
          .from('community_members')
          .insert({ user_id: userId, community_id: comm.id, role: 'member' });
      }
      setSuccessData({ collegeName: existingCollege.name });
    } else {
      // Insert new college (trigger auto-creates community)
      const { data: newCollege, error: collegeError } = await supabase
        .from('colleges')
        .insert({ name: collegeName, city, state, added_by: userId })
        .select()
        .single();

      if (collegeError) {
        setError(collegeError.message);
        setSubmitting(false);
        return;
      }

      // Fetch auto-created community and update status = 'pending'
      const { data: newCommunity } = await supabase
        .from('communities')
        .select('*')
        .eq('college_id', newCollege.id)
        .single();

      if (newCommunity) {
        await supabase
          .from('communities')
          .update({ status: 'pending' })
          .eq('id', newCommunity.id);

        await supabase
          .from('community_members')
          .insert({ user_id: userId, community_id: newCommunity.id, role: 'creator' });
      }

      setSuccessData({ collegeName: newCollege.name });
    }

    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <section className="section pt-36 pb-24 min-h-screen">
      <div className="container mx-auto px-6 max-w-xl">
        {successData ? (
          /* 3D Neumorphic Approval Confirmation Card */
          <div className="neu-card p-8 sm:p-10 text-center border border-purple-300/60 shadow-[12px_12px_28px_rgba(147,51,234,0.16),-12px_-12px_28px_#ffffff] space-y-6">
            <div className="w-16 h-16 neu-convex rounded-2xl flex items-center justify-center text-purple-700 font-black text-3xl mx-auto border border-white/80 shadow-sm">
              ⚡
            </div>
            <span className="badge badge-warning">● Pending Admin Verification</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              Onboarding Details Submitted!
            </h2>
            <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
              Your college community request for <span className="font-extrabold text-purple-700">&ldquo;{successData.collegeName}&rdquo;</span> has been sent to Open Engineering Admins for approval.
            </p>
            <p className="text-text-muted text-xs font-normal">
              Once approved by our admin team, your college hub will go live on the platform for all engineering students on campus.
            </p>
            <div className="pt-4 border-t border-purple-200/40">
              <Link
                href="/dashboard"
                className="w-full py-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm block shadow-md transition-all"
              >
                Go to Student Dashboard →
              </Link>
            </div>
          </div>
        ) : (
          /* Onboarding Form */
          <div className="neu-card p-8 sm:p-10 border border-purple-300/40 shadow-[10px_10px_24px_rgba(147,51,234,0.14),-10px_-10px_24px_#ffffff]">
            <div className="text-center mb-8">
              <span className="badge badge-primary mb-3">Student Onboarding</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mb-2">
                College & <span className="gradient-text">Community Setup</span>
              </h1>
              <p className="text-text-muted text-xs sm:text-sm font-normal leading-relaxed">
                Enter your college address and academic details to register your campus engineering hub.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl neu-flat border border-rose-300 text-rose-800 text-xs font-bold shadow-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                  College Full Name
                </label>
                <input
                  name="college_name"
                  required
                  placeholder="e.g. Indian Institute of Technology Guwahati"
                  className="neu-input py-3.5 px-4 text-xs sm:text-sm border border-purple-200/60 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                    City
                  </label>
                  <input
                    name="city"
                    required
                    placeholder="e.g. Guwahati"
                    className="neu-input py-3.5 px-4 text-xs sm:text-sm border border-purple-200/60 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                    State
                  </label>
                  <input
                    name="state"
                    required
                    placeholder="e.g. Assam"
                    className="neu-input py-3.5 px-4 text-xs sm:text-sm border border-purple-200/60 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                    Branch / Dept
                  </label>
                  <input
                    name="branch"
                    required
                    placeholder="e.g. Computer Science"
                    className="neu-input py-3.5 px-4 text-xs sm:text-sm border border-purple-200/60 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                    Year of Study
                  </label>
                  <select
                    name="year"
                    required
                    className="neu-input py-3.5 px-4 text-xs sm:text-sm border border-purple-200/60 text-slate-900 bg-[#e5e7f2]"
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
                className="w-full py-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-[4px_4px_14px_rgba(0,0,0,0.35),-4px_-4px_14px_#ffffff] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
              >
                {submitting ? 'Submitting Registration...' : 'Submit For Admin Approval ⚡'}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
