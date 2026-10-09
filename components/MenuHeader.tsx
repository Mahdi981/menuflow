import type { Restaurant } from '@/lib/types/menu';
import { getStatusText, getTodayHoursText } from '@/lib/types/hours';

export default function MenuHeader({ restaurant }: { restaurant: Restaurant }) {
  const status = getStatusText(restaurant.working_hours);
  const todayHours = getTodayHoursText(restaurant.working_hours);

  return (
    <header className="relative">
      {/* Cover */}
      <div
        className="relative h-48 sm:h-64 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, var(--color-brand) 0%, color-mix(in srgb, var(--color-brand) 70%, black) 100%)`,
        }}
      >
        {restaurant.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={restaurant.cover_url}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Info card */}
      <div className="max-w-3xl mx-auto px-4 -mt-20 relative">
        <div
          className="rounded-3xl shadow-2xl shadow-black/10 p-6 flex gap-4 items-start"
          style={{ backgroundColor: 'white' }}
        >
          {/* Logo */}
          {restaurant.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={restaurant.logo_url}
              alt={restaurant.name}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg -mt-16 shrink-0"
            />
          ) : (
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl -mt-16 border-4 border-white shadow-lg shrink-0"
              style={{
                background: `linear-gradient(135deg, var(--color-brand) 0%, color-mix(in srgb, var(--color-brand) 70%, black) 100%)`,
              }}
            >
              🍽️
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0 pt-1">
            <h1
              className="text-2xl font-bold truncate"
              style={{ color: 'var(--color-ink)' }}
            >
              {restaurant.name_ar ?? restaurant.name}
            </h1>

            {restaurant.description && (
              <p
                className="text-sm mt-1 line-clamp-2"
                style={{
                  color:
                    'color-mix(in srgb, var(--color-ink) 60%, transparent)',
                }}
              >
                {restaurant.description}
              </p>
            )}

            {/* Status + Hours */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                  status.isOpen
                    ? 'bg-green-500/10 text-green-600 border-green-500/30'
                    : 'bg-red-500/10 text-red-600 border-red-500/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    status.isOpen ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                {status.labelAr}
              </div>

              {todayHours && (
                <span
                  className="text-xs flex items-center gap-1"
                  style={{
                    color:
                      'color-mix(in srgb, var(--color-ink) 60%, transparent)',
                  }}
                >
                  🕐 {todayHours}
                </span>
              )}
            </div>

            {/* Meta: City + Phone */}
            <div
              className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs"
              style={{
                color:
                  'color-mix(in srgb, var(--color-ink) 60%, transparent)',
              }}
            >
              {restaurant.city && (
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--color-brand)' }}
                  />
                  📍 {restaurant.city}
                </span>
              )}
              {restaurant.phone && (
                <a
                  href={`tel:${restaurant.phone}`}
                  className="flex items-center gap-1.5 transition hover:opacity-80"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--color-brand)' }}
                  />
                  📞 {restaurant.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}