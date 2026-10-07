'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  User,
  Loader2,
  ChefHat,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { DEFAULT_PLANS, type PlanId } from '@/lib/plans';

const supabase = createClient();

const VALID_PLANS: PlanId[] = ['starter', 'professional', 'business'];

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Plan من URL
  const planParam = searchParams.get('plan') as PlanId | null;
  const selectedPlan: PlanId =
    planParam && VALID_PLANS.includes(planParam) ? planParam : 'starter';
  const planInfo = DEFAULT_PLANS[selectedPlan];

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. إنشاء الحساب
      const { data: authData, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            selected_plan: selectedPlan, // ← نحفظ الخطة في metadata
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signupError) throw signupError;

      // 2. إذا في session → يروح مباشرة للـ dashboard
      if (authData.session) {
        // 3. تخزين الـ plan في localStorage مؤقتاً
        // (رح نستخدمه عند first setup)
        localStorage.setItem('menuflow_selected_plan', selectedPlan);
        router.push('/dashboard/setup');
      } else {
        // 4. لازم تأكيد الإيميل
        setError('Check your email to confirm your account');
      }
    } catch (err: any) {
      setError(err.message ?? 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      localStorage.setItem('menuflow_selected_plan', selectedPlan);
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (err: any) {
      setError(err.message ?? 'Google signup failed');
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
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center">
            <ChefHat size={20} className="text-white" />
          </div>
          <span className="font-bold text-2xl text-ink">MenuFlow</span>
        </Link>

        {/* Card */}
        <div className="bg-surface border border-line rounded-3xl p-6 md:p-8 shadow-soft">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-ink">Create your account</h1>
            <p className="text-sm text-ink-muted mt-1">
              Start your 14-day free trial
            </p>
          </div>

          {/* Selected Plan Badge */}
          <div className="mb-6 p-3 rounded-xl bg-brand/5 border border-brand/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
                <ChefHat size={14} className="text-brand" />
              </div>
              <div>
                <p className="text-xs text-ink-muted uppercase tracking-wider">
                  Selected Plan
                </p>
                <p className="text-sm font-bold text-ink uppercase">
                  {planInfo.name}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-brand">
                ${planInfo.price_usd}
              </p>
              <p className="text-[10px] text-ink-muted">/ month</p>
            </div>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white border border-line hover:bg-cream transition text-sm font-medium text-ink mb-4"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-line" />
            <span className="text-xs text-ink-muted">or</span>
            <div className="flex-1 h-px bg-line" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink mb-1.5 block">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full bg-white border border-line rounded-xl pl-10 pr-4 py-3 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </div>

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

            <div>
              <label className="text-sm font-medium text-ink mb-1.5 block">
                Password
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

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-semibold shadow-brand transition disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Start Free Trial
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-ink-muted mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}