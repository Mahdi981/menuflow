'use client';

import { usePathname } from 'next/navigation';
import { Menu, ChefHat } from 'lucide-react';
import NotificationButton from '@/components/NotificationButton';
import { NAV, isNavActive } from '@/components/dashboard/Sidebar';

type Props = {
  onMenuClick: () => void;
};

export default function TopBar({ onMenuClick }: Props) {
  const pathname = usePathname();
  const current = NAV.find((item) => isNavActive(item.href, pathname));

  return (
    <>
      {/* ============ MOBILE ============ */}
      <header className="lg:hidden sticky top-0 z-30 bg-brand-dark/95 backdrop-blur text-white border-b border-white/10">
        <div className="flex items-center justify-between gap-2 px-4 h-14">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <ChefHat size={14} />
            </div>
            <span className="font-bold text-sm truncate">
              {current?.name ?? 'MenuFlow'}
            </span>
          </div>

          <NotificationButton tone="dark" />
        </div>
      </header>

      {/* ============ DESKTOP ============ */}
      <header className="hidden lg:flex sticky top-0 z-30 h-16 items-center justify-between gap-4 px-6 bg-cream/80 backdrop-blur-lg border-b border-line">
        <div className="flex items-center gap-2 text-sm min-w-0">
          <span className="text-ink-muted">Dashboard</span>
          {current && current.href !== '/dashboard' && (
            <>
              <span className="text-ink-subtle">/</span>
              <span className="font-semibold text-ink truncate">
                {current.name}
              </span>
            </>
          )}
        </div>

        <NotificationButton tone="light" />
      </header>
    </>
  );
}
