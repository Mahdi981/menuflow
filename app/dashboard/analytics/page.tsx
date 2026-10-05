'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  Loader2,
  Trophy,
  BarChart3,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { createClient } from '@/lib/supabase/client';
import { useRestaurant } from '@/lib/hooks/useRestaurant';

const supabase = createClient();

type OrderRow = {
  id: string;
  total: number;
  customer_phone: string;
  created_at: string;
  status: string;
  order_items: { product_name: string; quantity: number; total: number }[];
};

type DateRange = '7d' | '30d' | '90d' | 'all';

export default function AnalyticsPage() {
  const { restaurant, loading: restaurantLoading } = useRestaurant();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<DateRange>('30d');

  useEffect(() => {
    if (!restaurant?.id) return;
    let cancelled = false;

    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(
          'id, total, customer_phone, created_at, status, order_items(product_name, quantity, total)'
        )
        .eq('restaurant_id', restaurant.id)
        .neq('status', 'cancelled')
        .order('created_at', { ascending: false });

      if (cancelled) return;
      if (error) console.error(error);
      else setOrders((data ?? []) as OrderRow[]);
      setLoading(false);
    };

    fetchOrders();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant?.id]);

  const filteredOrders = useMemo(() => {
    if (range === 'all') return orders;
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const cutoff = Date.now() - days * 86400000;
    return orders.filter((o) => new Date(o.created_at).getTime() >= cutoff);
  }, [orders, range]);

  const stats = useMemo(() => {
    const revenue = filteredOrders.reduce(
      (s, o) => s + (Number(o.total) || 0),
      0
    );
    const count = filteredOrders.length;
    const avg = count > 0 ? revenue / count : 0;
    const uniqueCustomers = new Set(
      filteredOrders.map((o) => o.customer_phone).filter(Boolean)
    ).size;
    return { revenue, count, avg, uniqueCustomers };
  }, [filteredOrders]);

  const chartData = useMemo(() => {
    const days =
      range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 30;
    const now = new Date();
    const buckets: Record<
      string,
      { label: string; revenue: number; orders: number }
    > = {};

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en', {
        month: 'short',
        day: 'numeric',
      });
      buckets[key] = { label, revenue: 0, orders: 0 };
    }

    for (const o of filteredOrders) {
      const key = new Date(o.created_at).toISOString().split('T')[0];
      if (buckets[key]) {
        buckets[key].revenue += Number(o.total) || 0;
        buckets[key].orders += 1;
      }
    }

    return Object.values(buckets);
  }, [filteredOrders, range]);

  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; qty: number; revenue: number }>();
    for (const o of filteredOrders) {
      for (const item of o.order_items ?? []) {
        const existing = map.get(item.product_name);
        if (existing) {
          existing.qty += item.quantity;
          existing.revenue += Number(item.total) || 0;
        } else {
          map.set(item.product_name, {
            name: item.product_name,
            qty: item.quantity,
            revenue: Number(item.total) || 0,
          });
        }
      }
    }
    return Array.from(map.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [filteredOrders]);

  if (restaurantLoading || loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-cream p-8 text-center">
        <p className="text-red-500">No restaurant found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-ink">Analytics</h1>
          <p className="text-sm text-ink-muted mt-1">
            Track your restaurant performance
          </p>
        </div>

        <div className="flex gap-2">
          {(
            [
              { key: '7d', label: '7 Days' },
              { key: '30d', label: '30 Days' },
              { key: '90d', label: '90 Days' },
              { key: 'all', label: 'All Time' },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              onClick={() => setRange(f.key)}
              className={`px-3 py-2 rounded-xl text-xs md:text-sm font-medium transition ${
                range === f.key
                  ? 'bg-brand text-white shadow-brand'
                  : 'bg-surface border border-line text-ink-muted hover:text-ink hover:border-brand/30'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <StatCard
          icon={<DollarSign size={18} />}
          label="Revenue"
          value={`$${stats.revenue.toFixed(2)}`}
          color="green"
        />
        <StatCard
          icon={<ShoppingBag size={18} />}
          label="Orders"
          value={stats.count.toString()}
          color="brand"
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          label="Avg Order"
          value={`$${stats.avg.toFixed(2)}`}
          color="brand"
        />
        <StatCard
          icon={<Users size={18} />}
          label="Customers"
          value={stats.uniqueCustomers.toString()}
          color="amber"
        />
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-line rounded-2xl p-5 md:p-6 mb-6 shadow-soft"
      >
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
            <BarChart3 size={18} />
          </div>
          <h2 className="font-semibold text-ink">Sales Over Time</h2>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1C7E84" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#1C7E84" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D8" />
              <XAxis
                dataKey="label"
                stroke="#6B7280"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E1D8',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.08)',
                }}
                formatter={(value: any) => [
                  `$${Number(value).toFixed(2)}`,
                  'Revenue',
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#1C7E84"
                strokeWidth={2}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface border border-line rounded-2xl p-5 md:p-6 shadow-soft"
      >
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-amber-custom/10 flex items-center justify-center text-amber-custom">
            <Trophy size={18} />
          </div>
          <h2 className="font-semibold text-ink">Top Products</h2>
        </div>

        {topProducts.length === 0 ? (
          <p className="text-center text-ink-muted py-8 text-sm">
            No product data yet
          </p>
        ) : (
          <div className="space-y-3">
            {topProducts.map((p, idx) => {
              const maxQty = topProducts[0].qty;
              const pct = maxQty > 0 ? (p.qty / maxQty) * 100 : 0;
              return (
                <div key={p.name} className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                      idx === 0
                        ? 'bg-amber-custom/20 text-amber-custom'
                        : idx === 1
                          ? 'bg-brand/10 text-brand'
                          : idx === 2
                            ? 'bg-brand/5 text-brand'
                            : 'bg-cream text-ink-muted'
                    }`}
                  >
                    #{idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <p className="text-sm font-medium truncate text-ink">
                        {p.name}
                      </p>
                      <p className="text-xs text-ink-muted shrink-0">
                        {p.qty} sold · ${p.revenue.toFixed(2)}
                      </p>
                    </div>
                    <div className="h-1.5 bg-cream rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        className="h-full bg-brand rounded-full"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
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
      <p className="text-xl font-bold text-ink mt-1 truncate">{value}</p>
    </motion.div>
  );
}