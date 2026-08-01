'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/database';

import Logo from '@/components/ui/Logo';

const sidebarLinks = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    href: '/dashboard/my-community',
    label: 'My Community',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    href: '/dashboard/profile',
    label: 'Profile',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [communityStatus, setCommunityStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) setProfile(data);

      // Check community membership and status
      const { data: mem } = await supabase
        .from('community_members')
        .select('*, community:communities(status)')
        .eq('user_id', user.id)
        .maybeSingle();

      if (mem) {
        const comm = Array.isArray(mem.community) ? mem.community[0] : mem.community;
        if (comm?.status) setCommunityStatus(comm.status);
      }
    }
    loadProfile();
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#eef0f8] flex flex-col">
      {/* Sticky Dashboard Header */}
      <header className="sticky top-0 left-0 right-0 h-16 bg-[#eef0f8]/90 backdrop-blur-md border-b border-purple-200/30 flex items-center justify-between px-6 z-30 lg:px-10">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Hamburger Trigger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-10 h-10 neu-convex rounded-xl flex items-center justify-center border border-white/80 shadow-sm text-slate-800 active:scale-95 transition-all"
            aria-label="Open sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <Logo size="sm" />
        </div>

        {/* Right Side Avatar / Profile Preview */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/profile"
            className="w-10 h-10 neu-convex rounded-xl flex items-center justify-center text-purple-700 font-extrabold text-sm border border-white/80 shadow-sm hover:scale-105 active:scale-95 transition-all"
          >
            {profile?.full_name?.charAt(0)?.toUpperCase() || '?'}
          </Link>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 3D Neumorphic Sidebar */}
        <aside
          className={`fixed top-16 left-0 bottom-0 w-72 bg-[#eef0f8] border-r border-purple-200/40 z-40 transform transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full p-5">
            {/* 3D Neumorphic Profile Preview Card */}
            <div className="neu-card p-5 mb-6 border border-purple-300/40 shadow-[6px_6px_16px_rgba(147,51,234,0.1),-6px_-6px_16px_#ffffff]">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 neu-convex rounded-2xl flex items-center justify-center text-purple-700 font-black text-lg border border-white/80 shadow-sm">
                  {profile?.full_name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-sm text-slate-900 truncate">{profile?.full_name || 'Student'}</p>
                  <p className="text-text-muted text-xs truncate font-normal">{profile?.email}</p>
                </div>
              </div>
            </div>

            {/* Pending Approval Banner */}
            {communityStatus === 'pending' && (
              <div className="mb-4 p-3 rounded-xl neu-flat border border-amber-300/60 text-center">
                <div className="w-8 h-8 neu-convex rounded-xl flex items-center justify-center text-amber-600 mx-auto mb-1.5 text-xs font-black border border-white/80">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-amber-800 text-[10px] font-bold">Community Awaiting Admin Approval</p>
              </div>
            )}

            {/* 3D Neumorphic Nav Links */}
            <nav className="flex-1 space-y-2">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                    pathname === link.href
                      ? 'neu-pressed text-purple-950 border border-purple-300/60 shadow-[inset_3px_3px_6px_rgba(147,51,234,0.12),inset_-3px_-3px_6px_#ffffff]'
                      : 'text-slate-600 hover:text-purple-950 hover:bg-white/60 neu-card border border-white/80 shadow-[3px_3px_8px_rgba(120,80,180,0.08),-3px_-3px_8px_#ffffff]'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* 3D Neumorphic Logout Button */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-extrabold text-rose-700 hover:text-rose-900 neu-card border border-rose-200/60 shadow-[3px_3px_8px_rgba(225,29,72,0.08),-3px_-3px_8px_#ffffff] hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-72 p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
