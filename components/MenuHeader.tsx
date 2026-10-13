import { Clock, MapPin, Phone } from 'lucide-react';
import type { Restaurant } from '@/lib/types/menu';
import { getStatusText, getTodayHoursText } from '@/lib/types/hours';

export default function MenuHeader({ restaurant }: { restaurant: Restaurant }) {
  const status = getStatusText(restaurant.working_hours);
  const todayHours = getTodayHoursText(restaurant.working_hours);

  return (
    <header className="relative">
      {/* Cover */}
      <div
        className="relative h-44 sm:h-60 md:h-72 overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-dark) 100%)',
        }}
      >
        {restaurant.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={restaurant.cover_url}
            alt=""
            fetchPriority="high"
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Info card */}
      <div className="max-w-3xl mx-auto px-4 -mt-16 sm:-mt-20 relative">
        <div className="bg-surface rounded-3xl shadow-2xl shadow-black/10 border border-line p-4 sm:p-6 flex gap-4 items-start">
          {/* Logo */}
          {restaurant.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={restaurant.logo_url}
              alt={`${restaurant.name} logo`}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-surface shadow-lg -mt-12 sm:-mt-16 shrink-0 bg-surface"
            />
          ) : (
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-3xl -mt-12 sm:-mt-16 border-4 border-surface shadow-lg shrink-0"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-dark) 100%)',
              }}
              aria-hidden
            >
              🍽️
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1
              dir="auto"
              className="text-xl sm:text-2xl font-bold text-ink leading-tight line-clamp-2"
            >
              {restaurant.name_ar ?? restaurant.name}
            </h1>

            {restaurant.description && (
              <p
                dir="auto"
                className="text-sm text-ink-muted mt-1 line-clamp-2"
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
                <span className="relative flex w-1.5 h-1.5">
                  {status.isOpen && (
                    <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                  )}
                  <span
                    className={`relative w-1.5 h-1.5 rounded-full ${
                      status.isOpen ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                </span>
                {status.labelAr}
              </div>

              {todayHours && (
                <span className="text-xs text-ink-muted flex items-center gap-1 tabular-nums">
                  <Clock size={12} />
                  {todayHours}
                </span>
              )}
            </div>

            {/* Meta: City + Phone */}
            {(restaurant.city || restaurant.phone) && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-ink-muted">
                {restaurant.city && (
                  <span dir="auto" className="flex items-center gap-1">
                    <MapPin size={12} className="text-brand" />
                    {restaurant.city}
                  </span>
                )}
                {restaurant.phone && (
                  <a
                    href={`tel:${restaurant.phone}`}
                    className="flex items-center gap-1 hover:text-brand transition-colors"
                  >
                    <Phone size={12} className="text-brand" />
                    <span dir="ltr">{restaurant.phone}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
