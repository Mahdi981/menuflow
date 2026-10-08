'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export type PlanLimits = {
  id: string;
  name: string;
  price_usd: number;
  max_categories: number;
  max_products: number;
  max_orders_per_month: number;
};

export function usePlanLimits(planId?: string | null) {
  const [supabase] = useState(() => createClient());
  const [limits, setLimits] = useState<PlanLimits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!planId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchLimits = async () => {
      const { data, error } = await supabase
        .from('plans')
        .select(
          'id, name, price_usd, max_categories, max_products, max_orders_per_month'
        )
        .eq('id', planId)
        .maybeSingle();

      if (cancelled) return;

      if (error || !data) {
        setLimits(null);
      } else {
        setLimits(data as PlanLimits);
      }
      setLoading(false);
    };

    fetchLimits();
    return () => {
      cancelled = true;
    };
  }, [planId, supabase]);

  return { limits, loading };
}

/**
 * Helper: يعرض "∞" للأرقام الضخمة
 */
export function formatLimit(n: number | undefined | null): string {
  if (!n || n >= 999999) return '∞';
  return n.toString();
}

/**
 * Helper: يتحقق إذا وصل الحد
 */
export function isAtLimit(current: number, max: number | undefined | null): boolean {
  if (!max || max >= 999999) return false;
  return current >= max;
}