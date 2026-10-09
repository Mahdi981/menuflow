'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

export type PlanLimits = {
  id: string;
  name: string;
  price_usd: number;
  max_categories: number;
  max_products: number;
  max_orders_per_month: number;
};

// Fallback data (لو فشل الاتصال بـ DB)
const FALLBACK: Record<string, Omit<PlanLimits, 'id' | 'name'>> = {
  starter: {
    price_usd: 0,
    max_categories: 1,
    max_products: 30,
    max_orders_per_month: 20,
  },
  professional: {
    price_usd: 29,
    max_categories: 50,
    max_products: 999999,
    max_orders_per_month: 500,
  },
  business: {
    price_usd: 79,
    max_categories: 999999,
    max_products: 999999,
    max_orders_per_month: 999999,
  },
};

function getFallback(planId: string): PlanLimits {
  const data = FALLBACK[planId] ?? FALLBACK.starter;
  return {
    id: planId,
    name: planId,
    ...data,
  };
}

export function usePlanLimits(planId?: string | null) {

  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
if (!supabaseRef.current) {
  supabaseRef.current = createClient();
}
const supabase = supabaseRef.current;;
  const [limits, setLimits] = useState<PlanLimits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!planId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    // ⚠️ مهم: timeout 2.5 ثواني بعدها fallback
    const timeoutId = setTimeout(() => {
      if (!cancelled) {
        console.warn('[usePlanLimits] Timeout — using fallback for', planId);
        setLimits(getFallback(planId));
        setLoading(false);
      }
    }, 2500);

    const fetchLimits = async () => {
      try {
        const { data, error } = await supabase
          .from('plans')
          .select(
            'id, name, price_usd, max_categories, max_products, max_orders_per_month'
          )
          .eq('id', planId)
          .maybeSingle();

        if (cancelled) return;

        clearTimeout(timeoutId);

        if (error || !data) {
          console.warn('[usePlanLimits] No data — using fallback');
          setLimits(getFallback(planId));
        } else {
          setLimits(data as PlanLimits);
        }
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        clearTimeout(timeoutId);
        console.error('[usePlanLimits] Error:', err);
        setLimits(getFallback(planId));
        setLoading(false);
      }
    };

    fetchLimits();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [planId, supabase]);

  return { limits, loading };
}

export function formatLimit(n: number | undefined | null): string {
  if (!n || n >= 999999) return '∞';
  return n.toString();
}

export function isAtLimit(
  current: number,
  max: number | undefined | null
): boolean {
  if (!max || max >= 999999) return false;
  return current >= max;
}