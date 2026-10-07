'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import {
  ChefHat,
  Store,
  Phone,
  MapPin,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export default function SetupPage() {
  const router = useRouter();

  // ✅ الحل: lazy init
  const [supabase] = useState(() => createClient());

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. تأكد من المستخدم
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('يجب تسجيل الدخول');

      // 2. اختَر الخطة من localStorage (إذا جاء من /pricing)
      const selectedPlan =
        (typeof window !== 'undefined' &&
          localStorage.getItem('menuflow_selected_plan')) ||
        'starter';

      // 3. أنشئ المطعم عبر API Route
      const res = await fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          phone,
          address,
          plan: selectedPlan,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? 'فشل إنشاء المطعم');
      }

      const restaurant = json.restaurant;

      // 4. أنشئ الاشتراك (نفس المنطق)
      try {
        await supabase.from('subscriptions').insert({
          restaurant_id: restaurant.id,
          plan: selectedPlan,
          status: 'active',
          order_count: 0,
        });
      } catch (subErr) {
        console.warn('Subscription insert skipped:', subErr);
      }

      // 5. احذف الخطة من localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('menuflow_selected_plan');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-4">
      {/* Decorative gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-brand/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-amber-custom/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-brand to-brand-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-brand">
            <ChefHat size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-ink mb-2">
            أهلاً بمطعمك 👋
          </h1>
          <p className="text-sm text-ink-muted">
            عرّفنا شوي عن مطعمك
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface rounded-3xl border border-line p-6 md:p-8 shadow-soft">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 flex items-start gap-2">
              <AlertCircle
                size={16}
                className="text-red-600 shrink-0 mt-0.5"
              />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Restaurant Name */}
            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-2">
                اسم المطعم *
              </label>
              <div className="relative">
                <Store
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                  size={18}
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]/g, '')
                    );
                  }}
                  placeholder="مطعمي"
                  required
                  className="w-full bg-white border border-line rounded-xl py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                />
              </div>
            </div>

            {/* URL Slug */}
            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-2">
                رابط المنيو *
              </label>
              <div className="flex items-center gap-2 bg-white border border-line rounded-xl px-3 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition">
                <span className="text-xs text-ink-muted shrink-0">/r/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) =>
                    setSlug(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                    )
                  }
                  placeholder="my-restaurant"
                  required
                  className="flex-1 bg-transparent py-3 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-ink-muted mt-1">
                رابط منيوك: /r/{slug || 'my-restaurant'}
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-2">
                الهاتف
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                  size={18}
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+961 70 053 406"
                  className="w-full bg-white border border-line rounded-xl py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-2">
                العنوان
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                  size={18}
                />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="المدينة"
                  className="w-full bg-white border border-line rounded-xl py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !name || !slug}
              className="w-full bg-brand hover:bg-brand-dark py-3.5 rounded-xl font-semibold text-white shadow-brand transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  إنشاء المطعم
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}