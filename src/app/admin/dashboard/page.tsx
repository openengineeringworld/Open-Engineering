'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import type { InternshipApplication, ContactSubmission } from '@/types/database';

interface CommunityRequest {
  id: string;
  name: string;
  description: string | null;
  status: 'pending' | 'approved' | 'rejected';
  member_count: number;
  created_at: string;
  college_id: string;
  college?: {
    id: string;
    name: string;
    city: string;
    state: string;
    district?: string | null;
  };
  application_details?: {
    college_full_name?: string;
    college_short_name?: string;
    community_name?: string;
    leader_name?: string;
    leader_email?: string;
    leader_phone?: string;
    whatsapp_link?: string;
    additional_notes?: string;
    password?: string;
  };
}

export default function AdminDashboardPage() {
  const [mainSection, setMainSection] = useState<'communities' | 'internships' | 'contacts'>('communities');
  
  // Data states
  const [communities, setCommunities] = useState<CommunityRequest[]>([]);
  const [internships, setInternships] = useState<InternshipApplication[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);

  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter tabs for communities & internships
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit Modal state for Communities
  const [editingCommunity, setEditingCommunity] = useState<CommunityRequest | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    member_count: 0,
    college_name: '',
    college_city: '',
    college_state: '',
    college_district: '',
    status: 'approved' as 'pending' | 'approved' | 'rejected',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const router = useRouter();

  // Verify authentication and load initial data on mount
  useEffect(() => {
    async function init() {
      try {
        const authRes = await fetch('/api/admin/verify-auth');
        if (!authRes.ok) {
          router.push('/admin');
          return;
        }
        const authData = await authRes.json();
        if (!authData.authenticated) {
          router.push('/admin');
          return;
        }

        setAuthChecking(false);
        await refreshAllData();
      } catch (err) {
        console.error('Auth verification error:', err);
        router.push('/admin');
      }
    }
    init();
  }, [router]);

  // Refresh all dataset from Supabase APIs
  async function refreshAllData() {
    setLoading(true);
    try {
      await Promise.all([loadCommunities(), loadInternships(), loadContacts()]);
    } finally {
      setLoading(false);
    }
  }

  // 1. Load Communities
  async function loadCommunities() {
    try {
      const res = await fetch('/api/admin/communities');
      if (res.ok) {
        const data = await res.json();
        setCommunities(data.communities || []);
      }
    } catch (err) {
      console.error('Error loading communities:', err);
    }
  }

  // 2. Load Internship Applications
  async function loadInternships() {
    try {
      const res = await fetch('/api/admin/internships');
      if (res.ok) {
        const data = await res.json();
        setInternships(data.applications || []);
      }
    } catch (err) {
      console.error('Error loading internship applications:', err);
    }
  }

  // 3. Load Contact Messages
  async function loadContacts() {
    try {
      const res = await fetch('/api/admin/contacts');
      if (res.ok) {
        const data = await res.json();
        setContacts(data.contacts || []);
      }
    } catch (err) {
      console.error('Error loading contact submissions:', err);
    }
  }

  // Handle Logout
  async function handleLogout() {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      router.push('/admin');
      router.refresh();
    }
  }

  // Handle Community Status Change in Supabase
  async function handleCommunityStatusChange(id: string, newStatus: 'approved' | 'pending' | 'rejected') {
    try {
      setActionMessage(null);
      const res = await fetch('/api/admin/communities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update community status');
      }

      setCommunities((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );

      setActionMessage({
        type: 'success',
        text: `Community status updated to "${newStatus.toUpperCase()}" in Supabase. ${
          newStatus === 'approved' ? 'The club is now live on /community/search!' : ''
        }`,
      });
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err?.message || 'Failed to update status' });
    }
  }

  // Handle Internship Status Change in Supabase
  async function handleInternshipStatusChange(id: string, newStatus: 'approved' | 'pending' | 'rejected') {
    try {
      setActionMessage(null);
      const res = await fetch('/api/admin/internships', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update internship application status');
      }

      setInternships((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );

      setActionMessage({
        type: 'success',
        text: `Internship application status updated to "${newStatus.toUpperCase()}" in Supabase.`,
      });
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err?.message || 'Failed to update status' });
    }
  }

  // Delete Community Request
  async function handleDeleteCommunity(id: string, name: string) {
    if (!window.confirm(`Are you sure you want to delete community "${name}"?`)) return;
    try {
      setActionMessage(null);
      const res = await fetch(`/api/admin/communities?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete community');
      setCommunities((prev) => prev.filter((c) => c.id !== id));
      setActionMessage({ type: 'success', text: `Community "${name}" deleted.` });
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err?.message });
    }
  }

  // Delete Internship Application
  async function handleDeleteInternship(id: string, applicantName: string) {
    if (!window.confirm(`Delete internship application for "${applicantName}"?`)) return;
    try {
      setActionMessage(null);
      const res = await fetch(`/api/admin/internships?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete internship application');
      setInternships((prev) => prev.filter((item) => item.id !== id));
      setActionMessage({ type: 'success', text: `Application for "${applicantName}" deleted.` });
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err?.message });
    }
  }

  // Delete Contact Message
  async function handleDeleteContact(id: string) {
    if (!window.confirm('Delete this contact message?')) return;
    try {
      setActionMessage(null);
      const res = await fetch(`/api/admin/contacts?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete contact message');
      setContacts((prev) => prev.filter((item) => item.id !== id));
      setActionMessage({ type: 'success', text: 'Contact message deleted.' });
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err?.message });
    }
  }

  // Open Edit Modal for Community
  function handleOpenEdit(comm: CommunityRequest) {
    setEditingCommunity(comm);
    setEditForm({
      name: comm.name,
      description: comm.description || '',
      member_count: comm.member_count || 1,
      college_name: comm.college?.name || comm.application_details?.college_full_name || '',
      college_city: comm.college?.city || 'N/A',
      college_state: comm.college?.state || 'Assam',
      college_district: comm.college?.district || '',
      status: comm.status || 'approved',
    });
  }

  // Save Edit Form
  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCommunity) return;
    setSavingEdit(true);
    setActionMessage(null);

    try {
      const res = await fetch('/api/admin/communities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCommunity.id,
          name: editForm.name,
          description: editForm.description,
          member_count: editForm.member_count,
          status: editForm.status,
          college_id: editingCommunity.college_id,
          college_name: editForm.college_name,
          college_city: editForm.college_city,
          college_state: editForm.college_state,
          college_district: editForm.college_district,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update club details');
      }

      setCommunities((prev) =>
        prev.map((c) => (c.id === editingCommunity.id ? { ...c, ...data.community } : c))
      );

      setActionMessage({ type: 'success', text: `Club details for "${editForm.name}" updated successfully in Supabase!` });
      setEditingCommunity(null);
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err?.message || 'Failed to update club details' });
    } finally {
      setSavingEdit(false);
    }
  }

  // Communities statistics & filtering
  const commStats = useMemo(() => {
    const total = communities.length;
    const pending = communities.filter((c) => c.status === 'pending').length;
    const approved = communities.filter((c) => c.status === 'approved').length;
    const rejected = communities.filter((c) => c.status === 'rejected').length;
    return { total, pending, approved, rejected };
  }, [communities]);

  const filteredCommunities = useMemo(() => {
    return communities.filter((comm) => {
      if (activeTab !== 'all' && comm.status !== activeTab) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const commName = comm.name?.toLowerCase() || '';
        const colName = comm.college?.name?.toLowerCase() || '';
        const leader = comm.application_details?.leader_name?.toLowerCase() || '';
        const email = comm.application_details?.leader_email?.toLowerCase() || '';
        return commName.includes(q) || colName.includes(q) || leader.includes(q) || email.includes(q);
      }
      return true;
    });
  }, [communities, activeTab, searchQuery]);

  // Internships statistics & filtering
  const internshipStats = useMemo(() => {
    const total = internships.length;
    const pending = internships.filter((i) => i.status === 'pending').length;
    const approved = internships.filter((i) => i.status === 'approved').length;
    const rejected = internships.filter((i) => i.status === 'rejected').length;
    return { total, pending, approved, rejected };
  }, [internships]);

  const filteredInternships = useMemo(() => {
    return internships.filter((item) => {
      if (activeTab !== 'all' && item.status !== activeTab) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = item.full_name?.toLowerCase() || '';
        const email = item.email?.toLowerCase() || '';
        const col = item.college_name?.toLowerCase() || '';
        const title = item.program_title?.toLowerCase() || '';
        return name.includes(q) || email.includes(q) || col.includes(q) || title.includes(q);
      }
      return true;
    });
  }, [internships, activeTab, searchQuery]);

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-xs font-semibold tracking-wider">Verifying Admin Privileges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans pb-24">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-[#0e1422]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs font-extrabold border border-purple-500/30">
              Supabase Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-medium bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Supabase Sync</span>
            </div>

            <button
              onClick={handleLogout}
              className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-300 font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* Header & Main Navigation Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Supabase Form Data & Approval Dashboard
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Manage form submissions and approve statuses directly in Supabase tables.
            </p>
          </div>

          <button
            onClick={refreshAllData}
            disabled={loading}
            className="py-2.5 px-4 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh Supabase Data</span>
          </button>
        </div>

        {/* Action Status Notification */}
        {actionMessage && (
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 ${
              actionMessage.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            <span>{actionMessage.text}</span>
            <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white font-bold">
              ✕
            </button>
          </div>
        )}

        {/* Category Navigation Bar */}
        <div className="flex flex-wrap items-center gap-3 bg-[#121827] p-2 rounded-2xl border border-slate-800">
          <button
            onClick={() => { setMainSection('communities'); setActiveTab('pending'); }}
            className={`py-3 px-6 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 ${
              mainSection === 'communities'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <span>🏛️ Community Applications</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-950/80 text-purple-200 border border-purple-400/30">
              {commStats.pending} pending
            </span>
          </button>

          <button
            onClick={() => { setMainSection('internships'); setActiveTab('pending'); }}
            className={`py-3 px-6 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 ${
              mainSection === 'internships'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <span>🚀 Internship Applications</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-950/80 text-purple-200 border border-purple-400/30">
              {internshipStats.pending} pending
            </span>
          </button>

          <button
            onClick={() => setMainSection('contacts')}
            className={`py-3 px-6 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 ${
              mainSection === 'contacts'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <span>✉️ Contact Messages</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
              {contacts.length} total
            </span>
          </button>
        </div>

        {/* SECTION 1: COMMUNITY APPLICATIONS & CHAPTERS */}
        {mainSection === 'communities' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#121827] border border-slate-800 rounded-2xl p-5 shadow-lg">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Chapter Submissions</span>
                <div className="text-2xl sm:text-3xl font-black text-white">{commStats.total}</div>
              </div>
              <div className="bg-[#121827] border border-amber-500/30 rounded-2xl p-5 shadow-lg bg-amber-500/5">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">Pending Approval</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-300">{commStats.pending}</div>
              </div>
              <div className="bg-[#121827] border border-emerald-500/30 rounded-2xl p-5 shadow-lg bg-emerald-500/5">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">Verified & Approved</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-300">{commStats.approved}</div>
              </div>
              <div className="bg-[#121827] border border-slate-800 rounded-2xl p-5 shadow-lg">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Rejected</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-400">{commStats.rejected}</div>
              </div>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#121827] p-4 rounded-2xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'pending', label: 'Pending Approval', count: commStats.pending },
                  { id: 'approved', label: 'Approved Clubs', count: commStats.approved },
                  { id: 'all', label: 'All Submissions', count: commStats.total },
                  { id: 'rejected', label: 'Rejected', count: commStats.rejected },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2 px-3.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">{tab.count}</span>
                  </button>
                ))}
              </div>

              <div className="relative min-w-[240px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search college, club, leader..."
                  className="w-full bg-[#1a2234] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all pr-8"
                />
              </div>
            </div>

            {/* List */}
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-400 text-xs font-bold">Loading community submissions from Supabase...</p>
              </div>
            ) : filteredCommunities.length === 0 ? (
              <div className="bg-[#121827] border border-slate-800 rounded-3xl p-12 text-center">
                <p className="text-slate-400 text-xs">No community requests found in Supabase matching current filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredCommunities.map((comm) => {
                  const isPending = comm.status === 'pending';
                  const isApproved = comm.status === 'approved';

                  const app = comm.application_details;
                  const collegeName = comm.college?.name || app?.college_full_name || 'N/A';

                  return (
                    <div
                      key={comm.id}
                      className={`bg-[#121827] border rounded-3xl p-6 sm:p-8 transition-all relative shadow-xl ${
                        isPending
                          ? 'border-amber-500/40 bg-gradient-to-br from-[#121827] to-[#1a1712]'
                          : isApproved
                          ? 'border-emerald-500/30 bg-gradient-to-br from-[#121827] to-[#0f1d18]'
                          : 'border-slate-800'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase inline-flex items-center gap-1.5 ${
                              isPending
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : isApproved
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            {isPending ? 'Pending Approval' : isApproved ? 'Approved & Verified' : 'Rejected'}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(comm.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-purple-300 bg-purple-950/60 px-3 py-1 rounded-xl border border-purple-500/30">
                          👥 {comm.member_count || 1} Member(s)
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-3">
                          <div>
                            <span className="text-[10px] font-black uppercase text-purple-400 block mb-1">Community Name</span>
                            <h3 className="text-xl font-black text-white">{comm.name}</h3>
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">College / Institute</span>
                            <p className="text-sm font-bold text-slate-200">{collegeName}</p>
                          </div>
                          {comm.description && (
                            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                              {comm.description}
                            </p>
                          )}
                        </div>

                        <div className="space-y-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
                          <span className="text-[10px] font-black uppercase text-amber-400 block mb-2 border-b border-slate-800 pb-1">
                            Application Leader Details
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="text-slate-400 block text-[10px]">Leader Name</span>
                              <span className="font-bold text-white">{app?.leader_name || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">Email Address</span>
                              <a href={`mailto:${app?.leader_email}`} className="font-semibold text-purple-400 hover:underline block truncate">
                                {app?.leader_email || 'N/A'}
                              </a>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">Phone</span>
                              <span className="font-bold text-slate-200">{app?.leader_phone || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">WhatsApp</span>
                              {app?.whatsapp_link ? (
                                <a href={app.whatsapp_link} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold hover:underline">
                                  Group Link 🔗
                                </a>
                              ) : <span className="text-slate-500">N/A</span>}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleCommunityStatusChange(comm.id, 'approved')}
                            className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all"
                          >
                            ✓ Approve Status in Supabase
                          </button>

                          <button
                            onClick={() => handleCommunityStatusChange(comm.id, 'rejected')}
                            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-300 font-bold text-xs border border-slate-700 transition-all"
                          >
                            Reject Status
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(comm)}
                            className="py-2 px-4 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-500/40 font-bold text-xs"
                          >
                            Edit Details
                          </button>
                          <button
                            onClick={() => handleDeleteCommunity(comm.id, comm.name)}
                            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 border border-slate-800 text-xs font-bold"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: INTERNSHIP APPLICATIONS */}
        {mainSection === 'internships' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#121827] border border-slate-800 rounded-2xl p-5 shadow-lg">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Applications</span>
                <div className="text-2xl sm:text-3xl font-black text-white">{internshipStats.total}</div>
              </div>
              <div className="bg-[#121827] border border-amber-500/30 rounded-2xl p-5 shadow-lg bg-amber-500/5">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">Pending Review</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-300">{internshipStats.pending}</div>
              </div>
              <div className="bg-[#121827] border border-emerald-500/30 rounded-2xl p-5 shadow-lg bg-emerald-500/5">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">Approved Candidates</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-300">{internshipStats.approved}</div>
              </div>
              <div className="bg-[#121827] border border-slate-800 rounded-2xl p-5 shadow-lg">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Rejected</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-400">{internshipStats.rejected}</div>
              </div>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#121827] p-4 rounded-2xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'pending', label: 'Pending Review', count: internshipStats.pending },
                  { id: 'approved', label: 'Approved Candidates', count: internshipStats.approved },
                  { id: 'all', label: 'All Applications', count: internshipStats.total },
                  { id: 'rejected', label: 'Rejected', count: internshipStats.rejected },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2 px-3.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">{tab.count}</span>
                  </button>
                ))}
              </div>

              <div className="relative min-w-[240px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student, email, college..."
                  className="w-full bg-[#1a2234] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all pr-8"
                />
              </div>
            </div>

            {/* List */}
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-400 text-xs font-bold">Loading internship applications from Supabase...</p>
              </div>
            ) : filteredInternships.length === 0 ? (
              <div className="bg-[#121827] border border-slate-800 rounded-3xl p-12 text-center">
                <p className="text-slate-400 text-xs">No internship applications found in Supabase matching current filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredInternships.map((item) => {
                  const isPending = item.status === 'pending';
                  const isApproved = item.status === 'approved';

                  return (
                    <div
                      key={item.id}
                      className={`bg-[#121827] border rounded-3xl p-6 sm:p-8 transition-all relative shadow-xl ${
                        isPending
                          ? 'border-amber-500/40 bg-gradient-to-br from-[#121827] to-[#1a1712]'
                          : isApproved
                          ? 'border-emerald-500/30 bg-gradient-to-br from-[#121827] to-[#0f1d18]'
                          : 'border-slate-800'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase inline-flex items-center gap-1.5 ${
                              isPending
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : isApproved
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            {isPending ? 'Pending Approval' : isApproved ? 'Approved Candidate' : 'Rejected'}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Applied: {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-purple-300 bg-purple-950/60 px-3 py-1 rounded-xl border border-purple-500/30">
                          🎯 {item.program_title}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-3">
                          <div>
                            <span className="text-[10px] font-black uppercase text-purple-400 block mb-1">Applicant Name</span>
                            <h3 className="text-xl font-black text-white">{item.full_name}</h3>
                          </div>

                          <div className="text-xs space-y-1 text-slate-300">
                            <div><span className="text-slate-400 font-medium">College:</span> <strong className="text-white">{item.college_name}</strong></div>
                            {item.branch && <div><span className="text-slate-400 font-medium">Branch:</span> {item.branch} ({item.year || 'N/A'})</div>}
                          </div>

                          {item.github_url && (
                            <div>
                              <a href={item.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-purple-400 font-bold hover:underline">
                                🐙 View GitHub / Portfolio 🔗
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-800 text-xs">
                          <span className="text-[10px] font-black uppercase text-amber-400 block mb-2 border-b border-slate-800 pb-1">
                            Contact & Statements
                          </span>
                          <div><span className="text-slate-400 text-[10px] block">Email:</span> <a href={`mailto:${item.email}`} className="text-purple-300 font-semibold hover:underline">{item.email}</a></div>
                          <div><span className="text-slate-400 text-[10px] block">Phone / WhatsApp:</span> <span className="font-semibold text-white">{item.phone}</span></div>
                          {item.experience_notes && (
                            <div className="pt-2 border-t border-slate-800">
                              <span className="text-slate-400 text-[10px] block">Statement / Notes:</span>
                              <p className="text-slate-300 italic">{item.experience_notes}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status Action Buttons */}
                      <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleInternshipStatusChange(item.id, 'approved')}
                            className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all"
                          >
                            ✓ Approve Status in Supabase
                          </button>

                          <button
                            onClick={() => handleInternshipStatusChange(item.id, 'rejected')}
                            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-300 font-bold text-xs border border-slate-700 transition-all"
                          >
                            Reject Status
                          </button>
                        </div>

                        <button
                          onClick={() => handleDeleteInternship(item.id, item.full_name)}
                          className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 border border-slate-800 text-xs font-bold"
                        >
                          🗑️
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: CONTACT FORM SUBMISSIONS */}
        {mainSection === 'contacts' && (
          <div className="space-y-6">
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-400 text-xs font-bold">Loading contact messages from Supabase...</p>
              </div>
            ) : contacts.length === 0 ? (
              <div className="bg-[#121827] border border-slate-800 rounded-3xl p-12 text-center">
                <p className="text-slate-400 text-xs">No contact form messages found in Supabase.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {contacts.map((msg) => (
                  <div key={msg.id} className="bg-[#121827] border border-slate-800 rounded-2xl p-6 space-y-3 shadow-lg">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="text-base font-black text-white">{msg.subject}</h4>
                        <span className="text-xs text-purple-400 font-semibold">{msg.name} ({msg.email})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-500">
                          {new Date(msg.created_at).toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleDeleteContact(msg.id)}
                          className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 border border-slate-800 text-xs font-bold"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800 whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Edit Community Modal */}
      {editingCommunity && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121827] border border-slate-700/80 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative text-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider block">Admin Control</span>
                <h3 className="text-xl font-black text-white">Edit Community Details</h3>
              </div>
              <button onClick={() => setEditingCommunity(null)} className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Community Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-[#1a2234] border border-slate-700 rounded-xl px-4 py-3 text-white font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">College Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.college_name}
                  onChange={(e) => setEditForm({ ...editForm, college_name: e.target.value })}
                  className="w-full bg-[#1a2234] border border-slate-700 rounded-xl px-4 py-3 text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Member Count</label>
                  <input
                    type="number"
                    min={1}
                    value={editForm.member_count}
                    onChange={(e) => setEditForm({ ...editForm, member_count: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[#1a2234] border border-slate-700 rounded-xl px-4 py-3 text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Supabase Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full bg-[#1a2234] border border-slate-700 rounded-xl px-4 py-3 text-white font-semibold"
                  >
                    <option value="approved">Approved & Verified</option>
                    <option value="pending">Pending Approval</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-[#1a2234] border border-slate-700 rounded-xl px-4 py-3 text-white font-medium resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setEditingCommunity(null)} className="py-3 px-5 rounded-xl bg-slate-800 text-slate-300 font-bold">Cancel</button>
                <button type="submit" disabled={savingEdit} className="py-3 px-6 rounded-xl bg-purple-600 text-white font-extrabold disabled:opacity-50">
                  {savingEdit ? 'Saving...' : 'Save Changes in Supabase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
