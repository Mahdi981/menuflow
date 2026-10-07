'use client';

import { Menu, Bell } from 'lucide-react';
import NotificationButton from '@/components/NotificationButton';

type Props = {
  onMenuClick: () => void;
  userEmail?: string;
};

export default function TopBar({ onMenuClick, userEmail }: Props) {
  return (
    <header className="lg:hidden sticky top-0 z-30 bg-brand-dark text-white border-b border-white/10">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Hamburger */}
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
            <span className="text-xs font-bold">MF</span>
          </div>
          <span className="font-bold text-sm">MenuFlow</span>
        </div>

        {/* Notifications */}
        <div className="flex items-center gap-1">
          <NotificationButton />
        </div>
      </div>
    </header>
  );
}