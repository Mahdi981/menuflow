'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  XCircle,
  Eye,
  Search,
  Clock,
  Phone,
  MapPin,
  Truck,
  Store,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRestaurant } from '@/lib/hooks/useRestaurant';
import { useOrderNotifications } from '@/lib/hooks/useOrderNotifications';
import NotificationButton from '@/components/NotificationButton';

const supabase = createClient();

type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';

type OrderItem = {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
  total: number;
};

type Order = {
  id: string;
  order_number: string;
  restaurant_id: string;
  customer_name: string;
  customer_phone: string;
  type: 'delivery' | 'pickup';
  address: string | null;
  notes: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  created_at: string;
  // ⬇️ جديد
  latitude?: number | null;
  longitude?: number | null;
  location_type?: string | null;
  location_label?: string | null;
  order_items?: OrderItem[];
};

const statusConfig: Record<
  OrderStatus | 'all',
  { label: string; badge: string }
> = {
  all: { label: 'All', badge: 'bg-brand/10 text-brand border-brand/20' },
  pending: {
    label: 'Pending',
    badge: 'bg-amber-custom/10 text-amber-custom border-amber-custom/20',
  },
  accepted: {
    label: 'Accepted',
    badge: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  },
  preparing: {
    label: 'Preparing',
    badge: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  },
  ready: {
    label: 'Ready',
    badge: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    badge: 'bg-brand/10 text-brand border-brand/20',
  },
  completed: {
    label: 'Completed',
    badge: 'bg-green-500/10 text-green-600 border-green-500/20',
  },
  cancelled: {
    label: 'Cancelled',
    badge: 'bg-red-500/10 text-red-600 border-red-500/20',
  },
};

const nextStatusMap: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'accepted',
  accepted: 'preparing',
  preparing: 'ready',
  ready: 'out_for_delivery',
  out_for_delivery: 'completed',
};

export default function OrdersPage() {
  const { restaurant, loading: restaurantLoading } = useRestaurant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useOrderNotifications(orders);

  useEffect(() => {
    if (!restaurant?.id) return;
    let cancelled = false;

    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('restaurant_id', restaurant.id)
        .order('created_at', { ascending: false });

      if (cancelled) return;

      if (error) {
        console.error('❌ Fetch orders failed:', error);
      } else {
        setOrders((data ?? []) as Order[]);
      }
      setLoading(false);
    };

    fetchOrders();

    const channel = supabase
      .channel(`orders-${restaurant.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `restaurant_id=eq.${restaurant.id}`,
        },
        () => fetchOrders()
      )
      .subscribe((status: string) => console.log('📡 Realtime:', status));

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant?.id]);

  const updateStatus = async (id: string, newStatus: OrderStatus) => {
    const previous = orders;
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      setOrders(previous);
      alert(`Failed: ${error.message}`);
    }
  };

  const cancelOrder = (id: string) => updateStatus(id, 'cancelled');

  const filteredOrders = orders.filter((order) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      (order.order_number ?? '').toLowerCase().includes(q) ||
      order.customer_name.toLowerCase().includes(q) ||
      order.customer_phone.includes(searchTerm);
    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts: Record<OrderStatus | 'all', number> = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    accepted: orders.filter((o) => o.status === 'accepted').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    ready: orders.filter((o) => o.status === 'ready').length,
    out_for_delivery: orders.filter((o) => o.status === 'out_for_delivery')
      .length,
    completed: orders.filter((o) => o.status === 'completed').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-ink">Orders</h1>
          <p className="text-sm text-ink-muted mt-1">
            Manage and track all your restaurant orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <NotificationButton />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-600">Live</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(
          [
            'all',
            'pending',
            'accepted',
            'preparing',
            'ready',
            'out_for_delivery',
            'completed',
            'cancelled',
          ] as const
        ).map((key) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              statusFilter === key
                ? 'bg-brand text-white shadow-brand'
                : 'bg-surface border border-line text-ink-muted hover:text-ink hover:border-brand/30'
            }`}
          >
            {statusConfig[key].label}
            <span className="ml-2 text-xs opacity-70">
              {statusCounts[key]}
            </span>
          </button>
        ))}
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
          placeholder="Search by order number, customer name, or phone..."
          className="w-full bg-surface border border-line rounded-xl py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>

      {/* Orders */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-line rounded-2xl shadow-soft">
          <div className="w-16 h-16 rounded-2xl bg-brand/10 mx-auto flex items-center justify-center mb-4">
            <ShoppingBag size={28} className="text-brand" />
          </div>
          <p className="text-ink-muted font-medium">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, idx) => {
            const nextStatus = nextStatusMap[order.status];
            const cfg = statusConfig[order.status];
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                className="bg-surface border border-line rounded-2xl p-4 md:p-5 shadow-soft"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand shrink-0">
                    <Clock size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-ink">
                        {order.order_number}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.badge}`}
                      >
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-cream text-ink-muted">
                      {order.type === 'delivery' ? (
                        <Truck size={12} />
                      ) : (
                        <Store size={12} />
                      )}
                      {order.type === 'delivery' ? 'Delivery' : 'Pickup'}
                    </span>
                    <span className="text-lg font-bold text-brand">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="grid md:grid-cols-3 gap-3 mb-4">
                  {/* Customer */}
                  <div className="bg-cream rounded-xl p-3">
                    <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">
                      Customer
                    </p>
                    <p className="font-semibold text-sm text-ink">
                      {order.customer_name}
                    </p>
                    <p className="text-xs text-ink-muted flex items-center gap-1 mt-1">
                      <Phone size={11} /> {order.customer_phone}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="bg-cream rounded-xl p-3">
                    <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">
                      Items
                    </p>
                    <div className="space-y-1">
                      {order.order_items && order.order_items.length > 0 ? (
                        order.order_items.map((item) => (
                          <p key={item.id} className="text-xs text-ink">
                            {item.quantity}x {item.product_name}
                          </p>
                        ))
                      ) : (
                        <p className="text-xs text-ink-muted">—</p>
                      )}
                    </div>
                  </div>

                  {/* ⬇️ Address / Location (جديد) */}
                  <div className="bg-cream rounded-xl p-3">
                    {order.address ? (
                      <>
                        <p className="text-xs text-ink-muted uppercase tracking-wider mb-1 flex items-center gap-1">
                          <MapPin size={11} />
                          {order.location_type === 'map'
                            ? 'Location'
                            : 'Address'}
                        </p>
                        <p className="text-xs text-ink line-clamp-2 leading-relaxed">
                          {order.address}
                        </p>
                        {order.latitude && order.longitude && (
                          <a
                            href={`https://www.google.com/maps?q=${order.latitude},${order.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-brand font-semibold mt-2 hover:underline"
                          >
                            <ExternalLink size={11} />
                            فتح في Google Maps
                          </a>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">
                          Pickup
                        </p>
                        <p className="text-xs text-ink">In-store</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className="bg-amber-custom/5 border border-amber-custom/20 rounded-xl p-3 mb-4">
                    <p className="text-xs uppercase tracking-wider text-amber-custom font-medium mb-1">
                      Notes
                    </p>
                    <p className="text-xs text-ink">{order.notes}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-line">
                  <div className="flex items-center gap-3 text-xs text-ink-muted">
                    <span>Subtotal: ${order.subtotal.toFixed(2)}</span>
                    {order.delivery_fee > 0 && (
                      <span>Delivery: ${order.delivery_fee.toFixed(2)}</span>
                    )}
                    <span className="font-bold text-ink">
                      Total: ${order.total.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {nextStatus && (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => updateStatus(order.id, nextStatus)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white text-sm font-semibold shadow-brand transition"
                      >
                        <Check size={16} />
                        Move to {statusConfig[nextStatus].label}
                      </motion.button>
                    )}

                    {order.status === 'pending' && (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => cancelOrder(order.id)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-sm font-semibold hover:bg-red-500/20 transition"
                      >
                        <XCircle size={16} />
                        Reject
                      </motion.button>
                    )}

                    <button className="p-2.5 rounded-xl bg-cream hover:bg-brand/10 text-ink-muted hover:text-brand transition">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}