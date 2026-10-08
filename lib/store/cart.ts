'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/lib/types/menu';

export type AddToCartOptions = {
  variant_id?: string | null;
  variant_name?: string | null;
  addons?: { id: string; name: string; price: number }[];
  notes?: string | null;
  qty?: number;
};

type CartState = {
  restaurantSlug: string | null;
  items: CartItem[];

  addItem: (slug: string, product: Product, options?: AddToCartOptions) => void;
  removeItem: (cartItemId: string) => void;
  updateQty: (cartItemId: string, qty: number) => void;
  updateNotes: (cartItemId: string, notes: string) => void;
  clear: () => void;

  totalItems: () => number;
  subtotal: () => number;
};

function generateCartItemId(
  productId: string,
  variantId?: string | null,
  addonIds?: string[]
): string {
  const v = variantId ?? 'no-variant';
  const a = (addonIds ?? []).sort().join(',') || 'no-addons';
  return `${productId}-${v}-${a}`;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      restaurantSlug: null,
      items: [],

      addItem: (slug, product, options) => {
        const state = get();

        // احسب السعر الفعلي
        const baseDiscountPrice = product.discount_price ?? product.price;
        const variantPrice = options?.variant_id
          ? product.variants?.find((v) => v.id === options.variant_id)?.price ??
            baseDiscountPrice
          : baseDiscountPrice;
        const addonsTotal = (options?.addons ?? []).reduce(
          (s, a) => s + a.price,
          0
        );
        const finalPrice = variantPrice + addonsTotal;

        const cartItemId = generateCartItemId(
          product.id,
          options?.variant_id ?? null,
          (options?.addons ?? []).map((a) => a.id)
        );

        const newItem: CartItem = {
          cart_item_id: cartItemId,
          product_id: product.id,
          name: product.name,
          base_price: baseDiscountPrice,
          price: finalPrice,
          original_price: product.price,
          qty: options?.qty ?? 1,
          image_url: product.image_url,
          variant_id: options?.variant_id ?? null,
          variant_name: options?.variant_name ?? null,
          addons: options?.addons ?? [],
          notes: options?.notes ?? null,
        };

        // إذا بدّل مطعم → صفّر
        if (state.restaurantSlug && state.restaurantSlug !== slug) {
          set({ restaurantSlug: slug, items: [newItem] });
          return;
        }

        // إذا نفس المنتج + variant + addons → زيد الكمية
        const existing = state.items.find((i) => i.cart_item_id === cartItemId);
        if (existing) {
          set({
            restaurantSlug: slug,
            items: state.items.map((i) =>
              i.cart_item_id === cartItemId
                ? { ...i, qty: i.qty + (options?.qty ?? 1) }
                : i
            ),
          });
        } else {
          set({
            restaurantSlug: slug,
            items: [...state.items, newItem],
          });
        }
      },

      removeItem: (cartItemId) =>
        set((s) => ({
          items: s.items.filter((i) => i.cart_item_id !== cartItemId),
        })),

      updateQty: (cartItemId, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.cart_item_id !== cartItemId)
              : s.items.map((i) =>
                  i.cart_item_id === cartItemId ? { ...i, qty } : i
                ),
        })),

      updateNotes: (cartItemId, notes) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.cart_item_id === cartItemId ? { ...i, notes } : i
          ),
        })),

      clear: () => set({ items: [], restaurantSlug: null }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    {
      name: 'menuflow-cart-v2',
    }
  )
);