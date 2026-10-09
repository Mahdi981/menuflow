import DodoPayments from 'dodopayments';

// ⚠️ Server-only client
if (typeof window !== 'undefined') {
  throw new Error('Dodo client should only be used on the server');
}

export const dodo = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY!,
  environment:
    process.env.NEXT_PUBLIC_DODO_ENVIRONMENT === 'live' ? 'live_mode' : 'test_mode',
});

// ============================================
// Product IDs from env
// ============================================
export const PRODUCT_IDS = {
  professional: process.env.DODO_PRODUCT_PROFESSIONAL!,
  business: process.env.DODO_PRODUCT_BUSINESS!,
} as const;

export type PaidPlanId = keyof typeof PRODUCT_IDS;

export function isPaidPlan(plan: string): plan is PaidPlanId {
  return plan === 'professional' || plan === 'business';
}

// ============================================
// Plan pricing (for display)
// ============================================
export const PLAN_PRICES: Record<PaidPlanId, number> = {
  professional: 29,
  business: 79,
};

export const TRIAL_DAYS = 10;