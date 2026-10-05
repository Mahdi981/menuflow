'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import type { Restaurant } from '@/lib/types/menu';
import { useCart } from '@/lib/store/cart';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import CheckoutModal from './CheckoutModal';

export default function CartDrawer({
  open,
  onClose,
  restaurant,
}: {
  open: boolean;
  onClose: () => void;
  restaurant: Restaurant;
}) {
  const items = useCart((s) => s.items);
  const updateQty = useCart((s) => s.updateQty);
  const removeItem = useCart((s) => s.removeItem);
  const subtotal = useCart((s) => s.subtotal);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const sub = subtotal();

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-3xl max-h-[85vh] flex flex-col max-w-3xl mx-auto shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-line">
                <h2 className="text-lg font-bold text-ink">Your Order</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-cream rounded-full text-ink-muted"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.length === 0 && (
                  <p className="text-center text-ink-muted py-8">
                    Cart is empty
                  </p>
                )}
                {items.map((item) => (
                  <div key={item.product_id} className="flex gap-3 items-center">
                    <div className="w-14 h-14 rounded-xl bg-cream overflow-hidden flex-shrink-0">
                      {item.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          🍔
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate text-ink">
                        {item.name}
                      </p>
                      <p className="text-brand text-sm font-bold">
                        {formatCurrency(
                          item.price * item.qty,
                          restaurant.currency
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.product_id, item.qty - 1)}
                        className="w-7 h-7 rounded-full bg-cream flex items-center justify-center text-ink"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center font-semibold text-sm text-ink">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.product_id, item.qty + 1)}
                        className="w-7 h-7 rounded-full bg-brand text-white flex items-center justify-center"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => removeItem(item.product_id)}
                        className="ml-1 p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {items.length > 0 && (
                <div className="border-t border-line p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-muted">Subtotal</span>
                    <span className="font-semibold text-ink">
                      {formatCurrency(sub, restaurant.currency)}
                    </span>
                  </div>
                  {sub < restaurant.min_order && (
                    <p className="text-xs text-amber-custom bg-amber-custom/5 border border-amber-custom/20 rounded-lg p-2">
                      Minimum order:{' '}
                      {formatCurrency(restaurant.min_order, restaurant.currency)}
                    </p>
                  )}
                  <button
                    disabled={sub < restaurant.min_order}
                    onClick={() => setCheckoutOpen(true)}
                    className="w-full bg-gradient-to-r from-brand to-brand-dark hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition shadow-brand"
                  >
                    Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        restaurant={restaurant}
        onSuccess={() => {
          setCheckoutOpen(false);
          onClose();
        }}
      />
    </>
  );
}