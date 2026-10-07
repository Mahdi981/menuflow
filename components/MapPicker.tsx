'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

// إصلاح أيقونة Leaflet
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Default: Beirut, Lebanon
const BEIRUT_CENTER: [number, number] = [33.8938, 35.5018];

type Props = {
  value?: { lat: number; lng: number; label?: string } | null;
  onChange: (loc: { lat: number; lng: number; label?: string }) => void;
};

function ClickHandler({
  onClick,
}: {
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapPicker({ value, onChange }: Props) {
  const [position, setPosition] = useState<[number, number]>(
    value ? [value.lat, value.lng] : BEIRUT_CENTER
  );
  const [label, setLabel] = useState(value?.label ?? '');
  const [loading, setLoading] = useState(false);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar,en`,
        {
          headers: {
            'User-Agent': 'MenuFlow/1.0',
          },
        }
      );
      const data = await res.json();
      const addr =
        data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setLabel(addr);
      onChange({ lat, lng, label: addr });
    } catch (e) {
      console.error(e);
      onChange({ lat, lng });
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    const newPos: [number, number] = [lat, lng];
    setPosition(newPos);
    reverseGeocode(lat, lng);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('المتصفح ما بيدعم تحديد الموقع');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);
        reverseGeocode(lat, lng);
        setLoading(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        alert('ما قدرنا نحدد موقعك. تأكد من الأذونات.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={detectLocation}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand/5 border border-brand/20 text-brand font-medium text-sm hover:bg-brand/10 transition disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            جاري تحديد موقعك...
          </>
        ) : (
          <>
            <Navigation size={16} />
            حدد موقعي الحالي
          </>
        )}
      </button>

      <div className="relative rounded-xl overflow-hidden border border-line h-64 z-0">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={customIcon} />
          <ClickHandler onClick={handleMapClick} />
        </MapContainer>

        <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur rounded-lg px-3 py-2 shadow-lg pointer-events-none">
          <p className="text-xs text-ink-muted text-center">
            📍 اضغط على الخريطة لتحديد موقعك
          </p>
        </div>
      </div>

      {label && (
        <div className="bg-cream rounded-xl p-3">
          <p className="text-xs text-ink-muted uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <MapPin size={11} />
            العنوان المكتشف
          </p>
          <p className="text-sm text-ink leading-relaxed">{label}</p>
        </div>
      )}
    </div>
  );
}