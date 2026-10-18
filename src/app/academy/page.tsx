'use client';

import { motion } from 'framer-motion';
import FadeIn from '@/components/animations/FadeIn';

const bootcamps = [
  {
    title: 'Full-Stack Web Engineering Bootcamp',
    duration: '6 Weeks',
    level: 'Beginner to Advanced',
    desc: 'Master Next.js 16, React 19, TypeScript, Supabase, and 3D Neumorphic UI design systems from scratch.',
    highlights: ['Next.js 16 & React 19', 'TypeScript & Supabase', '3D Neumorphic UI Systems'],
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
    highlights: ['Embedded C++ & ESP32', 'GPS & Motion Sensors', 'IoT Cloud Telemetry'],
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
    highlights: ['Agri Sensor Analytics', 'Python AI/ML Pipelines', 'Predictive Soil Modeling'],
    icon: (
      <svg className="w-8 h-8 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
      </svg>
    ),
  },
];

const FORM_LINK = 'https://forms.gle/8VQEVc5U6R3R5JAb9';

export default function AcademyPage() {
  return (
    <>
      <section className="section pt-36 pb-12">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <FadeIn>
           
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
              Open Engineering <span className="gradient-text">Academy</span>
            </h1>
            <p className="text-text-muted text-lg leading-relaxed font-normal max-w-2xl mx-auto mb-8">
              We are building structured learning bootcamps, workshops, and hands-on masterclasses 
              taught directly by core engineers and industry experts.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={FORM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-xl shadow-[6px_6px_20px_rgba(147,51,234,0.35),-4px_-4px_12px_#ffffff] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Register for Courses 🚀</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section-sm pb-24">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Bootcamps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <p className="text-text-muted text-xs leading-relaxed font-normal mb-4">{camp.desc}</p>
                  
                  {/* Highlights */}
                  <div className="space-y-1.5 mb-6">
                    {camp.highlights.map((highlight) => (
                      <div key={highlight} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <svg className="w-3.5 h-3.5 text-purple-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-purple-200/50">
                  <a
                    href={FORM_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-[4px_4px_14px_rgba(0,0,0,0.3),-4px_-4px_14px_#ffffff] hover:shadow-[6px_6px_18px_rgba(0,0,0,0.45),-6px_-6px_18px_#ffffff] hover:scale-[1.02] active:scale-[0.98] transition-all group/btn"
                  >
                    <span>Apply / Enroll Now</span>
                    <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Callout Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="neu-card p-8 sm:p-10 text-center mt-12 border border-purple-300/40 shadow-[6px_6px_20px_rgba(147,51,234,0.12),-6px_-6px_20px_#ffffff]"
          >
            <div className="max-w-2xl mx-auto space-y-4">
              <span className="badge badge-primary text-xs">Cohort Registration</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Ready to Accelerate Your Career?
              </h2>
              <p className="text-text-muted text-sm sm:text-base leading-relaxed">
                Reserve your seat in our upcoming interactive bootcamps and masterclasses. All registrations are handled directly through our official application form.
              </p>
              <div className="pt-2">
                <a
                  href={FORM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold shadow-[6px_6px_20px_rgba(147,51,234,0.35),-4px_-4px_12px_#ffffff] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Open Registration Form</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
