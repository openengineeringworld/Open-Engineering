'use client';

import type { Metadata } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import FadeIn from '@/components/animations/FadeIn';

const bootcamps = [
  {
    title: 'Full-Stack Web Engineering Bootcamp',
    duration: '6 Weeks',
    level: 'Beginner to Advanced',
    desc: 'Master Next.js 16, React 19, TypeScript, Supabase, and 3D Neumorphic UI design systems from scratch.',
    icon: (
      <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: 'IoT & Hardware Systems Masterclass',
    duration: '4 Weeks',
    level: 'Intermediate',
    desc: 'Learn embedded systems, microcontrollers, GPS motion sensors, and IoT accident detection hardware.',
    icon: (
      <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'AI & Soil Intelligence (Agri-Tech)',
    duration: '4 Weeks',
    level: 'Intermediate',
    desc: 'Explore AI/ML data processing, sensor data analytics, and regional mobile interface design.',
    icon: (
      <svg className="w-8 h-8 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
      </svg>
    ),
  },
];

export default function AcademyPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <>
      <section className="section pt-36 pb-12">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <FadeIn>
            <Link
              href="/career"
              className="neu-flat px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-primary transition-colors inline-flex items-center gap-2 mb-8 border border-purple-200/50"
            >
              <span>← Back to Career Hub</span>
            </Link>

            <span className="badge badge-warning mb-4">⚡ Launching Soon</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
              Open Engineering <span className="gradient-text">Academy</span>
            </h1>
            <p className="text-text-muted text-lg leading-relaxed font-normal max-w-2xl mx-auto mb-10">
              We are building structured learning bootcamps, workshops, and hands-on masterclasses 
              taught directly by core engineers and industry experts.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-sm pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Upcoming Bootcamps Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {bootcamps.map((camp, index) => (
              <motion.div
                key={camp.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="neu-card p-6 border border-purple-300/40 shadow-[6px_6px_16px_rgba(147,51,234,0.12),-6px_-6px_16px_#ffffff] flex flex-col justify-between group"
              >
                <div>
                  <div className="w-14 h-14 neu-convex rounded-2xl p-2.5 flex items-center justify-center border border-purple-300/40 shadow-[4px_4px_10px_rgba(147,51,234,0.15),-4px_-4px_10px_#ffffff] mb-4">
                    {camp.icon}
                  </div>
                  <span className="badge badge-primary text-[10px] mb-2">{camp.duration} • {camp.level}</span>
                  <h3 className="text-lg font-extrabold mb-2 text-text leading-snug group-hover:text-primary transition-colors">{camp.title}</h3>
                  <p className="text-text-muted text-xs leading-relaxed font-normal">{camp.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Early Access Neumorphic Subscription Card */}
          <FadeIn>
            <div className="neu-card p-8 sm:p-12 text-center border border-purple-300/40 shadow-[10px_10px_24px_rgba(147,51,234,0.15),-10px_-10px_24px_#ffffff] max-w-2xl mx-auto">
              <h3 className="text-2xl font-extrabold mb-3 text-text">Get Early Access & Launch Invite</h3>
              <p className="text-text-muted text-sm leading-relaxed mb-8">
                Be the first to receive bootcamp enrolment links, early-bird discounts, and free engineering workshops.
              </p>

              {submitted ? (
                <div className="neu-convex p-4 rounded-2xl bg-purple-50 text-purple-900 font-bold text-sm border border-purple-300">
                  🎉 Thank you! You&apos;re on the early-access list for Open Engineering Academy.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Enter your college email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="neu-input flex-1 px-5 py-3.5 rounded-xl text-sm outline-none text-slate-800 border border-purple-200/60"
                  />
                  <button
                    type="submit"
                    className="py-3.5 px-6 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-[4px_4px_14px_rgba(0,0,0,0.35),-4px_-4px_14px_#ffffff] hover:shadow-[6px_6px_18px_rgba(0,0,0,0.5),-6px_-6px_18px_#ffffff] hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
                  >
                    Get Early Access ⚡
                  </button>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
