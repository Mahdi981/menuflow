'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronLeft } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { itemsLabel } from '@/lib/utils/arabic';

export default function CartButton({
  count,
  total,
  currency,
  onClick,
}: {
  count: number;
  total: number;
  currency: string;
  onClick: () => void;
}) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.button
          type="button"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClick}
          aria-label={`عرض السلة، ${itemsLabel(count)}`}
          className="fixed bottom-safe left-4 right-4 z-40 max-w-3xl mx-auto bg-gradient-to-r from-brand to-brand-dark text-white rounded-2xl py-3.5 px-4 sm:px-5 flex items-center justify-between gap-3 shadow-brand-lg font-semibold"
        >
          <span className="flex items-center gap-3">
            <span className="relative">
              <ShoppingBag size={22} />
              {/* key = count → badge bumps on every add */}
              <motion.span
                key={count}
                initial={{ scale: 1.6 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                className="absolute -top-2 -end-2 bg-amber-custom text-white text-[10px] font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center tabular-nums"
              >
                {count}
              </motion.span>
            </span>
            <span>عرض السلة</span>
          </span>

          <span className="flex items-center gap-1 bg-white/15 rounded-full ps-3 pe-2 py-1 text-sm tabular-nums">
            {formatCurrency(total, currency)}
            <ChevronLeft size={16} />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
