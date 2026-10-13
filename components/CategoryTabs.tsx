'use client';

import { useEffect, useRef } from 'react';
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
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // خلّي التاب المختار بالنص بالشريط على الموبايل (أفقياً بس، بدون ما تتحرك الصفحة)
  useEffect(() => {
    const scroller = scrollerRef.current;
    const tab = activeRef.current;
    if (!scroller || !tab) return;
    scroller.scrollTo({
      left: tab.offsetLeft - scroller.clientWidth / 2 + tab.clientWidth / 2,
      behavior: 'smooth',
    });
  }, [activeId]);

  return (
    <nav
      aria-label="أقسام المنيو"
      className="sticky top-0 z-30 bg-cream/90 backdrop-blur-lg border-b border-line mt-6"
    >
      <div
        ref={scrollerRef}
        className="relative max-w-3xl mx-auto px-4 py-3 overflow-x-auto scrollbar-hide"
      >
        <div className="flex gap-2 min-w-max" role="tablist">
          {categories.map((c) => {
            const isActive = c.id === activeId;
            return (
              <button
                key={c.id}
                ref={isActive ? activeRef : undefined}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelect(c.id)}
                className={`relative px-4 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                  isActive ? '' : 'bg-surface/60 hover:bg-surface border border-line'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-cat"
                    className="absolute inset-0 bg-gradient-to-r from-brand to-brand-dark rounded-full shadow-brand"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span
                  dir="auto"
                  className={`relative flex items-center gap-1.5 ${
                    isActive ? 'text-white' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {c.icon && <span aria-hidden>{c.icon}</span>}
                  {c.name_ar ?? c.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
