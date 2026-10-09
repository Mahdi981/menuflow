'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import WhishCheckout from '@/components/WhishCheckout';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [supabase] = useState(() => createClient());

  const planParam = searchParams.get('plan') ?? 'professional';
  const plan =
    planParam === 'business' ? 'business' : 'professional';

  const [user, setUser] = useState<any>(null);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from('restaurants')
          .select('id, name, slug, phone')
          .eq('owner_id', user.id)
          .maybeSingle();
        setRestaurant(data);
      }

      setLoading(false);
    };
    init();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-brand transition"
        >
          ← Back to pricing
        </Link>

        <div className="mt-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-2">
            Complete your subscription
          </h1>
          <p className="text-ink-muted">
            Pay via Whish Money — quick and easy 🇱🇧
          </p>
        </div>
      </div>

      {/* Main */}
      <WhishCheckout
        plan={plan}
        user={user}
        existingRestaurant={restaurant}
      />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-brand" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}