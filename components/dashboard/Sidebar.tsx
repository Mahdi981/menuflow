'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  ShoppingBag,
  Utensils,
  Grid3x3,
  Percent,
  Users,
  BarChart3,
  QrCode,
  Settings,
  LogOut,
  ChefHat,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

const NAV = [
  { name: 'Overview', href: '/dashboard', icon: LayoutGrid },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { name: 'Menu', href: '/dashboard/menu', icon: Utensils },
  { name: 'Categories', href: '/dashboard/categories', icon: Grid3x3 },
  { name: 'Offers', href: '/dashboard/offers', icon: Percent },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'QR Menu', href: '/dashboard/qr', icon: QrCode },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <aside className="w-64 shrink-0 bg-brand-dark text-white flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
            <ChefHat size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">MenuFlow</p>
            <p className="text-[10px] text-white/60 uppercase tracking-wider">
              Dashboard
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {NAV.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className="relative block">
              <div
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-xl border border-white/20"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={18} className="relative shrink-0" />
                <span className="relative">{item.name}</span>

                {isActive && (
                  <motion.div
                    layoutId="active-dot"
                    className="absolute right-3 w-1.5 h-1.5 rounded-full bg-amber-custom"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-red-500/20 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}