'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  Search,
  Loader2,
  Check,
  X,
  Clock,
  Copy,
  ExternalLink,
  Store,
  Phone,
  Mail,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

type SubRequest = {
  id: string;
  reference_number: string;
  restaurant_id: string | null;
  restaurant_name: string;
  owner_name: string;
  phone: string;
  email: string;
  plan: 'professional' | 'business';
  amount_usd: number;
  payment_method: string;
  status: 'pending' | 'paid' | 'activated' | 'cancelled' | 'expired';
  payment_reference: string | null;
  payment_receipt_url: string | null;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  expires_at: string;
};

type Filter = 'all' | 'pending' | 'paid' | 'activated' | 'cancelled';

export default function AdminPaymentsPage() {
  const [requests, setRequests] = useState<SubRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('pending');
  const [updating, setUpdating] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('subscription_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setRequests((data ?? []) as SubRequest[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();

    // Realtime
    const channel = supabase
      .channel('admin-sub-requests')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'subscription_requests' },
        () => fetchRequests()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return requests.filter((r) => {
      const matchesFilter = filter === 'all' || r.status === filter;
      const matchesSearch =
        !q ||
        r.reference_number.toLowerCase().includes(q) ||
        r.restaurant_name.toLowerCase().includes(q) ||
        r.owner_name.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.email.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [requests, filter, search]);

  const counts = useMemo(
    () => ({
      all: requests.length,
      pending: requests.filter((r) => r.status === 'pending').length,
      paid: requests.filter((r) => r.status === 'paid').length,
      activated: requests.filter((r) => r.status === 'activated').length,
      cancelled: requests.filter((r) => r.status === 'cancelled').length,
    }),
    [requests]
  );

  const updateStatus = async (
    id: string,
    status: SubRequest['status'],
    request: SubRequest
  ) => {
    setUpdating(id);

    const updates: any = { status };
    if (status === 'paid') updates.paid_at = new Date().toISOString();

    const { error } = await supabase
      .from('subscription_requests')
      .update(updates)
      .eq('id', id);

    // إذا activated → فعّل المطعم
    if (!error && status === 'activated' && request.restaurant_id) {
      await supabase
        .from('restaurants')
        .update({ plan: request.plan })
        .eq('id', request.restaurant_id);

      // أنشئ سجل في subscriptions
      await supabase.from('subscriptions').upsert(
        {
          restaurant_id: request.restaurant_id,
          plan: request.plan,
          status: 'active',
          price_usd: request.amount_usd,
          currency: 'USD',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        { onConflict: 'restaurant_id' }
      );
    }

    setUpdating(null);
    fetchRequests();
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const openWhatsApp = (phone: string, name: string, ref: string) => {
    const cleanPhone = phone.replace(/\D/g, '').replace(/^0/, '961');
    const message = `مرحباً ${name} 👋

بخصوص طلبك على MenuFlow (${ref}):
✅ تم استلام طلبك
💰 رح نتحقق من التحويل
🎉 رح نفعّل الاشتراك خلال 24 ساعة

شكراً! 🌹`;
    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-amber-custom" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-custom/10 border border-amber-custom/20 flex items-center justify-center text-amber-custom">
            <Wallet size={20} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-ink">
              Payments
            </h1>
            <p className="text-sm text-ink-muted">
              Subscription requests & payments
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {(['all', 'pending', 'paid', 'activated', 'cancelled'] as const).map(
          (key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`text-left p-4 rounded-2xl border transition ${
                filter === key
                  ? 'bg-brand text-white border-brand shadow-brand'
                  : 'bg-surface border-line hover:border-brand/40'
              }`}
            >
              <p
                className={`text-xs uppercase tracking-wider mb-1 ${
                  filter === key ? 'text-white/80' : 'text-ink-muted'
                }`}
              >
                {key}
              </p>
              <p
                className={`text-2xl font-bold ${
                  filter === key ? 'text-white' : 'text-ink'
                }`}
              >
                {counts[key]}
              </p>
            </button>
          )
        )}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by reference, restaurant, name, phone..."
          className="w-full bg-surface border border-line rounded-xl py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-line rounded-2xl shadow-soft">
          <div className="w-16 h-16 rounded-2xl bg-amber-custom/10 mx-auto flex items-center justify-center mb-4">
            <Wallet size={28} className="text-amber-custom" />
          </div>
          <p className="text-ink-muted font-medium">No requests</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req, idx) => {
            const isUpdating = updating === req.id;
            const isPending = req.status === 'pending';
            const isPaid = req.status === 'paid';

            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                className="bg-surface border border-line rounded-2xl p-4 md:p-5 shadow-soft"
              >
                {/* Top */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand shrink-0">
                    <Wallet size={18} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-bold text-ink">
                        {req.reference_number}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          req.status === 'activated'
                            ? 'bg-green-500/10 text-green-600 border-green-500/30'
                            : req.status === 'paid'
                              ? 'bg-blue-500/10 text-blue-600 border-blue-500/30'
                              : req.status === 'pending'
                                ? 'bg-amber-custom/10 text-amber-custom border-amber-custom/30'
                                : 'bg-gray-500/10 text-gray-600 border-gray-500/30'
                        }`}
                      >
                        {req.status}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-brand/10 text-brand">
                        {req.plan}
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted mt-1">
                      {new Date(req.created_at).toLocaleString()}
                    </p>
                  </div>

                  <span className="text-2xl font-bold text-brand">
                    ${req.amount_usd}
                  </span>
                </div>

                {/* Info Grid */}
                <div className="grid md:grid-cols-3 gap-3 mb-4">
                  <div className="bg-cream rounded-xl p-3">
                    <p className="text-xs text-ink-muted uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Store size={11} /> Restaurant
                    </p>
                    <p className="text-sm font-semibold text-ink truncate">
                      {req.restaurant_name}
                    </p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {req.owner_name}
                    </p>
                  </div>

                  <div className="bg-cream rounded-xl p-3">
                    <p className="text-xs text-ink-muted uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Phone size={11} /> Contact
                    </p>
                    <p className="text-sm text-ink flex items-center gap-2">
                      <span className="truncate">{req.phone}</span>
                      <button
                        onClick={() => copyToClipboard(req.phone, `phone-${req.id}`)}
                        className="p-1 hover:bg-brand/10 rounded transition"
                      >
                        {copied === `phone-${req.id}` ? (
                          <Check size={12} className="text-green-600" />
                        ) : (
                          <Copy size={12} className="text-ink-muted" />
                        )}
                      </button>
                    </p>
                    <p className="text-xs text-ink-muted mt-0.5 truncate">
                      {req.email}
                    </p>
                  </div>

                  <div className="bg-cream rounded-xl p-3">
                    <p className="text-xs text-ink-muted uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Clock size={11} /> Expires
                    </p>
                    <p className="text-sm text-ink">
                      {new Date(req.expires_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-line">
                  {isPending && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => updateStatus(req.id, 'paid', req)}
                        disabled={isUpdating}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold shadow transition disabled:opacity-60"
                      >
                        {isUpdating ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Check size={16} />
                        )}
                        Mark as Paid
                      </motion.button>

                      <button
                        onClick={() =>
                          updateStatus(req.id, 'cancelled', req)
                        }
                        disabled={isUpdating}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-sm font-semibold hover:bg-red-500/20 transition disabled:opacity-60"
                      >
                        <X size={16} />
                        Cancel
                      </button>

                      <button
                        onClick={() =>
                          openWhatsApp(req.phone, req.owner_name, req.reference_number)
                        }
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-semibold transition"
                      >
                        WhatsApp
                      </button>
                    </>
                  )}

                  {isPaid && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => updateStatus(req.id, 'activated', req)}
                        disabled={isUpdating}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold shadow transition disabled:opacity-60"
                      >
                        {isUpdating ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Check size={16} />
                        )}
                        Activate Plan
                      </motion.button>

                      <button
                        onClick={() =>
                          openWhatsApp(req.phone, req.owner_name, req.reference_number)
                        }
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-semibold transition"
                      >
                        WhatsApp
                      </button>
                    </>
                  )}

                  {req.status === 'activated' && (
                    <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                      <Check size={16} />
                      Activated on{' '}
                      {req.paid_at
                        ? new Date(req.paid_at).toLocaleDateString()
                        : '—'}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}