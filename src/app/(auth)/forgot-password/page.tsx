'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  }

  return (
    <div className="neu-card p-8">
      <h1 className="text-2xl font-bold mb-2 text-center">Forgot Password</h1>
      <p className="text-text-muted text-sm text-center mb-8">
        Enter your email and we&apos;ll send you a reset link
      </p>

      {sent ? (
        <div className="text-center py-6">
          <span className="text-5xl block mb-4">📧</span>
          <h3 className="text-lg font-semibold mb-2">Check your email</h3>
          <p className="text-text-muted text-sm mb-6">
            We&apos;ve sent a password reset link to your email address.
          </p>
          <Link href="/login" className="btn btn-outline btn-sm">
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-muted mb-2">Email</label>
            <input id="email" name="email" type="email" required className="neu-input" placeholder="you@example.com" />
          </div>

          {error && <p className="text-error text-sm text-center">{error}</p>}

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <p className="text-text-muted text-sm text-center">
            <Link href="/login" className="text-primary hover:underline">
              Back to Sign In
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
