import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ⚠️ Service role client — للـ webhook فقط
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('webhook-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // ⚠️ TODO: Verify webhook signature
    // مؤقتاً: نقبل الـ webhook بدون تحقق للاختبار
    // في production: نستخدم Dodo SDK للتحقق

    const event = JSON.parse(body);
    console.log('📥 Dodo webhook:', event.type);

    const { type, data } = event;

    switch (type) {
      case 'subscription.created':
      case 'subscription.renewed':
      case 'subscription.active': {
        const subscription = data;
        const metadata = subscription.metadata ?? {};
        const restaurantId = metadata.restaurant_id;
        const plan = metadata.plan;

        if (!restaurantId) {
          console.error('No restaurant_id in metadata');
          break;
        }

        // upsert subscription
        await supabase.from('subscriptions').upsert(
          {
            restaurant_id: restaurantId,
            dodo_subscription_id: subscription.subscription_id ?? subscription.id,
            dodo_customer_id: subscription.customer?.customer_id ?? subscription.customer_id,
            dodo_product_id: subscription.product_id,
            status: 'active',
            plan,
            price_usd: subscription.recurring_pre_tax_amount
              ? subscription.recurring_pre_tax_amount / 100
              : 0,
            currency: subscription.currency ?? 'USD',
            current_period_start: subscription.previous_billing_date ?? subscription.created_at,
            current_period_end: subscription.next_billing_date,
          },
          {
            onConflict: 'restaurant_id',
          }
        );

        // حدّث plan المطعم
        await supabase
          .from('restaurants')
          .update({ plan })
          .eq('id', restaurantId);

        console.log('✅ Subscription activated:', restaurantId, plan);
        break;
      }

      case 'subscription.cancelled':
      case 'subscription.expired': {
        const subscription = data;
        const metadata = subscription.metadata ?? {};
        const restaurantId = metadata.restaurant_id;

        if (!restaurantId) break;

        await supabase
          .from('subscriptions')
          .update({
            status: type === 'subscription.cancelled' ? 'cancelled' : 'expired',
            cancelled_at:
              type === 'subscription.cancelled' ? new Date().toISOString() : null,
          })
          .eq('restaurant_id', restaurantId);

        // رجّع المطعم لـ starter
        await supabase
          .from('restaurants')
          .update({ plan: 'starter' })
          .eq('id', restaurantId);

        console.log('❌ Subscription ended:', restaurantId);
        break;
      }

      case 'payment.succeeded': {
        console.log('💰 Payment succeeded');
        break;
      }

      case 'payment.failed': {
        console.log('❌ Payment failed');
        break;
      }

      default:
        console.log('Unhandled event:', type);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: err.message ?? 'Server error' },
      { status: 500 }
    );
  }
}