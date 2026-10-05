'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { Product } from '@/lib/types/menu';
import { formatCurrency } from '@/lib/utils/formatCurrency';

export default function ProductCard({
  product,
  currency,
  onAdd,
}: {
  product: Product;
  currency: string;
  onAdd: () => void;
}) {
  const hasDiscount =
    product.discount_price !== null && product.discount_price < product.price;
  const displayPrice = hasDiscount ? product.discount_price! : product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.price - displayPrice) / product.price) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-surface rounded-2xl shadow-soft hover:shadow-brand border border-line hover:border-brand/30 transition-all p-3 flex gap-3"
    >
      {/* Image */}
      <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-cream flex-shrink-0">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🍽️
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-amber-custom text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
            {discountPercent}% OFF
          </div>
        )}

        {/* Featured badge */}
        {product.featured && !hasDiscount && (
          <div className="absolute top-2 left-2 bg-brand text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
            ⭐
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col py-1">
        <h3 className="font-bold text-ink line-clamp-1 text-base">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-sm text-ink-muted line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-brand text-lg">
              {formatCurrency(displayPrice, currency)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-ink-muted line-through">
                {formatCurrency(product.price, currency)}
              </span>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={onAdd}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-dark hover:shadow-brand-lg text-white flex items-center justify-center shadow-md transition"
            aria-label="Add to cart"
          >
            <Plus size={20} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}