'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function CreateCommunityPage() {
  const [shortName, setShortName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [collegeFullName, setCollegeFullName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const calculatedCommunityName = shortName.trim()
    ? `Open Engineering ${shortName.trim().toUpperCase()}`
    : 'Open Engineering [College Short Form]';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/community/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collegeFullName,
          shortName,
          leaderName,
          leaderEmail,
          leaderPhone,
          whatsappLink,
          additionalNotes
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit community application.');
      }

      setLoading(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Failed to submit application:', err);
      setError(err?.message || 'Failed to submit application. Please try again.');
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#eef0f8]">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        
        {/* Navigation / Header */}
        <div className="text-center mb-10">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-purple-700 hover:text-purple-900 transition-colors mb-4 neu-flat px-4 py-2 rounded-full"
          >
            ← Back to Communities
          </Link>
          <span className="badge badge-primary block mx-auto w-max mb-3 px-4 py-1 text-xs font-bold shadow-sm">
            ⚡ Start Your Campus Chapter
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight mb-4">
            How to Start an <span className="gradient-text">Open Engineering</span> Community
          </h1>
          <p className="text-slate-600 text-sm sm:text-base font-medium max-w-2xl mx-auto">
            Follow the simple step-by-step instructions below to establish an official Open Engineering chapter at your college!
          </p>
        </div>

        {/* Post-Submission Message Card */}
        {submitted ? (
          <div className="neu-card p-8 sm:p-12 text-center max-w-2xl mx-auto border border-emerald-300/80 bg-gradient-to-b from-white to-[#f0fdf4] shadow-[10px_10px_25px_rgba(16,185,129,0.15),-10px_-10px_25px_#ffffff] animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
              Application Submitted Successfully!
            </h2>
            
            <div className="p-4 sm:p-6 neu-pressed rounded-2xl mb-8 bg-emerald-50/50 border border-emerald-200/60">
              <p className="text-emerald-950 text-base sm:text-lg font-bold leading-relaxed">
                Your details are delivered to our team, we will shortly verify and contact you.
              </p>
            </div>

            <div className="text-left neu-flat p-5 rounded-xl mb-8 text-xs sm:text-sm text-slate-700 space-y-2">
              <div className="font-bold text-slate-900 mb-2 border-b pb-2">Submission Summary</div>
              <div><span className="font-semibold text-slate-900">College:</span> {collegeFullName || 'Not specified'}</div>
              <div><span className="font-semibold text-slate-900">Community Name:</span> <span className="font-bold text-purple-700">{calculatedCommunityName}</span></div>
              <div><span className="font-semibold text-slate-900">Leader:</span> {leaderName} ({leaderEmail})</div>
              {whatsappLink && <div><span className="font-semibold text-slate-900">WhatsApp Group:</span> <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-purple-700 underline font-medium">{whatsappLink}</a></div>}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/community"
                className="py-3 px-6 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all"
              >
                Back to All Communities
              </Link>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="py-3 px-6 rounded-xl neu-flat hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Step-by-Step Instructions Grid */}
            <div className="space-y-6">
              
              {/* Step 1: Form a Team */}
              <div className="neu-card p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6 relative overflow-hidden border border-purple-200/50">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-600/30">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                    Form a Core Team
                  </h3>
                  <p className="text-slate-600 text-sm font-normal leading-relaxed">
                    Form a team of passionate student leaders, coordinators, and tech enthusiasts who will run and manage the official <strong className="text-slate-900">Open Engineering</strong> community at your college.
                  </p>
                </div>
              </div>

              {/* Step 2: Community Naming Format */}
              <div className="neu-card p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6 relative overflow-hidden border border-purple-200/50">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-600/30">
                  2
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Set Community Name
                  </h3>
                  <p className="text-slate-600 text-sm font-normal mb-4">
                    Your community name must follow the format: <strong className="text-slate-900 font-extrabold">"Open Engineering" + "Your College Name in short form"</strong>
                  </p>
                  
                  <div className="pt-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2.5">Examples of Community Names:</span>
                    <div className="flex flex-wrap gap-2.5">
                      <span className="font-extrabold text-purple-700 neu-flat px-3.5 py-1.5 rounded-lg bg-purple-50 text-xs sm:text-sm">
                        Open Engineering AEC
                      </span>
                      <span className="font-extrabold text-purple-700 neu-flat px-3.5 py-1.5 rounded-lg bg-purple-50 text-xs sm:text-sm">
                        Open Engineering JEC
                      </span>
                      <span className="font-extrabold text-purple-700 neu-flat px-3.5 py-1.5 rounded-lg bg-purple-50 text-xs sm:text-sm">
                        Open Engineering IITG
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Download Logo */}
              <div className="neu-card p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6 relative overflow-hidden border border-purple-200/50">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-600/30">
                  3
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Download Open Engineering Logo
                  </h3>
                  <p className="text-slate-600 text-sm font-normal mb-4">
                    Download the official logo below to use as your WhatsApp group icon and social media branding.
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl neu-pressed p-1.5 bg-white border border-purple-100 shrink-0 flex items-center justify-center">
                      <img src="/logo.png" alt="Open Engineering Logo" className="w-full h-full object-contain" />
                    </div>
                    <a
                      href="/logo.png"
                      download="Open_Engineering_Logo.png"
                      className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Logo
                    </a>
                  </div>
                </div>
              </div>

              {/* Step 4: Create WhatsApp Group */}
              <div className="neu-card p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6 relative overflow-hidden border border-purple-200/50">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-600/30">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                    Create a WhatsApp Group
                  </h3>
                  <p className="text-slate-600 text-sm font-normal leading-relaxed mb-3">
                    Create a WhatsApp group or community for your college engineers. Set the group name following the format (e.g., <strong className="text-purple-700">Open Engineering AEC</strong>, <strong className="text-purple-700">Open Engineering JEC</strong>) and set the downloaded Open Engineering logo as the group avatar icon.
                  </p>
                </div>
              </div>

              {/* Step 5: Follow Us on Social Media */}
              <div className="neu-card p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6 relative overflow-hidden border border-purple-200/50">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-600/30">
                  5
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Follow Us on Instagram & LinkedIn
                  </h3>
                  <p className="text-slate-600 text-sm font-normal mb-4">
                    Follow our official pages to connect with the national ecosystem and get updates on hackathons and resources:
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <a
                      href="https://www.instagram.com/openengineeringworld"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[200px] py-3 px-5 rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      Follow on Instagram
                    </a>

                    <a
                      href="https://www.linkedin.com/company/openengineeringworld"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[200px] py-3 px-5 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      Follow on LinkedIn
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Step 6: Registration Form */}
            <div className="neu-card p-6 sm:p-10 border border-purple-300/60 shadow-[8px_8px_22px_rgba(147,51,234,0.12),-8px_-8px_20px_#ffffff]">
              <div className="text-center mb-8">
                <span className="badge badge-warning mb-2 text-xs">Step 6 of 6</span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
                  Submit Community Application Form
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm font-medium mt-1">
                  Fill in your details below to register your community chapter with the Open Engineering team.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-bold flex items-center gap-2">
                  <svg className="w-5 h-5 shrink-0 fill-current" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="college-full-name" className="block text-xs font-extrabold text-slate-800 mb-1.5">
                    College Full Name *
                  </label>
                  <input
                    id="college-full-name"
                    type="text"
                    required
                    value={collegeFullName}
                    onChange={(e) => setCollegeFullName(e.target.value)}
                    placeholder="e.g. Assam Engineering College"
                    className="neu-input px-4 py-3 text-xs sm:text-sm w-full font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="college-short-name" className="block text-xs font-extrabold text-slate-800 mb-1.5">
                      College Short Form *
                    </label>
                    <input
                      id="college-short-name"
                      type="text"
                      required
                      value={shortName}
                      onChange={(e) => setShortName(e.target.value)}
                      placeholder="e.g. AEC"
                      className="neu-input px-4 py-3 text-xs sm:text-sm w-full font-medium uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                      Assigned Community Name
                    </label>
                    <div className="neu-pressed px-4 py-3 text-xs sm:text-sm w-full font-bold text-purple-700 border border-purple-200">
                      {calculatedCommunityName}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="leader-name" className="block text-xs font-extrabold text-slate-800 mb-1.5">
                      Lead / Representative Full Name *
                    </label>
                    <input
                      id="leader-name"
                      type="text"
                      required
                      value={leaderName}
                      onChange={(e) => setLeaderName(e.target.value)}
                      placeholder="e.g. Rahul Das"
                      className="neu-input px-4 py-3 text-xs sm:text-sm w-full font-medium"
                    />
                  </div>

                  <div>
                    <label htmlFor="leader-email" className="block text-xs font-extrabold text-slate-800 mb-1.5">
                      Lead Email Address *
                    </label>
                    <input
                      id="leader-email"
                      type="email"
                      required
                      value={leaderEmail}
                      onChange={(e) => setLeaderEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      className="neu-input px-4 py-3 text-xs sm:text-sm w-full font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="leader-phone" className="block text-xs font-extrabold text-slate-800 mb-1.5">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      id="leader-phone"
                      type="tel"
                      required
                      value={leaderPhone}
                      onChange={(e) => setLeaderPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="neu-input px-4 py-3 text-xs sm:text-sm w-full font-medium"
                    />
                  </div>

                  <div>
                    <label htmlFor="whatsapp-link" className="block text-xs font-extrabold text-slate-800 mb-1.5">
                      Created WhatsApp Group Invite Link *
                    </label>
                    <input
                      id="whatsapp-link"
                      type="url"
                      required
                      value={whatsappLink}
                      onChange={(e) => setWhatsappLink(e.target.value)}
                      placeholder="https://chat.whatsapp.com/..."
                      className="neu-input px-4 py-3 text-xs sm:text-sm w-full font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="additional-notes" className="block text-xs font-extrabold text-slate-800 mb-1.5">
                    Core Team Members & Additional Details (Optional)
                  </label>
                  <textarea
                    id="additional-notes"
                    rows={3}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="List core team member names, Instagram handle, or any message for the verifying team..."
                    className="neu-input px-4 py-3 text-xs sm:text-sm w-full font-medium resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-sm shadow-[4px_4px_14px_rgba(0,0,0,0.35),-4px_-4px_14px_#ffffff] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <span>Submit Application Details 🚀</span>
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

