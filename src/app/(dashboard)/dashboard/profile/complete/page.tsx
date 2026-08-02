'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { College } from '@/types/database';

export default function CompleteProfilePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [selectedCollege, setSelectedCollege] = useState('');
  const [showAddCollege, setShowAddCollege] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadColleges() {
      const { data } = await supabase.from('colleges').select('*').order('name');
      if (data) {
        setColleges(data as College[]);
        // Extract unique districts
        const uniqueDists = Array.from(
          new Set(data.map((c: any) => c.district).filter(Boolean))
        ) as string[];
        setDistricts(uniqueDists.sort());
      }
    }
    loadColleges();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter colleges when district changes
  useEffect(() => {
    if (selectedDistrict) {
      setFilteredColleges(colleges.filter((c) => c.district === selectedDistrict));
      setSelectedCollege('');
    } else {
      setFilteredColleges([]);
      setSelectedCollege('');
    }
  }, [selectedDistrict, colleges]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    let collegeId = '';

    // If adding a new college
    if (showAddCollege) {
      const { data: newCollege, error: collegeError } = await supabase
        .from('colleges')
        .insert({
          name: formData.get('college_name') as string,
          city: formData.get('college_city') as string,
          district: formData.get('college_district') as string,
          state: formData.get('college_state') as string,
          added_by: user.id,
        })
        .select()
        .single();

      if (collegeError) {
        setError(collegeError.message);
        setLoading(false);
        return;
      }
      collegeId = newCollege.id;
    } else {
      if (!selectedCollege) {
        setError('Please select a college.');
        setLoading(false);
        return;
      }
      const matched = colleges.find((c) => c.name === selectedCollege);
      if (!matched) {
        setError('Selected college is invalid.');
        setLoading(false);
        return;
      }
      collegeId = matched.id;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: formData.get('full_name') as string,
        phone: formData.get('phone') as string,
        college_id: collegeId,
        branch: formData.get('branch') as string,
        year: formData.get('year') as string,
        state: formData.get('state') as string,
        city: formData.get('city') as string,
        is_profile_complete: true,
      })
      .eq('id', user.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-8">
        {/* Replacement of Wave Emoji to comply with No Emojis Policy */}
        <div className="w-16 h-16 neu-convex rounded-2xl flex items-center justify-center text-purple-700 mx-auto mb-3 border border-white/80 shadow-sm">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="text-2xl font-black mb-2 text-slate-950">Complete Your Profile</h1>
        <p className="text-text-muted text-sm font-normal">Tell us a bit about yourself</p>
      </div>

      <div className="neu-card p-8 border border-purple-300/40 shadow-[10px_10px_24px_rgba(147,51,234,0.14),-10px_-10px_24px_#ffffff]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Full Name *</label>
            <input name="full_name" required className="neu-input py-3.5 px-4 text-xs sm:text-sm border border-purple-200/60 text-slate-900" placeholder="Your full name" />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Phone Number</label>
            <input name="phone" type="tel" className="neu-input py-3.5 px-4 text-xs sm:text-sm border border-purple-200/60 text-slate-900" placeholder="Your phone number" />
          </div>

          {/* College Selection */}
          <div>
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">College *</label>
            {!showAddCollege ? (
              <>
                <div className="space-y-3 mb-2">
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    required
                    className="neu-input py-3.5 px-4 text-xs sm:text-sm border border-purple-200/60 text-slate-900 bg-[#eef0f8] w-full"
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedCollege}
                    onChange={(e) => setSelectedCollege(e.target.value)}
                    disabled={!selectedDistrict}
                    required
                    className="neu-input py-3.5 px-4 text-xs sm:text-sm border border-purple-200/60 text-slate-900 bg-[#eef0f8] w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {!selectedDistrict ? 'Select a district first' : 'Select College'}
                    </option>
                    {filteredColleges.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="button" onClick={() => setShowAddCollege(true)} className="text-purple-700 text-xs font-extrabold hover:underline">
                  Can&apos;t find your college? Add it →
                </button>
              </>
            ) : (
              <div className="space-y-4 p-5 rounded-2xl neu-pressed border border-purple-200/40">
                <span className="text-[10px] font-black text-purple-700 uppercase tracking-widest block mb-2">
                  Custom College Information
                </span>
                <input name="college_name" required className="neu-input py-3 px-4 text-xs border border-purple-200/60 text-slate-900 bg-[#eef0f8] w-full" placeholder="College Name" />
                
                <div className="grid grid-cols-2 gap-3.5">
                  <input name="college_city" required className="neu-input py-3 px-4 text-xs border border-purple-200/60 text-slate-900 bg-[#eef0f8] w-full" placeholder="City" />
                  <input name="college_district" required className="neu-input py-3 px-4 text-xs border border-purple-200/60 text-slate-900 bg-[#eef0f8] w-full" placeholder="District" />
                </div>
                
                <input name="college_state" required className="neu-input py-3 px-4 text-xs border border-purple-200/60 text-slate-900 bg-[#eef0f8] w-full" placeholder="State" defaultValue="Assam" />
                
                <button type="button" onClick={() => setShowAddCollege(false)} className="text-purple-700 text-xs font-extrabold hover:underline">
                  ← Search existing colleges
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Branch</label>
              <input name="branch" className="neu-input py-3.5 px-4 text-xs sm:text-sm border border-purple-200/60 text-slate-900" placeholder="e.g., CSE" />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Year</label>
              <select name="year" className="neu-input py-3.5 px-4 text-xs sm:text-sm border border-purple-200/60 text-slate-900 bg-[#eef0f8]">
                <option value="">Select</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Alumni">Alumni</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">City</label>
              <input name="city" className="neu-input py-3.5 px-4 text-xs sm:text-sm border border-purple-200/60 text-slate-900" placeholder="Your city" />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">State</label>
              <input name="state" className="neu-input py-3.5 px-4 text-xs sm:text-sm border border-purple-200/60 text-slate-900" placeholder="Your state" />
            </div>
          </div>

          {error && <p className="text-rose-600 text-xs font-bold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-[4px_4px_14px_rgba(0,0,0,0.35),-4px_-4px_14px_#ffffff] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
          >
            {loading ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
