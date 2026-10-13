'use client';

import { motion } from 'framer-motion';
import { Plus, SlidersHorizontal, Star } from 'lucide-react';
import type { Product } from '@/lib/types/menu';
import { formatCurrency } from '@/lib/utils/formatCurrency';

export default function ProductCard({
  product,
  currency,
  onAdd,
  onOpenDetail,
  index = 0,
}: {
  product: Product;
  currency: string;
  onAdd: () => void;
  onOpenDetail?: () => void;
  index?: number;
}) {
  const hasDiscount =
    product.discount_price !== null && product.discount_price < product.price;
  const displayPrice = hasDiscount ? product.discount_price! : product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.price - displayPrice) / product.price) * 100)
    : 0;

  const hasOptions =
    (product.variants && product.variants.length > 0) ||
    (product.addons && product.addons.length > 0);

  // منتج فيه أحجام/إضافات لازم ينفتح للتفاصيل، مش ينضاف مباشرة بسعر غلط
  const handleQuickAdd = () => {
    if (hasOptions && onOpenDetail) onOpenDetail();
    else onAdd();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index, 8) * 0.04,
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative bg-surface rounded-2xl shadow-soft hover:shadow-brand border border-line hover:border-brand/30 transition-[box-shadow,border-color] duration-300 p-3 flex gap-3"
    >
      {/* Whole card opens details; the + button sits above it */}
      <button
        type="button"
        onClick={onOpenDetail}
        className="absolute inset-0 rounded-2xl"
        aria-label={`عرض ${product.name}`}
      />

      {/* Image */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-cream shrink-0">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🍽️
          </div>
        )}

        {hasDiscount && (
          <div dir="ltr" className="absolute top-1.5 start-1.5 bg-amber-custom text-white text-[11px] font-bold px-1.5 py-0.5 rounded-md shadow-md">
            -{discountPercent}%
          </div>
        )}

        {product.featured && !hasDiscount && (
          <div className="absolute top-1.5 start-1.5 bg-brand text-white p-1 rounded-md shadow-md">
            <Star size={12} className="fill-current" aria-label="مميز" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col py-0.5">
        <h3 dir="auto" className="font-bold text-ink line-clamp-1 text-base">
          {product.name}
        </h3>

        {product.description && (
          <p
            dir="auto"
            className="text-sm text-ink-muted line-clamp-2 mt-1 leading-relaxed"
          >
            {product.description}
          </p>
        )}

        {hasOptions && (
          <p className="text-xs text-brand font-medium mt-1.5 flex items-center gap-1">
            <SlidersHorizontal size={12} />
            اضغط للتفاصيل والإضافات
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-bold text-brand text-lg tabular-nums">
              {formatCurrency(displayPrice, currency)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-ink-muted line-through tabular-nums">
                {formatCurrency(product.price, currency)}
              </span>
            )}
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.88 }}
            onClick={handleQuickAdd}
            className="relative z-10 w-11 h-11 rounded-xl bg-gradient-to-br from-brand to-brand-dark text-white flex items-center justify-center shadow-md hover:shadow-brand-lg transition-shadow shrink-0"
            aria-label={`أضف ${product.name} إلى السلة`}
          >
            <Plus size={20} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
