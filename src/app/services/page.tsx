'use client';

import type { Metadata } from 'next';
import Link from 'next/link';
import { motion } from 'framer-motion';
import FadeIn from '@/components/animations/FadeIn';

const services = [
  {
    id: 'web-dev',
    title: 'Full-Stack Web Development',
    category: 'Web Engineering',
    desc: 'We build modern, ultra-responsive, and performant web applications using Next.js 16 and cutting-edge frontend architecture. From landing pages to complex enterprise platforms, we engineer solutions built to scale.',
    badge: 'Core Service',
    features: [
      'Next.js 16 & React 19 Engine',
      '100% Neumorphic Design System',
      'SEO & Speed Performance Optimized',
      'Supabase & Cloud DB Integration',
    ],
    icon: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
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
    id: 'app-dev',
    title: 'Mobile App Development',
    category: 'Mobile Engineering',
    desc: 'Native and cross-platform mobile applications designed for high performance, intuitive gesture controls, and flawless user experiences across iOS and Android ecosystems.',
    badge: 'Mobile Native',
    features: [
      'React Native & Flutter Apps',
      'Native iOS & Android Integration',
      'Real-time Push Notifications',
      'App Store & Play Store Launch',
    ],
    icon: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
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
    id: 'startup-dev',
    title: 'Startup MVP & Tech Acceleration',
    category: 'Venture Tech',
    desc: 'End-to-end technical execution for turning innovative ideas into viable, scalable tech startups. From rapid MVP architecture to market launch and investor-ready tech stack.',
    badge: 'Accelerator',
    features: [
      'Rapid MVP Prototype Build',
      'Scalable Technical Architecture',
      'Cloud Infrastructure & CI/CD',
      'Product Launch Roadmap',
    ],
    icon: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
        <path d="M24 4C24 4 34 12 34 26C34 32 30 36 24 38C18 36 14 32 14 26C14 12 24 4 24 4Z" className="fill-purple-100 stroke-purple-600" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="24" cy="18" r="4" className="fill-purple-600" />
        <path d="M14 26L6 30V36L14 34" className="fill-indigo-100 stroke-indigo-600" strokeWidth="2" strokeLinejoin="round" />
        <path d="M34 26L42 30V36L34 34" className="fill-indigo-100 stroke-indigo-600" strokeWidth="2" strokeLinejoin="round" />
        <path d="M20 38L24 46L28 38" className="fill-purple-600 stroke-purple-700" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'branding',
    title: '3D Branding & Visual Identity',
    category: 'Design Systems',
    desc: 'Compelling brand identities that make unforgettable impressions. We craft cohesive visual systems, logo marks, 3D design languages, and interactive UI/UX guidelines.',
    badge: 'Design System',
    features: [
      '3D Neumorphic UI Design',
      'Logo & Vector Mark Architecture',
      'Complete Brand Strategy Guide',
      'Interactive Figma UI Systems',
    ],
    icon: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
        <path d="M24 6C14.06 6 6 14.06 6 24C6 33.94 14.06 42 24 42C26.5 42 28.5 40 28.5 37.5C28.5 36.3 28 35.2 27.2 34.4C26.4 33.6 26 32.5 26 31.5C26 29.3 27.8 27.5 30 27.5H34C38.4 27.5 42 23.9 42 19.5C42 12 34 6 24 6Z" className="fill-purple-50 stroke-purple-600" strokeWidth="2.5" />
        <circle cx="14" cy="18" r="3" className="fill-purple-600" />
        <circle cx="24" cy="14" r="3" className="fill-indigo-600" />
        <circle cx="34" cy="18" r="3" className="fill-purple-400" />
        <circle cx="14" cy="28" r="3" className="fill-indigo-400" />
      </svg>
    ),
  },
  {
    id: 'growth-marketing',
    title: 'Growth Marketing & SEO Engine',
    category: 'Digital Traction',
    desc: 'Data-driven growth strategies that acquire users and convert engagement. We blend technical SEO engineering, performance marketing, content strategy, and product analytics.',
    badge: 'Growth Engine',
    features: [
      'Technical SEO Optimization',
      'Performance Paid Campaigns',
      'Content Strategy & Distribution',
      'User Funnel Analytics & Conversion',
    ],
    icon: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
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

export default function ServicesPage() {
  return (
    <>
      <section className="section pt-36 pb-16">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <span className="badge badge-primary mb-4">Our Engineering Services</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
              Services Designed to <span className="gradient-text">Build & Scale</span>
            </h1>
            <p className="text-text-muted text-lg leading-relaxed font-normal">
              Tailored engineering solutions built with precision, 3D neumorphic elegance, and scalable architecture.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-sm pb-24">
        <div className="container mx-auto px-6">
          {/* Dynamic 2-Column & 3-Column Upgraded Neumorphic Card Formation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="neu-card p-8 h-full flex flex-col justify-between group relative overflow-hidden border border-purple-300/40 shadow-[8px_8px_20px_rgba(147,51,234,0.12),-8px_-8px_20px_#ffffff] hover:shadow-[12px_12px_24px_rgba(147,51,234,0.22),-12px_-12px_24px_#ffffff] transition-all duration-300"
              >
                <div>
                  {/* Top Row: Custom 3D Neumorphic Convex Badge with Product-Specific SVG + Badge */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="w-18 h-18 sm:w-20 sm:h-20 neu-convex rounded-2xl p-3 flex items-center justify-center border border-purple-300/40 shadow-[5px_5px_14px_rgba(147,51,234,0.18),-5px_-5px_14px_#ffffff] shrink-0">
                      {service.icon}
                    </div>
                    <span className="badge badge-primary text-xs font-bold px-3 py-1 shadow-sm">
                      {service.badge}
                    </span>
                  </div>

                  <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                    {service.category}
                  </p>
                  <h2 className="text-2xl font-extrabold mb-3 text-text group-hover:text-primary transition-colors leading-snug">
                    {service.title}
                  </h2>
                  <p className="text-text-muted text-sm leading-relaxed mb-6 font-normal">
                    {service.desc}
                  </p>

                  {/* Feature Pills */}
                  <div className="space-y-2.5 mb-8">
                    {service.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                        <svg className="w-4 h-4 text-purple-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-purple-200/40">
                  <Link
                    href="/contact"
                    className="w-full py-3.5 px-5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-[4px_4px_14px_rgba(0,0,0,0.35),-4px_-4px_14px_#ffffff] hover:shadow-[6px_6px_18px_rgba(0,0,0,0.5),-6px_-6px_18px_#ffffff] hover:scale-[1.02] active:scale-[0.98] transition-all group/btn"
                  >
                    <span>Get Started with {service.title.split(' ')[0]}</span>
                    <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
