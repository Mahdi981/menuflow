'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export type Restaurant = {
  id: string;
  owner_id: string;
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
  plan: string;
  created_at: string;
  theme_primary: string | null;
  theme_accent: string | null;
  theme_bg: string | null;
  theme_text: string | null;
  theme_preset: string | null;
  favicon_url: string | null;
};

export function useRestaurant() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (!cancelled) {
            setRestaurant(null);
            setSubscription(null);
            setError('Not authenticated');
            setLoading(false);
          }
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('owner_id', user.id)
          .maybeSingle();

        if (cancelled) return;

        if (fetchError) {
          setError(fetchError.message);
          setRestaurant(null);
          setSubscription(null);
        } else {
          setRestaurant(data as Restaurant | null);
          setSubscription(null);
          setError('');
        }
      } catch (err: any) {
        if (!cancelled) setError(err?.message ?? 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  const createRestaurant = async (input: {
    name: string;
    slug: string;
    phone?: string;
    address?: string;
    logo_url?: string;
  }): Promise<Restaurant | null> => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? 'Failed to create restaurant');
      }

      setRestaurant(json.restaurant as Restaurant);
      return json.restaurant as Restaurant;
    } catch (err: any) {
      setError(err?.message ?? 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setRestaurant(null);
        setSubscription(null);
        return;
      }
      const { data } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();
      setRestaurant(data as Restaurant | null);
    } catch (err: any) {
      setError(err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return {
    restaurant,
    subscription,
    setSubscription,
    loading,
    error,
    createRestaurant,
    refresh,
    setRestaurant,
  };
}