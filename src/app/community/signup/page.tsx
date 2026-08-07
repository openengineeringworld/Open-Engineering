'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function CommunitySignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/onboarding';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const fullName = (formData.get('full_name') as string).trim();
    const email = (formData.get('email') as string).trim();
    const password = formData.get('password') as string;

    const supabase = createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      router.push(redirect);
      router.refresh();
    }
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
          <h1 className="text-3xl font-extrabold mb-2">Join Campus Chapter</h1>
          <p className="text-text-muted text-xs sm:text-sm font-normal">
            Create an account to become a College Ambassador or join your campus community.
          </p>
        </div>

        <div className="neu-card p-8 border border-purple-300/40 shadow-[8px_8px_20px_rgba(147,51,234,0.12),-8px_-8px_20px_#ffffff]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="full_name" className="block text-xs font-bold text-slate-700 mb-2">
                Full Name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                className="neu-input"
                placeholder="e.g. Alex Sharma"
              />
            </div>
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
                placeholder="you@college.edu"
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
                  minLength={6}
                  className="neu-input !pr-12"
                  placeholder="Min 6 characters"
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

            {error && <p className="text-rose-600 text-xs font-bold text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3.5 shadow-[4px_4px_14px_rgba(147,51,234,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              {loading ? 'Creating Account...' : 'Sign Up & Continue ⚡'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-purple-200/40 text-center space-y-3">
            <p className="text-text-muted text-xs font-medium">
              Already have an account?{' '}
              <Link href="/community/login" className="text-purple-700 hover:underline font-extrabold">
                Sign In to Dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CommunitySignUpPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="loading-spinner" /></div>}>
      <CommunitySignUpForm />
    </Suspense>
  );
}
