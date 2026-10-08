'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Flame,
} from 'lucide-react';
import type { Product } from '@/lib/types/menu';
import { formatCurrency } from '@/lib/utils/formatCurrency';

type Props = {
  product: Product | null;
  currency: string;
  open: boolean;
  onClose: () => void;
  onAdd: (options: {
    variant_id?: string | null;
    variant_name?: string | null;
    addons?: { id: string; name: string; price: number }[];
    notes?: string | null;
    qty?: number;
  }) => void;
};

export default function ProductDetailModal({
  product,
  currency,
  open,
  onClose,
  onAdd,
}: Props) {
  const [qty, setQty] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState('');

  // reset عند فتح منتج جديد
  useEffect(() => {
    if (product) {
      setQty(1);
      const defaultVariant =
        product.variants?.find((v) => v.is_default) ??
        product.variants?.[0];
      setSelectedVariantId(defaultVariant?.id ?? null);
      setSelectedAddons(new Set());
      setNotes('');
    }
  }, [product]);

  const selectedVariant = useMemo(
    () => product?.variants?.find((v) => v.id === selectedVariantId) ?? null,
    [product, selectedVariantId]
  );

  const basePrice = useMemo(() => {
    if (!product) return 0;
    if (selectedVariant) return selectedVariant.price;
    return product.discount_price ?? product.price;
  }, [product, selectedVariant]);

  const addonsTotal = useMemo(() => {
    if (!product?.addons) return 0;
    return product.addons
      .filter((a) => selectedAddons.has(a.id))
      .reduce((s, a) => s + a.price, 0);
  }, [product, selectedAddons]);

  const totalPrice = (basePrice + addonsTotal) * qty;

  const toggleAddon = (id: string) => {
    const next = new Set(selectedAddons);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedAddons(next);
  };

  const handleAdd = () => {
    if (!product) return;
    const addons = (product.addons ?? [])
      .filter((a) => selectedAddons.has(a.id))
      .map((a) => ({
        id: a.id,
        name: a.name_ar ?? a.name,
        price: a.price,
      }));

    onAdd({
      variant_id: selectedVariantId,
      variant_name: selectedVariant
        ? selectedVariant.name_ar ?? selectedVariant.name
        : null,
      addons,
      notes: notes.trim() || null,
      qty,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-3xl max-h-[90vh] overflow-y-auto max-w-2xl mx-auto shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-surface z-10 flex items-center justify-between p-4 border-b border-line">
              <h2 className="text-lg font-bold text-ink truncate pr-4">
                {product.name}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-cream rounded-full text-ink-muted shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-5">
              {/* Image */}
              {product.image_url && (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-cream">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.featured && (
                    <div className="absolute top-3 right-3 bg-brand text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <Flame size={12} />
                      Featured
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              {product.description && (
                <p className="text-sm text-ink-muted leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-ink mb-3">
                    اختار الحجم
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`p-3 rounded-xl border-2 font-medium text-sm transition text-left ${
                          selectedVariantId === v.id
                            ? 'border-brand bg-brand/5 text-brand'
                            : 'border-line text-ink-muted hover:border-brand/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{v.name_ar ?? v.name}</span>
                          {selectedVariantId === v.id && (
                            <Check size={16} className="text-brand" />
                          )}
                        </div>
                        <div className="text-xs text-ink-muted mt-1">
                          {formatCurrency(v.price, currency)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons */}
              {product.addons && product.addons.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-ink mb-3">
                    إضافات (اختياري)
                  </h3>
                  <div className="space-y-2">
                    {product.addons
                      .filter((a) => a.is_available)
                      .map((a) => {
                        const isSelected = selectedAddons.has(a.id);
                        return (
                          <button
                            key={a.id}
                            onClick={() => toggleAddon(a.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition ${
                              isSelected
                                ? 'border-brand bg-brand/5'
                                : 'border-line hover:border-brand/30'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                                  isSelected
                                    ? 'bg-brand border-brand'
                                    : 'border-line'
                                }`}
                              >
                                {isSelected && (
                                  <Check size={12} className="text-white" />
                                )}
                              </div>
                              <span
                                className={`text-sm ${
                                  isSelected
                                    ? 'text-brand font-medium'
                                    : 'text-ink'
                                }`}
                              >
                                {a.name_ar ?? a.name}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-brand">
                              +{formatCurrency(a.price, currency)}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <h3 className="text-sm font-bold text-ink mb-3">
                  ملاحظات (اختياري)
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="مثلاً: بدون بصلة، حار شوي..."
                  className="w-full bg-white border border-line rounded-xl px-4 py-3 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 resize-none"
                />
              </div>

              {/* Quantity */}
              <div>
                <h3 className="text-sm font-bold text-ink mb-3">الكمية</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 rounded-xl bg-cream hover:bg-brand/10 text-ink flex items-center justify-center transition"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="text-xl font-bold text-ink w-12 text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 rounded-xl bg-brand hover:bg-brand-dark text-white flex items-center justify-center transition"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer - Add to cart */}
            <div className="sticky bottom-0 bg-surface border-t border-line p-4">
              <button
                onClick={handleAdd}
                className="w-full flex items-center justify-between gap-3 py-4 px-5 rounded-2xl bg-gradient-to-r from-brand to-brand-dark hover:opacity-90 text-white font-bold shadow-brand transition"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag size={20} />
                  إضافة للسلة
                </span>
                <span className="text-lg">
                  {formatCurrency(totalPrice, currency)}
                </span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}