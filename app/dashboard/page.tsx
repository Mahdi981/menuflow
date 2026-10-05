'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  DollarSign,
  Users,
  Clock,
  TrendingUp,
  Package,
  Grid3x3,
  ArrowRight,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRestaurant } from '@/lib/hooks/useRestaurant';

const supabase = createClient();

type Stats = {
  todayOrders: number;
  todayRevenue: number;
  totalCustomers: number;
  pendingOrders: number;
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
};

export default function OverviewPage() {
  const { restaurant, loading: restaurantLoading } = useRestaurant();
  const [stats, setStats] = useState<Stats>({
    todayOrders: 0,
    todayRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!restaurant?.id) return;

    let cancelled = false;

    const fetchStats = async () => {
      setLoading(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [ordersRes, productsRes, categoriesRes] = await Promise.all([
        supabase
          .from('orders')
          .select('id, total, status, customer_phone, created_at')
          .eq('restaurant_id', restaurant.id),
        supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('restaurant_id', restaurant.id),
        supabase
          .from('categories')
          .select('id', { count: 'exact', head: true })
          .eq('restaurant_id', restaurant.id),
      ]);

      if (cancelled) return;

      const orders = ordersRes.data ?? [];
      const todayOrders = orders.filter(
        (o) => new Date(o.created_at) >= today
      );
      const todayRevenue = todayOrders
        .filter((o) => o.status !== 'cancelled')
        .reduce((s, o) => s + Number(o.total || 0), 0);
      const uniqueCustomers = new Set(
        orders.map((o) => o.customer_phone).filter(Boolean)
      ).size;
      const pendingOrders = orders.filter(
        (o) => o.status === 'pending'
      ).length;

      setStats({
        todayOrders: todayOrders.length,
        todayRevenue,
        totalCustomers: uniqueCustomers,
        pendingOrders,
        totalProducts: productsRes.count ?? 0,
        totalCategories: categoriesRes.count ?? 0,
        totalOrders: orders.length,
      });

      setRecentOrders(
        [...orders]
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 5)
      );

      setLoading(false);
    };

    fetchStats();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant?.id]);

  if (restaurantLoading || loading) {
    return (
      <div className="min-h-screen bg-cream p-8 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-cream p-8 text-center">
        <p className="text-red-500">No restaurant found</p>
        <Link
          href="/dashboard/setup"
          className="text-brand underline mt-2 inline-block"
        >
          Setup your restaurant →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-ink">
              Welcome back 👋
            </h1>
            <p className="text-sm text-ink-muted mt-1">
              Here's what's happening at {restaurant.name}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20">
            <span className="w-2 h-2 rounded-full bg-brand" />
            <span className="text-xs font-medium text-brand uppercase tracking-wider">
              {restaurant.plan} Plan
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <StatCard
          icon={<ShoppingBag size={20} />}
          label="Today's Orders"
          value={stats.todayOrders.toString()}
          delay={0}
        />
        <StatCard
          icon={<DollarSign size={20} />}
          label="Today's Revenue"
          value={`$${stats.todayRevenue.toFixed(2)}`}
          delay={0.05}
        />
        <StatCard
          icon={<Users size={20} />}
          label="Customers"
          value={stats.totalCustomers.toString()}
          delay={0.1}
        />
        <StatCard
          icon={<Clock size={20} />}
          label="Pending Orders"
          value={stats.pendingOrders.toString()}
          delay={0.15}
          highlight={stats.pendingOrders > 0}
        />
      </div>

      {/* Plan Limits */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface border border-line rounded-2xl p-5 md:p-6 shadow-soft mb-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
            <Package size={16} />
          </div>
          <h2 className="font-semibold text-ink">Plan Limits</h2>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <LimitItem
            icon={<ShoppingBag size={14} />}
            label="Orders"
            current={stats.totalOrders}
            max={restaurant.plan === 'starter' ? 20 : 500}
          />
          <LimitItem
            icon={<Package size={14} />}
            label="Products"
            current={stats.totalProducts}
            max={restaurant.plan === 'starter' ? 30 : 999}
          />
          <LimitItem
            icon={<Grid3x3 size={14} />}
            label="Categories"
            current={stats.totalCategories}
            max={restaurant.plan === 'starter' ? 1 : 50}
          />
        </div>
      </motion.div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-surface border border-line rounded-2xl p-5 md:p-6 shadow-soft"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
              <TrendingUp size={16} />
            </div>
            <h2 className="font-semibold text-ink">Recent Orders</h2>
          </div>
          <Link
            href="/dashboard/orders"
            className="text-sm text-brand hover:underline flex items-center gap-1 font-medium"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-brand/10 mx-auto flex items-center justify-center mb-4">
              <ShoppingBag size={28} className="text-brand" />
            </div>
            <p className="text-ink-muted font-medium">No orders yet</p>
            <p className="text-sm text-ink-muted/70 mt-1">
              Orders will appear here once customers start ordering
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href="/dashboard/orders"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream transition"
              >
                <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand shrink-0">
                  <ShoppingBag size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">
                    Order #{order.id.slice(0, 6)}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <span className="font-bold text-brand text-sm">
                  ${Number(order.total).toFixed(2)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  delay,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay: number;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-surface border rounded-2xl p-4 md:p-5 shadow-soft ${
        highlight ? 'border-amber-custom/40' : 'border-line'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
          highlight
            ? 'bg-amber-custom/10 text-amber-custom'
            : 'bg-brand/10 text-brand'
        }`}
      >
        {icon}
      </div>
      <p className="text-xs text-ink-muted uppercase tracking-wider">
        {label}
      </p>
      <p className="text-xl md:text-2xl font-bold text-ink mt-1">{value}</p>
    </motion.div>
  );
}

function LimitItem({
  icon,
  label,
  current,
  max,
}: {
  icon: React.ReactNode;
  label: string;
  current: number;
  max: number;
}) {
  const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0;
  const isWarning = pct >= 80;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
          {icon}
          {label}
        </span>
        <span
          className={`text-xs font-bold ${
            isWarning ? 'text-amber-custom' : 'text-ink'
          }`}
        >
          {current}/{max}
        </span>
      </div>
      <div className="h-1.5 bg-cream rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isWarning ? 'bg-amber-custom' : 'bg-brand'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}