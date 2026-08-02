'use client';

import type { Metadata } from 'next';
import Link from 'next/link';
import { motion } from 'framer-motion';
import FadeIn from '@/components/animations/FadeIn';

const jobs = [
  {
    id: 'fullstack-dev',
    title: 'Full Stack Web Developer',
    category: 'Engineering',
    type: 'Full-time',
    location: 'Remote (India)',
    experience: '1-3 Years',
    desc: 'Build and scale core web applications using Next.js 16, React 19, TypeScript, and Supabase. Work directly on production features, community dashboards, and client platforms.',
    skills: ['Next.js 16', 'React 19', 'TypeScript', 'Supabase', 'Tailwind CSS', 'PostgreSQL'],
    perks: ['Remote Flexibility', 'Competitive Stipend', 'Mentorship & Equity Options'],
    icon: (
      <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
        <rect x="4" y="8" width="40" height="32" rx="6" className="fill-purple-100 stroke-purple-600" strokeWidth="2.5" />
        <path d="M4 16H44" className="stroke-purple-600" strokeWidth="2" strokeLinecap="round" />
        <circle cx="10" cy="12" r="1.5" className="fill-purple-600" />
        <path d="M14 24L10 28L14 32" className="stroke-purple-700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 24L26 28L22 32" className="stroke-purple-700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 23L17 33" className="stroke-indigo-600" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'uiux-designer',
    title: '3D UI/UX Product Designer',
    category: 'Design & Product',
    type: 'Full-time',
    location: 'Remote (India)',
    experience: '1-2 Years',
    desc: 'Design intuitive, state-of-the-art 3D Neumorphic user interfaces and responsive web layouts for Open Engineering platforms and client hardware products.',
    skills: ['Figma', '3D Neumorphic Design', 'UI Systems', 'UX Prototyping', 'User Research'],
    perks: ['Design System Leadership', 'Flexible Hours', 'Portfolio Showcase'],
    icon: (
      <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
        <path d="M24 6C14.06 6 6 14.06 6 24C6 33.94 14.06 42 24 42C26.5 42 28.5 40 28.5 37.5C28.5 36.3 28 35.2 27.2 34.4C26.4 33.6 26 32.5 26 31.5C26 29.3 27.8 27.5 30 27.5H34C38.4 27.5 42 23.9 42 19.5C42 12 34 6 24 6Z" className="fill-purple-50 stroke-purple-600" strokeWidth="2.5" />
        <circle cx="14" cy="18" r="3" className="fill-purple-600" />
        <circle cx="24" cy="14" r="3" className="fill-indigo-600" />
        <circle cx="34" cy="18" r="3" className="fill-purple-400" />
      </svg>
    ),
  },
  {
    id: 'backend-engineer',
    title: 'Backend Systems Engineer',
    category: 'Infrastructure',
    type: 'Full-time',
    location: 'Remote (India)',
    experience: '2+ Years',
    desc: 'Architect and deploy high-throughput REST/GraphQL APIs, database schemas, and microservices for IoT accident detection (Acc2Not) and Agri-Tech (BhumiCare).',
    skills: ['Node.js', 'PostgreSQL', 'Supabase', 'REST & GraphQL', 'DevOps & CI/CD'],
    perks: ['Hardware IoT Exposure', 'Cloud Credit Access', 'Performance Bonuses'],
    icon: (
      <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="10" width="32" height="10" rx="3" className="fill-indigo-100 stroke-indigo-600" strokeWidth="2.5" />
        <rect x="8" y="28" width="32" height="10" rx="3" className="fill-purple-100 stroke-purple-600" strokeWidth="2.5" />
        <circle cx="14" cy="15" r="2" className="fill-indigo-600" />
        <circle cx="14" cy="33" r="2" className="fill-purple-600" />
      </svg>
    ),
  },
];

export default function JobsPage() {
  return (
    <>
      <section className="section pt-36 pb-12">
        <div className="container mx-auto px-6">
          <FadeIn className="max-w-4xl mx-auto">
            <Link
              href="/career"
              className="neu-flat px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-primary transition-colors inline-flex items-center gap-2 mb-8 border border-purple-200/50"
            >
              <span>← Back to Career Hub</span>
            </Link>
            
            <span className="badge badge-primary mb-4">Work With Us</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
              Open <span className="gradient-text">Positions</span>
            </h1>
            <p className="text-text-muted text-lg leading-relaxed font-normal">
              Join our engineering team and help build high-impact software, IoT devices, and community platforms.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-sm pb-24">
        <div className="container mx-auto px-6 max-w-4xl space-y-8">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="neu-card p-8 sm:p-10 border border-purple-300/40 shadow-[8px_8px_20px_rgba(147,51,234,0.12),-8px_-8px_20px_#ffffff] hover:shadow-[12px_12px_24px_rgba(147,51,234,0.22),-12px_-12px_24px_#ffffff] transition-all duration-300 group"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 neu-convex rounded-2xl p-3 flex items-center justify-center border border-purple-300/40 shadow-[5px_5px_14px_rgba(147,51,234,0.18),-5px_-5px_14px_#ffffff] shrink-0">
                    {job.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1 block">
                      {job.category}
                    </span>
                    <h2 className="text-2xl font-extrabold text-text tracking-tight mb-2 group-hover:text-primary transition-colors">
                      {job.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="badge badge-primary text-xs font-bold">{job.type}</span>
                      <span className="text-xs font-semibold text-slate-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                        📍 {job.location}
                      </span>
                      <span className="text-xs font-semibold text-slate-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                        ⏱️ {job.experience}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-text-muted text-sm leading-relaxed mb-6 font-normal">
                {job.desc}
              </p>

              {/* Skills Tech Stack */}
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2.5">
                  Required Skills & Tech Stack:
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="neu-flat px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 border border-purple-200/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* 100% Solid Black CTA Button */}
              <div className="pt-5 border-t border-purple-200/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap gap-4 text-xs font-medium text-text-muted">
                  {job.perks.map((perk) => (
                    <div key={perk} className="flex items-center gap-1.5">
                      <span className="text-purple-600">✓</span>
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={`mailto:openengineering9@gmail.com?subject=Job Application: ${encodeURIComponent(job.title)}`}
                  className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-[4px_4px_14px_rgba(0,0,0,0.35),-4px_-4px_14px_#ffffff] hover:shadow-[6px_6px_18px_rgba(0,0,0,0.5),-6px_-6px_18px_#ffffff] hover:scale-[1.02] active:scale-[0.98] transition-all group/btn shrink-0"
                >
                  <span>Apply for Position</span>
                  <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
