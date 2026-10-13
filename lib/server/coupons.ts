import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { formatCurrency } from '@/lib/utils/formatCurrency';

export type ServerOffer = {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order: number;
  max_uses: number | null;
  uses_count: number;
  expires_at: string | null;
};

type Result = { offer: ServerOffer } | { error: string };

/** يجيب الكوبون ويتحقق منه — كل الرسائل للزبون، فهي بالعربي */
export async function findValidCoupon(
  db: SupabaseClient,
  restaurantId: string,
  rawCode: string,
  subtotal: number,
  currency: string
): Promise<Result> {
  const code = rawCode.trim().toUpperCase().slice(0, 40);
  if (!code) return { error: 'كود الخصم غير صحيح' };

  const { data, error } = await db
    .from('offers')
    .select(
      'id, code, discount_type, discount_value, min_order, max_uses, uses_count, expires_at'
    )
    .eq('restaurant_id', restaurantId)
    .eq('code', code)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) return { error: 'كود الخصم غير صحيح' };

  const offer = data as ServerOffer;

  if (offer.expires_at && new Date(offer.expires_at) < new Date()) {
    return { error: 'انتهت صلاحية كود الخصم' };
  }
  if (offer.max_uses !== null && offer.uses_count >= offer.max_uses) {
    return { error: 'وصل كود الخصم للحد الأقصى من الاستخدام' };
  }
  if (subtotal < Number(offer.min_order ?? 0)) {
    return {
      error: `الحد الأدنى للطلب لاستخدام هذا الكود ${formatCurrency(
        Number(offer.min_order),
        currency
      )}`,
    };
  }

  return { offer };
}

/**
 * يحجز استخدام واحد من الكوبون بشكل آمن ضد الطلبات المتزامنة:
 * التحديث بينجح بس إذا uses_count ما تغيّر من وقت ما قريناه.
 */
export async function reserveCouponUse(
  db: SupabaseClient,
  offer: ServerOffer
): Promise<boolean> {
  let current = offer;

  for (let attempt = 0; attempt < 3; attempt++) {
    if (current.max_uses !== null && current.uses_count >= current.max_uses) {
      return false;
    }

    const { data } = await db
      .from('offers')
      .update({ uses_count: current.uses_count + 1 })
      .eq('id', current.id)
      .eq('uses_count', current.uses_count)
      .select('id');

    if (data && data.length > 0) return true;

    // حدا تاني استعمله بنفس اللحظة — اقرا العدد الجديد وجرّب كمان مرة
    const { data: fresh } = await db
      .from('offers')
      .select('uses_count, max_uses')
      .eq('id', current.id)
      .maybeSingle();
    if (!fresh) return false;
    current = { ...current, ...fresh };
  }

  return false;
}

/** إرجاع الاستخدام إذا فشل حفظ الطلب بعد الحجز */
export async function releaseCouponUse(db: SupabaseClient, offerId: string) {
  const { data } = await db
    .from('offers')
    .select('uses_count')
    .eq('id', offerId)
    .maybeSingle();
  if (!data || data.uses_count <= 0) return;
  await db
    .from('offers')
    .update({ uses_count: data.uses_count - 1 })
    .eq('id', offerId)
    .eq('uses_count', data.uses_count);
}
