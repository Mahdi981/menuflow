import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { unitPrice, couponDiscount, roundMoney } from '@/lib/pricing';
import { isValidLebanesePhone, toLebaneseE164 } from '@/lib/validation';
import {
  findValidCoupon,
  type ServerOffer,
  reserveCouponUse,
  releaseCouponUse,
} from '@/lib/server/coupons';

/**
 * إنشاء طلب من صفحة المنيو.
 *
 * الواجهة بتبعت بس شو بدو الزبون (IDs + كميات). كل الأسعار والخصومات
 * ورسوم التوصيل بتنحسب هون من قاعدة البيانات — ما منثق بأي رقم جاي من المتصفح.
 */

const MAX_ITEMS = 50;
const MAX_QTY = 99;

type ItemInput = {
  product_id: string;
  variant_id: string | null;
  addon_ids: string[];
  qty: number;
  notes: string | null;
};

type DbProduct = {
  id: string;
  name: string;
  price: number;
  discount_price: number | null;
  variants: {
    id: string;
    name: string;
    name_ar: string | null;
    price: number;
    is_available: boolean;
  }[];
  addons: {
    id: string;
    name: string;
    name_ar: string | null;
    price: number;
    is_available: boolean;
  }[];
};

type OrderLine = {
  product_id: string;
  name: string;
  price: number;
  qty: number;
  total: number;
  variant_name: string | null;
  addons: { id: string; name: string; price: number }[];
  notes: string | null;
};

function fail(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

function text(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

function isId(v: unknown): v is string {
  return typeof v === 'string' && v.length > 0 && v.length <= 64;
}

function parseItems(raw: unknown): ItemInput[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_ITEMS) {
    return null;
  }
  const items: ItemInput[] = [];
  for (const r of raw) {
    if (!r || typeof r !== 'object') return null;
    const { product_id, variant_id, addon_ids, qty, notes } = r as Record<
      string,
      unknown
    >;
    if (!isId(product_id)) return null;
    if (variant_id != null && !isId(variant_id)) return null;
    if (addon_ids != null && (!Array.isArray(addon_ids) || !addon_ids.every(isId))) {
      return null;
    }
    if (!Number.isInteger(qty) || (qty as number) < 1 || (qty as number) > MAX_QTY) {
      return null;
    }
    items.push({
      product_id,
      variant_id: (variant_id as string | null) ?? null,
      addon_ids: [...new Set((addon_ids as string[] | undefined) ?? [])],
      qty: qty as number,
      notes: text(notes, 200) || null,
    });
  }
  return items;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail('طلب غير صالح');
  }

  // ===== 1. بيانات الزبون =====
  const restaurantId = body.restaurant_id;
  if (!isId(restaurantId)) return fail('طلب غير صالح');

  const name = text(body.customer_name, 80);
  if (!name) return fail('الرجاء كتابة اسمك');

  const phoneRaw = text(body.customer_phone, 20);
  if (!isValidLebanesePhone(phoneRaw)) {
    return fail('الرجاء إدخال رقم هاتف لبناني صحيح (مثال: 70 123 456)');
  }

  const orderType = body.type;
  if (orderType !== 'delivery' && orderType !== 'pickup') {
    return fail('طلب غير صالح');
  }

  const items = parseItems(body.items);
  if (!items) return fail('محتوى السلة غير صالح');

  const notes = text(body.notes, 500) || null;

  // ===== 2. الموقع (للتوصيل بس) =====
  const loc = (body.location ?? {}) as Record<string, unknown>;
  const locationType = loc.type === 'manual' ? 'manual' : 'map';
  let address: string | null = null;
  let latitude: number | null = null;
  let longitude: number | null = null;

  if (orderType === 'delivery') {
    if (locationType === 'manual') {
      address = text(loc.address, 500);
      if (!address) return fail('الرجاء كتابة العنوان');
    } else {
      const lat = Number(loc.lat);
      const lng = Number(loc.lng);
      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng) ||
        Math.abs(lat) > 90 ||
        Math.abs(lng) > 180
      ) {
        return fail('الرجاء تحديد موقعك على الخريطة');
      }
      latitude = lat;
      longitude = lng;
      address =
        text(loc.label, 500) || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  }

  const db = createServiceRoleClient();

  // ===== 3. المطعم =====
  const { data: restaurant } = await db
    .from('restaurants')
    .select(
      'id, currency, delivery_fee, min_order, accepts_delivery, accepts_pickup, is_active'
    )
    .eq('id', restaurantId)
    .maybeSingle();

  if (!restaurant || !restaurant.is_active) {
    return fail('المطعم غير متاح حالياً', 404);
  }
  if (orderType === 'delivery' && !restaurant.accepts_delivery) {
    return fail('المطعم لا يقبل طلبات التوصيل حالياً');
  }
  if (orderType === 'pickup' && !restaurant.accepts_pickup) {
    return fail('المطعم لا يقبل طلبات الاستلام حالياً');
  }

  // ===== 4. الأسعار من قاعدة البيانات =====
  const productIds = [...new Set(items.map((i) => i.product_id))];
  const { data: productRows, error: productsError } = await db
    .from('products')
    .select(
      `id, name, price, discount_price,
       variants:product_variants(id, name, name_ar, price, is_available),
       addons:product_addons(id, name, name_ar, price, is_available)`
    )
    .in('id', productIds)
    .eq('restaurant_id', restaurant.id)
    .eq('available', true);

  if (productsError) {
    console.error('Order products lookup failed:', productsError);
    return fail('تعذّر إرسال الطلب، الرجاء المحاولة مرة أخرى', 500);
  }

  const products = new Map(
    ((productRows ?? []) as DbProduct[]).map((p) => [p.id, p])
  );

  const lines: OrderLine[] = [];
  for (const item of items) {
    const product = products.get(item.product_id);
    if (!product) {
      return fail('أحد الأصناف لم يعد متوفراً، الرجاء تحديث السلة', 409);
    }

    const availableVariants = product.variants.filter((v) => v.is_available);
    let variant: DbProduct['variants'][number] | null = null;
    if (item.variant_id) {
      variant =
        availableVariants.find((v) => v.id === item.variant_id) ?? null;
      if (!variant) {
        return fail(`الحجم المختار لـ «${product.name}» لم يعد متوفراً`, 409);
      }
    } else if (availableVariants.length > 0) {
      return fail(`الرجاء اختيار حجم لـ «${product.name}»`, 409);
    }

    const addons: DbProduct['addons'] = [];
    for (const addonId of item.addon_ids) {
      const addon = product.addons.find(
        (a) => a.id === addonId && a.is_available
      );
      if (!addon) {
        return fail(`إحدى إضافات «${product.name}» لم تعد متوفرة`, 409);
      }
      addons.push(addon);
    }

    const price = unitPrice(
      { price: Number(product.price), discount_price: product.discount_price },
      variant ? { price: Number(variant.price) } : null,
      addons.map((a) => ({ price: Number(a.price) }))
    );

    lines.push({
      product_id: product.id,
      name: product.name,
      price,
      qty: item.qty,
      total: roundMoney(price * item.qty),
      variant_name: variant ? variant.name_ar ?? variant.name : null,
      addons: addons.map((a) => ({
        id: a.id,
        name: a.name_ar ?? a.name,
        price: Number(a.price),
      })),
      notes: item.notes,
    });
  }

  const subtotal = roundMoney(lines.reduce((s, l) => s + l.total, 0));
  const currency = restaurant.currency ?? 'USD';

  if (subtotal < Number(restaurant.min_order ?? 0)) {
    return fail('لم يصل الطلب إلى الحد الأدنى');
  }

  // ===== 5. الكوبون =====
  let offer: ServerOffer | null = null;
  const couponCode = text(body.coupon_code, 40);
  if (couponCode) {
    const result = await findValidCoupon(
      db,
      restaurant.id,
      couponCode,
      subtotal,
      currency
    );
    if ('error' in result) return fail(result.error);
    offer = result.offer;
  }

  const discount = couponDiscount(offer, subtotal);
  const deliveryFee =
    orderType === 'delivery' ? Number(restaurant.delivery_fee ?? 0) : 0;
  const total = roundMoney(Math.max(0, subtotal - discount + deliveryFee));

  // الزبون شاف سعر معيّن — إذا تغيّرت الأسعار من وقتها، منوقف بدل ما نفاجئه
  const expected = Number(body.expected_total);
  if (Number.isFinite(expected) && Math.abs(expected - total) > 0.01) {
    return NextResponse.json(
      {
        error: 'تغيّرت بعض الأسعار، الرجاء تحديث الصفحة ومراجعة السلة',
        total,
      },
      { status: 409 }
    );
  }

  if (offer && !(await reserveCouponUse(db, offer))) {
    return fail('وصل كود الخصم للحد الأقصى من الاستخدام');
  }

  // ===== 6. الحفظ =====
  const customerPhone = toLebaneseE164(phoneRaw);

  const { data: order, error: orderError } = await db
    .from('orders')
    .insert({
      restaurant_id: restaurant.id,
      customer_name: name,
      customer_phone: customerPhone,
      type: orderType,
      address,
      latitude,
      longitude,
      location_type: locationType,
      location_label: orderType === 'delivery' ? address : null,
      notes,
      subtotal,
      delivery_fee: deliveryFee,
      total,
      status: 'pending',
    })
    .select('id, order_number')
    .single();

  if (orderError || !order) {
    console.error('Order insert failed:', orderError);
    if (offer) await releaseCouponUse(db, offer.id);
    return fail('تعذّر إرسال الطلب، الرجاء المحاولة مرة أخرى', 500);
  }

  const { error: itemsError } = await db.from('order_items').insert(
    lines.map((l) => ({
      order_id: order.id,
      product_id: l.product_id,
      product_name: l.name,
      price: l.price,
      quantity: l.qty,
      total: l.total,
      variant_name: l.variant_name,
      addons: l.addons,
      notes: l.notes,
    }))
  );

  if (itemsError) {
    console.error('Order items insert failed:', itemsError);
    // ما منخلّي طلب فاضي بلوحة المطعم
    await db.from('orders').delete().eq('id', order.id);
    if (offer) await releaseCouponUse(db, offer.id);
    return fail('تعذّر إرسال الطلب، الرجاء المحاولة مرة أخرى', 500);
  }

  return NextResponse.json({
    order: {
      order_number: order.order_number ?? `#${String(order.id).slice(0, 6)}`,
      customer_name: name,
      customer_phone: customerPhone,
      order_type: orderType,
      address,
      notes,
      items: lines.map((l) => ({
        name: l.name,
        qty: l.qty,
        price: l.price,
        variant_name: l.variant_name,
        addons: l.addons.map((a) => ({ name: a.name, price: a.price })),
        notes: l.notes,
      })),
      subtotal,
      delivery_fee: deliveryFee,
      discount,
      total,
    },
  });
}
