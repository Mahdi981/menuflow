import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { findValidCoupon } from '@/lib/server/coupons';

/**
 * معاينة كود الخصم بصفحة الطلب. ما بيحجز استخدام —
 * الحجز الفعلي بيصير بـ /api/orders لحظة تأكيد الطلب.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'طلب غير صالح' }, { status: 400 });
  }

  const restaurantId = body.restaurant_id;
  const code = typeof body.code === 'string' ? body.code : '';
  const subtotal = Number(body.subtotal);

  if (typeof restaurantId !== 'string' || !code || !Number.isFinite(subtotal)) {
    return NextResponse.json({ error: 'طلب غير صالح' }, { status: 400 });
  }

  const db = createServiceRoleClient();
  const { data: restaurant } = await db
    .from('restaurants')
    .select('id, currency, is_active')
    .eq('id', restaurantId)
    .maybeSingle();

  if (!restaurant || !restaurant.is_active) {
    return NextResponse.json({ error: 'المطعم غير متاح حالياً' }, { status: 404 });
  }

  const result = await findValidCoupon(
    db,
    restaurant.id,
    code,
    subtotal,
    restaurant.currency ?? 'USD'
  );

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // بس اللي بتحتاجه الواجهة — مش كل بيانات العرض
  const { offer } = result;
  return NextResponse.json({
    coupon: {
      code: offer.code,
      discount_type: offer.discount_type,
      discount_value: Number(offer.discount_value),
    },
  });
}
