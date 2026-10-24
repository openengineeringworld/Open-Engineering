'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from '@/components/animations/FadeIn';

// Simulation scenarios for interactive assistant showcase
interface Scenario {
  id: string;
  tabLabel: string;
  icon: string;
  userQuery: string;
  timestamp: string;
  agentSteps: string[];
  assistantOutput: {
    summary: string;
    details: {
      label: string;
      value: string;
      status?: 'success' | 'warning' | 'info';
    }[];
    actionTaken: string;
    proactiveTip?: string;
  };
}

const scenarios: Scenario[] = [
  {
    id: 'calendar',
    tabLabel: 'Proactive Scheduling',
    icon: '📅',
    userQuery: 'Secretary, my afternoon schedule looks chaotic with conflicting project reviews and no time for lunch.',
    timestamp: 'Today, 11:42 AM',
    agentSteps: [
      'Scanning 3 linked calendars (Google, Outlook, University Portal)',
      'Identified 2 hard overlap conflicts at 2:00 PM and 3:30 PM',
      'Contacted team leads with automated reschedule options',
      'Carved out a protected 45-minute nutrition & rest buffer at 1:15 PM',
    ],
    assistantOutput: {
      summary: 'Done! Your afternoon is reorganized without canceling any deliverables.',
      details: [
        { label: '1:15 PM – 2:00 PM', value: 'Protected Lunch & Decompression Buffer', status: 'success' },
        { label: '2:15 PM – 3:00 PM', value: 'Hardware Engineering Sync (Shifted +15m)', status: 'info' },
        { label: '3:15 PM – 4:00 PM', value: 'Faculty R&D Project Review (Confirmed)', status: 'success' },
        { label: '4:15 PM – 5:30 PM', value: 'Deep Focus Block: Embedded Systems Code', status: 'info' },
      ],
      actionTaken: 'Sent confirmation pings to 4 collaborators and updated your smartphone calendar.',
      proactiveTip: 'Proactive Alert: Your Smart Health Band detected elevated morning strain; I scheduled a 5-minute breather before the faculty review.',
    },
  },
  {
    id: 'inbox',
    tabLabel: 'Smart Inbox Triage',
    icon: '✉️',
    userQuery: 'Clear out my 24 unread emails and flag anything that actually needs my immediate attention.',
    timestamp: 'Today, 2:10 PM',
    agentSteps: [
      'Ingested 24 unread messages across 2 inboxes',
      'Filtered 14 newsletters and system notifications into background digests',
      'Identified 2 high-priority action items from Project Sponsors and Hackathon Organizers',
      'Prepared ready-to-approve contextual response drafts matching your tone',
    ],
    assistantOutput: {
      summary: 'Inbox cleared to Zero. 2 emails require your tap-to-send approval.',
      details: [
        { label: 'Urgent • Prof. Sharma', value: 'Lab equipment sign-off needed for Friday testing', status: 'warning' },
        { label: 'High • IEEE Chapter', value: 'Keynote speaking confirmation & bio submission', status: 'info' },
        { label: 'Archived • 14 updates', value: 'GitHub PR notifications & campus bulletins summarized', status: 'success' },
      ],
      actionTaken: 'Drafted two precise replies. Tap once to review and dispatch.',
      proactiveTip: 'Secretary noticed an attached 18-page spec doc and pre-extracted the 3 hardware requirements you care about.',
    },
  },
  {
    id: 'execution',
    tabLabel: 'Autonomous Execution',
    icon: '⚡',
    userQuery: 'Coordinate our team travel to the National Innovation Conclave next weekend in Bengaluru.',
    timestamp: 'Yesterday, 6:15 PM',
    agentSteps: [
      'Queried 4 teammates for departure preferences and university IDs',
      'Cross-referenced train schedules and transit routes against budget cap',
      'Pre-filled group booking vouchers and verified proximity to event venue',
      'Drafted formal travel clearance letter for college administration approval',
    ],
    assistantOutput: {
      summary: 'Travel itinerary fully drafted and optimized for 4 members under ₹12,000 total.',
      details: [
        { label: 'Transit', value: 'Vande Bharat Express (Confirmed departing 06:10 AM)', status: 'success' },
        { label: 'Stay', value: 'Innovation Hub Guest Quarters (800m from venue)', status: 'success' },
        { label: 'Admin Clearance', value: 'Automated letter drafted & queued for HOD signature', status: 'info' },
      ],
      actionTaken: 'Itinerary dispatched to team WhatsApp group with calendar invites synced.',
      proactiveTip: 'Weather forecast predicts rain in Bengaluru next Saturday; added an indoor transit contingency.',
    },
  },
  {
    id: 'study',
    tabLabel: 'Engineering Study OS',
    icon: '🎓',
    userQuery: 'I have a 60-page PDF on Microcontroller Architecture for tomorrow’s viva. Help me master it.',
    timestamp: 'Today, 8:30 PM',
    agentSteps: [
      'Ingested PDF: "ARM Cortex-M Embedded Architecture & Interrupt Controllers"',
      'Identified the 12 most frequent viva questioning patterns from previous semesters',
      'Synthesized complex pipeline and register architectures into visual mnemonics',
      'Generated an interactive 15-minute high-yield oral quiz session',
    ],
    assistantOutput: {
      summary: 'Study packet synthesized! 60 pages condensed into 5 high-yield conceptual pillars.',
      details: [
        { label: 'Core Concept 1', value: 'NVIC Priority Grouping & Nested Interrupts (High Viva Frequency)', status: 'warning' },
        { label: 'Core Concept 2', value: 'Memory Protection Unit (MPU) vs MMU in Real-Time Systems', status: 'info' },
        { label: 'Interactive Viva Drill', value: '10 Rapid-Fire Audio Flashcards ready on your phone', status: 'success' },
      ],
      actionTaken: 'Synced 10 key diagram summaries to your offline phone widget.',
      proactiveTip: 'Want a simulated 5-minute audio viva test right now? Tap "Start Audio Drill".',
    },
  },
];

const superAppPillars = [
  {
    id: 'proactive',
    title: 'Proactive, Not Reactive',
    badge: 'Ambient Intelligence',
    icon: (
      <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    description:
      'Unlike classic voice assistants that wait for commands, Secretary continuously analyzes patterns, spots bottlenecks hours before they happen, and fixes them with proactive intelligence.',
    highlights: ['Autonomous schedule conflict resolution', 'Early deadline warning radar', 'Proactive context briefing before calls'],
  },
  {
    id: 'super-app',
    title: 'The All-in-One Super App Engine',
    badge: 'Unified Life OS',
    icon: (
      <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    description:
      'Stop switching between 12 fragmented apps. Calendar, inbox, tasks, reminders, documents, travel, and personal finance operate harmoniously within a single conversational command deck.',
    highlights: ['Zero context switching', 'Cross-app automated pipelines', 'Universal search across your digital footprint'],
  },
  {
    id: 'execution',
    title: 'Autonomous Tool Execution',
    badge: 'Action-First Agent',
    icon: (
      <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    description:
      'Secretary doesn’t just answer questions — it gets things done. It triggers API workflows, fills complex forms, updates spreadsheets, sends validated emails, and interacts with real-world services.',
    highlights: ['Multi-agent tool orchestration', 'Safe human-in-the-loop approvals', 'Deterministic reliability with zero hallucinations'],
  },
  {
    id: 'memory',
    title: 'Long-Term Neural Memory',
    badge: 'Second Brain',
    icon: (
      <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    description:
      'Secretary remembers your communication quirks, who your key stakeholders are, your sleep and study preferences, and decisions made three months ago so you never have to repeat yourself.',
    highlights: ['Persistent contextual vector graph', 'Evolving personal style synthesizer', 'Granular control over what is remembered'],
  },
  {
    id: 'hardware-sync',
    title: 'Ecosystem & IoT Hardware Sync',
    badge: 'Open Engineering Hardware',
    icon: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    description:
      'Seamlessly connects with Open Engineering hardware devices like the Smart AI Health Band and Smart Home Automation units to adapt your tasks based on biometric stress and room environments.',
    highlights: ['Biometric-adaptive schedule pacing', 'Smart room lighting and climate triggers', 'On-device edge computing support'],
  },
  {
    id: 'privacy',
    title: 'Privacy-First Architecture',
    badge: 'Zero-Knowledge Security',
    icon: (
      <svg className="w-7 h-7 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    description:
      'Your life is personal. Secretary encrypts your personal knowledge graph locally. Your personal emails, voice notes, and schedule habits are never sold, rented, or used to train public frontier models.',
    highlights: ['Client-side AES-256 encryption', 'Local LLM inference support', 'Instant one-click data expunging'],
  },
];

const comparisonData = [
  {
    feature: 'Primary Mode',
    traditional: 'Reactive Voice Trigger ("Hey Siri")',
    chatbots: 'Text Prompt Chat Window',
    secretary: 'Proactive Autonomous Life Engine',
  },
  {
    feature: 'Task Execution',
    traditional: 'Basic Timers & Single Commands',
    chatbots: 'Generates Text Responses Only',
    secretary: 'Multi-Step Real-World Action Execution',
  },
  {
    feature: 'Daily Operations Sync',
    traditional: 'Siloed to phone system utilities',
    chatbots: 'Disconnected from your daily tools',
    secretary: 'Unified Calendar, Mail, Tasks & Travel Hub',
  },
  {
    feature: 'Context & Memory',
    traditional: 'Stateless / Minimal memory',
    chatbots: 'Session-based / Limited graph memory',
    secretary: 'Long-term Evolving Knowledge Vault',
  },
  {
    feature: 'Hardware & IoT Link',
    traditional: 'Proprietary brand ecosystem lock-in',
    chatbots: 'None',
    secretary: 'Open Engineering Wearables & IoT Modules',
  },
  {
    feature: 'Student & Engineer Focus',
    traditional: 'Generic consumer queries',
    chatbots: 'General purpose knowledge',
    secretary: 'Custom viva drills, project tracking, deep focus',
  },
];

const faqs = [
  {
    q: 'What is Secretary in simple words?',
    a: 'Secretary is an all-in-one AI super app and autonomous personal assistant being engineered by Open Engineering. Rather than just answering text questions like a chatbot, Secretary takes proactive ownership of your daily life — orchestrating calendars, drafting high-priority communications, coordinating travel, synthesizing engineering study material, and executing routine workflows without you lifting a finger.',
  },
  {
    q: 'Why does the tagline say "No worries! Your secretary is here, let it manage"?',
    a: 'Because mental bandwidth is the most valuable commodity today. Whether you are an engineering student juggling labs and viva exams, or a professional swamped by overlapping meetings and hundreds of unread emails, Secretary steps in like a reliable Chief of Staff so you can focus entirely on high-impact thinking and creative work.',
  },
  {
    q: 'How is Secretary different from ChatGPT, Claude, or Siri?',
    a: 'ChatGPT and Claude are conversational chat windows that produce text when you ask. Siri and Google Assistant do simple voice triggers like setting timers. Secretary is an *autonomous agentic super app* with integrated tool execution: it has long-term persistent memory, integrates directly with your inbox, calendar, and Open Engineering IoT hardware, and proactively intervenes before problems occur.',
  },
  {
    q: 'Which platforms will Secretary be available on?',
    a: 'Secretary is being engineered as a unified cross-platform experience across Web, Desktop (Windows & macOS), and Mobile (Android & iOS). It also interfaces smoothly with Open Engineering Smart AI Health Bands for real-time biometric and focus awareness.',
  },
  {
    q: 'How does Secretary handle privacy and security?',
    a: 'We adhere to a Zero-Knowledge, local-first architecture. Your personal schedule data, notes, and memory graphs are encrypted with client-side keys. Sensitive actions like executing payments or sending critical external emails always require explicit 1-tap confirmation.',
  },
  {
    q: 'When will Secretary be available for beta testing?',
    a: 'We are currently in active private alpha engineering. Early access will roll out in waves starting with Open Engineering campus chapters and waitlist members. You can join the VIP waitlist below to receive early preview invites and developer builds.',
  },
];

export default function SecretaryClient() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistName, setWaitlistName] = useState('');
  const [waitlistRole, setWaitlistRole] = useState('Student Engineer');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentScenario = scenarios.find((s) => s.id === activeTab) || scenarios[0];

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail || !waitlistEmail.includes('@')) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const randomTicket = `OE-SEC-${Math.floor(1000 + Math.random() * 9000)}`;
      setTicketNumber(randomTicket);
      setIsSubmitting(false);
      setWaitlistSubmitted(true);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-purple-600/30 selection:text-purple-300 relative overflow-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-purple-900/20 via-indigo-900/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-40 right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[800px] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="section pt-36 pb-20 relative">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center max-w-4xl mx-auto">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-semibold mb-8 shadow-[0_0_20px_rgba(147,51,234,0.18)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span>⚡ Currently In Active R&D by Open Engineering</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">Alpha Engineering v0.3</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300">Secretary</span>
              <br />
              <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-200 mt-2 block">
                The Autonomous AI Super App That Runs Your World.
              </span>
            </h1>

            {/* Tagline Callout */}
            <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-purple-950/40 border border-purple-500/20 shadow-inner">
              <p className="text-lg sm:text-xl font-semibold italic text-purple-200">
                “No worries! Your secretary is here, let it manage.”
              </p>
            </div>

            {/* Comprehensive Description */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal mb-10">
              Secretary is an all-in-one AI super app and autonomous personal assistant currently being built by{' '}
              <strong className="text-white font-semibold">Open Engineering</strong>. Designed to streamline your life and
              work, Secretary effortlessly manages your schedules, daily workflows, communications, reminders, and task
              execution with proactive intelligence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a
                href="#waitlist"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-[0_0_25px_rgba(147,51,234,0.4)] hover:shadow-[0_0_35px_rgba(147,51,234,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                <span>Join VIP Early Access</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>

              <a
                href="#simulator"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm sm:text-base border border-slate-700/80 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Watch Live AI Simulator</span>
                <span>✨</span>
              </a>
            </div>

            {/* Quick Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 border-t border-slate-800/80 text-xs sm:text-sm text-slate-400 font-medium">
              <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-purple-400">⚡</span>
                <span>Autonomous Agent</span>
              </div>
              <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-indigo-400">📅</span>
                <span>Smart Life OS</span>
              </div>
              <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-emerald-400">🛡️</span>
                <span>Zero-Knowledge Vault</span>
              </div>
              <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-cyan-400">⌚</span>
                <span>OpenEng IoT Sync</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Featured Logo & Product Showcase Card */}
      <section className="section-sm pb-16">
        <div className="container mx-auto px-6">
          <FadeIn>
            <div className="max-w-5xl mx-auto rounded-3xl bg-slate-900/90 border border-slate-800/90 p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
              {/* Subtle Ambient Glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col lg:flex-row items-center gap-10">
                {/* Logo Frame */}
                <div className="w-56 h-56 sm:w-64 sm:h-64 shrink-0 rounded-2xl bg-black border-2 border-purple-500/30 p-4 relative group shadow-[0_0_30px_rgba(147,51,234,0.2)] flex items-center justify-center">
                  <img
                    src="/images/products/Secretary%20logo.png"
                    alt="Secretary Official Logo"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                    Official Product Logo
                  </div>
                </div>

                {/* Explanation text */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-block text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
                    Open Engineering Innovation Lab
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                    The Next Evolution of Personal Productivity
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                    Most assistants make you do all the work: you type queries, they return paragraphs. Secretary flips
                    the script. As a true <span className="text-purple-300 font-semibold">Super App</span>, it operates
                    with autonomous agency. From scheduling meetings and drafting contextual responses to managing your
                    daily health buffer with synced wearable IoT data, Secretary acts as your always-on Chief of Staff.
                  </p>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700/60">
                      <span className="text-emerald-400">✓</span> Calendar & Task Autonomous Sync
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700/60">
                      <span className="text-emerald-400">✓</span> Natural Multi-Modal Voice & Chat
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700/60">
                      <span className="text-emerald-400">✓</span> Engineering Viva & Study Engine
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Interactive Live AI Simulator Console */}
      <section id="simulator" className="section-sm py-20 relative">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-3.5 py-1.5 rounded-full border border-purple-500/30">
              Interactive Preview
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4">
              See Secretary In Action
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Select a workflow scenario below to inspect how Secretary autonomously synthesizes inputs, plans multi-step
              actions, and executes without hallucination.
            </p>
          </FadeIn>

          <FadeIn>
            <div className="max-w-5xl mx-auto rounded-3xl bg-slate-900 border border-slate-700/80 shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden">
              {/* Window Header */}
              <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 text-xs font-mono text-slate-400 font-medium">
                    Secretary Agent Console • Mode: Proactive Autonomous
                  </span>
                </div>
                <div className="text-xs font-mono text-purple-400 bg-purple-950/50 px-3 py-1 rounded-full border border-purple-800/50">
                  ⚡ Agent Latency: 42ms
                </div>
              </div>

              {/* Scenario Tab Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 bg-slate-950/50 p-2 gap-2 border-b border-slate-800">
                {scenarios.map((sc) => {
                  const isActive = sc.id === activeTab;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => setActiveTab(sc.id)}
                      className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_4px_15px_rgba(147,51,234,0.35)]'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{sc.icon}</span>
                      <span>{sc.tabLabel}</span>
                    </button>
                  );
                })}
              </div>

              {/* Console Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentScenario.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    {/* User Query Bubble */}
                    <div className="flex items-start gap-4 max-w-3xl">
                      <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-500/40 text-purple-300 font-bold flex items-center justify-center shrink-0 text-sm shadow">
                        YOU
                      </div>
                      <div className="bg-slate-800/90 rounded-2xl rounded-tl-none p-4 sm:p-5 border border-slate-700/60 text-slate-200 text-sm sm:text-base leading-relaxed">
                        <p>{currentScenario.userQuery}</p>
                        <span className="text-[11px] text-slate-500 mt-2 block font-mono">
                          {currentScenario.timestamp}
                        </span>
                      </div>
                    </div>

                    {/* Agent Thinking & Reasoning Process */}
                    <div className="pl-6 sm:pl-14">
                      <div className="p-4 rounded-2xl bg-slate-950/70 border border-purple-900/40 text-xs font-mono space-y-2">
                        <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-wider">
                          <span className="inline-block w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                          <span>Autonomous Agent Pipeline:</span>
                        </div>
                        {currentScenario.agentSteps.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-slate-400 pl-3">
                            <span className="text-purple-500">›</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Secretary Response Card */}
                    <div className="flex items-start gap-4 max-w-4xl">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-black flex items-center justify-center shrink-0 text-xs shadow-[0_0_15px_rgba(147,51,234,0.4)]">
                        SEC
                      </div>
                      <div className="flex-1 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/30 rounded-2xl rounded-tl-none p-5 sm:p-6 border border-purple-500/30 shadow-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                            <span>✨</span>
                            <span>{currentScenario.assistantOutput.summary}</span>
                          </h4>
                          <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px]">
                            Resolved
                          </span>
                        </div>

                        {/* Details Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          {currentScenario.assistantOutput.details.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between"
                            >
                              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-1">
                                {item.label}
                              </div>
                              <div className="text-xs sm:text-sm font-semibold text-slate-200">
                                {item.value}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Action Taken Notification */}
                        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-center gap-2.5">
                          <span className="text-base">🚀</span>
                          <span>
                            <strong>Automated Action:</strong> {currentScenario.assistantOutput.actionTaken}
                          </span>
                        </div>

                        {/* Proactive Tip */}
                        {currentScenario.assistantOutput.proactiveTip && (
                          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
                            <span className="text-base">💡</span>
                            <span>
                              <strong>Proactive Intelligence:</strong>{' '}
                              {currentScenario.assistantOutput.proactiveTip}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 6 Core Super App Capabilities */}
      <section className="section-sm py-20 bg-slate-950/50 relative border-t border-b border-slate-800/80">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-3.5 py-1.5 rounded-full border border-purple-500/30">
              Why It Is a Super App
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 mb-4">
              More Than An Assistant. Your Complete Operations Center.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Secretary unifies the 6 key operational layers of modern life and engineering work into a cohesive,
              context-aware intelligence engine.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {superAppPillars.map((pillar, idx) => (
              <FadeIn key={pillar.id} delay={idx * 0.08}>
                <div className="h-full p-7 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 hover:shadow-[0_10px_30px_rgba(147,51,234,0.15)] transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {pillar.icon}
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/40 border border-purple-800/40 px-2.5 py-1 rounded-full">
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                      {pillar.title}
                    </h3>

                    <p className="text-sm text-slate-300 leading-relaxed font-normal mb-6">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-800/80">
                    {pillar.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <span className="text-purple-400 font-bold">•</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How Secretary Works Architecture */}
      <section className="section-sm py-20 relative">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-3.5 py-1.5 rounded-full border border-purple-500/30">
              Under The Hood
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4">
              How Secretary Thinks & Executes
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              A 4-stage autonomous cognitive architecture designed for precision, deterministic reliability, and complete privacy.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <FadeIn delay={0.1}>
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 relative h-full flex flex-col justify-between">
                <div>
                  <div className="text-3xl font-black text-purple-400/30 mb-2">01</div>
                  <h4 className="text-lg font-bold text-white mb-2">Ambient Perception</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    Securely ingests incoming calendar changes, urgent message signals, task lists, and biometric stress levels without intrusive tracking.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] font-mono text-purple-300">
                  Input layer: Calendar, Mail, Voice, Health
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 relative h-full flex flex-col justify-between">
                <div>
                  <div className="text-3xl font-black text-indigo-400/30 mb-2">02</div>
                  <h4 className="text-lg font-bold text-white mb-2">Cognitive Reasoning</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    Breaks complex requests down into dependency graphs. Verifies availability, constraints, and priorities using deterministic safety rails.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] font-mono text-indigo-300">
                  Planning layer: Multi-Agent LLM Graph
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 relative h-full flex flex-col justify-between">
                <div>
                  <div className="text-3xl font-black text-emerald-400/30 mb-2">03</div>
                  <h4 className="text-lg font-bold text-white mb-2">Autonomous Action</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    Triggers native API calls: writes calendar events, dispatches approved messages, runs code, and coordinates travel itineraries.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] font-mono text-emerald-300">
                  Action layer: Tool Calling & APIs
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 relative h-full flex flex-col justify-between">
                <div>
                  <div className="text-3xl font-black text-cyan-400/30 mb-2">04</div>
                  <h4 className="text-lg font-bold text-white mb-2">Reflective Memory</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    Learns from your corrections and feedback. Progressively mirrors your writing tone and anticipates your favorite working rhythms.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] font-mono text-cyan-300">
                  Memory layer: Local Encrypted Vector DB
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Comparison Matrix Table */}
      <section className="section-sm py-20 bg-slate-950/40 relative">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-3.5 py-1.5 rounded-full border border-purple-500/30">
              The Evolution
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4">
              How Secretary Outperforms Yesterday’s Tools
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              See why switching to an autonomous super app is a leap forward from passive voice assistants and disconnected chat windows.
            </p>
          </FadeIn>

          <FadeIn>
            <div className="max-w-5xl mx-auto overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-xs uppercase font-extrabold tracking-wider">
                    <th className="py-4 px-6 text-slate-400">Capability</th>
                    <th className="py-4 px-6 text-slate-400">Legacy Voice AI</th>
                    <th className="py-4 px-6 text-slate-400">Chatbot Windows</th>
                    <th className="py-4 px-6 text-purple-300 bg-purple-950/40 border-l border-r border-purple-500/30">
                      ⚡ Secretary Super App
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
                  {comparisonData.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6 font-bold text-white">{row.feature}</td>
                      <td className="py-4 px-6 text-slate-400">{row.traditional}</td>
                      <td className="py-4 px-6 text-slate-400">{row.chatbots}</td>
                      <td className="py-4 px-6 font-semibold text-purple-200 bg-purple-950/20 border-l border-r border-purple-500/20">
                        {row.secretary}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Development Roadmap */}
      <section className="section-sm py-20 relative">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-3.5 py-1.5 rounded-full border border-purple-500/30">
              R&D Roadmap
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4">
              Building The Future In The Open
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Secretary is actively being built by the Open Engineering team and student engineering contributors.
            </p>
          </FadeIn>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-emerald-500/40 relative">
              <span className="badge badge-success text-[10px] mb-2">Phase 1 • Done</span>
              <h4 className="text-sm font-bold text-white mb-1">Agent Core & Architecture</h4>
              <p className="text-xs text-slate-400">
                Cognitive reasoning pipeline, safety sandbox, and prompt intent parser.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-purple-950/50 border-2 border-purple-500 relative shadow-[0_0_20px_rgba(147,51,234,0.3)]">
              <span className="badge bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] mb-2">
                Phase 2 • In Progress
              </span>
              <h4 className="text-sm font-bold text-white mb-1">Calendar & Inbox Connectors</h4>
              <p className="text-xs text-slate-300">
                Tool execution, Google/Outlook sync, and tap-to-send draft approval engine.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
              <span className="badge bg-slate-800 text-slate-400 text-[10px] mb-2">Phase 3 • Q3 2026</span>
              <h4 className="text-sm font-bold text-white mb-1">Campus Alpha Wave</h4>
              <p className="text-xs text-slate-400">
                Closed testing with engineering student chapters and academic viva study OS.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
              <span className="badge bg-slate-800 text-slate-400 text-[10px] mb-2">Phase 4 • Q4 2026</span>
              <h4 className="text-sm font-bold text-white mb-1">Public Super App Rollout</h4>
              <p className="text-xs text-slate-400">
                Cross-platform mobile apps, OpenEng Smart Band sync, and developer plugin API.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Early Access Waitlist Form */}
      <section id="waitlist" className="section-sm py-20 relative">
        <div className="container mx-auto px-6">
          <FadeIn>
            <div className="max-w-3xl mx-auto rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-purple-500/40 p-8 sm:p-12 shadow-[0_0_50px_rgba(147,51,234,0.25)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

              <div className="text-center mb-8">
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-3.5 py-1.5 rounded-full border border-purple-500/30">
                  Priority Access
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-3">
                  Be The First To Experience Secretary
                </h2>
                <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
                  Join student engineers, researchers, and creators getting early preview builds and shaping the roadmap.
                </p>
              </div>

              {waitlistSubmitted ? (
                <div className="p-8 rounded-2xl bg-purple-950/40 border border-purple-500/60 text-center space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-3xl border border-emerald-500/40">
                    ✓
                  </div>
                  <h3 className="text-2xl font-bold text-white">You are on the VIP Waitlist!</h3>
                  <p className="text-slate-300 text-sm max-w-md mx-auto">
                    Welcome aboard, <strong>{waitlistName || 'friend'}</strong>. We’ve saved your priority spot for Secretary Alpha.
                  </p>
                  <div className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 border border-purple-500/40 text-purple-300 font-mono text-sm font-bold shadow-inner">
                    Priority Ticket: <span className="text-white">{ticketNumber}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    We’ll send preview download links and product updates to <strong>{waitlistEmail}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={waitlistName}
                        onChange={(e) => setWaitlistName(e.target.value)}
                        placeholder="e.g. Alex Sharma"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={waitlistEmail}
                        onChange={(e) => setWaitlistEmail(e.target.value)}
                        placeholder="e.g. alex@university.edu"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                      What Describes You Best?
                    </label>
                    <select
                      value={waitlistRole}
                      onChange={(e) => setWaitlistRole(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value="Student Engineer">Student Engineer / University Student</option>
                      <option value="Software Developer / Researcher">Software Developer / Tech Researcher</option>
                      <option value="Startup Founder / Entrepreneur">Startup Founder / Entrepreneur</option>
                      <option value="Busy Professional / Creator">Busy Professional / Content Creator</option>
                      <option value="Hardware / IoT Enthusiast">Hardware / IoT Enthusiast</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-base shadow-[0_0_25px_rgba(147,51,234,0.4)] hover:shadow-[0_0_35px_rgba(147,51,234,0.6)] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span>Reserving Your Spot...</span>
                    ) : (
                      <>
                        <span>Claim VIP Early Access Ticket</span>
                        <span>→</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-slate-500 mt-3">
                    Zero spam. We respect your inbox. You can unsubscribe at any time.
                  </p>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-sm py-20 relative">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-3.5 py-1.5 rounded-full border border-purple-500/30">
              Questions & Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Everything you need to know about the Secretary AI Super App project.
            </p>
          </FadeIn>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = faqOpen === index;
              return (
                <FadeIn key={index} delay={index * 0.05}>
                  <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-colors">
                    <button
                      onClick={() => setFaqOpen(isOpen ? null : index)}
                      className="w-full px-6 py-5 text-left font-bold text-sm sm:text-base text-white flex items-center justify-between gap-4 cursor-pointer hover:text-purple-300 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <span className="text-purple-400 text-xl font-mono shrink-0">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/60 pt-4 font-normal">
                        {faq.a}
                      </div>
                    )}
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Back to Products / Ecosystem Footer Note */}
      <section className="section-sm pb-24 pt-10 border-t border-slate-800/80">
        <div className="container mx-auto px-6 text-center">
          <FadeIn>
            <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider font-semibold">
                An Open Engineering R&D Initiative
              </p>
              <h3 className="text-lg font-bold text-white mb-4">
                Exploring other innovations built by Open Engineering?
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/products"
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700"
                >
                  ← All Open Engineering Products
                </Link>
                <Link
                  href="/community"
                  className="px-5 py-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 text-xs font-bold transition-all border border-purple-700/60"
                >
                  Join Engineering Community
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
