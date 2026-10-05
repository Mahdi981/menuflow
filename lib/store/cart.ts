'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/lib/types/menu';

type CartState = {
  restaurantSlug: string | null;
  items: CartItem[];

  // actions
  addItem: (slug: string, product: Product) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;

  // computed
  totalItems: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      restaurantSlug: null,
      items: [],

      addItem: (slug, product) => {
        const state = get();
        const price = product.discount_price ?? product.price;
        const original_price = product.price;

        const newItem: CartItem = {
          product_id: product.id,
          name: product.name,
          price,
          original_price,
          qty: 1,
          image_url: product.image_url,
        };

        // if switching restaurants → reset cart
        if (state.restaurantSlug && state.restaurantSlug !== slug) {
          set({ restaurantSlug: slug, items: [newItem] });
          return;
        }

        const existing = state.items.find((i) => i.product_id === product.id);
        if (existing) {
          set({
            restaurantSlug: slug,
            items: state.items.map((i) =>
              i.product_id === product.id ? { ...i, qty: i.qty + 1 } : i
            ),
          });
        } else {
          set({
            restaurantSlug: slug,
            items: [...state.items, newItem],
          });
        }
      },

      removeItem: (productId) =>
        set((s) => ({
          items: s.items.filter((i) => i.product_id !== productId),
        })),

      updateQty: (productId, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.product_id !== productId)
              : s.items.map((i) =>
                  i.product_id === productId ? { ...i, qty } : i
                ),
        })),

      clear: () => set({ items: [], restaurantSlug: null }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    {
      name: 'menuflow-cart',
    }
  )
);