'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren, { StaggerItem } from '@/components/animations/StaggerChildren';
import Logo from '@/components/ui/Logo';
import HeroNotificationBadge from '@/components/ui/HeroNotificationBadge';

// ========================================
// Hero Section (Animated Typography & 3D Neumorphism Upgrade)
// ========================================
// ========================================
// Hero Section (Animated Typography & 3D Neumorphism Upgrade)
// ========================================
function Hero() {
  // Honeycomb hex positions — 4 rows of staggered hexagons
  const hexagons = [
    // Row 1
    { x: 0, y: 0, delay: 0, icon: 'code' },
    { x: 1, y: 0, delay: 0.1, icon: 'cpu' },
    { x: 2, y: 0, delay: 0.2, icon: 'globe' },
    { x: 3, y: 0, delay: 0.15, icon: 'shield' },
    { x: 4, y: 0, delay: 0.25, icon: 'zap' },
    // Row 2 (offset)
    { x: 0.5, y: 1, delay: 0.3, icon: 'book' },
    { x: 1.5, y: 1, delay: 0.05, icon: 'rocket' },
    { x: 2.5, y: 1, delay: 0.35, icon: 'heart' },
    { x: 3.5, y: 1, delay: 0.2, icon: 'star' },
    // Row 3
    { x: 0, y: 2, delay: 0.4, icon: 'layers' },
    { x: 1, y: 2, delay: 0.12, icon: 'terminal' },
    { x: 2, y: 2, delay: 0.28, icon: 'database' },
    { x: 3, y: 2, delay: 0.18, icon: 'wifi' },
    { x: 4, y: 2, delay: 0.08, icon: 'settings' },
    // Row 4 (offset)
    { x: 0.5, y: 3, delay: 0.22, icon: 'cloud' },
    { x: 1.5, y: 3, delay: 0.38, icon: 'chip' },
    { x: 2.5, y: 3, delay: 0.1, icon: 'bulb' },
    { x: 3.5, y: 3, delay: 0.32, icon: 'tool' },
  ];

  const hexIcons: Record<string, ReactNode> = {
    code: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
    cpu: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />,
    globe: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />,
    shield: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    zap: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />,
    book: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
    rocket: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />,
    heart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
    star: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
    layers: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />,
    terminal: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    database: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />,
    wifi: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />,
    settings: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>,
    cloud: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />,
    chip: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />,
    bulb: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
    tool: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17l-5.02 5.02a2.121 2.121 0 01-3-3l5.02-5.02m3-3l6.72-6.72a2.121 2.121 0 013 3L14.42 12.17m-3 3L8.59 12.34" />,
  };

  const hexSize = 90; // px
  const hexGapX = hexSize * 1.05;
  const hexGapY = hexSize * 0.92;

  return (
    <section className="relative pt-32 pb-24 min-h-screen flex items-center overflow-hidden bg-slate-50/30">
      {/* Background Gradients and Glowing Blobs */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      
      {/* Ambient Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] bg-purple-300/25 rounded-full blur-[110px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-300/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[20rem] h-[20rem] bg-pink-200/15 rounded-full blur-[90px] pointer-events-none" />

      {/* Honeycomb Grid Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="relative" style={{ width: hexGapX * 5 + hexSize, height: hexGapY * 4 + hexSize }}>
          {hexagons.map((hex, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
              animate={{ 
                opacity: [0.08, 0.18, 0.08],
                scale: [0.95, 1.05, 0.95],
                rotate: 0
              }}
              transition={{
                opacity: { repeat: Infinity, duration: 4 + hex.delay * 3, ease: 'easeInOut', delay: hex.delay * 2 },
                scale: { repeat: Infinity, duration: 5 + hex.delay * 2, ease: 'easeInOut', delay: hex.delay * 2 },
                rotate: { duration: 0.8, delay: hex.delay * 2 }
              }}
              className="absolute"
              style={{
                left: hex.x * hexGapX,
                top: hex.y * hexGapY,
                width: hexSize,
                height: hexSize,
              }}
            >
              <div className="w-full h-full relative">
                {/* Hexagon Shape via CSS clip-path */}
                <div
                  className="w-full h-full bg-gradient-to-br from-purple-300/20 via-indigo-200/15 to-purple-400/10 backdrop-blur-[2px] border border-purple-300/15 flex items-center justify-center"
                  style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                >
                  <svg className="w-6 h-6 text-purple-500/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {hexIcons[hex.icon]}
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8 pt-8">
          
          {/* One-Line Notification Cum Clickable Button */}
          <HeroNotificationBadge />

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.08] text-slate-950"
          >
            Learn Engineering.
            <span className="block text-transparent bg-clip-text gradient-text-primary mt-2 filter drop-shadow-[0_2px_8px_rgba(126,34,206,0.15)]">
              Build Real Solutions.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl"
          >
            An open ecosystem bridging the gap between classroom theory and real-world engineering. 
            Collaborate with fellow student engineers, access verified study vaults, and build industrial-grade projects.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link
              href="/services"
              className="w-full sm:w-auto py-4 px-10 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 shadow-[5px_5px_12px_rgba(0,0,0,0.25),-5px_-5px_12px_#ffffff] hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              <span>Explore Services</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href="/products"
              className="w-full sm:w-auto py-4 px-10 rounded-xl neu-card text-slate-800 hover:text-purple-950 font-bold text-sm sm:text-base inline-flex items-center justify-center border border-white/85 shadow-[6px_6px_14px_rgba(120,80,180,0.1)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Discover Products</span>
            </Link>
          </motion.div>

          {/* Floating Honeycomb Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-8"
          >
            {[
              { value: '5+', label: 'Products', color: 'text-purple-700' },
              { value: '50+', label: 'Engineers', color: 'text-indigo-700' },
              { value: '10+', label: 'Services', color: 'text-emerald-700' },
              { value: '100%', label: 'Open Source', color: 'text-pink-700' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.08, y: -4 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative group cursor-default"
              >
                <div
                  className="w-24 h-24 sm:w-28 sm:h-28 bg-white/80 backdrop-blur-md border border-purple-200/40 flex flex-col items-center justify-center gap-1 shadow-[4px_4px_12px_rgba(120,80,180,0.1),-4px_-4px_12px_#ffffff] group-hover:shadow-[6px_6px_20px_rgba(120,80,180,0.18),-6px_-6px_20px_#ffffff] transition-all duration-300"
                  style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                >
                  <span className={`text-xl sm:text-2xl font-black ${stat.color}`}>{stat.value}</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}


// ========================================
// About Preview
// ========================================
function AboutPreview() {
  return (
    <section className="section">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn direction="left">
            <div className="space-y-6">
              <span className="badge badge-primary">About Us</span>
              <h2 className="text-3xl sm:text-4xl font-bold">
                Building the Future of{' '}
                <span className="gradient-text">Engineering Education</span>
              </h2>
              <p className="text-text-muted leading-relaxed">
                Open Engineering is an engineering-focused platform designed to help students 
                learn engineering concepts and apply them to real-world challenges. We bridge 
                the gap between theory and practice.
              </p>
              <p className="text-text-muted leading-relaxed">
                Our community-driven approach connects students across colleges, enabling 
                collaboration, knowledge sharing, and growth.
              </p>
              <Link href="/about" className="btn btn-outline">
                Learn More
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </FadeIn>
          <FadeIn direction="right">
            <div className="grid grid-cols-2 gap-5">
              {[
                { number: '500+', label: 'Students Active' },
                { number: '50+', label: 'Colleges Onboard' },
                { number: '10+', label: 'Core Services' },
                { number: '100%', label: 'Practical Focus' },
              ].map((stat) => (
                <div key={stat.label} className="neu-card p-6 text-center">
                  <p className="text-3xl font-extrabold gradient-text mb-1">{stat.number}</p>
                  <p className="text-text-muted text-xs font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ========================================
// Services Preview
// ========================================
const services = [
  {
    title: 'Full-Stack Web Development',
    category: 'Web Engineering',
    desc: 'Modern, ultra-responsive web applications built with Next.js 16 and cutting-edge scalable frontend & backend tech.',
    tag: 'Next.js 16 & React',
    icon: (
      <svg className="w-9 h-9 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
        <rect x="4" y="8" width="40" height="32" rx="6" className="fill-purple-100 stroke-purple-600" strokeWidth="2.5" />
        <path d="M4 16H44" className="stroke-purple-600" strokeWidth="2" strokeLinecap="round" />
        <circle cx="10" cy="12" r="1.5" className="fill-purple-600" />
        <circle cx="15" cy="12" r="1.5" className="fill-indigo-500" />
        <circle cx="20" cy="12" r="1.5" className="fill-purple-400" />
        <path d="M14 24L10 28L14 32" className="stroke-purple-700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 24L26 28L22 32" className="stroke-purple-700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 23L17 33" className="stroke-indigo-600" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="29" y="22" width="11" height="12" rx="2" className="fill-purple-200 stroke-purple-600" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: 'Mobile App Development',
    category: 'Mobile Engineering',
    desc: 'Native and cross-platform mobile apps for iOS & Android built for performance and flawless user experience.',
    tag: 'iOS & Android',
    icon: (
      <svg className="w-9 h-9 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
        <rect x="12" y="4" width="24" height="40" rx="6" className="fill-indigo-50 stroke-indigo-600" strokeWidth="2.5" />
        <path d="M20 8H28" className="stroke-indigo-600" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="38" r="2" className="fill-purple-600" />
        <rect x="16" y="12" width="16" height="20" rx="3" className="fill-purple-100 stroke-indigo-500" strokeWidth="1.8" />
        <path d="M19 16H29" className="stroke-purple-600" strokeWidth="2" strokeLinecap="round" />
        <path d="M19 20H25" className="stroke-indigo-600" strokeWidth="2" strokeLinecap="round" />
        <path d="M19 26L22 28L29 22" className="stroke-purple-700" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Startup MVP & Tech Acceleration',
    category: 'Venture Tech',
    desc: 'End-to-end technical execution, MVP rapid engineering, cloud architecture, and market launch strategy.',
    tag: 'MVP Accelerator',
    icon: (
      <svg className="w-9 h-9 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
        <path d="M24 4C24 4 34 12 34 26C34 32 30 36 24 38C18 36 14 32 14 26C14 12 24 4 24 4Z" className="fill-purple-100 stroke-purple-600" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="24" cy="18" r="4" className="fill-purple-600" />
        <path d="M14 26L6 30V36L14 34" className="fill-indigo-100 stroke-indigo-600" strokeWidth="2" strokeLinejoin="round" />
        <path d="M34 26L42 30V36L34 34" className="fill-indigo-100 stroke-indigo-600" strokeWidth="2" strokeLinejoin="round" />
        <path d="M20 38L24 46L28 38" className="fill-purple-600 stroke-purple-700" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: '3D Branding & Visual Identity',
    category: 'Design Systems',
    desc: 'Compelling 3D design systems, logo architecture, and visual brand identities that make lasting market impact.',
    tag: '3D Neumorphism',
    icon: (
      <svg className="w-9 h-9 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
        <path d="M24 6C14.06 6 6 14.06 6 24C6 33.94 14.06 42 24 42C26.5 42 28.5 40 28.5 37.5C28.5 36.3 28 35.2 27.2 34.4C26.4 33.6 26 32.5 26 31.5C26 29.3 27.8 27.5 30 27.5H34C38.4 27.5 42 23.9 42 19.5C42 12 34 6 24 6Z" className="fill-purple-50 stroke-purple-600" strokeWidth="2.5" />
        <circle cx="14" cy="18" r="3" className="fill-purple-600" />
        <circle cx="24" cy="14" r="3" className="fill-indigo-600" />
        <circle cx="34" cy="18" r="3" className="fill-purple-400" />
        <circle cx="14" cy="28" r="3" className="fill-indigo-400" />
      </svg>
    ),
  },
  {
    title: 'Growth Marketing & SEO Engine',
    category: 'Digital Traction',
    desc: 'Data-driven digital marketing strategies, technical SEO engineering, and conversion funnel optimization.',
    tag: 'Analytics & Growth',
    icon: (
      <svg className="w-9 h-9 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
        <path d="M6 42H42" className="stroke-slate-400" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="10" y="26" width="6" height="16" rx="2" className="fill-purple-200 stroke-purple-600" strokeWidth="2" />
        <rect x="21" y="18" width="6" height="24" rx="2" className="fill-indigo-200 stroke-indigo-600" strokeWidth="2" />
        <rect x="32" y="10" width="6" height="32" rx="2" className="fill-purple-600 stroke-purple-800" strokeWidth="2" />
        <path d="M8 22L19 14L28 18L40 6" className="stroke-purple-600" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M32 6H40V14" className="stroke-purple-600" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function ServicesPreview() {
  return (
    <section className="section">
      <div className="container mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <span className="badge badge-primary mb-4">Our Services</span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Engineering Solutions <span className="gradient-text">That Deliver</span>
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto text-sm sm:text-base">
            From full-stack web and mobile development to 3D branding and growth marketing.
          </p>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <StaggerItem key={service.title}>
              <motion.div
                whileHover={{ y: -6 }}
                className="neu-card p-7 h-full flex flex-col justify-between group border border-purple-300/30 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="w-16 h-16 rounded-2xl neu-convex flex items-center justify-center border border-purple-300/40 shadow-[5px_5px_14px_rgba(147,51,234,0.18),-5px_-5px_14px_#ffffff] shrink-0 p-2.5">
                      {service.icon}
                    </div>
                    <span className="badge badge-primary text-[11px] font-bold">
                      {service.tag}
                    </span>
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                    {service.category}
                  </p>
                  <h3 className="text-xl font-extrabold mb-3 text-text group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed font-normal">
                    {service.desc}
                  </p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <FadeIn className="text-center mt-12">
          <Link href="/services" className="btn btn-outline">
            View All Services & Features →
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

// ========================================
// Products Preview
// ========================================
function ProductsPreview() {
  const featuredProducts = [
    {
      title: 'BhumiCare',
      category: 'Agri-Tech Soil AI',
      desc: 'Real-time, affordable soil health assessment & crop decision platform for farmers across India using sensors and AI/ML analysis.',
      status: 'live' as const,
      link: 'https://bhumicare.vercel.app',
      image: '/images/products/bhumicare.png',
    },
    {
      title: 'Acc2Not',
      category: 'IoT Vehicle Safety',
      desc: 'Vehicle IoT accident detection system that senses motion & impact, automatically dispatching GPS alerts to emergency responders.',
      status: 'ongoing' as const,
      link: 'https://acc2not.vercel.app',
      image: '/images/products/acc2not.png',
    },
    {
      title: 'Smart Home Automation',
      category: 'IoT Hardware & Buildings',
      desc: 'Intelligent hardware modules and IoT devices for complete home automation, appliance control, and energy optimization.',
      status: 'ongoing' as const,
      link: null,
      image: '/images/products/home-automation.png',
    },
    {
      title: 'Next Gen Smart Vehicle Engine',
      category: 'Clean Tech Powertrains',
      desc: 'Engineering next-generation eco-friendly powertrains — Electric, 100% Ethanol engines, and Hydrogen combustion technology.',
      status: 'ongoing' as const,
      link: null,
      image: '/images/products/smart-engine.png',
    },
  ];

  return (
    <section className="section">
      <div className="container mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <span className="badge badge-primary mb-4">Our Products</span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Innovative Engineering <span className="gradient-text">Solutions</span>
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto text-sm sm:text-base">
            From agri-tech soil monitoring to IoT vehicle safety systems and clean tech engines.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <FadeIn key={prod.title}>
              <div className="neu-card p-5 h-full flex flex-col justify-between group overflow-hidden">
                <div>
                  {/* 3D Neumorphic Image Container */}
                  <div className="neu-pressed overflow-hidden rounded-xl h-44 mb-4 relative border border-purple-300/40 shadow-[inset_3px_3px_8px_rgba(147,51,234,0.12),inset_-3px_-3px_8px_#ffffff]">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 z-10">
                      {prod.status === 'live' ? (
                        <span className="badge badge-success text-[10px] shadow-sm">● Live</span>
                      ) : (
                        <span className="badge badge-warning text-[10px] shadow-sm">⚡ Ongoing</span>
                      )}
                    </div>
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                    {prod.category}
                  </p>
                  <h3 className="text-base font-bold mb-2 text-text">{prod.title}</h3>
                  <p className="text-text-muted text-xs leading-relaxed mb-4 font-normal line-clamp-3">
                    {prod.desc}
                  </p>
                </div>
                {prod.link ? (
                  <a
                    href={prod.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm w-full text-xs font-bold justify-center"
                  >
                    Visit Website ↗
                  </a>
                ) : (
                  <Link href="/products" className="btn btn-secondary btn-sm w-full text-xs font-semibold justify-center">
                    Learn Details →
                  </Link>
                )}
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="text-center mt-12">
          <Link href="/products" className="btn btn-outline">
            View Full Product Catalog →
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

// ========================================
// Community Preview
// ========================================
function CommunityPreview() {
  return (
    <section className="section relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <FadeIn className="text-center max-w-3xl mx-auto">
          <span className="badge badge-primary mb-4">Community</span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Join Your College{' '}
            <span className="gradient-text">Community</span>
          </h2>
          <p className="text-text-muted text-lg leading-relaxed mb-10">
            Connect with fellow engineers from your college. Share knowledge, 
            collaborate on projects, and grow together. Every college has its own 
            dedicated community space.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 text-left">
            {[
              {
                icon: (
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
                label: 'Discussion Feed',
                desc: 'Share ideas & technical posts'
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                ),
                label: 'Announcements',
                desc: 'Stay updated on college events'
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                label: 'Member Directory',
                desc: 'Connect directly with peers'
              },
            ].map((feature) => (
              <div key={feature.label} className="neu-card p-6 flex flex-col items-start">
                <div className="w-12 h-12 neu-convex rounded-2xl flex items-center justify-center border border-purple-300/40 shadow-sm mb-4 p-2.5">
                  {feature.icon}
                </div>
                <p className="font-bold text-sm mb-1 text-text">{feature.label}</p>
                <p className="text-text-muted text-xs leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          <Link href="/community" className="btn btn-primary btn-lg">
            Explore Communities
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

// ========================================
// Career Preview
// ========================================
function CareerPreview() {
  return (
    <section className="section">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <span className="badge badge-primary mb-4">Careers</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Grow With <span className="gradient-text">Us</span>
            </h2>
            <p className="text-text-muted leading-relaxed mb-6">
              Join our team and work on real-world engineering challenges. 
              We offer jobs, internships, and academy programs.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/jobs" className="btn btn-outline btn-sm">Jobs</Link>
              <Link href="/internship" className="btn btn-outline btn-sm">Internship</Link>
              <Link href="/academy" className="btn btn-ghost btn-sm">Academy →</Link>
            </div>
          </FadeIn>
          <FadeIn direction="right">
            <div className="space-y-4">
              {['Full Stack Developer', 'UI/UX Designer', 'Marketing Intern'].map((role, i) => (
                <div key={role} className="neu-card p-5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-text">{role}</p>
                    <p className="text-text-muted text-sm">{i === 2 ? 'Internship' : 'Full-time'} · Remote</p>
                  </div>
                  <Link href="/jobs" className="btn btn-ghost btn-sm">
                    View →
                  </Link>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ========================================
// Contact Preview
// ========================================
function ContactPreview() {
  return (
    <section className="section">
      <div className="container mx-auto px-6 text-center">
        <FadeIn className="max-w-2xl mx-auto neu-card p-10 sm:p-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to <span className="gradient-text">Get Started?</span>
          </h2>
          <p className="text-text-muted text-lg mb-8">
            Have a question or want to collaborate? We&apos;d love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn btn-primary btn-lg">
              Contact Us
            </Link>
            <a href="mailto:openengineering9@gmail.com" className="btn btn-secondary btn-lg">
              openengineering9@gmail.com
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ========================================
// Home Page Component
// ========================================
export default function Home() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <ServicesPreview />
      <ProductsPreview />
      <CommunityPreview />
      <CareerPreview />
      <ContactPreview />
    </>
  );
}
