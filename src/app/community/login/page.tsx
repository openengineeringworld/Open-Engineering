'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function CommunityLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/community/dashboard';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_profile_complete')
        .eq('id', user.id)
        .maybeSingle();

      if (profile && !profile.is_profile_complete) {
        router.push('/onboarding');
      } else {
        router.push(redirect);
      }
    } else {
      router.push(redirect);
    }
    router.refresh();
  }

  return (
    <section className="section pt-36 pb-24">
      <div className="container mx-auto px-6 max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-purple-700 hover:underline mb-4"
          >
            ← Back to Community
          </Link>
          <span className="badge badge-primary mb-3">College Ambassador</span>
          <h1 className="text-3xl font-extrabold mb-2">Ambassador Sign In</h1>
          <p className="text-text-muted text-xs sm:text-sm font-normal">
            Sign in to manage your campus chapter & access your ambassador dashboard.
          </p>
        </div>

        <div className="neu-card p-8 border border-purple-300/40 shadow-[8px_8px_20px_rgba(147,51,234,0.12),-8px_-8px_20px_#ffffff]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="neu-input"
                placeholder="ambassador@college.edu"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="neu-input !pr-12"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-purple-700 font-bold text-xs transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-purple-700 text-xs font-bold hover:underline">
                Forgot Password?
              </Link>
            </div>

            {error && <p className="text-rose-600 text-xs font-bold text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3.5 shadow-[4px_4px_14px_rgba(147,51,234,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              {loading ? 'Signing In...' : 'Sign In to Dashboard ⚡'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-purple-200/40 text-center">
            <p className="text-text-muted text-xs font-medium">
              Want to launch or join a campus chapter?{' '}
              <Link href="/community/signup" className="text-purple-700 hover:underline font-extrabold">
                Sign Up / Join Chapter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CommunityLoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="loading-spinner" /></div>}>
      <CommunityLoginForm />
    </Suspense>
  );
}
