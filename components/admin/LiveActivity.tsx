'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Store,
  ShoppingBag,
  AlertCircle,
  UserPlus,
  Power,
  Clock,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

type Activity = {
  id: string;
  type: 'order' | 'restaurant' | 'user' | 'status';
  title: string;
  subtitle?: string;
  timestamp: string;
  color: 'brand' | 'amber' | 'green' | 'red';
};

export default function LiveActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Realtime: new orders
    const ordersChannel = supabase
      .channel('admin-orders-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const order = payload.new as any;
          addActivity({
            id: order.id,
            type: 'order',
            title: `New order ${order.order_number ?? ''}`,
            subtitle: `${order.customer_name} — $${Number(order.total).toFixed(2)}`,
            timestamp: new Date().toISOString(),
            color: 'green',
          });
        }
      )
      .subscribe();

    // Realtime: new restaurants
    const restaurantsChannel = supabase
      .channel('admin-restaurants-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'restaurants' },
        (payload) => {
          const r = payload.new as any;
          addActivity({
            id: r.id,
            type: 'restaurant',
            title: `New restaurant: ${r.name}`,
            subtitle: `/r/${r.slug}`,
            timestamp: new Date().toISOString(),
            color: 'brand',
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'restaurants' },
        (payload) => {
          const r = payload.new as any;
          const old = payload.old as any;
          if (old.is_active !== r.is_active) {
            addActivity({
              id: r.id + Date.now(),
              type: 'status',
              title: r.is_active ? `Restaurant activated` : `Restaurant disabled`,
              subtitle: r.name,
              timestamp: new Date().toISOString(),
              color: r.is_active ? 'green' : 'red',
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(restaurantsChannel);
    };
  }, []);

  const addActivity = (activity: Activity) => {
    setActivities((prev) => [activity, ...prev].slice(0, 20));
  };

  const icons = {
    order: ShoppingBag,
    restaurant: Store,
    user: UserPlus,
    status: Power,
  };

  const colors = {
    brand: 'bg-brand/10 text-brand',
    amber: 'bg-amber-custom/10 text-amber-custom',
    green: 'bg-green-500/10 text-green-600',
    red: 'bg-red-500/10 text-red-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-line rounded-2xl p-5 md:p-6 shadow-soft"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
            <Activity size={16} />
          </div>
          <h2 className="font-semibold text-ink">Live Activity</h2>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-green-600 uppercase">
            Live
          </span>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-xl bg-brand/10 mx-auto flex items-center justify-center mb-3">
            <Activity size={20} className="text-brand" />
          </div>
          <p className="text-sm text-ink-muted">
            Waiting for activity...
          </p>
          <p className="text-xs text-ink-muted/70 mt-1">
            New orders and events will appear here live
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          <AnimatePresence initial={false}>
            {activities.map((a) => {
              const Icon = icons[a.type];
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-cream"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colors[a.color]}`}
                  >
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">
                      {a.title}
                    </p>
                    {a.subtitle && (
                      <p className="text-xs text-ink-muted truncate mt-0.5">
                        {a.subtitle}
                      </p>
                    )}
                    <p className="text-[10px] text-ink-muted/70 mt-0.5 flex items-center gap-1">
                      <Clock size={9} />
                      {timeAgo(a.timestamp)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 5) return 'just now';
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}