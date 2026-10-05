export type Restaurant = {
  id: string;
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
  working_hours: Record<string, { open: string; close: string }> | null;
  plan: 'starter' | 'professional' | 'business';
};

export type Category = {
  id: string;
  restaurant_id: string;
  name: string;
  name_ar: string | null;
  icon: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  image_url: string | null;
  available: boolean;
  featured: boolean;
  sort_order: number;
};

export type CartItem = {
  product_id: string;
  name: string;
  price: number;         // effective price (after discount)
  original_price: number;
  qty: number;
  image_url: string | null;
};

export type OrderType = 'delivery' | 'pickup';

export type OrderStatus =
  | 'pending' | 'confirmed' | 'preparing' | 'ready'
  | 'delivering' | 'completed' | 'cancelled';

export type FullMenu = Restaurant & {
  categories: (Category & { products: Product[] })[];
  uncategorized: Product[];  // products with category_id = null
};

// helper
export function effectivePrice(p: Product): number {
  return p.discount_price ?? p.price;
}