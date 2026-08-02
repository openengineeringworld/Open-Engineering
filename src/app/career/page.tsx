'use client';

import type { Metadata } from 'next';
import Link from 'next/link';
import { motion } from 'framer-motion';
import FadeIn from '@/components/animations/FadeIn';

const careerPaths = [
  {
    title: 'Open Positions & Jobs',
    desc: 'Full-time positions for software developers, UI/UX designers, and systems engineers wanting to build engineering solutions.',
    href: '/jobs',
    count: '3 Open Roles',
    badgeClass: 'badge-success',
    icon: (
      <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
        <rect x="6" y="14" width="36" height="26" rx="4" className="fill-purple-100 stroke-purple-600" strokeWidth="2.5" />
        <path d="M16 14V10C16 8.89543 16.8954 8 18 8H30C31.1046 8 32 8.89543 32 10V14" className="stroke-purple-600" strokeWidth="2.5" />
        <path d="M6 22H42" className="stroke-purple-600" strokeWidth="2" strokeDasharray="3 3" />
        <circle cx="24" cy="22" r="3" className="fill-purple-600" />
      </svg>
    ),
  },
  {
    title: 'Internship Program',
    desc: 'Hands-on 2-3 month internships for students looking to gain production experience with Next.js, IoT, and AI platforms.',
    href: '/internship',
    count: '2 Active Cohorts',
    badgeClass: 'badge-primary',
    icon: (
      <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
        <path d="M24 6L42 16L24 26L6 16L24 6Z" className="fill-indigo-100 stroke-indigo-600" strokeWidth="2.5" />
        <path d="M12 20V32C12 32 18 38 24 38C30 38 36 32 36 32V20" className="stroke-indigo-600" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M38 18.5V30" className="stroke-purple-600" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="38" cy="32" r="2.5" className="fill-purple-600" />
      </svg>
    ),
  },
  {
    title: 'Open Engineering Academy',
    desc: 'Structured learning bootcamps, workshops, and hands-on hardware & software masterclasses taught by engineers.',
    href: '/academy',
    count: 'Launching Soon ⚡',
    badgeClass: 'badge-warning',
    icon: (
      <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
        <path d="M8 12C8 9.79086 9.79086 8 12 8H24V38H12C9.79086 38 8 36.2091 8 34V12Z" className="fill-purple-100 stroke-purple-600" strokeWidth="2.5" />
        <path d="M40 12C40 9.79086 38.2091 8 36 8H24V38H36C38.2091 38 40 36.2091 40 34V12Z" className="fill-purple-50 stroke-purple-600" strokeWidth="2.5" />
        <line x1="24" y1="8" x2="24" y2="38" className="stroke-purple-700" width="2.5" />
      </svg>
    ),
  },
];

export default function CareerPage() {
  return (
    <>
      <section className="section pt-36 pb-16">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <span className="badge badge-primary mb-4">Careers & Growth</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
              Build Your Future With <span className="gradient-text">Open Engineering</span>
            </h1>
            <p className="text-text-muted text-lg leading-relaxed font-normal">
              Whether you are a seasoned software developer, student seeking real-world internship experience, or 
              learner wanting structured masterclasses — explore your path below.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-sm pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {careerPaths.map((path, index) => (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                whileHover={{ y: -6 }}
              >
                <Link href={path.href} className="block h-full">
                  <div className="neu-card p-8 h-full flex flex-col justify-between group cursor-pointer border border-purple-300/40 shadow-[8px_8px_20px_rgba(147,51,234,0.12),-8px_-8px_20px_#ffffff] hover:shadow-[12px_12px_24px_rgba(147,51,234,0.22),-12px_-12px_24px_#ffffff] transition-all duration-300">
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="w-16 h-16 sm:w-18 sm:h-18 neu-convex rounded-2xl p-3 flex items-center justify-center border border-purple-300/40 shadow-[5px_5px_14px_rgba(147,51,234,0.18),-5px_-5px_14px_#ffffff] shrink-0">
                          {path.icon}
                        </div>
                        <span className={`badge ${path.badgeClass} text-xs font-bold px-3 py-1 shadow-sm`}>
                          {path.count}
                        </span>
                      </div>

                      <h2 className="text-xl font-extrabold mb-3 text-text group-hover:text-primary transition-colors leading-snug">
                        {path.title}
                      </h2>
                      <p className="text-text-muted text-sm leading-relaxed mb-6 font-normal">
                        {path.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-purple-200/40 flex items-center justify-between text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                      <span>Explore Path</span>
                      <span>→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
