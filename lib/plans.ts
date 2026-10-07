export type PlanId = 'starter' | 'professional' | 'business';

export type PlanFeature = {
  label: string;
  included: boolean;
};

export type Plan = {
  id: PlanId;
  name: string;
  name_ar: string | null;
  description: string | null;
  price_usd: number;
  free_trial_days: number;
  stripe_price_id: string | null;
  max_categories: number;
  max_products: number;
  max_orders_per_month: number;
  features: PlanFeature[];
  is_active: boolean;
  sort_order: number;
};

/**
 * تنسيق الحدود — 999999 = ∞
 */
export function formatLimit(n: number): string {
  if (n >= 999999) return '∞';
  return n.toString();
}

/**
 * الخطط الافتراضية (fallback)
 */
export const DEFAULT_PLANS: Record<PlanId, Plan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    name_ar: 'المبتدئ',
    description: 'Perfect for trying MenuFlow',
    price_usd: 5,
    free_trial_days: 14,
    stripe_price_id: null,
    max_categories: 1,
    max_products: 3,
    max_orders_per_month: 5,
    features: [
      { label: 'Public Menu + QR Code', included: true },
      { label: 'Basic orders dashboard', included: true },
      { label: 'Offers & coupons', included: false },
      { label: 'Analytics', included: false },
      { label: 'Custom domain', included: false },
      { label: 'Priority support', included: false },
    ],
    is_active: true,
    sort_order: 1,
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    name_ar: 'احترافي',
    description: 'For growing restaurants',
    price_usd: 29,
    free_trial_days: 14,
    stripe_price_id: null,
    max_categories: 50,
    max_products: 999999,
    max_orders_per_month: 500,
    features: [
      { label: 'Public Menu + QR Code', included: true },
      { label: 'Full orders dashboard', included: true },
      { label: 'Offers & coupons', included: true },
      { label: 'Analytics & insights', included: true },
      { label: 'Custom domain', included: false },
      { label: 'Priority support', included: false },
    ],
    is_active: true,
    sort_order: 2,
  },
  business: {
    id: 'business',
    name: 'Business',
    name_ar: 'الأعمال',
    description: 'For serious restaurants',
    price_usd: 79,
    free_trial_days: 14,
    stripe_price_id: null,
    max_categories: 999999,
    max_products: 999999,
    max_orders_per_month: 999999,
    features: [
      { label: 'Public Menu + QR Code', included: true },
      { label: 'Full orders dashboard', included: true },
      { label: 'Offers & coupons', included: true },
      { label: 'Analytics & insights', included: true },
      { label: 'Custom domain', included: true },
      { label: 'Priority support', included: true },
    ],
    is_active: true,
    sort_order: 3,
  },
};