'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Store,
  Search,
  ExternalLink,
  Loader2,
  Activity,
  Crown,
  Ban,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

type Restaurant = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  is_active: boolean;
  logo_url: string | null;
  owner_id: string;
  created_at: string;
};

type Filter = 'all' | 'active' | 'inactive' | 'starter' | 'professional' | 'business';

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('restaurants')
        .select('id, name, slug, plan, is_active, logo_url, owner_id, created_at')
        .order('created_at', { ascending: false });

      if (!error) setRestaurants((data ?? []) as Restaurant[]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return restaurants.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(q) || r.slug.toLowerCase().includes(q);

      let matchesFilter = true;
      if (filter === 'active') matchesFilter = r.is_active;
      else if (filter === 'inactive') matchesFilter = !r.is_active;
      else if (filter === 'starter') matchesFilter = r.plan === 'starter';
      else if (filter === 'professional')
        matchesFilter = r.plan === 'professional';
      else if (filter === 'business') matchesFilter = r.plan === 'business';

      return matchesSearch && matchesFilter;
    });
  }, [restaurants, searchTerm, filter]);

  const counts = useMemo(
    () => ({
      all: restaurants.length,
      active: restaurants.filter((r) => r.is_active).length,
      inactive: restaurants.filter((r) => !r.is_active).length,
      starter: restaurants.filter((r) => r.plan === 'starter').length,
      professional: restaurants.filter((r) => r.plan === 'professional').length,
      business: restaurants.filter((r) => r.plan === 'business').length,
    }),
    [restaurants]
  );

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
          <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
            <Store size={20} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-ink">
              All Restaurants
            </h1>
            <p className="text-sm text-ink-muted">
              {restaurants.length} total · {counts.active} active
            </p>
          </div>
        </div>
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
            placeholder="Search by name or slug..."
            className="w-full bg-surface border border-line rounded-xl py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: 'all', label: 'All' },
              { key: 'active', label: 'Active' },
              { key: 'inactive', label: 'Inactive' },
              { key: 'starter', label: 'Starter' },
              { key: 'professional', label: 'Pro' },
              { key: 'business', label: 'Business' },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                filter === f.key
                  ? 'bg-brand text-white shadow-brand'
                  : 'bg-surface border border-line text-ink-muted hover:text-ink hover:border-brand/30'
              }`}
            >
              {f.label}
              <span className="ml-1.5 opacity-70">{counts[f.key]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-line rounded-2xl shadow-soft">
          <div className="w-16 h-16 rounded-2xl bg-brand/10 mx-auto flex items-center justify-center mb-4">
            <Store size={28} className="text-brand" />
          </div>
          <p className="text-ink-muted font-medium">No restaurants found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r, idx) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.02, 0.3) }}
              className="bg-surface border border-line rounded-2xl p-4 shadow-soft hover:shadow-brand transition"
            >
              <div className="flex items-center gap-4">
                {/* Logo */}
                {r.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.logo_url}
                    alt={r.name}
                    className="w-12 h-12 rounded-xl object-cover border border-line shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand shrink-0">
                    <Store size={20} />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-ink truncate">{r.name}</p>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        r.is_active
                          ? 'bg-green-500/10 text-green-600 border-green-500/20'
                          : 'bg-red-500/10 text-red-600 border-red-500/20'
                      }`}
                    >
                      {r.is_active ? (
                        <span className="flex items-center gap-1">
                          <Activity size={9} /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Ban size={9} /> Inactive
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted mt-0.5">/r/{r.slug}</p>
                </div>

                {/* Plan */}
                <div className="text-right hidden md:block">
                  <p className="text-[10px] uppercase text-ink-muted tracking-wider">
                    Plan
                  </p>
                  <p className="text-sm font-bold text-amber-custom uppercase flex items-center gap-1 justify-end">
                    {r.plan === 'business' && <Crown size={12} />}
                    {r.plan}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <a
                    href={`/r/${r.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-cream hover:bg-brand/10 text-ink-muted hover:text-brand transition"
                    title="View menu"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <Link
                    href={`/admin/restaurants/${r.id}`}
                    className="px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white text-sm font-semibold shadow-brand transition"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}