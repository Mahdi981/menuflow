// منطق التسعير الوحيد — بيستعمله الـ cart (للعرض) والسيرفر (للحساب الفعلي)
// عشان اللي بيشوفه الزبون = اللي بينحسب عليه.

type PricedProduct = {
  price: number;
  discount_price: number | null;
};

type PricedOption = { price: number };

/** سعر المنتج الأساسي بعد الخصم (إذا الخصم صالح) */
export function basePrice(product: PricedProduct): number {
  const d = product.discount_price;
  if (d !== null && d !== undefined && d > 0 && d < product.price) return d;
  return product.price;
}

/** سعر القطعة الواحدة: الحجم (إذا موجود) بيحل محل السعر الأساسي + الإضافات */
export function unitPrice(
  product: PricedProduct,
  variant: PricedOption | null | undefined,
  addons: PricedOption[] = []
): number {
  const base = variant ? variant.price : basePrice(product);
  return roundMoney(base + addons.reduce((s, a) => s + a.price, 0));
}

export type Coupon = {
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
};

export function couponDiscount(coupon: Coupon | null, subtotal: number): number {
  if (!coupon) return 0;
  const raw =
    coupon.discount_type === 'percentage'
      ? (subtotal * Math.min(Math.max(coupon.discount_value, 0), 100)) / 100
      : Math.max(coupon.discount_value, 0);
  return roundMoney(Math.min(raw, subtotal));
}

export function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}
