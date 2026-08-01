'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  async function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirm = formData.get('confirm_password') as string;

    if (password !== confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (updateError) { setError(updateError.message); return; }
    setSuccess('Password updated successfully');
    (e.target as HTMLFormElement).reset();
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  async function handleDeleteAccount() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Delete profile (cascades in Supabase)
    await supabase.from('profiles').delete().eq('id', user.id);
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="text-2xl font-black text-slate-900">Settings</h1>

      {/* Change Password */}
      <div className="neu-card p-6 sm:p-8 border border-purple-300/40 shadow-[6px_6px_16px_rgba(147,51,234,0.1),-6px_-6px_16px_#ffffff]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 neu-convex rounded-xl flex items-center justify-center text-purple-600 border border-white/80">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-base font-extrabold text-slate-900">Change Password</h2>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">New Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                className="neu-input !pr-12 py-3.5 px-4 text-sm border border-purple-200/60 text-slate-900"
                placeholder="Min 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-purple-700 transition-colors"
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
          <div>
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Confirm Password</label>
            <div className="relative">
              <input
                name="confirm_password"
                type={showConfirm ? 'text' : 'password'}
                required
                minLength={6}
                className="neu-input !pr-12 py-3.5 px-4 text-sm border border-purple-200/60 text-slate-900"
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-purple-700 transition-colors"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? (
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

          {error && (
            <div className="p-3 rounded-xl neu-flat border border-rose-300 text-rose-800 text-xs font-bold">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 rounded-xl neu-flat border border-emerald-300 text-emerald-800 text-xs font-bold">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="py-3 px-6 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-[3px_3px_10px_rgba(0,0,0,0.3),-3px_-3px_10px_#ffffff] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Account Section */}
      <div className="neu-card p-6 sm:p-8 border border-purple-300/40 shadow-[6px_6px_16px_rgba(147,51,234,0.1),-6px_-6px_16px_#ffffff]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 neu-convex rounded-xl flex items-center justify-center text-slate-600 border border-white/80">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <h2 className="text-base font-extrabold text-slate-900">Account</h2>
        </div>
        <p className="text-text-muted text-xs mb-4 font-normal">Sign out of your account on this device.</p>
        <button
          onClick={handleSignOut}
          className="py-2.5 px-5 rounded-xl neu-card text-rose-700 font-bold text-xs border border-rose-200/60 hover:text-rose-900 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Sign Out
        </button>
      </div>

      {/* Danger Zone */}
      <div className="neu-card p-6 sm:p-8 border border-rose-300/50 shadow-[6px_6px_16px_rgba(225,29,72,0.08),-6px_-6px_16px_#ffffff]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 neu-convex rounded-xl flex items-center justify-center text-rose-600 border border-white/80">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-base font-extrabold text-rose-800">Danger Zone</h2>
        </div>
        <p className="text-text-muted text-xs mb-4 font-normal">Permanently delete your account and all associated data. This action cannot be undone.</p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Delete Account
          </button>
        ) : (
          <div className="p-4 rounded-xl neu-flat border border-rose-300 space-y-3">
            <p className="text-rose-800 text-xs font-bold">Are you absolutely sure? This will permanently delete your account.</p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                className="py-2 px-4 rounded-xl bg-rose-700 text-white font-bold text-xs hover:bg-rose-800 transition-colors"
              >
                Yes, Delete My Account
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="py-2 px-4 rounded-xl neu-card text-slate-700 font-bold text-xs border border-purple-200/60"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
