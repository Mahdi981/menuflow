'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Store,
  ArrowLeft,
  Loader2,
  Check,
  Ban,
  Crown,
  ShoppingBag,
  DollarSign,
  Users,
  ExternalLink,
  AlertCircle,
  Save,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

const PLANS = ['starter', 'professional', 'business'] as const;
type Plan = (typeof PLANS)[number];

type Restaurant = {
  id: string;
  name: string;
  name_ar: string | null;
  slug: string;
  plan: Plan;
  is_active: boolean;
  logo_url: string | null;
  cover_url: string | null;
  phone: string | null;
  city: string | null;
  owner_id: string;
  created_at: string;
};

type Stats = {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  pendingOrders: number;
};

export default function AdminRestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form
  const [plan, setPlan] = useState<Plan>('starter');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);

      const [restRes, ordersRes] = await Promise.all([
        supabase.from('restaurants').select('*').eq('id', id).single(),
        supabase
          .from('orders')
          .select('id, total, status, customer_phone')
          .eq('restaurant_id', id),
      ]);

      if (restRes.error || !restRes.data) {
        setError('Restaurant not found');
        setLoading(false);
        return;
      }

      const r = restRes.data as Restaurant;
      setRestaurant(r);
      setPlan(r.plan);
      setIsActive(r.is_active);

      const orders = (ordersRes.data ?? []) as Array<{
  id: string;
  total: number | string | null;
  status: string;
  customer_phone: string | null;
  created_at: string;
}>;
      const uniqueCustomers = new Set(
        orders.map((o) => o.customer_phone).filter(Boolean)
      ).size;
      const revenue = orders
        .filter((o) => o.status !== 'cancelled')
        .reduce((s, o) => s + Number(o.total || 0), 0);

      setStats({
        totalOrders: orders.length,
        totalRevenue: revenue,
        totalCustomers: uniqueCustomers,
        pendingOrders: orders.filter((o) => o.status === 'pending').length,
      });

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleSave = async () => {
    if (!restaurant) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    const { error: updateError } = await supabase
      .from('restaurants')
      .update({
        plan,
        is_active: isActive,
      })
      .eq('id', restaurant.id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-cream p-8 text-center">
        <p className="text-red-500">Restaurant not found</p>
        <Link
          href="/admin/restaurants"
          className="text-brand underline mt-2 inline-block"
        >
          Back to list
        </Link>
      </div>
    );
  }

  const hasChanges =
    plan !== restaurant.plan || isActive !== restaurant.is_active;

  return (
    <div className="min-h-screen bg-cream p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/restaurants"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-brand transition mb-4"
        >
          <ArrowLeft size={16} />
          Back to restaurants
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {restaurant.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center text-brand">
                <Store size={28} />
              </div>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-ink">
                {restaurant.name}
              </h1>
              <p className="text-sm text-ink-muted mt-1">/r/{restaurant.slug}</p>
            </div>
          </div>

          <a
            href={`/r/${restaurant.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-line text-ink text-sm font-medium hover:bg-cream transition"
          >
            <ExternalLink size={16} />
            View Menu
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <StatBox
          icon={<ShoppingBag size={18} />}
          label="Orders"
          value={stats.totalOrders.toString()}
          color="brand"
        />
        <StatBox
          icon={<DollarSign size={18} />}
          label="Revenue"
          value={`$${stats.totalRevenue.toFixed(0)}`}
          color="green"
        />
        <StatBox
          icon={<Users size={18} />}
          label="Customers"
          value={stats.totalCustomers.toString()}
          color="amber"
        />
        <StatBox
          icon={<AlertCircle size={18} />}
          label="Pending"
          value={stats.pendingOrders.toString()}
          color={stats.pendingOrders > 0 ? 'amber' : 'brand'}
        />
      </div>

      {/* Settings */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Plan */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-line rounded-2xl p-6 shadow-soft"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-amber-custom/10 flex items-center justify-center text-amber-custom">
              <Crown size={16} />
            </div>
            <h2 className="font-semibold text-ink">Plan</h2>
          </div>

          <div className="space-y-2">
            {PLANS.map((p) => (
              <button
                key={p}
                onClick={() => setPlan(p)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition ${
                  plan === p
                    ? 'border-brand bg-brand/5'
                    : 'border-line hover:border-brand/30'
                }`}
              >
                <span
                  className={`font-semibold uppercase text-sm ${
                    plan === p ? 'text-brand' : 'text-ink'
                  }`}
                >
                  {p}
                </span>
                {plan === p && (
                  <Check size={18} className="text-brand" />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-line rounded-2xl p-6 shadow-soft"
        >
          <div className="flex items-center gap-2 mb-5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isActive
                  ? 'bg-green-500/10 text-green-600'
                  : 'bg-red-500/10 text-red-600'
              }`}
            >
              {isActive ? <Check size={16} /> : <Ban size={16} />}
            </div>
            <h2 className="font-semibold text-ink">Status</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-cream">
              <div>
                <p className="text-sm font-medium text-ink">
                  Restaurant Active
                </p>
                <p className="text-xs text-ink-muted mt-0.5">
                  {isActive
                    ? 'Visible to customers'
                    : 'Hidden from customers'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative w-12 h-7 rounded-full transition shrink-0 ${
                  isActive ? 'bg-brand' : 'bg-line'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all ${
                    isActive ? 'left-[22px]' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Restaurant info */}
            <div className="space-y-2 text-sm">
              {restaurant.phone && (
                <div className="flex justify-between">
                  <span className="text-ink-muted">Phone</span>
                  <span className="text-ink font-mono">
                    {restaurant.phone}
                  </span>
                </div>
              )}
              {restaurant.city && (
                <div className="flex justify-between">
                  <span className="text-ink-muted">City</span>
                  <span className="text-ink">{restaurant.city}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-ink-muted">Created</span>
                <span className="text-ink">
                  {new Date(restaurant.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-600 text-sm">
          ✅ Changes saved successfully
        </div>
      )}

      {/* Save bar */}
      {hasChanges && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-4 right-4 z-40 max-w-3xl mx-auto"
        >
          <div className="bg-ink text-white rounded-2xl p-4 flex items-center justify-between shadow-2xl">
            <p className="text-sm font-medium">You have unsaved changes</p>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-semibold text-sm shadow-brand transition disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'brand' | 'amber' | 'green';
}) {
  const colors = {
    brand: 'bg-brand/10 text-brand',
    amber: 'bg-amber-custom/10 text-amber-custom',
    green: 'bg-green-500/10 text-green-600',
  };
  return (
    <div className="bg-surface border border-line rounded-2xl p-4 shadow-soft">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}
      >
        {icon}
      </div>
      <p className="text-xs text-ink-muted uppercase tracking-wider">
        {label}
      </p>
      <p className="text-xl font-bold text-ink mt-1">{value}</p>
    </div>
  );
}