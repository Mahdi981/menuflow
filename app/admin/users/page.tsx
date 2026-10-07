'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Store,
  Loader2,
  Crown,
  Mail,
  Calendar,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

type UserRow = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  restaurants: { id: string; name: string; slug: string; plan: string }[];
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      const [restaurantsRes] = await Promise.all([
        supabase
          .from('restaurants')
          .select('id, name, slug, plan, owner_id, created_at'),
      ]);

      const restaurants = restaurantsRes.data ?? [];

      // Group restaurants by owner_id
      const byOwner = new Map<string, UserRow>();

      restaurants.forEach((r) => {
        if (!byOwner.has(r.owner_id)) {
          byOwner.set(r.owner_id, {
            id: r.owner_id,
            email: '—',
            created_at: r.created_at,
            last_sign_in_at: null,
            restaurants: [],
          });
        }
        byOwner.get(r.owner_id)!.restaurants.push({
          id: r.id,
          name: r.name,
          slug: r.slug,
          plan: r.plan,
        });
      });

      // Fetch user emails via admin? We'll show placeholder
      // In production, use admin API or show owner_id

      setUsers(Array.from(byOwner.values()));
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        u.restaurants.some((r) => r.name.toLowerCase().includes(q))
    );
  }, [users, searchTerm]);

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
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-ink">Users</h1>
            <p className="text-sm text-ink-muted">
              {users.length} users with restaurants
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by email, ID, or restaurant name..."
          className="w-full bg-surface border border-line rounded-xl py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-line rounded-2xl shadow-soft">
          <div className="w-16 h-16 rounded-2xl bg-brand/10 mx-auto flex items-center justify-center mb-4">
            <Users size={28} className="text-brand" />
          </div>
          <p className="text-ink-muted font-medium">No users found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((user, idx) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.02, 0.3) }}
              className="bg-surface border border-line rounded-2xl p-4 shadow-soft"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center font-bold text-white shrink-0">
                  {user.restaurants[0]?.name.charAt(0).toUpperCase() ?? 'U'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs text-ink-muted truncate">
                    {user.id}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs flex items-center gap-1 text-ink">
                      <Store size={11} className="text-brand" />
                      {user.restaurants.length} restaurant
                      {user.restaurants.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-ink-muted flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Restaurants */}
                  <div className="mt-3 space-y-1.5">
                    {user.restaurants.map((r) => (
                      <a
                        key={r.id}
                        href={`/admin/restaurants/${r.id}`}
                        className="flex items-center gap-2 text-xs text-ink hover:text-brand transition"
                      >
                        <Store size={11} className="text-brand" />
                        <span className="font-medium">{r.name}</span>
                        <span className="text-ink-muted">/r/{r.slug}</span>
                        <span className="text-[10px] uppercase font-bold text-amber-custom ml-auto">
                          {r.plan}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}