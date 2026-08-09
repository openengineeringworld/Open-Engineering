'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AmbassadorProfile {
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  collegeFullName: string;
  collegeShortName: string;
  collegeAddress: string;
  whatsappLink: string;
  status: string;
  createdAt: string;
}

interface CommunityData {
  id: string;
  name: string;
  description: string;
  member_count: number;
  status: string;
  college?: {
    id: string;
    name: string;
    city: string;
    state: string;
  };
}

export default function CommunityDashboardPage() {
  const [ambassador, setAmbassador] = useState<AmbassadorProfile | null>(null);
  const [community, setCommunity] = useState<CommunityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'profile'>('editor');

  // Form states for community editing
  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [collegeFullName, setCollegeFullName] = useState('');
  const [collegeAddress, setCollegeAddress] = useState('');

  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/community/ambassador/me');
        if (res.status === 401) {
          router.push('/community/login');
          return;
        }
        const data = await res.json();
        if (data.ambassador) {
          setAmbassador(data.ambassador);
          setLeaderName(data.ambassador.leaderName || '');
          setLeaderPhone(data.ambassador.leaderPhone || '');
          setCollegeFullName(data.ambassador.collegeFullName || '');
          setCollegeAddress(data.ambassador.collegeAddress || '');
          setWhatsappLink(data.ambassador.whatsappLink || '');
        }
        if (data.community) {
          setCommunity(data.community);
          setCommunityName(data.community.name || '');
          setDescription(data.community.description || '');
        }
      } catch (err) {
        console.error('Failed to load ambassador dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess('');
    setSaveError('');

    try {
      const res = await fetch('/api/community/ambassador/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          communityId: community?.id,
          communityName,
          description,
          whatsappLink,
          leaderName,
          leaderPhone,
          leaderEmail: ambassador?.leaderEmail,
          collegeFullName,
          collegeAddress
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update community details.');
      }

      setSaveSuccess('🎉 Community page details updated successfully! Changes are live now.');
      
      // Refresh local state
      if (community) {
        setCommunity({
          ...community,
          name: communityName,
          description: description
        });
      }
      if (ambassador) {
        setAmbassador({
          ...ambassador,
          leaderName,
          leaderPhone,
          collegeFullName,
          collegeAddress,
          whatsappLink
        });
      }

      setTimeout(() => setSaveSuccess(''), 5000);
    } catch (err: any) {
      setSaveError(err?.message || 'Error saving changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/community/ambassador/logout', { method: 'POST' });
    router.push('/community/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-[#eef0f8]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-700 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black text-purple-900 uppercase tracking-widest">Loading Ambassador Dashboard...</p>
        </div>
      </div>
    );
  }

  const liveCommunityUrl = community?.id ? `/community/${community.id}` : '/community';

  return (
    <section className="min-h-screen pt-32 pb-24 bg-[#eef0f8]">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-8">
        
        {/* Navigation & Header */}
        <div className="neu-card p-6 sm:p-8 border border-purple-300/60 shadow-[10px_10px_25px_rgba(147,51,234,0.12),-10px_-10px_25px_#ffffff] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge badge-primary text-xs font-black px-3 py-1">
                ⭐ Official Campus Ambassador
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-3 py-0.5 rounded-full border border-emerald-300">
                ● Active Chapter
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Welcome, {ambassador?.leaderName || 'Ambassador'}!
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm font-medium">
              Manage your college chapter <strong className="text-purple-800 font-extrabold">{communityName || community?.name || 'Open Engineering Chapter'}</strong> and edit live community details.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href={liveCommunityUrl}
              target="_blank"
              className="py-3.5 px-6 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs sm:text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center gap-2"
            >
              <span>View Public Community Page ↗</span>
            </Link>

            <button
              onClick={handleLogout}
              className="py-3.5 px-5 rounded-xl neu-flat hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-extrabold text-xs sm:text-sm transition-all border border-rose-200/50 cursor-pointer"
            >
              Log Out 🚪
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-purple-200/60 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('editor')}
            className={`py-3.5 px-6 font-black text-xs sm:text-sm capitalize transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'editor'
                ? 'border-purple-700 text-purple-800 bg-purple-100/60 rounded-t-xl shadow-sm'
                : 'border-transparent text-slate-600 hover:text-purple-700'
            }`}
          >
            ✏️ Edit /community/[id] Details
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-3.5 px-6 font-black text-xs sm:text-sm capitalize transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'preview'
                ? 'border-purple-700 text-purple-800 bg-purple-100/60 rounded-t-xl shadow-sm'
                : 'border-transparent text-slate-600 hover:text-purple-700'
            }`}
          >
            🔗 Live Links & WhatsApp Group
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3.5 px-6 font-black text-xs sm:text-sm capitalize transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'border-purple-700 text-purple-800 bg-purple-100/60 rounded-t-xl shadow-sm'
                : 'border-transparent text-slate-600 hover:text-purple-700'
            }`}
          >
            👤 Ambassador Profile & Status
          </button>
        </div>

        {/* TAB 1: EDIT COMMUNITY DETAILS */}
        {activeTab === 'editor' && (
          <div className="neu-card p-6 sm:p-10 border border-purple-300/60 shadow-[8px_8px_22px_rgba(147,51,234,0.12),-8px_-8px_20px_#ffffff] space-y-6">
            
            <div className="border-b border-purple-200/60 pb-4">
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 mb-1">
                Edit Community Details for /community/[id]
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm font-medium">
                Changes saved here will immediately update your public campus community page at <span className="font-mono text-purple-800 font-bold">{liveCommunityUrl}</span>.
              </p>
            </div>

            {saveSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-black flex items-center gap-3 animate-fadeIn">
                <span className="text-lg">✅</span>
                <span>{saveSuccess}</span>
              </div>
            )}

            {saveError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs sm:text-sm font-black flex items-center gap-3">
                <span className="text-lg">⚠️</span>
                <span>{saveError}</span>
              </div>
            )}

            <form onSubmit={handleSaveChanges} className="space-y-6">
              
              {/* Community Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="comm-name" className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                    Official Community Name *
                  </label>
                  <input
                    id="comm-name"
                    type="text"
                    required
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                    className="neu-input px-4 py-3 text-xs sm:text-sm w-full font-bold text-slate-900"
                    placeholder="e.g. Open Engineering AEC"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Public title shown on your community banner page.
                  </p>
                </div>

                <div>
                  <label htmlFor="whatsapp-url" className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                    WhatsApp Group Invite Link *
                  </label>
                  <input
                    id="whatsapp-url"
                    type="url"
                    required
                    value={whatsappLink}
                    onChange={(e) => setWhatsappLink(e.target.value)}
                    className="neu-input px-4 py-3 text-xs sm:text-sm w-full font-bold text-emerald-800"
                    placeholder="https://chat.whatsapp.com/..."
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Direct invite URL for students to join your campus WhatsApp group.
                  </p>
                </div>
              </div>

              {/* Community Tagline / Description */}
              <div>
                <label htmlFor="comm-desc" className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                  Community Description / Tagline
                </label>
                <textarea
                  id="comm-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="neu-input px-4 py-3 text-xs sm:text-sm w-full font-medium resize-none"
                  placeholder="Describe your chapter goals, activities, and engineering domains..."
                />
              </div>

              {/* College Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-purple-200/40">
                <div>
                  <label htmlFor="college-name" className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                    College / Institute Full Name
                  </label>
                  <input
                    id="college-name"
                    type="text"
                    value={collegeFullName}
                    onChange={(e) => setCollegeFullName(e.target.value)}
                    className="neu-input px-4 py-3 text-xs sm:text-sm w-full font-medium"
                    placeholder="e.g. Assam Engineering College"
                  />
                </div>

                <div>
                  <label htmlFor="college-addr" className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                    College Location / Address
                  </label>
                  <input
                    id="college-addr"
                    type="text"
                    value={collegeAddress}
                    onChange={(e) => setCollegeAddress(e.target.value)}
                    className="neu-input px-4 py-3 text-xs sm:text-sm w-full font-medium"
                    placeholder="e.g. Jalukbari, Guwahati, Assam"
                  />
                </div>
              </div>

              {/* Lead Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-purple-200/40">
                <div>
                  <label htmlFor="lead-name" className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                    Campus Ambassador / Lead Name
                  </label>
                  <input
                    id="lead-name"
                    type="text"
                    value={leaderName}
                    onChange={(e) => setLeaderName(e.target.value)}
                    className="neu-input px-4 py-3 text-xs sm:text-sm w-full font-medium"
                    placeholder="e.g. Rahul Das"
                  />
                </div>

                <div>
                  <label htmlFor="lead-phone" className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                    Lead WhatsApp / Contact Phone Number
                  </label>
                  <input
                    id="lead-phone"
                    type="tel"
                    value={leaderPhone}
                    onChange={(e) => setLeaderPhone(e.target.value)}
                    className="neu-input px-4 py-3 text-xs sm:text-sm w-full font-medium"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="py-4 px-8 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-black text-xs sm:text-sm shadow-[4px_4px_14px_rgba(0,0,0,0.35),-4px_-4px_14px_#ffffff] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Community Changes...</span>
                    </>
                  ) : (
                    <span>Save & Update Public /community/[id] Page 🚀</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 2: LIVE LINKS & WHATSAPP */}
        {activeTab === 'preview' && (
          <div className="neu-card p-6 sm:p-10 border border-purple-300/60 shadow-[8px_8px_22px_rgba(147,51,234,0.12),-8px_-8px_20px_#ffffff] space-y-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-950">
              Community Links & Public Share Hub
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Public Community Page Card */}
              <div className="p-6 rounded-2xl neu-flat bg-white border border-purple-200/80 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xl">
                  🌐
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Public Community Page URL
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Share this public URL with engineering students across your college campus to join your community.
                </p>
                <div className="p-3 neu-pressed rounded-xl font-mono text-xs text-purple-900 font-bold break-all">
                  {typeof window !== 'undefined' ? `${window.location.origin}${liveCommunityUrl}` : liveCommunityUrl}
                </div>
                <div className="flex gap-3">
                  <Link
                    href={liveCommunityUrl}
                    target="_blank"
                    className="py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow transition-all"
                  >
                    Open Page ↗
                  </Link>
                </div>
              </div>

              {/* WhatsApp Group Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white border border-emerald-500/30 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xl border border-emerald-400/30">
                  💬
                </div>
                <h3 className="text-lg font-extrabold text-white">
                  WhatsApp Group Invite Link
                </h3>
                <p className="text-xs text-slate-300 font-normal">
                  This invite link is highlighted directly on your community page so students can join instantly.
                </p>
                <div className="p-3 bg-slate-950/80 rounded-xl font-mono text-xs text-emerald-400 font-bold break-all border border-emerald-500/20">
                  {whatsappLink || 'https://chat.whatsapp.com/open-engineering'}
                </div>
                <div>
                  <a
                    href={whatsappLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow transition-all"
                  >
                    Test WhatsApp Link ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AMBASSADOR PROFILE */}
        {activeTab === 'profile' && (
          <div className="neu-card p-6 sm:p-10 border border-purple-300/60 shadow-[8px_8px_22px_rgba(147,51,234,0.12),-8px_-8px_20px_#ffffff] space-y-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-950">
              Ambassador Credentials & Chapter Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 neu-flat rounded-xl space-y-1">
                <span className="text-slate-500 font-bold uppercase tracking-wider block">Lead Name</span>
                <span className="font-extrabold text-slate-900 text-base">{ambassador?.leaderName || 'N/A'}</span>
              </div>

              <div className="p-4 neu-flat rounded-xl space-y-1">
                <span className="text-slate-500 font-bold uppercase tracking-wider block">Lead Registered Email</span>
                <span className="font-extrabold text-purple-700 text-base">{ambassador?.leaderEmail || 'N/A'}</span>
              </div>

              <div className="p-4 neu-flat rounded-xl space-y-1">
                <span className="text-slate-500 font-bold uppercase tracking-wider block">Phone / WhatsApp</span>
                <span className="font-extrabold text-slate-900 text-base">{ambassador?.leaderPhone || 'N/A'}</span>
              </div>

              <div className="p-4 neu-flat rounded-xl space-y-1">
                <span className="text-slate-500 font-bold uppercase tracking-wider block">College Full Name</span>
                <span className="font-extrabold text-slate-900 text-base">{ambassador?.collegeFullName || 'N/A'}</span>
              </div>

              <div className="p-4 neu-flat rounded-xl space-y-1">
                <span className="text-slate-500 font-bold uppercase tracking-wider block">Application Status</span>
                <span className="badge badge-success text-xs font-black uppercase">{ambassador?.status || 'APPROVED'}</span>
              </div>

              <div className="p-4 neu-flat rounded-xl space-y-1">
                <span className="text-slate-500 font-bold uppercase tracking-wider block">Registration Date</span>
                <span className="font-bold text-slate-700">{ambassador?.createdAt ? new Date(ambassador.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
