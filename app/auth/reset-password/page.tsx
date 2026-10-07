'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Lock,
  Loader2,
  ChefHat,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Supabase بيعمل session مؤقتة من الرابط
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsReady(true);
      } else {
        setError('Invalid or expired reset link. Please request a new one.');
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2500);
    } catch (err: any) {
      setError(err.message ?? 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mb-8"
        >
          <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center">
            <ChefHat size={20} className="text-white" />
          </div>
          <span className="font-bold text-2xl text-ink">MenuFlow</span>
        </Link>

        {/* Card */}
        <div className="bg-surface border border-line rounded-3xl p-6 md:p-8 shadow-soft">
          {success ? (
            /* ============ SUCCESS ============ */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" strokeWidth={3} />
              </div>
              <h1 className="text-2xl font-bold text-ink mb-2">
                Password updated!
              </h1>
              <p className="text-sm text-ink-muted mb-4">
                Redirecting you to sign in...
              </p>
              <Loader2 size={20} className="animate-spin text-brand mx-auto" />
            </motion.div>
          ) : !isReady ? (
            /* ============ LOADING ============ */
            <div className="text-center py-8">
              <Loader2 size={32} className="animate-spin text-brand mx-auto mb-4" />
              <p className="text-sm text-ink-muted">
                Verifying reset link...
              </p>
            </div>
          ) : (
            /* ============ FORM ============ */
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-ink">
                  New password
                </h1>
                <p className="text-sm text-ink-muted mt-1">
                  Enter your new password below
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-ink mb-1.5 block">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      minLength={6}
                      className="w-full bg-white border border-line rounded-xl pl-10 pr-10 py-3 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-ink mb-1.5 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      required
                      minLength={6}
                      className="w-full bg-white border border-line rounded-xl pl-10 pr-4 py-3 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-sm flex items-start gap-2">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-semibold shadow-brand transition disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}