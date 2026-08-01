'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/ui/Logo';
import { createClient } from '@/lib/supabase/client';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/products', label: 'Products' },
  {
    href: '/career',
    label: 'Career',
    children: [
      { href: '/career/jobs', label: 'Jobs' },
      { href: '/career/internship', label: 'Internship' },
      { href: '/career/academy', label: 'Academy' },
    ],
  },
  { href: '/community', label: 'Community' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-50 py-3.5 px-4 sm:px-8"
      >
        {/* Soft, Professional Neumorphic + Glassmorphic Floating Rounded Container */}
        <div
          className={`max-w-6xl mx-auto px-6 py-2.5 rounded-2xl transition-all duration-300 flex items-center justify-between backdrop-blur-lg border border-purple-200/40 ${
            scrolled
              ? 'bg-white/90 shadow-[0_10px_32px_rgba(147,51,234,0.12),-6px_-6px_20px_#ffffff]'
              : 'bg-white/80 shadow-[0_6px_24px_rgba(147,51,234,0.08),-6px_-6px_20px_#ffffff]'
          }`}
        >
          {/* Brand Logo */}
          <Logo size="md" />

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
                      isActive(link.href)
                        ? 'text-purple-950 bg-purple-100/70 shadow-[inset_1.5px_1.5px_4px_rgba(147,51,234,0.12),inset_-1.5px_-1.5px_4px_#ffffff] border border-purple-200/50'
                        : 'text-slate-700 hover:text-purple-950 hover:bg-purple-50/50'
                    }`}
                  >
                    <span>{link.label}</span>
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-purple-700' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2.5 w-48 rounded-2xl bg-white/95 backdrop-blur-lg border border-purple-200/50 p-2 shadow-[0_10px_28px_rgba(147,51,234,0.12),-6px_-6px_20px_#ffffff]"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                              isActive(child.href)
                                ? 'text-purple-950 bg-purple-100/80 font-extrabold'
                                : 'text-slate-700 hover:text-purple-950 hover:bg-purple-50/60'
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    isActive(link.href)
                      ? 'text-purple-950 bg-purple-100/70 shadow-[inset_1.5px_1.5px_4px_rgba(147,51,234,0.12),inset_-1.5px_-1.5px_4px_#ffffff] border border-purple-200/50'
                      : 'text-slate-700 hover:text-purple-950 hover:bg-purple-50/50'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Auth Aware Action Buttons */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex py-2 px-4 rounded-xl neu-card text-purple-950 font-extrabold text-xs border border-purple-300/50 hover:scale-[1.02] transition-all"
                >
                  Dashboard ⚡
                </Link>
                <button
                  onClick={handleSignOut}
                  className="py-2 px-3 rounded-xl neu-card text-rose-700 font-bold text-xs border border-rose-200/60 hover:text-rose-950 transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 hover:text-purple-950 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup?redirect=/onboarding"
                  className="hidden sm:inline-flex py-2.5 px-5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-[3px_3px_12px_rgba(0,0,0,0.25),-3px_-3px_12px_#ffffff] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Join Community
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl neu-convex border border-purple-200/50 text-slate-800"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <motion.span
                  animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                  className="block h-0.5 w-5 bg-slate-900 rounded-full origin-left"
                />
                <motion.span
                  animate={mobileOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                  className="block h-0.5 w-5 bg-slate-900 rounded-full"
                />
                <motion.span
                  animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                  className="block h-0.5 w-5 bg-slate-900 rounded-full origin-left"
                />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* 3D Neumorphic Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/45 backdrop-blur-md z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.22 }}
              className="fixed inset-y-0 right-0 w-80 max-w-[85vw] z-50 bg-[#eef0f8] shadow-[-12px_0_36px_rgba(120,80,180,0.22)] border-l border-white/80 p-5 lg:hidden flex flex-col"
            >
              {/* 3D Neumorphic Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-purple-200/40 mb-3 shrink-0">
                <div className="neu-convex p-1.5 rounded-2xl border border-white/80 shadow-sm">
                  <Logo size="sm" />
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 neu-convex rounded-2xl flex items-center justify-center border border-purple-200/60 shadow-[3px_3px_8px_rgba(120,80,180,0.15),-3px_-3px_8px_#ffffff] text-slate-800 font-extrabold hover:text-purple-700 active:scale-95 transition-all"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Links Section */}
              <div className="flex-1 overflow-y-auto py-2 space-y-3 pr-1 select-none scrollbar-thin">
                {/* 3D Neumorphic Navigation Links List */}
                <div className="flex flex-col gap-3">
                  {navLinks.map((link) =>
                    link.children ? (
                      <div key={link.href} className="neu-card p-3 rounded-2xl border border-white/80 shadow-[5px_5px_14px_rgba(120,80,180,0.12),-5px_-5px_14px_#ffffff]">
                        <p className="px-3 py-1.5 text-purple-700 text-xs font-black uppercase tracking-wider flex items-center justify-between">
                          <span>{link.label}</span>
                          <span className="badge badge-primary text-[10px] py-0.5 px-2">3 Opportunities</span>
                        </p>
                        <div className="mt-1 space-y-1.5">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`block px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                                isActive(child.href)
                                  ? 'neu-pressed text-purple-950 border border-purple-300/60 shadow-[inset_3px_3px_6px_rgba(147,51,234,0.15),inset_-3px_-3px_6px_#ffffff]'
                                  : 'text-slate-700 hover:text-purple-900 hover:bg-white/60'
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`block px-4 py-3 rounded-2xl text-xs font-extrabold transition-all ${
                          isActive(link.href)
                            ? 'neu-pressed text-purple-950 border border-purple-300/60 shadow-[inset_3px_3px_8px_rgba(147,51,234,0.18),inset_-3px_-3px_8px_#ffffff]'
                            : 'neu-card text-slate-700 hover:text-purple-950 border border-white/80 shadow-[4px_4px_10px_rgba(120,80,180,0.1),-4px_-4px_10px_#ffffff]'
                        }`}
                      >
                        {link.label}
                      </Link>
                    )
                  )}
                </div>
              </div>

              {/* 3D Neumorphic Drawer Footer Action Buttons */}
              <div className="pt-4 border-t border-purple-200/40 mt-auto space-y-2.5 shrink-0">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="w-full py-3 rounded-2xl neu-convex text-purple-950 font-bold text-xs text-center block border border-purple-200/60 shadow-[4px_4px_12px_rgba(120,80,180,0.12),-4px_-4px_12px_#ffffff]"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full py-3 rounded-2xl neu-card text-rose-700 font-bold text-xs text-center block border border-rose-200/60 shadow-[3px_3px_8px_rgba(225,29,72,0.08),-3px_-3px_8px_#ffffff]"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signup?redirect=/onboarding"
                      className="w-full py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs text-center block shadow-[4px_4px_14_rgba(0,0,0,0.35),-4px_-4px_14px_#ffffff] transition-all"
                    >
                      Join Community Hub
                    </Link>
                    <Link
                      href="/login"
                      className="w-full py-3 rounded-2xl neu-convex text-slate-900 font-bold text-xs text-center block border border-purple-200/60 shadow-[4px_4px_12px_rgba(120,80,180,0.12),-4px_-4px_12px_#ffffff]"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
