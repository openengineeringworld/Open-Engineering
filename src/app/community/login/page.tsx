'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function CommunityLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/community/dashboard';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/community/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign in. Please check your credentials.');
      }

      router.push(redirectUrl);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password.');
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen pt-36 pb-24 bg-[#eef0f8]">
      <div className="container mx-auto px-4 sm:px-6 max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-purple-700 hover:text-purple-900 transition-colors mb-4 neu-flat px-4 py-2 rounded-full"
          >
            ← Back to Communities
          </Link>
          <span className="badge badge-primary block mx-auto w-max mb-3 px-3.5 py-1 text-xs font-extrabold shadow-sm">
            ⚡ Community Ambassador Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight mb-2">
            Ambassador Sign In
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
            Enter the email and password you created during your community application form fillup.
          </p>
        </div>

        {/* Card */}
        <div className="neu-card p-6 sm:p-8 border border-purple-300/60 shadow-[10px_10px_25px_rgba(147,51,234,0.14),-10px_-10px_25px_#ffffff]">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-extrabold flex items-start gap-2.5 shadow-sm">
              <svg className="w-5 h-5 shrink-0 fill-current text-rose-600 mt-0.5" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Field 1: Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                Ambassador Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="neu-input px-4 py-3 text-xs sm:text-sm w-full font-medium"
                placeholder="e.g. rahul@example.com"
              />
            </div>

            {/* Field 2: Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="neu-input px-4 py-3 text-xs sm:text-sm w-full font-medium !pr-16"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 text-slate-500 hover:text-purple-700 font-extrabold text-[11px] uppercase transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-black text-xs sm:text-sm shadow-[4px_4px_14px_rgba(0,0,0,0.35),-4px_-4px_14px_#ffffff] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating Ambassador...</span>
                </div>
              ) : (
                <span>Sign In to Dashboard ⚡</span>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-purple-200/40 text-center space-y-2">
            <p className="text-slate-600 text-xs font-medium">
              Haven&apos;t registered your campus chapter yet?
            </p>
            <Link
              href="/community/create"
              className="inline-block text-purple-700 hover:text-purple-900 font-extrabold text-xs underline underline-offset-4 transition-colors"
            >
              Fill out Community Application Form →
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

export default function CommunityLoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-32"><div className="loading-spinner" /></div>}>
      <CommunityLoginForm />
    </Suspense>
  );
}
