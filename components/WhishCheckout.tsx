'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Copy,
  Phone,
  Mail,
  Store,
  User,
  CreditCard,
  Loader2,
  ArrowRight,
  Shield,
  Clock,
  Wallet,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils/formatCurrency';

const WHISH_NUMBER = '70 053 406';
const WHATSAPP_NUMBER = '96170053406';

const PLANS = {
  professional: {
    name: 'Professional',
    price: 29,
    features: [
      '50 Categories',
      'Unlimited Products',
      '500 Orders / month',
      'Offers & Coupons',
      'Analytics',
    ],
  },
  business: {
    name: 'Business',
    price: 79,
    features: [
      'Unlimited Everything',
      'Custom Domain',
      'Priority Support',
      'Multi-location',
      'API Access',
    ],
  },
} as const;

type Props = {
  plan: 'professional' | 'business';
  user: any;
  existingRestaurant: any;
};

export default function WhishCheckout({ plan, user, existingRestaurant }: Props) {
  const [supabase] = useState(() => createClient());
  const planData = PLANS[plan];

  const [form, setForm] = useState({
    restaurant_name: existingRestaurant?.name ?? '',
    owner_name: user?.user_metadata?.full_name ?? '',
    phone: existingRestaurant?.phone ?? '',
    email: user?.email ?? '',
  });

  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!form.restaurant_name.trim()) return 'اسم المطعم مطلوب';
    if (!form.owner_name.trim()) return 'اسم صاحب المطعم مطلوب';
    if (!form.phone.trim()) return 'رقم الهاتف مطلوب';
    if (!/^(\+961|961|0)?(3|70|71|76|78|79|81)\d{6}$/.test(form.phone.replace(/\s/g, '')))
      return 'رقم هاتف لبناني غير صالح';
    if (!form.email.trim() || !form.email.includes('@'))
      return 'البريد الإلكتروني غير صالح';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const { data, error: insertError } = await supabase
        .from('subscription_requests')
        .insert({
          restaurant_id: existingRestaurant?.id ?? null,
          restaurant_name: form.restaurant_name.trim(),
          owner_name: form.owner_name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim().toLowerCase(),
          plan,
          amount_usd: planData.price,
          payment_method: 'whish',
          status: 'pending',
        })
        .select()
        .single();

      if (insertError || !data) {
        throw new Error(insertError?.message ?? 'Failed to create request');
      }

      setCreated(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyWhish = async () => {
    await navigator.clipboard.writeText(WHISH_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openWhatsApp = () => {
    if (!created) return;

    const message = `مرحباً 👋

أنا ${form.owner_name}، صاحب مطعم "${form.restaurant_name}".

بدي أفعّل خطة *${planData.name}* على MenuFlow.

📋 *تفاصيل الطلب:*
• الخطة: ${planData.name}
• المبلغ: $${planData.price}
• الرقم المرجعي: *${created.reference_number}*

📱 *بياناتي:*
• الاسم: ${form.owner_name}
• المطعم: ${form.restaurant_name}
• الهاتف: ${form.phone}
• الإيميل: ${form.email}

💰 رح أحوّل المبلغ على Whish Money الآن.

رقم Whish: ${WHISH_NUMBER}

شكراً! 🌹`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // ============ SUCCESS VIEW ============
  if (created) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Success */}
        <div className="bg-surface border border-line rounded-3xl p-6 md:p-8 shadow-soft mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto mb-5"
          >
            <Check size={40} className="text-green-600" strokeWidth={3} />
          </motion.div>

          <h2 className="text-2xl font-bold text-ink text-center mb-2">
            Almost there! 🎉
          </h2>
          <p className="text-sm text-ink-muted text-center mb-6">
            Your request has been created. Now send the payment via Whish.
          </p>

          {/* Reference */}
          <div className="bg-cream rounded-2xl p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-ink-muted uppercase tracking-wider">
                Reference Number
              </span>
              <span className="text-[10px] text-brand font-bold uppercase">
                Keep this!
              </span>
            </div>
            <p className="font-mono text-lg font-bold text-brand">
              {created.reference_number}
            </p>
          </div>

          {/* Step 1: Whish */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-brand text-white text-xs font-bold flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-ink">
                Transfer to Whish Money
              </h3>
            </div>

            <div className="bg-brand/5 border border-brand/20 rounded-2xl p-5">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center text-brand">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-ink-muted">Whish Number</p>
                    <p className="font-mono font-bold text-ink text-lg">
                      {WHISH_NUMBER}
                    </p>
                  </div>
                </div>
                <button
                  onClick={copyWhish}
                  className="p-2.5 rounded-xl bg-white border border-line hover:border-brand transition"
                >
                  {copied ? (
                    <Check size={18} className="text-green-600" />
                  ) : (
                    <Copy size={18} className="text-ink-muted" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-brand/10">
                <span className="text-sm text-ink-muted">Amount</span>
                <span className="font-bold text-brand text-xl">
                  ${planData.price}
                </span>
              </div>
            </div>

            <p className="text-xs text-ink-muted mt-3 flex items-start gap-1.5">
              <Clock size={12} className="mt-0.5 shrink-0" />
              Send the exact amount (${planData.price}). Request expires in 48h.
            </p>
          </div>

          {/* Step 2: WhatsApp */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-brand text-white text-xs font-bold flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-ink">Confirm on WhatsApp</h3>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openWhatsApp}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-base shadow-lg transition"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Send confirmation on WhatsApp
            </motion.button>

            <p className="text-xs text-ink-muted mt-3 text-center">
              We'll activate your subscription within 24 hours
            </p>
          </div>

          {/* Note */}
          <div className="bg-amber-custom/10 border border-amber-custom/30 rounded-xl p-4">
            <p className="text-xs text-ink">
              💡 <strong>Tip:</strong> Send us a screenshot of the Whish
              transfer on WhatsApp to speed up activation.
            </p>
          </div>
        </div>

        {/* Support */}
        <div className="text-center">
          <p className="text-sm text-ink-muted">
            Need help?{' '}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand font-semibold hover:underline"
            >
              Contact us on WhatsApp
            </a>
          </p>
        </div>
      </motion.div>
    );
  }

  // ============ FORM VIEW ============
  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
      {/* Left: Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-surface border border-line rounded-3xl p-6 shadow-soft"
      >
        <h2 className="text-lg font-bold text-ink mb-5">Your Information</h2>

        <div className="space-y-4">
          <Field
            icon={<Store size={16} />}
            label="Restaurant Name *"
            value={form.restaurant_name}
            onChange={(v) => update('restaurant_name', v)}
            placeholder="e.g. Hasoon Restaurant"
          />

          <Field
            icon={<User size={16} />}
            label="Owner Name *"
            value={form.owner_name}
            onChange={(v) => update('owner_name', v)}
            placeholder="Your full name"
          />

          <Field
            icon={<Phone size={16} />}
            label="Phone (Lebanon) *"
            value={form.phone}
            onChange={(v) => update('phone', v)}
            placeholder="70 123 456"
            type="tel"
          />

          <Field
            icon={<Mail size={16} />}
            label="Email *"
            value={form.email}
            onChange={(v) => update('email', v)}
            placeholder="you@example.com"
            type="email"
          />
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 flex items-center justify-center gap-2 py-4 rounded-xl bg-brand hover:bg-brand-dark text-white font-bold shadow-brand transition disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Creating request...
            </>
          ) : (
            <>
              Continue to Payment
              <ArrowRight size={18} />
            </>
          )}
        </button>

        <p className="text-xs text-ink-muted text-center mt-3 flex items-center justify-center gap-1.5">
          <Shield size={12} />
          Secure checkout
        </p>
      </motion.form>

      {/* Right: Order Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface border border-line rounded-3xl p-6 shadow-soft h-fit md:sticky md:top-6"
      >
        <h2 className="text-lg font-bold text-ink mb-5">Order Summary</h2>

        {/* Plan */}
        <div className="bg-gradient-to-br from-brand to-brand-dark rounded-2xl p-5 text-white mb-5">
          <p className="text-xs text-white/70 uppercase tracking-wider mb-1">
            Plan
          </p>
          <p className="text-2xl font-bold mb-3">{planData.name}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">${planData.price}</span>
            <span className="text-sm text-white/70">/ month</span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {planData.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-ink">
              <Check size={16} className="text-green-500 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        {/* Trial badge */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mb-5">
          <p className="text-xs text-green-700 text-center font-semibold">
            🎁 10-day free trial included
          </p>
        </div>

        {/* Payment method */}
        <div className="bg-cream rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Wallet size={18} className="text-brand" />
            <p className="text-sm font-bold text-ink">
              Whish Money Payment
            </p>
          </div>
          <p className="text-xs text-ink-muted">
            After submitting, you'll get our Whish number to send the payment.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-ink-muted mb-1.5 block">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">
          {icon}
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white border border-line rounded-xl pl-10 pr-4 py-3 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>
    </div>
  );
}