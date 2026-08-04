'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren, { StaggerItem } from '@/components/animations/StaggerChildren';
import Logo from '@/components/ui/Logo';

// ========================================
// Hero Section (Animated Typography & 3D Neumorphism Upgrade)
// ========================================
// ========================================
// Hero Section (Animated Typography & 3D Neumorphism Upgrade)
// ========================================
function Hero() {
  return (
    <section className="relative pt-32 pb-24 min-h-screen flex items-center overflow-hidden bg-slate-50/30">
      {/* Background Gradients and Glowing Blobs */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      
      {/* Ambient Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] bg-purple-300/25 rounded-full blur-[110px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-300/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[20rem] h-[20rem] bg-pink-200/15 rounded-full blur-[90px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-8">
          
          {/* Left Column - Content */}
          <div className="lg:col-span-6 text-left space-y-6 max-w-2xl mx-auto lg:mx-0">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-purple-200/60 shadow-[4px_4px_10px_rgba(147,51,234,0.04)]"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
              </span>
              <span className="text-[10px] font-black text-purple-700 uppercase tracking-widest">
                The Engineering Hub of the Future
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-slate-950"
            >
              Learn Engineering.
              <span className="block text-purple-600 mt-2 filter drop-shadow-[0_2px_10px_rgba(147,51,234,0.1)]">
                Build Real Solutions.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal"
            >
              An open ecosystem bridging the gap between classroom theory and real-world engineering. 
              Collaborate with fellow student engineers, access verified study vaults, and build industrial-grade projects.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-2"
            >
              <Link
                href="/services"
                className="w-full sm:w-auto py-4 px-8 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 shadow-[5px_5px_12px_rgba(0,0,0,0.25),-5px_-5px_12px_#ffffff] hover:scale-[1.02] active:scale-[0.98] transition-all group"
              >
                <span>Explore Services</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <Link
                href="/products"
                className="w-full sm:w-auto py-4 px-8 rounded-xl neu-card text-slate-800 hover:text-purple-950 font-bold text-sm sm:text-base inline-flex items-center justify-center border border-white/85 shadow-[6px_6px_14px_rgba(120,80,180,0.1)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Discover Products</span>
              </Link>
            </motion.div>
          </div>

          {/* Right Column - Community & Project Showcase Console */}
          <div className="lg:col-span-6 relative h-[500px] w-full flex items-center justify-center">
            {/* Glowing background shapes */}
            <div className="absolute w-[360px] h-[360px] rounded-full bg-gradient-to-tr from-purple-100/40 to-indigo-100/30 blur-2xl pointer-events-none" />
            
            {/* Main Interactive Dashboard Console */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -8, 0]
              }}
              transition={{ 
                opacity: { duration: 0.6, delay: 0.1 },
                scale: { duration: 0.6, delay: 0.1 },
                y: { repeat: Infinity, duration: 8, ease: "easeInOut" }
              }}
              className="w-full max-w-[420px] bg-white/80 backdrop-blur-xl border border-white/95 rounded-3xl shadow-[16px_16px_40px_rgba(147,51,234,0.12),-16px_-16px_40px_#ffffff] p-6 space-y-6 z-10"
            >
              {/* Header block */}
              <div className="flex items-center justify-between border-b border-purple-100/50 pb-3">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Engineering Hub Console</h3>
                  <p className="text-[10px] text-text-muted font-normal">Real-time campus network metrics</p>
                </div>
                <span className="badge badge-success text-[10px] px-2.5 py-1">● Network Live</span>
              </div>

              {/* Grid Content */}
              <div className="space-y-4">
                {/* 1. College Chapters metric */}
                <div className="neu-pressed p-4 rounded-2xl border border-purple-200/20 bg-white/40 flex items-center justify-between shadow-[inset_2px_2px_6px_rgba(147,51,234,0.06),inset_-2px_-2px_6px_#ffffff]">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Campus Chapters</p>
                    <p className="text-xl font-black text-slate-950">12 Active Hubs</p>
                  </div>
                  {/* Avatar stack */}
                  <div className="flex -space-x-2 overflow-hidden">
                    <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-purple-100 flex items-center justify-center text-[10px] font-black text-purple-700">A</div>
                    <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-700">P</div>
                    <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-pink-100 flex items-center justify-center text-[10px] font-black text-pink-700">K</div>
                    <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-600">+8</div>
                  </div>
                </div>

                {/* 2. Featured Projects list */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Featured Campus Projects</p>
                  
                  {/* Project Item 1 */}
                  <div className="neu-card p-3.5 flex items-center justify-between border border-purple-100/40 hover:scale-[1.01] transition-transform duration-300 bg-white/65">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 neu-convex rounded-xl flex items-center justify-center text-purple-600 font-bold text-base border border-white shrink-0">
                        🌱
                      </div>
                      <div>
                        <p className="font-extrabold text-xs text-slate-900">Soil Health Monitor</p>
                        <p className="text-[10px] text-text-muted">A.D.P. College Chapter</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Active</span>
                  </div>

                  {/* Project Item 2 */}
                  <div className="neu-card p-3.5 flex items-center justify-between border border-purple-100/40 hover:scale-[1.01] transition-transform duration-300 bg-white/65">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 neu-convex rounded-xl flex items-center justify-center text-indigo-600 font-bold text-base border border-white shrink-0">
                        🚗
                      </div>
                      <div>
                        <p className="font-extrabold text-xs text-slate-900">IoT Crash Detector</p>
                        <p className="text-[10px] text-text-muted">Nagaon College Chapter</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">Ongoing</span>
                  </div>
                </div>

                {/* 3. Global Stats */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="neu-card p-3 text-center border border-purple-100/30 bg-white/65">
                    <p className="text-lg font-black text-purple-700">500+</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Members</p>
                  </div>
                  <div className="neu-card p-3 text-center border border-purple-100/30 bg-white/65">
                    <p className="text-lg font-black text-indigo-600">15+</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Projects Shared</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

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
