'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Mail,
  Loader2,
  ChefHat,
  ArrowLeft,
  Check,
  AlertCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

      if (resetError) throw resetError;

      setSent(true);
    } catch (err: any) {
      setError(err.message ?? 'Failed to send reset email');
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
          {sent ? (
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
                Check your email
              </h1>
              <p className="text-sm text-ink-muted mb-6">
                We sent a password reset link to{' '}
                <span className="font-semibold text-ink">{email}</span>
              </p>

              <div className="bg-brand/5 border border-brand/20 rounded-xl p-4 text-left mb-6">
                <p className="text-xs text-ink-muted">
                  💡 Didn't receive it? Check your <strong>spam folder</strong>,
                  or{' '}
                  <button
                    onClick={() => setSent(false)}
                    className="text-brand font-semibold hover:underline"
                  >
                    try again
                  </button>
                  .
                </p>
              </div>

              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-sm text-brand font-semibold hover:underline"
              >
                <ArrowLeft size={14} />
                Back to sign in
              </Link>
            </motion.div>
          ) : (
            /* ============ FORM ============ */
            <>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-brand transition mb-4"
              >
                <ArrowLeft size={14} />
                Back to sign in
              </Link>

              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-ink">Reset password</h1>
                <p className="text-sm text-ink-muted mt-1">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-ink mb-1.5 block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
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
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
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