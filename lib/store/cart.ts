'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/lib/types/menu';
import { basePrice, unitPrice } from '@/lib/pricing';

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
  syncWithMenu: (slug: string, products: Product[]) => void;

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

        // نفس منطق السيرفر (lib/pricing) — هون للعرض بس، السيرفر بيعيد الحساب
        const baseDiscountPrice = basePrice(product);
        const variant = options?.variant_id
          ? product.variants?.find((v) => v.id === options.variant_id)
          : null;
        const finalPrice = unitPrice(product, variant, options?.addons ?? []);

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

      // السلة محفوظة بالمتصفح — منحدّث أسعارها من المنيو الحالي ومنشيل
      // الأصناف اللي ما عادت متوفرة، عشان تطابق اللي بيحسبه السيرفر
      syncWithMenu: (slug, products) => {
        const state = get();
        if (state.restaurantSlug !== slug || state.items.length === 0) return;

        const byId = new Map(products.map((p) => [p.id, p]));
        const items = state.items.flatMap((item) => {
          const product = byId.get(item.product_id);
          if (!product) return [];

          const variant = item.variant_id
            ? product.variants?.find(
                (v) => v.id === item.variant_id && v.is_available
              )
            : null;
          if (item.variant_id && !variant) return [];
          // المنتج صار إلو أحجام — لازم الزبون يختار من جديد
          if (!item.variant_id && product.variants?.some((v) => v.is_available)) {
            return [];
          }

          const addons: { id: string; name: string; price: number }[] = [];
          for (const a of item.addons ?? []) {
            const fresh = product.addons?.find(
              (x) => x.id === a.id && x.is_available
            );
            if (!fresh) return [];
            addons.push({ ...a, price: fresh.price });
          }

          return [
            {
              ...item,
              name: product.name,
              base_price: basePrice(product),
              original_price: product.price,
              price: unitPrice(product, variant, addons),
              addons,
            },
          ];
        });

        set({ items });
      },

      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    {
      name: 'menuflow-cart-v2',
    }
  )
);