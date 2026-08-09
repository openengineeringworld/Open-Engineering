'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/verify-auth');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            router.push('/admin/dashboard');
            return;
          }
        }
      } catch (err) {
        console.error('Error checking auth:', err);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Invalid admin credentials');
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-xs font-semibold tracking-wider">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden text-slate-100 select-none">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Header Badge & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold mb-4 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            Protected Admin Portal
          </div>

          <div className="flex justify-center mb-3">
            <Logo size="lg" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2">
            Administrator Sign In
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-normal mt-1">
            Access internal dashboard to verify campus clubs & manage requests
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-[#121827]/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2.5">
              <svg className="w-5 h-5 shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">
                Admin Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full bg-[#1a2234] border border-slate-700/70 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full bg-[#1a2234] border border-slate-700/70 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400 hover:text-purple-400 transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In to Admin Dashboard →</span>
              )}
            </button>
          </form>
        </div>

        {/* Security Footer Note */}
        <div className="text-center mt-6 text-[11px] text-slate-500 font-medium">
          🔒 Encrypted administrative session. Unauthorized access attempts are monitored.
        </div>

      </div>
    </div>
  );
}
