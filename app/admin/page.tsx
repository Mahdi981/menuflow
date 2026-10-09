'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Store,
  Users,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Loader2,
  Shield,
  Activity,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import LiveActivity from '@/components/admin/LiveActivity';

type Stats = {
  totalRestaurants: number;
  activeRestaurants: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
};

type RestaurantRow = {
  id: string;
  name: string;
  slug: string;
  plan: string | null;
  is_active: boolean;
  created_at: string;
  owner_id: string | null;
};

type OrderRow = {
  id: string;
  total: number | string | null;
  status: string;
  created_at: string;
};

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats>({
    totalRestaurants: 0,
    activeRestaurants: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
  });
  const [recentRestaurants, setRecentRestaurants] = useState<RestaurantRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      setLoading(true);

      // ✅ createClient داخل useEffect
      const supabase = createClient();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [restaurantsRes, ordersRes] = await Promise.all([
        supabase
          .from('restaurants')
          .select('id, name, slug, plan, is_active, created_at, owner_id'),
        supabase.from('orders').select('id, total, status, created_at'),
      ]);

      if (cancelled) return;

      const restaurants = (restaurantsRes.data ?? []) as RestaurantRow[];
      const orders = (ordersRes.data ?? []) as OrderRow[];
      const uniqueOwners = new Set(
        restaurants.map((r: RestaurantRow) => r.owner_id).filter(Boolean)
      ).size;

      const todayOrders = orders.filter(
        (o: OrderRow) => new Date(o.created_at) >= today
      );
      const revenue = orders
        .filter((o: OrderRow) => o.status !== 'cancelled')
        .reduce(
          (s: number, o: OrderRow) => s + Number(o.total || 0),
          0
        );

      setStats({
        totalRestaurants: restaurants.length,
        activeRestaurants: restaurants.filter(
          (r: RestaurantRow) => r.is_active
        ).length,
        totalUsers: uniqueOwners,
        totalOrders: orders.length,
        totalRevenue: revenue,
        todayOrders: todayOrders.length,
      });

      setRecentRestaurants(
        [...restaurants]
          .sort(
            (a: RestaurantRow, b: RestaurantRow) =>
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
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-custom/10 border border-amber-custom/30 flex items-center justify-center text-amber-custom">
            <Shield size={20} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-ink">
              Super Admin
            </h1>
            <p className="text-sm text-ink-muted">
              Full platform overview and control
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4 mb-6">
        <StatCard
          icon={<Store size={20} />}
          label="Restaurants"
          value={stats.totalRestaurants.toString()}
          color="brand"
        />
        <StatCard
          icon={<Activity size={20} />}
          label="Active"
          value={stats.activeRestaurants.toString()}
          color="green"
        />
        <StatCard
          icon={<Users size={20} />}
          label="Users"
          value={stats.totalUsers.toString()}
          color="amber"
        />
        <StatCard
          icon={<ShoppingBag size={20} />}
          label="Total Orders"
          value={stats.totalOrders.toString()}
          color="brand"
        />
        <StatCard
          icon={<DollarSign size={20} />}
          label="Revenue"
          value={`$${stats.totalRevenue.toFixed(0)}`}
          color="green"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Today"
          value={stats.todayOrders.toString()}
          color="amber"
        />
      </div>

      {/* Live Activity */}
      <div className="mb-6">
        <LiveActivity />
      </div>

      {/* Recent Restaurants */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-line rounded-2xl p-5 md:p-6 shadow-soft"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
              <Store size={16} />
            </div>
            <h2 className="font-semibold text-ink">Recent Restaurants</h2>
          </div>
          <Link
            href="/admin/restaurants"
            className="text-sm text-brand hover:underline flex items-center gap-1 font-medium"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentRestaurants.length === 0 ? (
          <p className="text-center text-ink-muted py-8">No restaurants yet</p>
        ) : (
          <div className="space-y-2">
            {recentRestaurants.map((r) => (
              <Link
                key={r.id}
                href={`/admin/restaurants/${r.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream transition"
              >
                <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand shrink-0">
                  <Store size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-ink truncate">{r.name}</p>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        r.is_active
                          ? 'bg-green-500/10 text-green-600 border-green-500/20'
                          : 'bg-red-500/10 text-red-600 border-red-500/20'
                      }`}
                    >
                      {r.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted">/r/{r.slug}</p>
                </div>
                <span className="text-xs font-bold text-amber-custom uppercase">
                  {r.plan}
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-line rounded-2xl p-4 shadow-soft"
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}
      >
        {icon}
      </div>
      <p className="text-xs text-ink-muted uppercase tracking-wider">
        {label}
      </p>
      <p className="text-xl font-bold text-ink mt-1">{value}</p>
    </motion.div>
  );
}