'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('full_name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = createClient();

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    router.push('/onboarding');
    router.refresh();
  }

  return (
    <div className="neu-card p-8">
      <h1 className="text-2xl font-bold mb-2 text-center">Create Account</h1>
      <p className="text-text-muted text-sm text-center mb-8">Join the engineering community</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-text-muted mb-2">Full Name</label>
          <input id="full_name" name="full_name" required className="neu-input" placeholder="Your full name" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-muted mb-2">Email</label>
          <input id="email" name="email" type="email" required className="neu-input" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-muted mb-2">Password</label>
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
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-purple-700 font-semibold text-xs transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 014.122-.863c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-5.875-1.002a3 3 0 11-4.243-4.243M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && <p className="text-error text-sm text-center">{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <p className="text-text-muted text-sm text-center mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign In
        </Link>
      </p>
    </div>
  );
}
