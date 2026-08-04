'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const isCreatingCommunity = searchParams.get('redirect')?.includes('/community/create');
  const supabase = createClient();

  // Onboarding & College Data States
  const [colleges, setColleges] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [showAddCollege, setShowAddCollege] = useState(false);

  const isAdminFlow = showAddCollege || !!isCreatingCommunity;

  // Load districts and colleges on mount
  useEffect(() => {
    async function loadColleges() {
      const { data: collegeData } = await supabase
        .from('colleges')
        .select('*, community:communities(*)')
        .order('name');

      if (collegeData) {
        setColleges(collegeData);
      }
    }
    loadColleges();
  }, []);

  // Compute available districts dynamically based on approval
  const districts = useMemo(() => {
    let list = colleges;
    if (!isAdminFlow) {
      list = colleges.filter((c) => {
        const comms = Array.isArray(c.community) ? c.community : (c.community ? [c.community] : []);
        return comms.some((comm: any) => comm.status === 'approved');
      });
    }
    const uniqueDists = Array.from(
      new Set(list.map((c: any) => c.district).filter(Boolean))
    ) as string[];
    return uniqueDists.sort();
  }, [colleges, isAdminFlow]);

  // Filter colleges based on district and approval status
  const filteredColleges = useMemo(() => {
    if (!selectedDistrict) return [];
    return colleges.filter((c) => {
      if (c.district !== selectedDistrict) return false;
      if (!isAdminFlow) {
        const comms = Array.isArray(c.community) ? c.community : (c.community ? [c.community] : []);
        const approvedComm = comms.find((comm: any) => comm.status === 'approved');
        return !!approvedComm;
      }
      return true;
    });
  }, [selectedDistrict, colleges, isAdminFlow]);

  // Reset selected college when district changes
  useEffect(() => {
    setSelectedCollege('');
  }, [selectedDistrict]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const fullName = (formData.get('full_name') as string).trim();
    const email = (formData.get('email') as string).trim();
    const password = formData.get('password') as string;
    const branch = (formData.get('branch') as string).trim();
    const year = (formData.get('year') as string).trim();

    let collegeName = '';
    let city = '';
    let state = 'Assam';
    let district = '';

    if (showAddCollege) {
      collegeName = (formData.get('college_name') as string).trim();
      city = (formData.get('city') as string).trim();
      state = (formData.get('state') as string).trim() || 'Assam';
      district = (formData.get('district') as string).trim();
    } else {
      if (!selectedCollege) {
        setError('Please select a college from the list.');
        setLoading(false);
        return;
      }
      const matched = colleges.find((c) => c.name === selectedCollege);
      if (!matched) {
        setError('Selected college is invalid.');
        setLoading(false);
        return;
      }
      collegeName = matched.name;
      city = matched.city;
      state = matched.state || 'Assam';
      district = matched.district || '';
    }

    // 1. Sign up the user in Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const userId = signUpData.user?.id;
    if (!userId) {
      setError('Registration succeeded but user profile could not be initialized.');
      setLoading(false);
      return;
    }

    try {
      // 2. Resolve College & Community
      let targetCollegeId = '';
      const { data: existingCollege } = await supabase
        .from('colleges')
        .select('*, community:communities(*)')
        .ilike('name', collegeName)
        .maybeSingle();

      if (isAdminFlow) {
        let community: any = null;

        if (existingCollege) {
          targetCollegeId = existingCollege.id;
          
          const { data: existingComm } = await supabase
            .from('communities')
            .select('*')
            .eq('college_id', existingCollege.id)
            .maybeSingle();

          if (existingComm) {
            setError('A community chapter has already been launched for this college. Please join it as a member instead.');
            setLoading(false);
            return;
          }

          const { data: newComm, error: commError } = await supabase
            .from('communities')
            .insert({
              college_id: existingCollege.id,
              name: `${existingCollege.name} Chapter`,
              description: 'Welcome to the campus chapter! Connect with fellow engineers.',
              status: 'pending'
            })
            .select()
            .single();

          if (commError || !newComm) {
            setError(commError?.message || 'Failed to create community chapter.');
            setLoading(false);
            return;
          }
          community = newComm;
        } else {
          // Create custom college (triggers trigger that inserts community)
          const { data: newCollege, error: collegeError } = await supabase
            .from('colleges')
            .insert({ name: collegeName, city, state, district, added_by: userId })
            .select()
            .single();

          if (collegeError) {
            setError(collegeError.message);
            setLoading(false);
            return;
          }

          targetCollegeId = newCollege.id;

          // Fetch auto-created community
          const { data: newCommunity } = await supabase
            .from('communities')
            .select('*')
            .eq('college_id', newCollege.id)
            .single();

          community = newCommunity;
        }

        if (community) {
          // Update community to pending approval
          await supabase
            .from('communities')
            .update({ status: 'pending' })
            .eq('id', community.id);

          // Join as creator (approved status)
          await supabase
            .from('community_members')
            .insert({
              user_id: userId,
              community_id: community.id,
              role: 'creator',
              status: 'approved',
            });
        }
      } else {
        // Normal student joining existing college
        if (!existingCollege) {
          setError('Selected college was not found.');
          setLoading(false);
          return;
        }

        targetCollegeId = existingCollege.id;
        
        // Fetch community to join (must be approved)
        const { data: existingComm } = await supabase
          .from('communities')
          .select('*')
          .eq('college_id', existingCollege.id)
          .eq('status', 'approved')
          .maybeSingle();
        
        if (!existingComm) {
          setError('There is no active community chapter for this college yet. A Campus Admin must launch it first.');
          setLoading(false);
          return;
        }

        await supabase
          .from('community_members')
          .insert({
            user_id: userId,
            community_id: existingComm.id,
            role: 'member',
            status: 'pending'
          });
      }

      // 3. Update profile with academic details, resolved college_id, and mark complete
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          college_id: targetCollegeId,
          branch,
          year,
          city,
          state,
          is_profile_complete: true,
        })
        .eq('id', userId);

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during profile setup.');
      setLoading(false);
    }
  }

  return (
    <div className="neu-card p-8 sm:p-10 border border-purple-300/40 shadow-[10px_10px_24px_rgba(147,51,234,0.14),-10px_-10px_24px_#ffffff]">
      <h1 className="text-2xl font-black mb-2 text-center text-slate-950">
        {isAdminFlow ? 'Launch Campus Chapter' : 'Create Account'}
      </h1>
      <p className="text-text-muted text-sm text-center mb-8 font-medium">
        {isAdminFlow ? 'Register as Campus Creator & Administrator' : 'Join the engineering community & campus chapter'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Account Information */}
        <div className="space-y-4">
          <span className="text-[10px] font-black text-purple-700 uppercase tracking-widest block border-b border-purple-200/40 pb-1">
            1. Account Details
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
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Campus Registration */}
        <div className="space-y-4 pt-2">
          <span className="text-[10px] font-black text-purple-700 uppercase tracking-widest block border-b border-purple-200/40 pb-1">
            2. Campus & Location
          </span>

          {!showAddCollege ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                    College District (Assam)
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
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
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                    Select College / University
                  </label>
                  <select
                    value={selectedCollege}
                    onChange={(e) => setSelectedCollege(e.target.value)}
                    disabled={!selectedDistrict}
                    required
                    className="neu-input py-3.5 px-4 text-xs sm:text-sm border border-purple-200/60 text-slate-900 bg-[#eef0f8] w-full disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <option value="">
                      {!selectedDistrict ? 'Select district first' : 'Select College'}
                    </option>
                    {filteredColleges.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddCollege(true)}
                className="text-purple-700 text-xs font-extrabold hover:underline"
              >
                Can&apos;t find your college? Register custom college →
              </button>
            </>
          ) : (
            <div className="space-y-4 p-4 rounded-2xl neu-pressed border border-purple-200/40">
              <span className="text-[10px] font-black text-purple-700 uppercase tracking-widest block mb-2">
                Custom College Details
              </span>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  College Full Name
                </label>
                <input
                  name="college_name"
                  required={showAddCollege}
                  placeholder="e.g. Assam Engineering College"
                  className="neu-input py-3 px-4 text-xs border border-purple-200/60 text-slate-900 bg-[#eef0f8] w-full font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    City
                  </label>
                  <input
                    name="city"
                    required={showAddCollege}
                    placeholder="e.g. Guwahati"
                    className="neu-input py-3 px-4 text-xs border border-purple-200/60 text-slate-900 bg-[#eef0f8] w-full font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    District
                  </label>
                  <input
                    name="district"
                    required={showAddCollege}
                    placeholder="e.g. Kamrup"
                    className="neu-input py-3 px-4 text-xs border border-purple-200/60 text-slate-900 bg-[#eef0f8] w-full font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  State
                </label>
                <input
                  name="state"
                  required={showAddCollege}
                  defaultValue="Assam"
                  placeholder="e.g. Assam"
                  className="neu-input py-3 px-4 text-xs border border-purple-200/60 text-slate-900 bg-[#eef0f8] w-full font-medium"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowAddCollege(false)}
                className="text-purple-700 text-xs font-extrabold hover:underline"
              >
                ← Search existing colleges
              </button>
            </div>
          )}
        </div>

        {/* Section 3: Academic Details */}
        <div className="space-y-4 pt-2">
          <span className="text-[10px] font-black text-purple-700 uppercase tracking-widest block border-b border-purple-200/40 pb-1">
            3. Academic Information {isAdminFlow && <span className="text-purple-700 font-extrabold text-[9px] lowercase tracking-normal bg-purple-100/80 px-2 py-0.5 rounded-md ml-1.5">(for Campus Admin)</span>}
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Branch / Dept
              </label>
              <input
                name="branch"
                required
                placeholder="e.g. CSE, Civil..."
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
        </div>

        {error && <p className="text-error text-xs text-center font-extrabold">{error}</p>}

        <button 
          type="submit" 
          disabled={loading} 
          className="btn btn-primary w-full py-4 shadow-[4px_4px_14px_rgba(147,51,234,0.2),-4px_-4px_14px_#ffffff] hover:scale-[1.01] flex items-center justify-center gap-2 group"
        >
          <span>{loading ? 'Registering Account...' : isAdminFlow ? 'Sign Up & Launch Chapter as Admin ⚡' : 'Sign Up & Join Community'}</span>
          {!loading && (
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          )}
        </button>
      </form>

      <p className="text-text-muted text-sm text-center mt-6 font-medium">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline font-bold">
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700" /></div>}>
      <SignUpForm />
    </Suspense>
  );
}
