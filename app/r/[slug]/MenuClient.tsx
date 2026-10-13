'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import type { FullMenu, Category, Product } from '@/lib/types/menu';
import MenuHeader from '@/components/MenuHeader';
import CategoryTabs from '@/components/CategoryTabs';
import ProductCard from '@/components/ProductCard';
import CartButton from '@/components/CartButton';
import CartDrawer from '@/components/CartDrawer';
import ProductDetailModal from '@/components/ProductDetailModal';
import { useCart } from '@/lib/store/cart';
import { buildThemeVars } from '@/lib/themes';
import { itemsLabel } from '@/lib/utils/arabic';

export default function MenuClient({ menu }: { menu: FullMenu }) {
  const [activeCat, setActiveCat] = useState<string>(
    menu.categories[0]?.id ?? '__uncat__'
  );
  const [cartOpen, setCartOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const totalItems = useCart((s) => s.items.reduce((a, i) => a + i.qty, 0));
  const subtotal = useCart((s) =>
    s.items.reduce((a, i) => a + i.price * i.qty, 0)
  );
  const addItem = useCart((s) => s.addItem);
  const syncWithMenu = useCart((s) => s.syncWithMenu);

  // حدّث أسعار السلة المحفوظة من المنيو الحالي (بعد ما يتحمّل الـ localStorage)
  useEffect(() => {
    const sync = () =>
      syncWithMenu(menu.slug, [
        ...menu.categories.flatMap((c) => c.products),
        ...menu.uncategorized,
      ]);
    if (useCart.persist.hasHydrated()) sync();
    return useCart.persist.onFinishHydration(sync);
  }, [menu, syncWithMenu]);

  const allCategories: (Category & { products: Product[] })[] = [
    ...menu.categories,
    ...(menu.uncategorized.length
      ? [
          {
            id: '__uncat__',
            restaurant_id: menu.id,
            name: 'أخرى',
            name_ar: null,
            icon: null,
            sort_order: 9999,
            products: menu.uncategorized,
          },
        ]
      : []),
  ];

  const current =
    allCategories.find((c) => c.id === activeCat) ?? allCategories[0];

  const themeVars = buildThemeVars({
    primary: menu.theme_primary ?? '#1C7E84',
    accent: menu.theme_accent ?? '#C9A227',
    bg: menu.theme_bg ?? '#F0EEE9',
    text: menu.theme_text ?? '#1A1A1A',
  });

  const handleSelectCategory = (id: string) => {
    setActiveCat(id);
    // ارجع لأول القائمة إذا الزبون كان نازل تحت
    const el = listRef.current;
    if (el && el.getBoundingClientRect().top < 0) {
      el.scrollIntoView({ block: 'start' });
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        dir="rtl"
        lang="ar"
        className="min-h-screen pb-32 bg-cream text-ink transition-colors"
        style={themeVars}
      >
        <MenuHeader restaurant={menu} />

        <CategoryTabs
          categories={allCategories}
          activeId={activeCat}
          onSelect={handleSelectCategory}
        />

        <div
          ref={listRef}
          className="max-w-3xl mx-auto px-4 py-6 scroll-mt-20"
        >
          {current && (
            <div className="flex items-center gap-3 mb-4">
              <h2 dir="auto" className="text-lg font-bold text-ink">
                {current.name_ar ?? current.name}
              </h2>
              <div className="flex-1 h-px bg-line" />
              <span className="text-xs font-medium text-ink-muted tabular-nums">
                {itemsLabel(current.products.length)}
              </span>
            </div>
          )}

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current?.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-3 md:grid-cols-2"
            >
              {current?.products.length === 0 && (
                <div className="md:col-span-2 text-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-surface mx-auto flex items-center justify-center text-3xl shadow-soft mb-4">
                    🍽️
                  </div>
                  <p className="font-medium text-ink-muted">لا توجد أصناف بعد</p>
                </div>
              )}

              {current?.products.map((p, i) => (
                <ProductCard
                  key={p.id}
                  index={i}
                  product={p}
                  currency={menu.currency}
                  onAdd={() => addItem(menu.slug, p)}
                  onOpenDetail={() => setDetailProduct(p)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <CartButton
          count={totalItems}
          total={subtotal}
          currency={menu.currency}
          onClick={() => setCartOpen(true)}
        />

        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          restaurant={menu}
        />

        <ProductDetailModal
          product={detailProduct}
          currency={menu.currency}
          open={detailProduct !== null}
          onClose={() => setDetailProduct(null)}
          onAdd={(options) => {
            if (detailProduct) {
              addItem(menu.slug, detailProduct, options);
            }
          }}
        />
      </div>
    </MotionConfig>
  );
}
