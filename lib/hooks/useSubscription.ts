'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

export type SubscriptionStatus =
  | 'pending'
  | 'active'
  | 'trial'
  | 'expired'
  | 'cancelled'
  | 'failed';

export type Subscription = {
  id: string;
  restaurant_id: string;
  dodo_subscription_id: string | null;
  dodo_customer_id: string | null;
  dodo_product_id: string | null;
  dodo_payment_id: string | null;
  status: SubscriptionStatus;
  plan: 'starter' | 'professional' | 'business';
  price_usd: number;
  currency: string;
  trial_started_at: string | null;
  trial_ends_at: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
};

export function useSubscription(restaurantId?: string | null) {
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
if (!supabaseRef.current) {
  supabaseRef.current = createClient();
}
const supabase = supabaseRef.current;
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchSub = async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cancelled) return;

      if (error || !data) {
        setSubscription(null);
      } else {
        setSubscription(data as Subscription);
      }
      setLoading(false);
    };

    fetchSub();

    // Realtime
    const channel = supabase
      .channel(`subscription-${restaurantId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        () => fetchSub()
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [restaurantId, supabase]);

  const isTrialActive: boolean =
  subscription?.status === 'trial' &&
  !!subscription?.trial_ends_at &&
  new Date(subscription.trial_ends_at) > new Date();

  const trialDaysLeft = (() => {
    if (!subscription?.trial_ends_at) return 0;
    const diff =
      new Date(subscription.trial_ends_at).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  })();

  const isActive = subscription?.status === 'active';
  const isExpired =
    subscription?.status === 'expired' ||
    subscription?.status === 'cancelled';

  return {
    subscription,
    loading,
    isTrialActive,
    trialDaysLeft,
    isActive,
    isExpired,
  };
}