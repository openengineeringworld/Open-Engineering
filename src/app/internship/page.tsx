'use client';

import type { Metadata } from 'next';
import Link from 'next/link';
import { motion } from 'framer-motion';
import FadeIn from '@/components/animations/FadeIn';

const internships = [
  {
    id: 'ai-productivity-intern',
    title: 'AI for Productivity & Future',
    category: 'AI & Future Tech',
    desc: 'Leverage cutting-edge AI models, prompt engineering, autonomous agents, and AI-driven workflows to boost personal and enterprise productivity.',
    learn: [
      'ChatGPT, Claude, Perplexity & DeepSeek LLM Workflows',
      'AI Development Tools (Cursor, GitHub Copilot, v0)',
      'Autonomous AI Agents (LangChain, AutoGPT, CrewAI)',
      'AI Workflow & Automation Platforms (n8n, Make, Zapier)',
      'Advanced Prompt Engineering & Fine-Tuning',
      'Multimodal AI Tools (Midjourney, Runway, ElevenLabs)',
    ],
    icon: (
      <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
        <path d="M24 6L28 16L38 20L28 24L24 34L20 24L10 20L20 16L24 6Z" className="fill-purple-100 stroke-purple-600" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M35 28L37 33L42 35L37 37L35 42L33 37L28 35L33 33L35 28Z" className="fill-indigo-100 stroke-indigo-600" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="14" cy="34" r="3" className="fill-purple-600" />
      </svg>
    ),
  },
  {
    id: 'web-intern',
    title: 'Full Stack Web Development',
    category: 'Engineering Cohort',
    desc: 'Work alongside our core engineering team to build real-world web applications. Master Next.js 16, Supabase, Tailwind CSS, and production CI/CD workflows.',
    learn: [
      'Next.js 16 App Router & React 19',
      'Supabase Database & Authentication',
      'Git Branching & Team Pull Requests',
      'Production Deployment & Monitoring',
    ],
    icon: (
      <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
        <path d="M24 6L42 16L24 26L6 16L24 6Z" className="fill-indigo-100 stroke-indigo-600" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M12 20V32C12 32 18 38 24 38C30 38 36 32 36 32V20" className="stroke-indigo-600" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M38 18.5V30" className="stroke-purple-600" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="38" cy="32" r="2.5" className="fill-purple-600" />
      </svg>
    ),
  },
  {
    id: 'iot-robotics-intern',
    title: 'IoT & Robotics Engineering',
    category: 'Hardware & Embedded',
    desc: 'Work on real-world IoT systems, microcontrollers (ESP32/Arduino/STM32), sensor networks, robotic automation, and hardware-cloud integration.',
    learn: [
      'Microcontroller Programming (ESP32, Arduino & STM32)',
      'IoT Cloud Sync & Wireless Protocols (MQTT, BLE, HTTP)',
      'Sensor Integration, Actuators & Robotic Kinematics',
      'Circuit Design, PCB Layout & Hardware Prototyping',
    ],
    icon: (
      <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
        <rect x="14" y="14" width="20" height="20" rx="4" className="fill-purple-100 stroke-purple-600" strokeWidth="2.5" />
        <path d="M20 14V8M28 14V8M20 34V40M28 34V40M14 20H8M14 28H8M34 20H40M34 28H40" className="stroke-indigo-600" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="24" r="4" className="fill-purple-600" />
      </svg>
    ),
  },
];

export default function InternshipPage() {
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

            <span className="badge badge-primary mb-4">Hands-On Learning</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
              Internship <span className="gradient-text">Programs</span>
            </h1>
            <p className="text-text-muted text-lg leading-relaxed font-normal">
              Gain real-world engineering and product launch experience while still in college. 
              Build real products, work in production repositories, and get certified.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-sm pb-24">
        <div className="container mx-auto px-6 max-w-4xl space-y-8">
          {internships.map((intern, index) => (
            <motion.div
              key={intern.id}
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
                    {intern.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1 block">
                      {intern.category}
                    </span>
                    <h2 className="text-2xl font-extrabold text-text tracking-tight group-hover:text-primary transition-colors">
                      {intern.title}
                    </h2>
                  </div>
                </div>
              </div>

              <p className="text-text-muted text-sm leading-relaxed mb-6 font-normal">
                {intern.desc}
              </p>

              {/* Learning Outcomes Grid */}
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2.5">
                  Key Skills & Learning Outcomes:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {intern.learn.map((item) => (
                    <div
                      key={item}
                      className="neu-flat px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2.5 border border-purple-200/50"
                    >
                      <svg className="w-4 h-4 text-purple-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 100% Solid Black CTA Button */}
              <div className="pt-5 border-t border-purple-200/40 flex justify-end">
                <a
                  href="https://forms.gle/8VQEVc5U6R3R5JAb9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-[4px_4px_14px_rgba(0,0,0,0.35),-4px_-4px_14px_#ffffff] hover:shadow-[6px_6px_18px_rgba(0,0,0,0.5),-6px_-6px_18px_#ffffff] hover:scale-[1.02] active:scale-[0.98] transition-all group/btn shrink-0"
                >
                  <span>Apply for Internship</span>
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
