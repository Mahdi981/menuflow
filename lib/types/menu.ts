// ============================================
// Restaurant
// ============================================
export type Restaurant = {
  id: string;              // UUID
  owner_id: string;        // UUID
  name: string;
  name_ar: string | null;
  slug: string;
  description: string | null;
  description_ar: string | null;
  logo_url: string | null;
  cover_url: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  currency: string;
  delivery_fee: number;
  min_order: number;
  is_active: boolean;
  accepts_delivery: boolean;
  accepts_pickup: boolean;
  working_hours: any;
  plan: 'starter' | 'professional' | 'business';
  created_at: string;
   theme_primary: string | null;
  theme_accent: string | null;
  theme_bg: string | null;
  theme_text: string | null;
  theme_preset: string | null;
  favicon_url: string | null;
};

// ============================================
// Category
// ============================================
export type Category = {
  id: string;              // UUID
  restaurant_id: string;   // UUID
  name: string;
  name_ar: string | null;
  icon: string | null;
  sort_order: number;
  created_at?: string;
};

// ============================================
// Product
// ============================================
export type ProductAddon = {
  id: string;
  product_id: string;
  name: string;
  name_ar: string | null;
  price: number;
  is_available: boolean;
  sort_order: number;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  name: string;
  name_ar: string | null;
  price: number;
  is_default: boolean;
  is_available: boolean;
  sort_order: number;
};

export type Product = {
  id: string;              // UUID
  restaurant_id: string;   // UUID
  category_id: string | null; // UUID
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  image_url: string | null;
  available: boolean;
  featured: boolean;
  sort_order: number;
  created_at?: string;
  // جديد
  addons?: ProductAddon[];
  variants?: ProductVariant[];
};

// ============================================
// Cart
// ============================================
export type CartItem = {
  cart_item_id: string;   // unique per combination
  product_id: string;
  name: string;
  base_price: number;
  price: number;           // effective price
  original_price: number;
  qty: number;
  image_url: string | null;
  // variant
  variant_id?: string | null;
  variant_name?: string | null;
  // addons
  addons?: { id: string; name: string; price: number }[];
  // notes
  notes?: string | null;
};

// ============================================
// Order
// ============================================
export type OrderType = 'delivery' | 'pickup';

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';

// ============================================
// Menu (Full data)
// ============================================
export type FullMenu = Restaurant & {
  categories: (Category & { products: Product[] })[];
  uncategorized: Product[];
};

// ============================================
// Helpers
// ============================================
export function effectivePrice(p: Product): number {
  return p.discount_price ?? p.price;
}

export function generateCartItemId(
  productId: string,
  variantId?: string | null,
  addonIds?: string[]
): string {
  const variant = variantId ?? 'no-variant';
  const addons = (addonIds ?? []).sort().join(',') || 'no-addons';
  return `${productId}-${variant}-${addons}`;
}