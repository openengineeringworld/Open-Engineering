'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { College } from '@/types/database';

export default function CompleteProfilePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const [showAddCollege, setShowAddCollege] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadColleges() {
      const { data } = await supabase.from('colleges').select('*').order('name');
      if (data) setColleges(data);
    }
    loadColleges();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = colleges.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    let collegeId = selectedCollege;

    // If adding a new college
    if (showAddCollege) {
      const { data: newCollege, error: collegeError } = await supabase
        .from('colleges')
        .insert({
          name: formData.get('college_name') as string,
          city: formData.get('college_city') as string,
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
        <span className="text-4xl block mb-3">👋</span>
        <h1 className="text-2xl font-bold mb-2">Complete Your Profile</h1>
        <p className="text-text-muted text-sm">Tell us a bit about yourself</p>
      </div>

      <div className="neu-card p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Full Name *</label>
            <input name="full_name" required className="neu-input" placeholder="Your full name" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Phone Number</label>
            <input name="phone" type="tel" className="neu-input" placeholder="Your phone number" />
          </div>

          {/* College Selection */}
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">College *</label>
            {!showAddCollege ? (
              <>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="neu-input mb-2"
                  placeholder="Search for your college..."
                />
                {search && (
                  <div className="max-h-40 overflow-y-auto space-y-1 mb-2">
                    {filtered.map((college) => (
                      <button
                        key={college.id}
                        type="button"
                        onClick={() => { setSelectedCollege(college.id); setSearch(college.name); }}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                          selectedCollege === college.id ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 text-text-muted'
                        }`}
                      >
                        {college.name} — {college.city}, {college.state}
                      </button>
                    ))}
                  </div>
                )}
                <button type="button" onClick={() => setShowAddCollege(true)} className="text-primary text-sm hover:underline">
                  Can&apos;t find your college? Add it →
                </button>
              </>
            ) : (
              <div className="space-y-3 p-4 rounded-xl bg-surface-dark/50 border border-border/30">
                <input name="college_name" required className="neu-input" placeholder="College Name" />
                <div className="grid grid-cols-2 gap-3">
                  <input name="college_city" required className="neu-input" placeholder="City" />
                  <input name="college_state" required className="neu-input" placeholder="State" />
                </div>
                <button type="button" onClick={() => setShowAddCollege(false)} className="text-text-muted text-sm hover:underline">
                  ← Search existing colleges
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Branch</label>
              <input name="branch" className="neu-input" placeholder="e.g., CSE" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Year</label>
              <select name="year" className="neu-input">
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
              <label className="block text-sm font-medium text-text-muted mb-2">City</label>
              <input name="city" className="neu-input" placeholder="Your city" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">State</label>
              <input name="state" className="neu-input" placeholder="Your state" />
            </div>
          </div>

          {error && <p className="text-error text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
