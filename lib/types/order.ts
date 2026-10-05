export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export type OrderType = "delivery" | "pickup";

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  price: number;
  quantity: number;
  total: number;
  created_at: string;
};

export type Order = {
  id: string;
  order_number: string | null;
  restaurant_id: string;
  customer_name: string;
  customer_phone: string;
  type: OrderType;
  address: string | null;
  notes: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  // joined
  order_items?: OrderItem[];
};