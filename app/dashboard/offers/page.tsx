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
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRestaurant } from '@/lib/hooks/useRestaurant';
import { uploadImage } from '@/lib/utils/uploadImage';

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
  currency: string;
  delivery_fee: number;
  min_order: number;
  is_active: boolean;
  accepts_delivery: boolean;
  accepts_pickup: boolean;
};

export default function SettingsPage() {
  const { restaurant, loading: restaurantLoading, refresh } = useRestaurant();
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
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
      currency: restaurant.currency ?? 'USD',
      delivery_fee: restaurant.delivery_fee ?? 0,
      min_order: restaurant.min_order ?? 0,
      is_active: restaurant.is_active ?? true,
      accepts_delivery: restaurant.accepts_delivery ?? true,
      accepts_pickup: restaurant.accepts_pickup ?? true,
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
    key: 'logo_url' | 'cover_url'
  ) => {
    const setUploading =
      key === 'logo_url' ? setUploadingLogo : setUploadingCover;
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
        currency: form.currency,
        delivery_fee: form.delivery_fee,
        min_order: form.min_order,
        is_active: form.is_active,
        accepts_delivery: form.accepts_delivery,
        accepts_pickup: form.accepts_pickup,
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
        <div className="lg:col-span-2 space-y-6">
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

        <div className="space-y-6">
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