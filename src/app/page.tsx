'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren, { StaggerItem } from '@/components/animations/StaggerChildren';
import Logo from '@/components/ui/Logo';

// ========================================
// Hero Section (Animated Typography & 3D Neumorphism Upgrade)
// ========================================
function Hero() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section className="relative pt-36 pb-20 min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Neumorphic Ambient Orbs */}
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
      
      <motion.div
        animate={{ y: [0, -18, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/6 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 18, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Live Network Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full neu-convex text-xs font-extrabold text-slate-800 mb-8 border border-purple-200/60 shadow-[4px_4px_12px_rgba(147,51,234,0.12),-4px_-4px_12px_#ffffff]">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-600" />
              </span>
              <span>Open Engineering Platform</span>
              <span className="bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full text-[11px] font-black border border-purple-200/80">
                50+ Hubs Live
              </span>
            </div>
          </motion.div>

          {/* Unified Single-Color Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 max-w-4xl mx-auto text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.12] text-slate-950"
          >
            <span className="block mb-1">
              Learn Engineering.
            </span>
            <span className="block text-slate-950">
              Build Real Solutions.
            </span>
          </motion.h1>

          {/* Clean, Fluid Subtitle for Mobile & Desktop */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl mx-auto mb-10 text-slate-700 text-sm sm:text-base leading-relaxed font-normal px-2"
          >
            An open ecosystem bridging the gap between classroom theory and real-world engineering. 
            Collaborate with fellow student engineers, access verified study vaults, and build industrial-grade projects.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 sm:mb-14"
          >
            <Link
              href="/community/join"
              className="w-full sm:w-auto py-4 px-8 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 shadow-[4px_4px_14px_rgba(0,0,0,0.35),-4px_-4px_14px_#ffffff] hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              <span>Explore College Hubs</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href="/products"
              className="w-full sm:w-auto py-4 px-8 rounded-xl neu-card text-slate-800 hover:text-purple-900 font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 border border-purple-300/40 shadow-[4px_4px_14px_rgba(147,51,234,0.12),-4px_-4px_14px_#ffffff] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Discover Our Products</span>
            </Link>
          </motion.div>

          {/* Clean 3D Neumorphic College Search Feature Section */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="neu-card p-5 sm:p-7 max-w-2xl mx-auto text-left border border-purple-300/40 shadow-[12px_12px_28px_rgba(147,51,234,0.14),-12px_-12px_28px_#ffffff]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 neu-convex rounded-2xl flex items-center justify-center border border-purple-300/40 text-purple-700 font-black shrink-0 shadow-sm">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0v-4m0 4h4m-4-4l4 4" />
                </svg>
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-950">Search College Engineering Hubs</h3>
                <p className="text-text-muted text-xs font-normal">
                  Find your college engineering hub or launch a new community for your campus.
                </p>
              </div>
            </div>

            {/* Mobile-Adaptive Search Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery) {
                  window.location.href = `/community?search=${encodeURIComponent(searchQuery)}`;
                }
              }}
              className="flex flex-col sm:relative mb-4 sm:mb-5 gap-3 sm:gap-0"
            >
              <div className="relative flex-1">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="College name, e.g. IIT, NIT, MIT..."
                  className="neu-input !pl-11 pr-4 sm:pr-40 py-3.5 sm:py-4 text-xs sm:text-sm rounded-xl w-full border border-purple-200/60 outline-none text-slate-900"
                />
              </div>
              <button
                type="submit"
                className="py-3 sm:py-2.5 px-5 rounded-xl sm:rounded-lg bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2 transition-all shadow-md w-full sm:w-auto text-center"
              >
                Find Hub →
              </button>
            </form>

            {/* Quick College Filter Shortcuts */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-bold text-slate-600 mr-1">Popular:</span>
              {['IIT Guwahati', 'NIT Trichy', 'BITS Pilani', 'VSSUT', 'Kiit University'].map((college) => (
                <Link
                  key={college}
                  href={`/community?search=${encodeURIComponent(college)}`}
                  className="neu-flat px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-950 hover:bg-purple-100/80 border border-purple-200/60 transition-all"
                >
                  {college}
                </Link>
              ))}
            </div>
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
              { icon: '💬', label: 'Discussion Feed', desc: 'Share ideas & technical posts' },
              { icon: '📢', label: 'Announcements', desc: 'Stay updated on college events' },
              { icon: '👥', label: 'Member Directory', desc: 'Connect directly with peers' },
            ].map((feature) => (
              <div key={feature.label} className="neu-card p-6">
                <span className="text-3xl mb-3 block">{feature.icon}</span>
                <p className="font-bold text-sm mb-1 text-text">{feature.label}</p>
                <p className="text-text-muted text-xs">{feature.desc}</p>
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
              <Link href="/career/jobs" className="btn btn-outline btn-sm">Jobs</Link>
              <Link href="/career/internship" className="btn btn-outline btn-sm">Internship</Link>
              <Link href="/career/academy" className="btn btn-ghost btn-sm">Academy →</Link>
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
                  <Link href="/career/jobs" className="btn btn-ghost btn-sm">
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
