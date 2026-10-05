'use client';

import { motion } from 'framer-motion';
import type { Category } from '@/lib/types/menu';

export default function CategoryTabs({
  categories,
  activeId,
  onSelect,
}: {
  categories: Category[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="sticky top-0 z-30 bg-cream/95 backdrop-blur-lg border-b border-line mt-6">
      <div className="max-w-3xl mx-auto px-4 py-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {categories.map((c) => {
            const isActive = c.id === activeId;
            return (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className="relative px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="active-cat"
                    className="absolute inset-0 bg-gradient-to-r from-brand to-brand-dark rounded-full shadow-brand"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span
                  className={`relative flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {c.icon && <span>{c.icon}</span>}
                  {c.name_ar ?? c.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}