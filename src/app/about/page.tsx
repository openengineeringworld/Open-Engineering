'use client';

import type { Metadata } from 'next';
import Link from 'next/link';
import { motion } from 'framer-motion';
import FadeIn from '@/components/animations/FadeIn';

const stats = [
  { label: 'College Chapters', value: '50+', icon: '🏛️' },
  { label: 'Student Engineers', value: '1,000+', icon: '👥' },
  { label: 'Active R&D Projects', value: '15+', icon: '🚀' },
  { label: 'Real Solutions Built', value: '100%', icon: '⚡' },
];

const values = [
  {
    title: 'Practical Learning',
    desc: 'We believe engineering is best learned by doing. Every concept taught in our community translates directly into a working project.',
    icon: (
      <svg className="w-9 h-9 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="10" width="32" height="10" rx="3" className="fill-purple-100 stroke-purple-600" strokeWidth="2.5" />
        <rect x="8" y="28" width="32" height="10" rx="3" className="fill-indigo-100 stroke-indigo-600" strokeWidth="2.5" />
        <path d="M16 15H32" className="stroke-purple-600" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 33H28" className="stroke-indigo-600" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Community First',
    desc: 'Engineering is a team discipline. We connect students across engineering colleges to collaborate, share knowledge, and innovate.',
    icon: (
      <svg className="w-9 h-9 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="16" r="6" className="fill-purple-100 stroke-purple-600" strokeWidth="2.5" />
        <path d="M12 36C12 29.3726 17.3726 24 24 24C30.6274 24 36 29.3726 36 36" className="stroke-purple-600" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="36" cy="18" r="4" className="fill-indigo-100 stroke-indigo-600" strokeWidth="2" />
        <circle cx="12" cy="18" r="4" className="fill-indigo-100 stroke-indigo-600" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: 'Innovation Driven',
    desc: 'We empower students to step outside textbook boundaries and build hardware, software, and clean-tech solutions for industry challenges.',
    icon: (
      <svg className="w-9 h-9 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
        <path d="M24 6C14.06 6 6 14.06 6 24C6 33.94 14.06 42 24 42C26.5 42 28.5 40 28.5 37.5C28.5 36.3 28 35.2 27.2 34.4C26.4 33.6 26 32.5 26 31.5C26 29.3 27.8 27.5 30 27.5H34C38.4 27.5 42 23.9 42 19.5C42 12 34 6 24 6Z" className="fill-purple-50 stroke-purple-600" strokeWidth="2.5" />
        <circle cx="14" cy="18" r="3" className="fill-purple-600" />
        <circle cx="24" cy="14" r="3" className="fill-indigo-600" />
        <circle cx="34" cy="18" r="3" className="fill-purple-400" />
      </svg>
    ),
  },
  {
    title: 'Inclusive Access',
    desc: 'High-quality engineering mentorship, tools, and project opportunities belong to every aspiring engineer, regardless of tier or background.',
    icon: (
      <svg className="w-9 h-9 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="18" className="fill-indigo-50 stroke-indigo-600" strokeWidth="2.5" />
        <ellipse cx="24" cy="24" rx="8" ry="18" className="stroke-indigo-600" strokeWidth="2" />
        <line x1="6" y1="24" x2="42" y2="24" className="stroke-purple-600" strokeWidth="2" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section pt-36 pb-16">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <span className="badge badge-primary mb-4">About Open Engineering</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
              Learn Engineering. <span className="gradient-text">Build Real Solutions.</span>
            </h1>
            <p className="text-text-muted text-lg leading-relaxed font-normal">
              Open Engineering is an open platform designed to bridge the gap between college engineering 
              academics and real-world industrial execution.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Impact Statistics Counter Row */}
      <section className="section-sm pb-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="neu-card p-6 text-center border border-purple-300/40 shadow-[6px_6px_16px_rgba(147,51,234,0.12),-6px_-6px_16px_#ffffff]"
              >
                <div className="text-3xl sm:text-4xl font-extrabold gradient-text mb-2">
                  {stat.value}
                </div>
                <p className="text-text-muted text-xs sm:text-sm font-semibold">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Showcase */}
      <section className="section-sm pb-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn>
              <div className="neu-card p-8 sm:p-10 h-full border border-purple-300/40 shadow-[8px_8px_20px_rgba(147,51,234,0.12),-8px_-8px_20px_#ffffff] group">
                <div className="w-16 h-16 rounded-2xl neu-convex flex items-center justify-center border border-purple-300/40 shadow-[5px_5px_14px_rgba(147,51,234,0.18),-5px_-5px_14px_#ffffff] mb-6">
                  <svg className="w-9 h-9 transition-transform group-hover:scale-110" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="18" className="fill-purple-100 stroke-purple-600" strokeWidth="2.5" />
                    <circle cx="24" cy="24" r="12" className="fill-indigo-100 stroke-purple-600" strokeWidth="2" />
                    <circle cx="24" cy="24" r="5" className="fill-purple-600" />
                  </svg>
                </div>
                <h2 className="text-2xl font-extrabold mb-4 text-text">Our Mission</h2>
                <p className="text-text-muted text-sm sm:text-base leading-relaxed font-normal">
                  To empower engineering students with practical knowledge, tools, and a collaborative 
                  community that bridges the gap between classroom theory and production engineering. 
                  We make engineering education hands-on, accessible, and impactful across India.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="neu-card p-8 sm:p-10 h-full border border-purple-300/40 shadow-[8px_8px_20px_rgba(147,51,234,0.12),-8px_-8px_20px_#ffffff] group">
                <div className="w-16 h-16 rounded-2xl neu-convex flex items-center justify-center border border-purple-300/40 shadow-[5px_5px_14px_rgba(147,51,234,0.18),-5px_-5px_14px_#ffffff] mb-6">
                  <svg className="w-9 h-9 transition-transform group-hover:scale-110" viewBox="0 0 48 48" fill="none">
                    <path d="M24 4C24 4 34 12 34 26C34 32 30 36 24 38C18 36 14 32 14 26C14 12 24 4 24 4Z" className="fill-purple-100 stroke-purple-600" strokeWidth="2.5" strokeLinejoin="round" />
                    <circle cx="24" cy="18" r="4" className="fill-purple-600" />
                    <path d="M14 26L6 30V36L14 34" className="fill-indigo-100 stroke-indigo-600" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M34 26L42 30V36L34 34" className="fill-indigo-100 stroke-indigo-600" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="text-2xl font-extrabold mb-4 text-text">Our Vision</h2>
                <p className="text-text-muted text-sm sm:text-base leading-relaxed font-normal">
                  To establish Open Engineering as the primary innovation ecosystem where every student engineer 
                  can build real products (Agri-Tech, IoT, Clean Tech Engines, AI), collaborate across colleges, 
                  and scale their career potential.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="section-sm pb-24">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <span className="badge badge-primary mb-4">Our Principles</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Core Pillars of <span className="gradient-text">Open Engineering</span>
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto text-sm sm:text-base">
              The fundamental values that guide our platform, products, and community.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((val, index) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="neu-card p-8 h-full flex items-start gap-6 group border border-purple-300/40 shadow-[6px_6px_16px_rgba(147,51,234,0.12),-6px_-6px_16px_#ffffff]"
              >
                <div className="w-16 h-16 rounded-2xl neu-convex flex items-center justify-center border border-purple-300/40 shadow-[5px_5px_14px_rgba(147,51,234,0.18),-5px_-5px_14px_#ffffff] shrink-0 p-2.5">
                  {val.icon}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold mb-2 text-text group-hover:text-primary transition-colors">
                    {val.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed font-normal">
                    {val.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-sm pb-24">
        <div className="container mx-auto px-6 text-center">
          <FadeIn>
            <div className="neu-card p-10 sm:p-14 max-w-3xl mx-auto border border-purple-300/40 shadow-[10px_10px_24px_rgba(147,51,234,0.15),-10px_-10px_24px_#ffffff]">
              <h2 className="text-3xl font-extrabold mb-4 text-text">Ready to Learn & Build?</h2>
              <p className="text-text-muted text-base leading-relaxed mb-8 max-w-lg mx-auto">
                Join student engineers across colleges in India who learn, collaborate, and build real solutions together.
              </p>
              <Link
                href="/community/join"
                className="py-4 px-8 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 shadow-[4px_4px_14px_rgba(0,0,0,0.35),-4px_-4px_14px_#ffffff] hover:shadow-[6px_6px_18px_rgba(0,0,0,0.5),-6px_-6px_18px_#ffffff] hover:scale-[1.02] active:scale-[0.98] transition-all group/btn"
              >
                <span>Join Community Now</span>
                <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
