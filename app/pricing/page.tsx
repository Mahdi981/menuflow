'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  X,
  Sparkles,
  Rocket,
  Building2,
  ArrowRight,
  Loader2,
  Gift,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  formatLimit,
  DEFAULT_PLANS,
  type Plan,
  type PlanId,
} from '@/lib/plans';

const supabase = createClient();

const PLAN_ICONS: Record<PlanId, any> = {
  starter: Sparkles,
  professional: Rocket,
  business: Building2,
};

const PLAN_COLORS: Record<PlanId, 'gray' | 'orange' | 'blue'> = {
  starter: 'gray',
  professional: 'orange',
  business: 'blue',
};

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error || !data || data.length === 0) {
        // Fallback
        setPlans(Object.values(DEFAULT_PLANS));
      } else {
        setPlans(data as Plan[]);
      }
      setLoading(false);
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/30 text-brand text-xs font-medium mb-6">
            <Sparkles size={14} />
            Simple, transparent pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Pricing that scales
            <br />
            with your restaurant
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Start with a 14-day free trial. Cancel anytime.
          </p>
        </motion.div>
      </div>

      {/* Plans */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, idx) => {
            const Icon = PLAN_ICONS[plan.id] ?? Sparkles;
            const isPopular = plan.id === 'professional';
            const color = PLAN_COLORS[plan.id] ?? 'gray';

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative rounded-3xl p-6 md:p-8 border-2 transition ${
                  isPopular
                    ? 'border-brand bg-gradient-to-b from-brand/10 to-transparent shadow-2xl shadow-brand/20'
                    : 'border-white/10 bg-white/[0.02]'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-brand to-brand-dark text-white text-xs font-bold shadow-brand">
                    MOST POPULAR
                  </div>
                )}

                {/* Icon + Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      color === 'orange'
                        ? 'bg-brand/20 text-brand'
                        : color === 'blue'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-xs text-gray-500">
                      {plan.description ?? ''}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">
                      ${plan.price_usd}
                    </span>
                    <span className="text-sm text-gray-500">/ month</span>
                  </div>

                  {plan.free_trial_days > 0 && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium">
                      <Gift size={12} />
                      {plan.free_trial_days}-day free trial
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {/* Auto-generated from plan limits */}
                  <FeatureItem
                    label={`${formatLimit(plan.max_categories)} Categor${
                      plan.max_categories === 1 ? 'y' : 'ies'
                    }`}
                  />
                  <FeatureItem
                    label={`${formatLimit(plan.max_products)} Product${
                      plan.max_products === 1 ? '' : 's'
                    }`}
                  />
                  <FeatureItem
                    label={`${formatLimit(plan.max_orders_per_month)} Orders / month`}
                  />

                  {/* Custom features */}
                  {plan.features?.map((f) => (
                    <FeatureItem
                      key={f.label}
                      label={f.label}
                      included={f.included}
                    />
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={`/auth/signup?plan=${plan.id}`}
                  className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold transition ${
                    isPopular
                      ? 'bg-gradient-to-r from-brand to-brand-dark text-white hover:opacity-90 shadow-brand'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  Start {plan.free_trial_days}-day Trial
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>
            Need something custom?{' '}
            <a
              href="mailto:hello@meinfina.com"
              className="text-brand underline"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({
  label,
  included = true,
}: {
  label: string;
  included?: boolean;
}) {
  return (
    <li className="flex items-center gap-2.5 text-sm">
      {included ? (
        <Check size={16} className="text-green-400 shrink-0" />
      ) : (
        <X size={16} className="text-gray-600 shrink-0" />
      )}
      <span className={included ? 'text-gray-300' : 'text-gray-600'}>
        {label}
      </span>
    </li>
  );
}