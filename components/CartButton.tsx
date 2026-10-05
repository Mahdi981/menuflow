'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

export default function CartButton({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          onClick={onClick}
          className="fixed bottom-4 left-4 right-4 z-40 max-w-3xl mx-auto bg-gradient-to-r from-brand to-brand-dark text-white rounded-2xl py-4 px-6 flex items-center justify-between shadow-brand-lg font-semibold"
        >
          <span className="flex items-center gap-2.5">
            <div className="relative">
              <ShoppingBag size={22} />
              <span className="absolute -top-1.5 -right-1.5 bg-amber-custom text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            </div>
            <span>View Cart</span>
          </span>

          <span className="bg-white/20 rounded-full px-3 py-1 text-sm">
            {count} item{count !== 1 ? 's' : ''}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}