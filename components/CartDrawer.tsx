'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, Pencil } from 'lucide-react';
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
  const updateNotes = useCart((s) => s.updateNotes);
  const subtotal = useCart((s) => s.subtotal);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

  const sub = subtotal();

  const handleEditNote = (cartItemId: string, currentNote: string | null) => {
    setEditingNoteId(cartItemId);
    setNoteDraft(currentNote ?? '');
  };

  const handleSaveNote = () => {
    if (editingNoteId) {
      updateNotes(editingNoteId, noteDraft.trim());
      setEditingNoteId(null);
      setNoteDraft('');
    }
  };

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
              className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-3xl max-h-[90vh] flex flex-col max-w-3xl mx-auto shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-line shrink-0">
                <h2 className="text-lg font-bold text-ink">Your Order</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-cream rounded-full text-ink-muted"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-cream mx-auto flex items-center justify-center text-3xl mb-4">
                      🛒
                    </div>
                    <p className="text-ink-muted font-medium">Cart is empty</p>
                    <p className="text-sm text-ink-muted/70 mt-1">
                      Add items from the menu
                    </p>
                  </div>
                )}

                {items.map((item) => (
                  <div
                    key={item.cart_item_id}
                    className="bg-cream rounded-xl p-3 space-y-2"
                  >
                    {/* Main row */}
                    <div className="flex gap-3 items-start">
                      <div className="w-14 h-14 rounded-xl bg-white overflow-hidden flex-shrink-0">
                        {item.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">
                            🍔
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-ink truncate">
                          {item.name}
                        </p>

                        {item.variant_name && (
                          <p className="text-xs text-ink-muted mt-0.5">
                            الحجم: {item.variant_name}
                          </p>
                        )}

                        {item.addons && item.addons.length > 0 && (
                          <p className="text-xs text-ink-muted mt-0.5 line-clamp-2">
                            + {item.addons.map((a) => a.name).join('، ')}
                          </p>
                        )}

                        <p className="text-brand text-sm font-bold mt-1">
                          {formatCurrency(
                            item.price * item.qty,
                            restaurant.currency
                          )}
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(item.cart_item_id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Notes row */}
                    <div className="flex items-center gap-2">
                      {editingNoteId === item.cart_item_id ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            placeholder="ملاحظة..."
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveNote();
                              if (e.key === 'Escape') setEditingNoteId(null);
                            }}
                            className="flex-1 bg-white border border-line rounded-lg px-3 py-1.5 text-xs text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand"
                          />
                          <button
                            onClick={handleSaveNote}
                            className="px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-semibold"
                          >
                            حفظ
                          </button>
                        </div>
                      ) : item.notes ? (
                        <button
                          onClick={() =>
                            handleEditNote(item.cart_item_id, item.notes ?? '')
                          }
                          className="flex items-center gap-1.5 text-xs text-amber-custom hover:underline"
                        >
                          <Pencil size={11} />
                          <span className="italic">📝 {item.notes}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditNote(item.cart_item_id, '')}
                          className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-brand transition"
                        >
                          <Pencil size={11} />
                          إضافة ملاحظة
                        </button>
                      )}
                    </div>

                    {/* Qty row */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-ink-muted">
                        {formatCurrency(item.price, restaurant.currency)} × {item.qty}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQty(item.cart_item_id, item.qty - 1)
                          }
                          className="w-8 h-8 rounded-full bg-white hover:bg-brand/10 flex items-center justify-center text-ink transition"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-bold text-sm text-ink">
                          {item.qty}
                        </span>
                        <button
                          onClick={() =>
                            updateQty(item.cart_item_id, item.qty + 1)
                          }
                          className="w-8 h-8 rounded-full bg-brand hover:bg-brand-dark text-white flex items-center justify-center transition"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-line p-4 space-y-3 shrink-0">
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
                    className="w-full bg-gradient-to-r from-brand to-brand-dark hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition shadow-brand"
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