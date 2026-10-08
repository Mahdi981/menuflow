'use client';

import { Menu } from 'lucide-react';

type Props = {
  onMenuClick: () => void;
};

export default function AdminTopBar({ onMenuClick }: Props) {
  return (
    <header className="lg:hidden sticky top-0 z-30 bg-[#0D4247] text-white border-b border-white/10">
      <div className="flex items-center justify-between px-4 h-14">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-custom flex items-center justify-center">
            <span className="text-xs font-bold">MF</span>
          </div>
          <span className="font-bold text-sm">MenuFlow</span>
          <span className="text-[10px] font-bold text-amber-custom uppercase">
            Admin
          </span>
        </div>

        {/* Spacer */}
        <div className="w-9" />
      </div>
    </header>
  );
}