'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, PenLine } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('./MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="h-64 rounded-xl bg-cream flex items-center justify-center text-ink-muted text-sm">
      جاري تحميل الخريطة...
    </div>
  ),
});

export type LocationData = {
  type: 'map' | 'manual';
  address?: string;
  lat?: number;
  lng?: number;
  label?: string;
};

type Props = {
  value: LocationData;
  onChange: (loc: LocationData) => void;
};

export default function LocationPicker({ value, onChange }: Props) {
  const [tab, setTab] = useState<'map' | 'manual'>(
    value.type ?? 'map'
  );

  const switchTab = (t: 'map' | 'manual') => {
    setTab(t);
    onChange({ ...value, type: t });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => switchTab('map')}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-medium text-sm transition ${
            tab === 'map'
              ? 'border-brand bg-brand/5 text-brand'
              : 'border-line text-ink-muted hover:border-brand/30'
          }`}
        >
          <MapPin size={16} />
          الخريطة
        </button>
        <button
          type="button"
          onClick={() => switchTab('manual')}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-medium text-sm transition ${
            tab === 'manual'
              ? 'border-brand bg-brand/5 text-brand'
              : 'border-line text-ink-muted hover:border-brand/30'
          }`}
        >
          <PenLine size={16} />
          يدوي
        </button>
      </div>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {tab === 'map' ? (
          <MapPicker
            value={
              value.lat !== undefined && value.lng !== undefined
                ? { lat: value.lat, lng: value.lng, label: value.label }
                : null
            }
            onChange={(loc) =>
              onChange({
                type: 'map',
                lat: loc.lat,
                lng: loc.lng,
                label: loc.label,
              })
            }
          />
        ) : (
          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">
              العنوان *
            </label>
            <textarea
              value={value.address ?? ''}
              onChange={(e) =>
                onChange({
                  ...value,
                  type: 'manual',
                  address: e.target.value,
                })
              }
              rows={3}
              className="w-full bg-white border border-line rounded-xl px-4 py-3 text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 resize-none"
              placeholder="الشارع، المبنى، الطابق..."
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}