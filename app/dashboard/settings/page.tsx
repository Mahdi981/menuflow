'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Loader2,
  Store,
  Phone,
  Image as ImageIcon,
  Truck,
  DollarSign,
  Link as LinkIcon,
  Check,
  Palette,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRestaurant } from '@/lib/hooks/useRestaurant';
import { uploadImage } from '@/lib/utils/uploadImage';
import { THEME_PRESETS } from '@/lib/themes';

const supabase = createClient();

const CURRENCIES = [
  { code: 'USD', label: 'USD — US Dollar ($)' },
  { code: 'LBP', label: 'LBP — Lebanese Pound (ل.ل)' },
  { code: 'EUR', label: 'EUR — Euro (€)' },
  { code: 'SAR', label: 'SAR — Saudi Riyal (ر.س)' },
  { code: 'AED', label: 'AED — UAE Dirham (د.إ)' },
];

type FormState = {
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  phone: string;
  address: string;
  city: string;
  logo_url: string;
  cover_url: string;
  favicon_url: string;
  currency: string;
  delivery_fee: number;
  min_order: number;
  is_active: boolean;
  accepts_delivery: boolean;
  accepts_pickup: boolean;
  // Theme
  theme_primary: string;
  theme_accent: string;
  theme_bg: string;
  theme_text: string;
  theme_preset: string;
};

 export default function SettingsPage() {
  const { restaurant, loading: restaurantLoading, refresh } = useRestaurant();
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurant) return;
    setForm({
      name: restaurant.name ?? '',
      name_ar: restaurant.name_ar ?? '',
      description: restaurant.description ?? '',
      description_ar: restaurant.description_ar ?? '',
      phone: restaurant.phone ?? '',
      address: restaurant.address ?? '',
      city: restaurant.city ?? '',
      logo_url: restaurant.logo_url ?? '',
      cover_url: restaurant.cover_url ?? '',
      favicon_url: restaurant.favicon_url ?? '',
      currency: restaurant.currency ?? 'USD',
      delivery_fee: restaurant.delivery_fee ?? 0,
      min_order: restaurant.min_order ?? 0,
      is_active: restaurant.is_active ?? true,
      accepts_delivery: restaurant.accepts_delivery ?? true,
      accepts_pickup: restaurant.accepts_pickup ?? true,
      theme_primary: restaurant.theme_primary ?? '#1C7E84',
      theme_accent: restaurant.theme_accent ?? '#C9A227',
      theme_bg: restaurant.theme_bg ?? '#F0EEE9',
      theme_text: restaurant.theme_text ?? '#1A1A1A',
      theme_preset: restaurant.theme_preset ?? 'teal',
    });
  }, [restaurant]);

  if (restaurantLoading || !form) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-cream p-8 text-center">
        <p className="text-red-500">No restaurant found</p>
      </div>
    );
  }

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleUpload = async (
    file: File,
    key: 'logo_url' | 'cover_url' | 'favicon_url'
  ) => {
    const setUploading =
      key === 'logo_url'
        ? setUploadingLogo
        : key === 'cover_url'
          ? setUploadingCover
          : setUploadingFavicon;

    setUploading(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      if (!url) {
        setError('Upload failed');
        return;
      }
      update(key, url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const applyPreset = (presetId: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setForm((prev) =>
      prev
        ? {
            ...prev,
            theme_preset: preset.id,
            theme_primary: preset.primary,
            theme_accent: preset.accent,
            theme_bg: preset.bg,
            theme_text: preset.text,
          }
        : prev
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    const { error: updateError } = await supabase
      .from('restaurants')
      .update({
        name: form.name.trim(),
        name_ar: form.name_ar.trim() || null,
        description: form.description.trim() || null,
        description_ar: form.description_ar.trim() || null,
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
        city: form.city.trim() || null,
        logo_url: form.logo_url || null,
        cover_url: form.cover_url || null,
        favicon_url: form.favicon_url || null,
        currency: form.currency,
        delivery_fee: form.delivery_fee,
        min_order: form.min_order,
        is_active: form.is_active,
        accepts_delivery: form.accepts_delivery,
        accepts_pickup: form.accepts_pickup,
        theme_primary: form.theme_primary,
        theme_accent: form.theme_accent,
        theme_bg: form.theme_bg,
        theme_text: form.theme_text,
        theme_preset: form.theme_preset,
      })
      .eq('id', restaurant.id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    await refresh();
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-cream p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-ink">Settings</h1>
          <p className="text-sm text-ink-muted mt-1">
            Manage your restaurant information and preferences
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brand hover:bg-brand-dark text-white font-semibold shadow-brand disabled:opacity-50 transition"
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : success ? (
            <Check size={18} />
          ) : (
            <Save size={18} />
          )}
          {saving ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}
        </motion.button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-600 text-sm">
          ✅ Settings saved successfully
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ============ LEFT: MAIN FORM ============ */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Section icon={<Store size={18} />} title="Basic Information">
            <Field label="Restaurant Name (EN) *">
              <input
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="input-clean"
              />
            </Field>
            <Field label="Restaurant Name (AR)">
              <input
                value={form.name_ar}
                onChange={(e) => update('name_ar', e.target.value)}
                dir="rtl"
                className="input-clean"
              />
            </Field>
            <Field label="Description (EN)">
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                rows={3}
                className="input-clean resize-none"
              />
            </Field>
            <Field label="Description (AR)">
              <textarea
                value={form.description_ar}
                onChange={(e) => update('description_ar', e.target.value)}
                rows={3}
                dir="rtl"
                className="input-clean resize-none"
              />
            </Field>
          </Section>

          {/* Contact */}
          <Section icon={<Phone size={18} />} title="Contact">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Phone">
                <input
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+961 xx xxx xxx"
                  className="input-clean"
                />
              </Field>
              <Field label="City">
                <input
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  className="input-clean"
                />
              </Field>
            </div>
            <Field label="Address">
              <input
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                className="input-clean"
              />
            </Field>
          </Section>

          {/* Theme Customization */}
          <Section icon={<Palette size={18} />} title="Menu Appearance">
            <Field label="Theme Presets">
              <div className="grid grid-cols-4 gap-2">
                {THEME_PRESETS.map((preset) => {
                  const isActive = form.theme_preset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset.id)}
                      className={`relative p-2 rounded-xl border-2 transition ${
                        isActive
                          ? 'border-brand shadow-brand'
                          : 'border-line hover:border-brand/30'
                      }`}
                      title={preset.name_ar}
                    >
                      <div className="flex gap-1 mb-1.5">
                        <div
                          className="flex-1 h-6 rounded-md"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div
                          className="w-3 h-6 rounded-md"
                          style={{ backgroundColor: preset.accent }}
                        />
                      </div>
                      <div
                        className="w-full h-2 rounded-md"
                        style={{ backgroundColor: preset.bg }}
                      />
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand flex items-center justify-center">
                          <Check size={10} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* Custom Colors */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <Field label="Primary Color">
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={form.theme_primary}
                    onChange={(e) => update('theme_primary', e.target.value)}
                    className="w-12 h-12 rounded-xl cursor-pointer border border-line shrink-0"
                  />
                  <input
                    type="text"
                    value={form.theme_primary}
                    onChange={(e) => update('theme_primary', e.target.value)}
                    className="flex-1 bg-white border border-line rounded-xl px-3 py-2.5 text-sm font-mono text-ink focus:outline-none focus:border-brand"
                  />
                </div>
              </Field>

              <Field label="Accent Color">
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={form.theme_accent}
                    onChange={(e) => update('theme_accent', e.target.value)}
                    className="w-12 h-12 rounded-xl cursor-pointer border border-line shrink-0"
                  />
                  <input
                    type="text"
                    value={form.theme_accent}
                    onChange={(e) => update('theme_accent', e.target.value)}
                    className="flex-1 bg-white border border-line rounded-xl px-3 py-2.5 text-sm font-mono text-ink focus:outline-none focus:border-brand"
                  />
                </div>
              </Field>

              <Field label="Background Color">
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={form.theme_bg}
                    onChange={(e) => update('theme_bg', e.target.value)}
                    className="w-12 h-12 rounded-xl cursor-pointer border border-line shrink-0"
                  />
                  <input
                    type="text"
                    value={form.theme_bg}
                    onChange={(e) => update('theme_bg', e.target.value)}
                    className="flex-1 bg-white border border-line rounded-xl px-3 py-2.5 text-sm font-mono text-ink focus:outline-none focus:border-brand"
                  />
                </div>
              </Field>

              <Field label="Text Color">
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={form.theme_text}
                    onChange={(e) => update('theme_text', e.target.value)}
                    className="w-12 h-12 rounded-xl cursor-pointer border border-line shrink-0"
                  />
                  <input
                    type="text"
                    value={form.theme_text}
                    onChange={(e) => update('theme_text', e.target.value)}
                    className="flex-1 bg-white border border-line rounded-xl px-3 py-2.5 text-sm font-mono text-ink focus:outline-none focus:border-brand"
                  />
                </div>
              </Field>
            </div>

            {/* Live Preview */}
            <Field label="Live Preview">
              <div
                className="rounded-2xl p-5 border border-line"
                style={{ backgroundColor: form.theme_bg }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: form.theme_primary }}
                  >
                    🍽️
                  </div>
                  <div>
                    <p
                      className="font-bold text-base"
                      style={{ color: form.theme_text }}
                    >
                      {form.name_ar || form.name || 'اسم المطعم'}
                    </p>
                    <p
                      className="text-xs"
                      style={{
                        color: `color-mix(in srgb, ${form.theme_text} 60%, transparent)`,
                      }}
                    >
                      📍 {form.city || 'المدينة'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button
                    className="px-4 py-2 rounded-lg text-white text-xs font-bold shadow"
                    style={{ backgroundColor: form.theme_primary }}
                  >
                    زر أساسي
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg text-white text-xs font-bold shadow"
                    style={{ backgroundColor: form.theme_accent }}
                  >
                    زر تمييزي
                  </button>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-white/50 backdrop-blur">
                  <p
                    className="text-xs font-medium"
                    style={{ color: form.theme_text }}
                  >
                    معاينة حية — كل التغييرات تنعكس فوراً
                  </p>
                </div>
              </div>
            </Field>
          </Section>

          {/* Delivery */}
          <Section icon={<Truck size={18} />} title="Delivery & Pickup">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Delivery Fee">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.delivery_fee}
                  onChange={(e) =>
                    update('delivery_fee', parseFloat(e.target.value) || 0)
                  }
                  className="input-clean"
                />
              </Field>
              <Field label="Minimum Order">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.min_order}
                  onChange={(e) =>
                    update('min_order', parseFloat(e.target.value) || 0)
                  }
                  className="input-clean"
                />
              </Field>
            </div>

            <div className="space-y-1 pt-2">
              <Toggle
                label="Accept Delivery Orders"
                checked={form.accepts_delivery}
                onChange={(v) => update('accepts_delivery', v)}
              />
              <Toggle
                label="Accept Pickup Orders"
                checked={form.accepts_pickup}
                onChange={(v) => update('accepts_pickup', v)}
              />
              <Toggle
                label="Restaurant is Active"
                hint="Inactive restaurants are hidden from customers"
                checked={form.is_active}
                onChange={(v) => update('is_active', v)}
              />
            </div>
          </Section>

          {/* Currency */}
          <Section icon={<DollarSign size={18} />} title="Currency">
            <Field label="Menu Currency">
              <select
                value={form.currency}
                onChange={(e) => update('currency', e.target.value)}
                className="input-clean"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
          </Section>
        </div>

        {/* ============ RIGHT: MEDIA ============ */}
        <div className="space-y-6">
          {/* Logo */}
          <Section icon={<ImageIcon size={18} />} title="Logo">
            <div className="flex flex-col items-center gap-4">
              {form.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.logo_url}
                  alt="Logo"
                  className="w-28 h-28 rounded-2xl object-cover border border-line"
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-cream border border-dashed border-line flex items-center justify-center">
                  <ImageIcon size={28} className="text-ink-muted" />
                </div>
              )}
              <label className="cursor-pointer text-sm px-4 py-2 rounded-lg bg-cream hover:bg-brand/10 transition text-ink font-medium">
                {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f, 'logo_url');
                  }}
                />
              </label>
            </div>
          </Section>

          {/* Cover */}
          <Section icon={<ImageIcon size={18} />} title="Cover">
            <div className="flex flex-col items-center gap-4">
              {form.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.cover_url}
                  alt="Cover"
                  className="w-full h-32 rounded-2xl object-cover border border-line"
                />
              ) : (
                <div className="w-full h-32 rounded-2xl bg-cream border border-dashed border-line flex items-center justify-center">
                  <ImageIcon size={28} className="text-ink-muted" />
                </div>
              )}
              <label className="cursor-pointer text-sm px-4 py-2 rounded-lg bg-cream hover:bg-brand/10 transition text-ink font-medium">
                {uploadingCover ? 'Uploading...' : 'Upload Cover'}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f, 'cover_url');
                  }}
                />
              </label>
            </div>
          </Section>

          {/* Favicon */}
          <Section icon={<ImageIcon size={18} />} title="Favicon">
            <div className="flex flex-col items-center gap-4">
              {form.favicon_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.favicon_url}
                  alt="Favicon"
                  className="w-16 h-16 rounded-xl object-cover border border-line"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-cream border border-dashed border-line flex items-center justify-center text-2xl">
                  🔖
                </div>
              )}
              <label className="cursor-pointer text-sm px-4 py-2 rounded-lg bg-cream hover:bg-brand/10 transition text-ink font-medium">
                {uploadingFavicon ? 'Uploading...' : 'Upload Favicon'}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f, 'favicon_url');
                  }}
                />
              </label>
              <p className="text-xs text-ink-muted text-center leading-relaxed">
                تظهر بجانب اسم المطعم في تبويب المتصفح. الأفضل أن تكون صورة
                مربعة 64×64.
              </p>
            </div>
          </Section>

          {/* Public URL */}
          <Section icon={<LinkIcon size={18} />} title="Public URL">
            <div className="text-sm">
              <p className="text-ink-muted mb-2">Your menu is at:</p>
              <code className="block p-3 rounded-lg bg-cream text-brand text-xs break-all">
                /r/{restaurant.slug}
              </code>
              <p className="text-xs text-ink-muted/70 mt-2">
                ⚠️ The URL slug cannot be changed here
              </p>
            </div>
          </Section>
        </div>
      </div>

      <style jsx global>{`
        .input-clean {
          width: 100%;
          background: white;
          border: 1px solid #e5e1d8;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: #1a1a1a;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .input-clean::placeholder {
          color: rgba(107, 114, 128, 0.5);
        }
        .input-clean:focus {
          border-color: #1c7e84;
          box-shadow: 0 0 0 3px rgba(28, 126, 132, 0.1);
        }
      `}</style>
    </div>
  );
}

/* ============ SUB-COMPONENTS ============ */

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-line rounded-2xl p-5 md:p-6 shadow-soft"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
          {icon}
        </div>
        <h2 className="font-semibold text-ink">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </motion.div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-ink-muted mb-1.5 block">
        {label}
      </label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="text-sm text-ink">{label}</p>
        {hint && <p className="text-xs text-ink-muted mt-0.5">{hint}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-7 rounded-full transition shrink-0 ${
          checked ? 'bg-brand' : 'bg-line'
        }`}
      >
        <span
          className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all shadow ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}