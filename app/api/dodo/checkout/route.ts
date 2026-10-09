import { NextResponse } from 'next/server';
import { dodo, PRODUCT_IDS, TRIAL_DAYS, type PaidPlanId } from '@/lib/dodo/client';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    // 1. التحقق من المستخدم
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. اجلب المطعم
    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('id, name, slug')
      .eq('owner_id', user.id)
      .maybeSingle();

    if (!restaurant) {
      return NextResponse.json(
        { error: 'No restaurant found' },
        { status: 404 }
      );
    }

    // 3. استقبل الـ plan
    const body = await request.json();
    const plan = body.plan as PaidPlanId;

    if (!plan || !PRODUCT_IDS[plan]) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // 4. ارجع URL
    const origin = request.headers.get('origin') ?? 'https://menu-restaurant.store';

    // 5. أنشئ Checkout Session في Dodo
    const session = await dodo.checkoutSessions.create({
      product_cart: [
        {
          product_id: PRODUCT_IDS[plan],
          quantity: 1,
        },
      ],
      customer: {
        email: user.email!,
        name: restaurant.name,
      },
      metadata: {
        restaurant_id: restaurant.id,
        user_id: user.id,
        plan,
      },
      return_url: `${origin}/dashboard/settings?checkout=success&plan=${plan}`,
    });

    if (!session.checkout_url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      checkout_url: session.checkout_url,
      session_id: session.session_id,
    });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json(
      { error: err.message ?? 'Server error' },
      { status: 500 }
    );
  }
}