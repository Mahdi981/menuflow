import type { Restaurant } from '@/lib/types/menu';

export default function MenuHeader({ restaurant }: { restaurant: Restaurant }) {
  return (
    <header className="relative">
      {/* Cover */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-br from-brand to-brand-dark overflow-hidden">
        {restaurant.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={restaurant.cover_url}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        )}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Info card */}
      <div className="max-w-3xl mx-auto px-4 -mt-20 relative">
        <div className="bg-surface rounded-3xl shadow-2xl shadow-black/10 p-6 flex gap-4 items-start">
          {/* Logo */}
          {restaurant.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={restaurant.logo_url}
              alt={restaurant.name}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg -mt-16 shrink-0"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-3xl -mt-16 border-4 border-white shadow-lg shrink-0">
              🍽️
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0 pt-1">
            <h1 className="text-2xl font-bold text-ink truncate">
              {restaurant.name_ar ?? restaurant.name}
            </h1>

            {restaurant.description && (
              <p className="text-sm text-ink-muted mt-1 line-clamp-2">
                {restaurant.description}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-ink-muted">
              {restaurant.city && (
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                  📍 {restaurant.city}
                </span>
              )}
              {restaurant.phone && (
                <a
                  href={`tel:${restaurant.phone}`}
                  className="flex items-center gap-1.5 hover:text-brand transition"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand" />
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