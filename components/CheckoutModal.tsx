'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Tag, Check, AlertCircle, Phone } from 'lucide-react';
import type { Restaurant, OrderType } from '@/lib/types/menu';
import { useCart } from '@/lib/store/cart';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { itemsLabel } from '@/lib/utils/arabic';
import { useModalBehavior } from '@/lib/hooks/useModalBehavior';
import LocationPicker, { type LocationData } from './LocationPicker';
import { isOpenNow } from '@/lib/types/hours';

const supabase = createClient();

type Offer = {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order: number;
  max_uses: number | null;
  uses_count: number;
  expires_at: string | null;
  is_active: boolean;
};

type OrderResult = {
  order_number: string;
  customer_name: string;
  customer_phone: string;
  order_type: 'delivery' | 'pickup';
  address: string | null;
  notes: string | null;
  items: {
    name: string;
    qty: number;
    price: number;
    variant_name?: string | null;
    addons?: { name: string; price: number }[];
    notes?: string | null;
  }[];
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
};

export default function CheckoutModal({
  open,
  onClose,
  restaurant,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  restaurant: Restaurant;
  onSuccess: () => void;
}) {
  const { items, subtotal, clear } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderType, setOrderType] = useState<OrderType>(
    restaurant.accepts_delivery ? 'delivery' : 'pickup'
  );
  const [location, setLocation] = useState<LocationData>({ type: 'map' });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);

  const sub = subtotal();
  const deliveryFee = orderType === 'delivery' ? restaurant.delivery_fee : 0;

  const discountAmount = appliedOffer
    ? appliedOffer.discount_type === 'percentage'
      ? (sub * appliedOffer.discount_value) / 100
      : Math.min(appliedOffer.discount_value, sub)
    : 0;

  const total = Math.max(0, sub - discountAmount + deliveryFee);

  const validateLebanesePhone = (p: string): boolean => {
    const cleaned = p.replace(/\D/g, '');
    if (cleaned.length !== 7 && cleaned.length !== 8) return false;
    return /^(3|70|71|76|78|79|81)/.test(cleaned);
  };

  const formatPhone = (p: string): string => {
    const cleaned = p.replace(/\D/g, '');
    return `+961${cleaned}`;
  };

  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    setCouponLoading(true);
    setCouponError(null);

    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('restaurant_id', restaurant.id)
      .eq('code', code)
      .eq('is_active', true)
      .maybeSingle();

    setCouponLoading(false);

    if (error || !data) {
      setCouponError('كود الخصم غير صحيح');
      return;
    }

    const offer = data as Offer;

    if (offer.expires_at && new Date(offer.expires_at) < new Date()) {
      setCouponError('انتهت صلاحية كود الخصم');
      return;
    }

    if (offer.max_uses !== null && offer.uses_count >= offer.max_uses) {
      setCouponError('وصل كود الخصم للحد الأقصى من الاستخدام');
      return;
    }

    if (sub < offer.min_order) {
      setCouponError(
        `الحد الأدنى للطلب لاستخدام هذا الكود ${formatCurrency(offer.min_order, restaurant.currency)}`
      );
      return;
    }

    setAppliedOffer(offer);
    setCouponError(null);
  };

  const removeCoupon = () => {
    setAppliedOffer(null);
    setCouponCode('');
    setCouponError(null);
  };

  const buildWhatsAppMessage = (order: OrderResult): string => {
    const lines: string[] = [];
    lines.push(`🔔 *طلب جديد ${order.order_number}*`);
    lines.push('');
    lines.push(`👤 *الاسم:* ${order.customer_name}`);
    lines.push(`📞 *الهاتف:* ${order.customer_phone}`);
    lines.push(
      `${order.order_type === 'delivery' ? '🛵' : '🏪'} *نوع الطلب:* ${order.order_type === 'delivery' ? 'توصيل' : 'استلام من المطعم'}`
    );

    if (order.address) {
      lines.push(`📍 *العنوان:* ${order.address}`);
    }

    lines.push('');
    lines.push('📋 *الطلبات:*');
    order.items.forEach((item) => {
      const variantText = item.variant_name ? ` (${item.variant_name})` : '';
      lines.push(
        `  • ${item.qty}× ${item.name}${variantText} — ${formatCurrency(item.price * item.qty, restaurant.currency)}`
      );
      if (item.addons && item.addons.length > 0) {
        item.addons.forEach((addon) => {
          lines.push(`    + ${addon.name} (${formatCurrency(addon.price, restaurant.currency)})`);
        });
      }
      if (item.notes) {
        lines.push(`    📝 ${item.notes}`);
      }
    });

    lines.push('');
    lines.push(
      `💵 المجموع الفرعي: ${formatCurrency(order.subtotal, restaurant.currency)}`
    );

    if (order.discount > 0) {
      lines.push(
        `🎁 الخصم: -${formatCurrency(order.discount, restaurant.currency)}`
      );
    }

    if (order.delivery_fee > 0) {
      lines.push(
        `🛵 التوصيل: ${formatCurrency(order.delivery_fee, restaurant.currency)}`
      );
    }

    lines.push(
      `💰 *الإجمالي: ${formatCurrency(order.total, restaurant.currency)}*`
    );

    if (order.notes) {
      lines.push('');
      lines.push(`📝 *ملاحظات:* ${order.notes}`);
    }

    return lines.join('\n');
  };

  const openWhatsApp = () => {
    if (!orderResult) return;
    const message = buildWhatsAppMessage(orderResult);
    const encodedMessage = encodeURIComponent(message);
    const restaurantPhone = (restaurant.phone ?? '').replace(/\D/g, '');

    if (!restaurantPhone) {
      alert('رقم هاتف المطعم غير متوفر.');
      return;
    }

    const url = `https://wa.me/${restaurantPhone}?text=${encodedMessage}`;
    window.open(url, '_blank');
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('الرجاء كتابة اسمك');
      return;
    }

    if (!validateLebanesePhone(phone)) {
      setError('الرجاء إدخال رقم هاتف لبناني صحيح (مثال: 70 123 456)');
      return;
    }

    if (orderType === 'delivery') {
      if (location.type === 'manual' && !location.address?.trim()) {
        setError('الرجاء كتابة العنوان');
        return;
      }
      if (location.type === 'map' && (!location.lat || !location.lng)) {
        setError('الرجاء تحديد موقعك على الخريطة');
        return;
      }
    }

    if (items.length === 0) {
      setError('السلة فارغة');
      return;
    }

    setLoading(true);

    const formattedPhone = formatPhone(phone);

    const finalAddress =
      orderType === 'delivery'
        ? location.type === 'map'
          ? location.label ??
            `${location.lat?.toFixed(5)}, ${location.lng?.toFixed(5)}`
          : location.address ?? null
        : null;

    // 1. INSERT order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        restaurant_id: restaurant.id,
        customer_name: name.trim(),
        customer_phone: formattedPhone,
        type: orderType,
        address: finalAddress,
        latitude:
          orderType === 'delivery' && location.type === 'map'
            ? location.lat ?? null
            : null,
        longitude:
          orderType === 'delivery' && location.type === 'map'
            ? location.lng ?? null
            : null,
        location_type: location.type,
        location_label: location.label ?? location.address ?? null,
        notes: notes.trim() || null,
        subtotal: sub,
        delivery_fee: deliveryFee,
        total,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError || !order) {
      setLoading(false);
      console.error('Order insert failed:', orderError);
      setError('تعذّر إرسال الطلب، الرجاء المحاولة مرة أخرى');
      return;
    }

    // 2. INSERT order_items مع variant + addons + notes
    const orderItems = items.map((i) => ({
      order_id: order.id,
      product_id: i.product_id,
      product_name: i.name,
      price: i.price,
      quantity: i.qty,
      total: i.price * i.qty,
      variant_name: i.variant_name ?? null,
      addons: i.addons ?? [],
      notes: i.notes ?? null,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      setLoading(false);
      console.error('Order items insert failed:', itemsError);
      setError('تعذّر إرسال الطلب، الرجاء المحاولة مرة أخرى');
      return;
    }

    // 3. Increment offer uses
    if (appliedOffer) {
      await supabase
        .from('offers')
        .update({ uses_count: appliedOffer.uses_count + 1 })
        .eq('id', appliedOffer.id);
    }

    const result: OrderResult = {
      order_number: order.order_number ?? `#${order.id.slice(0, 6)}`,
      customer_name: name.trim(),
      customer_phone: formattedPhone,
      order_type: orderType,
      address: finalAddress,
      notes: notes.trim() || null,
      items: items.map((i) => ({
        name: i.name,
        qty: i.qty,
        price: i.price,
        variant_name: i.variant_name ?? null,
        addons: i.addons ?? [],
        notes: i.notes ?? null,
      })),
      subtotal: sub,
      delivery_fee: deliveryFee,
      discount: discountAmount,
      total,
    };

    setLoading(false);
    setOrderResult(result);
    clear();
  }

  const handleClose = () => {
    setOrderResult(null);
    setName('');
    setPhone('');
    setLocation({ type: 'map' });
    setNotes('');
    setCouponCode('');
    setAppliedOffer(null);
    setCouponError(null);
    setError(null);
    onClose();
  };

  const handleDone = () => {
    setOrderResult(null);
    onSuccess();
  };

  useModalBehavior(open, orderResult ? handleDone : handleClose);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="إتمام الطلب"
            className="fixed bottom-0 left-0 right-0 z-[60] bg-surface rounded-t-3xl max-h-[90dvh] overflow-y-auto overscroll-contain max-w-3xl mx-auto shadow-2xl pb-safe"
          >
            {orderResult ? (
              /* ========== SUCCESS ========== */
              <div className="p-6 md:p-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto mb-5"
                >
                  <Check size={40} className="text-green-600" strokeWidth={3} />
                </motion.div>

                <h2 className="text-2xl font-bold text-ink text-center mb-2">
                  تم استلام طلبك! 🎉
                </h2>
                <p className="text-sm text-ink-muted text-center mb-6">
                  رقم الطلب{' '}
                  <span dir="ltr" className="font-mono font-bold text-ink">
                    {orderResult.order_number}
                  </span>
                </p>

                <div className="bg-cream rounded-2xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-ink-muted">الإجمالي</span>
                    <span className="text-lg font-bold text-brand">
                      {formatCurrency(orderResult.total, restaurant.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-ink-muted">
                    <span>{itemsLabel(orderResult.items.length)}</span>
                    <span>
                      {orderResult.order_type === 'delivery'
                        ? '🛵 توصيل'
                        : '🏪 استلام من المطعم'}
                    </span>
                  </div>
                </div>

                <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-4 mb-4">
                  <p className="text-xs text-ink-muted text-center mb-3">
                    📱 أرسل الطلب على واتساب المطعم للتأكيد الفوري
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openWhatsApp}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-base shadow-lg transition"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    إرسال عبر واتساب
                  </motion.button>
                </div>

                <button
                  onClick={handleDone}
                  className="w-full py-3 rounded-xl bg-cream hover:bg-brand/10 text-ink font-medium text-sm transition"
                >
                  تم
                </button>
              </div>
            ) : (
              /* ========== FORM ========== */
              <>
                <div className="sticky top-0 bg-surface flex items-center justify-between p-4 border-b border-line z-10">
                  <h2 className="text-lg font-bold text-ink">إتمام الطلب</h2>
                  <button
                    onClick={handleClose}
                    className="p-2.5 -m-1 hover:bg-cream rounded-full text-ink-muted transition-colors"
                    aria-label="إغلاق"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                  {/* Order Type */}
                  <div className="grid grid-cols-2 gap-2">
                    {restaurant.accepts_delivery && (
                      <button
                        type="button"
                        onClick={() => setOrderType('delivery')}
                        className={`py-3 rounded-xl font-medium border-2 transition ${
                          orderType === 'delivery'
                            ? 'border-brand bg-brand/5 text-brand'
                            : 'border-line text-ink-muted'
                        }`}
                      >
                        🛵 توصيل
                      </button>
                    )}
                    {restaurant.accepts_pickup && (
                      <button
                        type="button"
                        onClick={() => setOrderType('pickup')}
                        className={`py-3 rounded-xl font-medium border-2 transition ${
                          orderType === 'pickup'
                            ? 'border-brand bg-brand/5 text-brand'
                            : 'border-line text-ink-muted'
                        }`}
                      >
                        🏪 استلام من المطعم
                      </button>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-sm font-medium text-ink mb-1 block">
                      الاسم *
                    </label>
                    <input
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                      placeholder="اسمك"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-sm font-medium text-ink mb-1 block">
                      رقم الهاتف (لبنان) *
                    </label>
                    {/* الأرقام دائماً من اليسار لليمين حتى بالواجهة العربية */}
                    <div dir="ltr" className="flex gap-2">
                      <div className="flex items-center gap-1.5 px-3 bg-cream border border-line rounded-xl text-sm text-ink font-medium shrink-0">
                        <span>🇱🇧</span>
                        <span>+961</span>
                      </div>
                      <input
                        required
                        type="tel"
                        inputMode="numeric"
                        value={phone}
                        onChange={(e) => {
                          const cleaned = e.target.value
                            .replace(/\D/g, '')
                            .slice(0, 8);
                          setPhone(cleaned);
                        }}
                        placeholder="70 123 456"
                        maxLength={8}
                        className="flex-1 bg-surface border border-line rounded-xl px-4 py-3 text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 font-mono tracking-wider"
                      />
                    </div>
                    <p className="text-xs text-ink-muted mt-1 flex items-center gap-1">
                      <Phone size={10} />
                      03 · 70 · 71 · 76 · 78 · 79 · 81
                    </p>
                  </div>

                  {/* Location */}
                  {orderType === 'delivery' && (
                    <div>
                      <label className="text-sm font-medium text-ink mb-2 block">
                        موقع التوصيل *
                      </label>
                      <LocationPicker value={location} onChange={setLocation} />
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="text-sm font-medium text-ink mb-1 block">
                      ملاحظات (اختياري)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 resize-none"
                      placeholder="أي طلبات خاصة..."
                    />
                  </div>

                  {/* Coupon */}
                  <div>
                    <label className="text-sm font-medium text-ink mb-1.5 block">
                      كود الخصم
                    </label>

                    {appliedOffer ? (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                        <Check size={18} className="text-green-600 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-mono font-bold text-green-600">
                            {appliedOffer.code}
                          </p>
                          <p className="text-xs text-green-600">
                            {appliedOffer.discount_type === 'percentage'
                              ? `خصم ${appliedOffer.discount_value}%`
                              : `خصم ${formatCurrency(appliedOffer.discount_value, restaurant.currency)}`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={removeCoupon}
                          className="text-xs text-red-500 hover:underline shrink-0"
                        >
                          إزالة
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag
                            size={16}
                            className="absolute start-3 top-1/2 -translate-y-1/2 text-ink-muted"
                          />
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) =>
                              setCouponCode(e.target.value.toUpperCase())
                            }
                            placeholder="أدخل الكود"
                            className="w-full bg-surface border border-line rounded-xl ps-10 pe-3 py-3 font-mono text-ink placeholder:text-ink-muted/50 placeholder:font-sans focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={applyCoupon}
                          disabled={couponLoading || !couponCode.trim()}
                          className="px-5 rounded-xl bg-ink text-white font-medium text-sm disabled:opacity-40 flex items-center gap-2 hover:bg-ink/90 transition"
                        >
                          {couponLoading ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            'تطبيق'
                          )}
                        </button>
                      </div>
                    )}

                    {couponError && (
                      <p className="flex items-center gap-1.5 text-xs text-red-600 mt-2">
                        <AlertCircle size={12} />
                        {couponError}
                      </p>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="bg-cream rounded-xl p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-ink-muted">المجموع الفرعي</span>
                      <span className="text-ink">
                        {formatCurrency(sub, restaurant.currency)}
                      </span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>الخصم ({appliedOffer?.code})</span>
                        <span dir="ltr">
                          -{formatCurrency(discountAmount, restaurant.currency)}
                        </span>
                      </div>
                    )}

                    {orderType === 'delivery' && (
                      <div className="flex justify-between">
                        <span className="text-ink-muted">رسوم التوصيل</span>
                        <span className="text-ink">
                          {formatCurrency(deliveryFee, restaurant.currency)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between font-bold text-base border-t border-line pt-2">
                      <span className="text-ink">الإجمالي</span>
                      <span className="text-brand">
                        {formatCurrency(total, restaurant.currency)}
                      </span>
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-brand to-brand-dark hover:opacity-90 disabled:opacity-40 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-brand transition"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        جاري إرسال الطلب...
                      </>
                    ) : (
                      `تأكيد الطلب — ${formatCurrency(total, restaurant.currency)}`
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}