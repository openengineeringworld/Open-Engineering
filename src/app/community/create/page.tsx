'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { College, Community } from '@/types/database';

function CreateCommunityForm() {
  const [colleges, setColleges] = useState<(College & { community?: Community })[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  // Form states
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCollegeId, setSelectedCollegeId] = useState('');
  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const [isCustomCollege, setIsCustomCollege] = useState(false);

  // Custom college inputs
  const [customCollegeName, setCustomCollegeName] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [customState, setCustomState] = useState('');
  const [customDistrict, setCustomDistrict] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Query parameters pre-selection
  useEffect(() => {
    const queryDistrict = searchParams.get('district');
    const queryCollegeId = searchParams.get('collegeId');
    if (queryDistrict) setSelectedDistrict(queryDistrict);
    if (queryCollegeId) setSelectedCollegeId(queryCollegeId);
  }, [searchParams]);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/signup?redirect=/community/create');
        return;
      }
      setUserId(user.id);

      // Check if already in a community
      const { data: membership } = await supabase
        .from('community_members')
        .select('*, community:communities(*)')
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
      const mapped = data.map((c) => ({
        ...c,
        community: Array.isArray(c.community) ? c.community[0] : c.community,
      }));
      setColleges(mapped);
    }
    setLoading(false);
  }

  // Extract unique districts
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      let collegeId = selectedCollegeId;
      let community: Community | null = null;

      if (isCustomCollege) {
        // 1. Validate custom college inputs
        if (!customCollegeName.trim() || !customCity.trim() || !customState.trim() || !customDistrict.trim()) {
          throw new Error('Please fill in all custom college fields.');
        }

        // 2. Insert new college (trigger automatically creates community)
        const { data: newCollege, error: collegeError } = await supabase
          .from('colleges')
          .insert({
            name: customCollegeName.trim(),
            city: customCity.trim(),
            state: customState.trim(),
            district: customDistrict.trim(),
            added_by: userId,
          })
          .select()
          .single();

        if (collegeError) {
          if (collegeError.code === '23505') {
            throw new Error('This college already exists in our database.');
          }
          throw new Error(collegeError.message);
        }

        collegeId = newCollege.id;

        // 3. Fetch the automatically created community
        const { data: autoComm, error: commFetchError } = await supabase
          .from('communities')
          .select('*')
          .eq('college_id', collegeId)
          .single();

        if (commFetchError || !autoComm) {
          throw new Error('Failed to retrieve the launched community chapter.');
        }

        community = autoComm;
      } else {
        // Validation for existing college selection
        if (!collegeId) {
          throw new Error('Please select a college.');
        }

        const { data: existingComm } = await supabase
          .from('communities')
          .select('*')
          .eq('college_id', collegeId)
          .maybeSingle();

        if (!existingComm) {
          const selectedCol = colleges.find((c) => c.id === collegeId);
          const colName = selectedCol ? selectedCol.name : 'College';
          const { data: newComm, error: commError } = await supabase
            .from('communities')
            .insert({
              college_id: collegeId,
              name: communityName.trim() || `${colName} Chapter`,
              description: description.trim() || 'Welcome to the campus chapter! Connect with fellow engineers.',
              status: 'pending'
            })
            .select()
            .single();

          if (commError || !newComm) {
            throw new Error(commError?.message || 'Failed to create community chapter.');
          }
          community = newComm;
        } else {
          community = existingComm;
        }
      }

      if (!community) {
        throw new Error('Community chapter could not be found.');
      }

      // 4. Verify if the community already has an active creator/admin
      const { data: existingCreator } = await supabase
        .from('community_members')
        .select('id')
        .eq('community_id', community.id)
        .eq('role', 'creator')
        .maybeSingle();

      if (existingCreator) {
        throw new Error('This college community already has an active Campus Admin. Please go to the Join Community page to request access instead.');
      }

      // 5. Update community status to pending (for global admin approval) and update description if provided
      const updateData: any = { status: 'pending' };
      if (communityName.trim()) updateData.name = communityName.trim();
      if (description.trim()) updateData.description = description.trim();

      const { error: updateError } = await supabase
        .from('communities')
        .update(updateData)
        .eq('id', community.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // 6. Join user to community_members as 'creator' (approved immediately so they can manage it)
      const { error: joinError } = await supabase
        .from('community_members')
        .insert({
          user_id: userId,
          community_id: community.id,
          role: 'creator',
          status: 'approved',
        });

      if (joinError) {
        throw new Error(joinError.message);
      }

      // 7. Update user profile college_id
      await supabase
        .from('profiles')
        .update({ college_id: collegeId })
        .eq('id', userId);

      setSuccess('Your campus community chapter has been successfully launched! It is awaiting Open Engineering Admin verification, but you are now registered as the Campus Creator & Admin.');
      
      setTimeout(() => {
        router.push('/dashboard/my-community');
        router.refresh();
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while launching the community.');
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
          <span className="badge badge-primary mb-3">Launch Chapter</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
            Pioneer Your Campus <span className="gradient-text">Chapter</span>
          </h1>
          <p className="text-text-muted text-sm font-normal">
            Select your college to claim admin rights, or register a new one to go live.
          </p>
        </div>

        {success && (
          <div className="neu-card p-6 text-center mb-8 border border-purple-300/60 shadow-[8px_8px_20px_rgba(147,51,234,0.14),-8px_-8px_20px_#ffffff]">
            <div className="w-14 h-14 neu-convex rounded-2xl flex items-center justify-center text-purple-700 mx-auto mb-3 border border-white/80 shadow-sm animate-bounce">
              ⚡
            </div>
            <h3 className="text-xl font-extrabold text-slate-950 mb-2">Campus Chapter Launched!</h3>
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
          <form onSubmit={handleSubmit} className="space-y-6 neu-card p-6 sm:p-8 border border-purple-300/40 shadow-[8px_8px_20px_rgba(147,51,234,0.12),-8px_-8px_20px_#ffffff]">
            
            {/* Toggle College Type */}
            <div className="flex items-center justify-between pb-4 border-b border-purple-200/30">
              <span className="text-sm font-extrabold text-slate-950">Is your college registered in our system?</span>
              <button
                type="button"
                onClick={() => {
                  setIsCustomCollege(!isCustomCollege);
                  setError('');
                }}
                className="text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors underline"
              >
                {isCustomCollege ? 'Select from Registered List' : 'Register New College'}
              </button>
            </div>

            {!isCustomCollege ? (
              <>
                {/* District Dropdown */}
                <div>
                  <label htmlFor="district" className="block text-xs font-bold text-slate-700 mb-1.5">
                    1. Select District
                  </label>
                  {loading ? (
                    <div className="skeleton h-11 rounded-xl" />
                  ) : (
                    <select
                      id="district"
                      value={selectedDistrict}
                      onChange={(e) => {
                        setSelectedDistrict(e.target.value);
                        setSelectedCollegeId('');
                      }}
                      required
                      className="neu-input px-4 py-3 text-xs sm:text-sm border border-purple-200/60 text-slate-900 bg-[#eef0f8] w-full font-medium"
                    >
                      <option value="">-- Choose District --</option>
                      {districts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* College Dropdown */}
                {selectedDistrict && (
                  <div>
                    <label htmlFor="college" className="block text-xs font-bold text-slate-700 mb-1.5">
                      2. Select Your College
                    </label>
                    <select
                      id="college"
                      value={selectedCollegeId}
                      onChange={(e) => setSelectedCollegeId(e.target.value)}
                      required
                      className="neu-input px-4 py-3 text-xs sm:text-sm border border-purple-200/60 text-slate-900 bg-[#eef0f8] w-full font-medium"
                    >
                      <option value="">-- Choose College --</option>
                      {filteredColleges.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            ) : (
              /* Custom College Registration Inputs */
              <div className="space-y-4 pt-2">
                <span className="badge badge-warning text-[10px]">Pioneering a New College</span>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">College Full Name</label>
                  <input
                    type="text"
                    value={customCollegeName}
                    onChange={(e) => setCustomCollegeName(e.target.value)}
                    required
                    className="neu-input px-4 py-3 text-xs"
                    placeholder="e.g., Indian Institute of Technology Guwahati"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">City</label>
                    <input
                      type="text"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      required
                      className="neu-input px-4 py-3 text-xs"
                      placeholder="e.g., Guwahati"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">State</label>
                    <input
                      type="text"
                      value={customState}
                      onChange={(e) => setCustomState(e.target.value)}
                      required
                      className="neu-input px-4 py-3 text-xs"
                      placeholder="e.g., Assam"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">District</label>
                  <input
                    type="text"
                    value={customDistrict}
                    onChange={(e) => setCustomDistrict(e.target.value)}
                    required
                    className="neu-input px-4 py-3 text-xs"
                    placeholder="e.g., Kamrup Rural"
                  />
                </div>
              </div>
            )}

            {/* Custom Hub details */}
            <div className="pt-4 border-t border-purple-200/30 space-y-4">
              <span className="text-xs font-extrabold text-slate-950 block">Community Customization</span>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Community Custom Name (optional)</label>
                <input
                  type="text"
                  value={communityName}
                  onChange={(e) => setCommunityName(e.target.value)}
                  className="neu-input px-4 py-3 text-xs"
                  placeholder="e.g., IITG Tech Society (Default is College Name + Community)"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Short Description / Catchphrase (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="neu-input px-4 py-3 text-xs resize-none"
                  rows={2}
                  placeholder="e.g., The official coding and systems engineering group of IIT Guwahati."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || (!isCustomCollege && !selectedCollegeId)}
              className="w-full py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-[4px_4px_14px_rgba(0,0,0,0.35),-4px_-4px_14px_#ffffff] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {submitting ? 'Launching Campus Chapter...' : 'Launch Campus Chapter & Become Admin ⚡'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default function CreateCommunityPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700" /></div>}>
      <CreateCommunityForm />
    </Suspense>
  );
}
