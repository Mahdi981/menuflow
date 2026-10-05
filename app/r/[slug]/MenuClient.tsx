'use client';

import { useState } from 'react';
import type { FullMenu, Category, Product } from '@/lib/types/menu';
import MenuHeader from '@/components/MenuHeader';
import CategoryTabs from '@/components/CategoryTabs';
import ProductCard from '@/components/ProductCard';
import CartButton from '@/components/CartButton';
import CartDrawer from '@/components/CartDrawer';
import { useCart } from '@/lib/store/cart';

export default function MenuClient({ menu }: { menu: FullMenu }) {
  const [activeCat, setActiveCat] = useState<string>(
    menu.categories[0]?.id ?? '__uncat__'
  );
  const [cartOpen, setCartOpen] = useState(false);
  const totalItems = useCart((s) => s.items.reduce((a, i) => a + i.qty, 0));
  const addItem = useCart((s) => s.addItem);

  const allCategories: (Category & { products: Product[] })[] = [
    ...menu.categories,
    ...(menu.uncategorized.length
      ? [
          {
            id: '__uncat__',
            restaurant_id: menu.id,
            name: 'Other',
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

  return (
    <div className="min-h-screen bg-cream pb-28">
      <MenuHeader restaurant={menu} />

      <CategoryTabs
        categories={allCategories}
        activeId={activeCat}
        onSelect={setActiveCat}
      />

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
        {current && (
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-lg font-bold text-ink">
              {current.name_ar ?? current.name}
            </h2>
            <div className="flex-1 h-px bg-line" />
            <span className="text-xs text-ink-muted font-medium">
              {current.products.length} item
              {current.products.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {current?.products.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-surface mx-auto flex items-center justify-center text-3xl shadow-soft mb-4">
              🍽️
            </div>
            <p className="text-ink-muted font-medium">No items yet</p>
          </div>
        )}

        {current?.products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            currency={menu.currency}
            onAdd={() => addItem(menu.slug, p)}
          />
        ))}

        <div className="h-4" />
      </div>

      <CartButton count={totalItems} onClick={() => setCartOpen(true)} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        restaurant={menu}
      />
    </div>
  );
}