'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Phone,
  DollarSign,
  TrendingUp,
  Loader2,
  Crown,
  MapPin,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRestaurant } from '@/lib/hooks/useRestaurant';

const supabase = createClient();

type OrderRow = {
  id: string;
  customer_name: string;
  customer_phone: string;
  total: number;
  address: string | null;
  created_at: string;
  status: string;
};

type Customer = {
  phone: string;
  name: string;
  address: string | null;
  ordersCount: number;
  totalSpent: number;
  lastOrderAt: string;
};

type DateFilter = 'all' | '30d' | '7d';

export default function CustomersPage() {
  const { restaurant, loading: restaurantLoading } = useRestaurant();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  useEffect(() => {
    if (!restaurant?.id) return;
    let cancelled = false;

    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(
          'id, customer_name, customer_phone, total, address, created_at, status'
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

  const customers = useMemo<Customer[]>(() => {
    const now = Date.now();
    const cutoff =
      dateFilter === '30d'
        ? now - 30 * 86400000
        : dateFilter === '7d'
          ? now - 7 * 86400000
          : 0;

    const filtered = orders.filter(
      (o) => new Date(o.created_at).getTime() >= cutoff
    );

    const map = new Map<string, Customer>();
    for (const o of filtered) {
      const phone = o.customer_phone.trim();
      if (!phone) continue;

      const existing = map.get(phone);
      if (existing) {
        existing.ordersCount += 1;
        existing.totalSpent += Number(o.total) || 0;
        if (new Date(o.created_at) > new Date(existing.lastOrderAt)) {
          existing.lastOrderAt = o.created_at;
          existing.name = o.customer_name;
          if (o.address) existing.address = o.address;
        }
      } else {
        map.set(phone, {
          phone,
          name: o.customer_name,
          address: o.address,
          ordersCount: 1,
          totalSpent: Number(o.total) || 0,
          lastOrderAt: o.created_at,
        });
      }
    }

    return Array.from(map.values()).sort(
      (a, b) =>
        new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime()
    );
  }, [orders, dateFilter]);

  const filteredCustomers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q)
    );
  }, [customers, searchTerm]);

  const stats = useMemo(() => {
    const total = customers.length;
    const repeat = customers.filter((c) => c.ordersCount > 1).length;
    const revenue = customers.reduce((s, c) => s + c.totalSpent, 0);
    const avg = total > 0 ? revenue / total : 0;
    return { total, repeat, revenue, avg };
  }, [customers]);

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
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-ink">Customers</h1>
        <p className="text-sm text-ink-muted mt-1">
          People who ordered from your restaurant
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <StatCard
          icon={<Users size={18} />}
          label="Customers"
          value={stats.total.toString()}
          color="brand"
        />
        <StatCard
          icon={<Crown size={18} />}
          label="Repeat"
          value={stats.repeat.toString()}
          color="amber"
        />
        <StatCard
          icon={<DollarSign size={18} />}
          label="Revenue"
          value={`$${stats.revenue.toFixed(0)}`}
          color="green"
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          label="Avg / Customer"
          value={`$${stats.avg.toFixed(2)}`}
          color="brand"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full bg-surface border border-line rounded-xl py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <div className="flex gap-2">
          {(
            [
              { key: 'all', label: 'All Time' },
              { key: '30d', label: '30 Days' },
              { key: '7d', label: '7 Days' },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              onClick={() => setDateFilter(f.key)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                dateFilter === f.key
                  ? 'bg-brand text-white shadow-brand'
                  : 'bg-surface border border-line text-ink-muted hover:text-ink hover:border-brand/30'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-2xl border border-line shadow-soft">
          <div className="w-16 h-16 rounded-2xl bg-brand/10 mx-auto flex items-center justify-center mb-4">
            <Users size={28} className="text-brand" />
          </div>
          <p className="text-ink-muted font-medium">
            {searchTerm ? 'No customers match your search' : 'No customers yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCustomers.map((customer, idx) => (
            <motion.div
              key={customer.phone}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.02, 0.3) }}
              className="bg-surface border border-line rounded-2xl p-4 flex items-center gap-4 shadow-soft"
            >
              <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center font-bold text-white shrink-0">
                {customer.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-ink truncate">
                    {customer.name}
                  </p>
                  {customer.ordersCount >= 5 && (
                    <Crown size={14} className="text-amber-custom shrink-0" />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-ink-muted">
                  <span className="flex items-center gap-1">
                    <Phone size={11} /> {customer.phone}
                  </span>
                  {customer.address && (
                    <span className="flex items-center gap-1 truncate max-w-[200px]">
                      <MapPin size={11} /> {customer.address}
                    </span>
                  )}
                </div>
              </div>

              <div className="hidden md:flex items-center gap-6 text-right">
                <div>
                  <p className="text-xs text-ink-muted uppercase tracking-wider">
                    Orders
                  </p>
                  <p className="font-bold text-sm text-ink">
                    {customer.ordersCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted uppercase tracking-wider">
                    Spent
                  </p>
                  <p className="font-bold text-sm text-brand">
                    ${customer.totalSpent.toFixed(2)}
                  </p>
                </div>
              </div>

              <a
                href={`tel:${customer.phone}`}
                className="p-2.5 rounded-xl bg-cream hover:bg-brand/10 hover:text-brand text-ink-muted transition shrink-0"
                title="Call"
              >
                <Phone size={16} />
              </a>
            </motion.div>
          ))}
        </div>
      )}
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