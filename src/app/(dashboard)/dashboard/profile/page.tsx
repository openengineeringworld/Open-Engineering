'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/database';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setProfile(data);
        if (data.college_id) {
          const { data: college } = await supabase.from('colleges').select('name').eq('id', data.college_id).single();
          if (college) setCollegeName(college.name);
        }
      }
      setLoading(false);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: formData.get('full_name') as string,
        phone: formData.get('phone') as string,
        branch: formData.get('branch') as string,
        year: formData.get('year') as string,
        state: formData.get('state') as string,
        city: formData.get('city') as string,
      })
      .eq('id', profile.id);

    setSaving(false);
    if (updateError) { setError(updateError.message); return; }

    setEditing(false);
    router.refresh();

    // Reload profile
    const { data } = await supabase.from('profiles').select('*').eq('id', profile.id).single();
    if (data) setProfile(data);
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!profile || !e.target.files?.[0]) return;
    const file = e.target.files[0];

    const filePath = `${profile.id}/avatar.${file.name.split('.').pop()}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) { setError(uploadError.message); return; }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

    await supabase.from('profiles').update({ profile_image: publicUrl }).eq('id', profile.id);
    setProfile({ ...profile, profile_image: publicUrl });
  }

  if (loading) return <div className="flex justify-center py-20"><div className="loading-spinner" /></div>;
  if (!profile) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-black text-slate-900">My Profile</h1>

      {/* Avatar Card */}
      <div className="neu-card p-6 sm:p-8 border border-purple-300/40 shadow-[8px_8px_20px_rgba(147,51,234,0.12),-8px_-8px_20px_#ffffff]">
        <div className="flex items-center gap-6">
          <div className="relative group">
            {profile.profile_image ? (
              <img src={profile.profile_image} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover neu-convex border border-white/80 shadow-sm" />
            ) : (
              <div className="w-20 h-20 neu-convex rounded-2xl flex items-center justify-center text-purple-700 text-2xl font-black border border-white/80 shadow-sm">
                {profile.full_name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
            <label className="absolute inset-0 rounded-2xl bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">{profile.full_name}</h2>
            <p className="text-text-muted text-sm font-normal">{profile.email}</p>
            {collegeName && <p className="text-purple-700 text-xs font-bold mt-0.5">{collegeName}</p>}
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="neu-card p-6 sm:p-8 border border-purple-300/40 shadow-[6px_6px_16px_rgba(147,51,234,0.1),-6px_-6px_16px_#ffffff]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 neu-convex rounded-xl flex items-center justify-center text-purple-600 border border-white/80">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-base font-extrabold text-slate-900">Profile Details</h2>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="py-2 px-4 rounded-xl neu-card text-purple-800 font-bold text-xs border border-purple-300/50 hover:scale-[1.02] transition-all"
            >
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Full Name</label>
                <input name="full_name" defaultValue={profile.full_name || ''} className="neu-input py-3 px-4 text-sm border border-purple-200/60 text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Phone</label>
                <input name="phone" defaultValue={profile.phone || ''} className="neu-input py-3 px-4 text-sm border border-purple-200/60 text-slate-900" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Branch</label>
                <input name="branch" defaultValue={profile.branch || ''} className="neu-input py-3 px-4 text-sm border border-purple-200/60 text-slate-900" placeholder="e.g., Computer Science" />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Year</label>
                <select name="year" defaultValue={profile.year || ''} className="neu-input py-3 px-4 text-sm border border-purple-200/60 text-slate-900 bg-[#e5e7f2]">
                  <option value="">Select Year</option>
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
                <input name="city" defaultValue={profile.city || ''} className="neu-input py-3 px-4 text-sm border border-purple-200/60 text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">State</label>
                <input name="state" defaultValue={profile.state || ''} className="neu-input py-3 px-4 text-sm border border-purple-200/60 text-slate-900" />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl neu-flat border border-rose-300 text-rose-800 text-xs font-bold">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="py-3 px-6 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="py-3 px-6 rounded-xl neu-card text-slate-700 font-bold text-xs border border-purple-200/60"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'Full Name', value: profile.full_name },
              { label: 'Phone', value: profile.phone },
              { label: 'Branch', value: profile.branch },
              { label: 'Year', value: profile.year },
              { label: 'City', value: profile.city },
              { label: 'State', value: profile.state },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-xl neu-flat border border-purple-200/30">
                <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1 font-bold">{item.label}</p>
                <p className="text-sm font-extrabold text-slate-900">{item.value || '—'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
