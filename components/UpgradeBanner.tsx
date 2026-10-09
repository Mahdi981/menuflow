'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Crown, Clock, ArrowRight, AlertTriangle } from 'lucide-react';
import type { Subscription } from '@/lib/hooks/useSubscription';

type Props = {
  subscription: Subscription | null;
  trialDaysLeft?: number;
  isTrialActive?: boolean;
};

export default function UpgradeBanner({
  subscription,
  trialDaysLeft = 0,
  isTrialActive = false,
}: Props) {
  // إذا ما في subscription أو Starter → ما نعرض شي
  if (!subscription || subscription.plan === 'starter') {
    return null;
  }

  // إذا active → عرض العادي
  if (subscription.status === 'active') {
    return null;
  }

  // إذا trial → عرض countdown
  if (isTrialActive && trialDaysLeft > 0) {
    const isUrgent = trialDaysLeft <= 3;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-5 mb-6 border ${
          isUrgent
            ? 'bg-red-500/10 border-red-500/30'
            : 'bg-amber-custom/10 border-amber-custom/30'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isUrgent
                ? 'bg-red-500/20 text-red-500'
                : 'bg-amber-custom/20 text-amber-custom'
            }`}
          >
            {isUrgent ? <AlertTriangle size={20} /> : <Clock size={20} />}
          </div>
          <div className="flex-1">
            <p className="font-bold text-ink">
              {isUrgent
                ? `Trial ends in ${trialDaysLeft} day${trialDaysLeft === 1 ? '' : 's'}!`
                : `Trial: ${trialDaysLeft} days left`}
            </p>
            <p className="text-sm text-ink-muted mt-1">
              You're on <strong className="text-brand uppercase">{subscription.plan}</strong> trial.
              Subscribe to keep all features after the trial ends.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 text-sm text-brand font-semibold mt-2 hover:underline"
            >
              Subscribe now <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // إذا expired/cancelled/failed
  if (
    subscription.status === 'expired' ||
    subscription.status === 'cancelled' ||
    subscription.status === 'failed'
  ) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 mb-6 border bg-red-500/10 border-red-500/30"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-ink">
              Your subscription has ended
            </p>
            <p className="text-sm text-ink-muted mt-1">
              You're now on the Free Starter plan. Subscribe to unlock all
              features again.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 text-sm text-brand font-semibold mt-2 hover:underline"
            >
              View plans <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}