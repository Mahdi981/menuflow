'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Shield,
  Bell,
  Globe,
  DollarSign,
  Save,
  Loader2,
  Check,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [settings, setSettings] = useState({
    platform_name: 'MenuFlow',
    support_email: 'support@meinfina.com',
    default_currency: 'USD',
    enable_signups: true,
    enable_new_restaurants: true,
    maintenance_mode: false,
    email_notifications: true,
    slack_notifications: false,
  });

  const handleSave = async () => {
    setSaving(true);
    // TODO: Save to a platform_settings table
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  const update = <K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-cream p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
            <Settings size={20} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-ink">Settings</h1>
            <p className="text-sm text-ink-muted">Platform configuration</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brand hover:bg-brand-dark text-white font-semibold shadow-brand transition disabled:opacity-50"
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : success ? (
            <Check size={18} />
          ) : (
            <Save size={18} />
          )}
          {saving ? 'Saving...' : success ? 'Saved!' : 'Save'}
        </button>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-600 text-sm">
          ✅ Settings saved
        </div>
      )}

      <div className="space-y-6">
        {/* General */}
        <Section icon={<Globe size={18} />} title="General">
          <Field label="Platform Name">
            <input
              value={settings.platform_name}
              onChange={(e) => update('platform_name', e.target.value)}
              className="w-full bg-white border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </Field>
          <Field label="Support Email">
            <input
              value={settings.support_email}
              onChange={(e) => update('support_email', e.target.value)}
              className="w-full bg-white border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </Field>
          <Field label="Default Currency">
            <select
              value={settings.default_currency}
              onChange={(e) => update('default_currency', e.target.value)}
              className="w-full bg-white border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="USD">USD</option>
              <option value="LBP">LBP</option>
              <option value="EUR">EUR</option>
            </select>
          </Field>
        </Section>

        {/* Access */}
        <Section icon={<Shield size={18} />} title="Access">
          <Toggle
            label="Enable New Signups"
            hint="Allow new users to create accounts"
            checked={settings.enable_signups}
            onChange={(v) => update('enable_signups', v)}
          />
          <Toggle
            label="Enable New Restaurants"
            hint="Allow users to create new restaurants"
            checked={settings.enable_new_restaurants}
            onChange={(v) => update('enable_new_restaurants', v)}
          />
          <Toggle
            label="Maintenance Mode"
            hint="Platform visible only to admins"
            checked={settings.maintenance_mode}
            onChange={(v) => update('maintenance_mode', v)}
            danger
          />
        </Section>

        {/* Notifications */}
        <Section icon={<Bell size={18} />} title="Notifications">
          <Toggle
            label="Email Notifications"
            hint="Get notified on new signups, orders"
            checked={settings.email_notifications}
            onChange={(v) => update('email_notifications', v)}
          />
          <Toggle
            label="Slack Notifications"
            hint="Send alerts to Slack"
            checked={settings.slack_notifications}
            onChange={(v) => update('slack_notifications', v)}
          />
        </Section>
      </div>
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
        <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
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
  danger,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="text-sm text-ink font-medium">{label}</p>
        {hint && <p className="text-xs text-ink-muted mt-0.5">{hint}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-7 rounded-full transition shrink-0 ${
          checked ? (danger ? 'bg-red-500' : 'bg-brand') : 'bg-line'
        }`}
      >
        <span
          className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}