'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Check,
  X,
  Sparkles,
  Rocket,
  Building2,
  ArrowRight,
} from 'lucide-react';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    period: 'forever free',
    description: 'Perfect for trying MenuFlow',
    icon: Sparkles,
    color: 'gray',
    popular: false,
    features: [
      { label: '1 Restaurant', included: true },
      { label: 'Up to 30 products', included: true },
      { label: '20 orders / month', included: true },
      { label: 'Public Menu + QR Code', included: true },
      { label: 'Basic orders dashboard', included: true },
      { label: 'Custom domain', included: false },
      { label: 'WhatsApp notifications', included: false },
      { label: 'Priority support', included: false },
    ],
    cta: 'Get Started Free',
    href: '/signup',
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 29,
    period: 'per month',
    description: 'For growing restaurants',
    icon: Rocket,
    color: 'orange',
    popular: true,
    features: [
      { label: '1 Restaurant', included: true },
      { label: 'Unlimited products', included: true },
      { label: '500 orders / month', included: true },
      { label: 'Public Menu + QR Code', included: true },
      { label: 'Full orders dashboard', included: true },
      { label: 'Offers & coupons', included: true },
      { label: 'Analytics & insights', included: true },
      { label: 'Custom domain', included: false },
      { label: 'WhatsApp notifications', included: false },
      { label: 'Priority support', included: false },
    ],
    cta: 'Start 14-day Free Trial',
    href: '/signup?plan=professional',
  },
  {
    id: 'business',
    name: 'Business',
    price: 79,
    period: 'per month',
    description: 'For serious restaurants',
    icon: Building2,
    color: 'blue',
    popular: false,
    features: [
      { label: '1 Restaurant', included: true },
      { label: 'Unlimited products', included: true },
      { label: 'Unlimited orders', included: true },
      { label: 'Public Menu + QR Code', included: true },
      { label: 'Full orders dashboard', included: true },
      { label: 'Offers & coupons', included: true },
      { label: 'Analytics & insights', included: true },
      { label: 'Custom domain', included: true },
      { label: 'WhatsApp notifications', included: true },
      { label: 'Priority support', included: true },
    ],
    cta: 'Start 14-day Free Trial',
    href: '/signup?plan=business',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-medium mb-6">
            <Sparkles size={14} />
            Simple, transparent pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Pricing that scales
            <br />
            with your restaurant
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Start free. Upgrade when you grow. Cancel anytime.
          </p>
        </motion.div>
      </div>

      {/* Plans */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, idx) => {
            const Icon = plan.icon;
            const isPopular = plan.popular;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative rounded-3xl p-6 md:p-8 border-2 transition ${
                  isPopular
                    ? 'border-orange-500 bg-gradient-to-b from-orange-500/10 to-transparent shadow-2xl shadow-orange-500/20'
                    : 'border-white/10 bg-white/[0.02]'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold">
                    MOST POPULAR
                  </div>
                )}

                {/* Icon + Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      plan.color === 'orange'
                        ? 'bg-orange-500/20 text-orange-400'
                        : plan.color === 'blue'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-xs text-gray-500">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-sm text-gray-500">/ {plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li
                      key={f.label}
                      className="flex items-center gap-2.5 text-sm"
                    >
                      {f.included ? (
                        <Check size={16} className="text-green-400 shrink-0" />
                      ) : (
                        <X size={16} className="text-gray-600 shrink-0" />
                      )}
                      <span
                        className={
                          f.included ? 'text-gray-300' : 'text-gray-600'
                        }
                      >
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={plan.href}
                  className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold transition ${
                    isPopular
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-90'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {plan.cta}
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
              className="text-orange-400 underline"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}