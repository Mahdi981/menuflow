'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  Store,
  Users,
  ScrollText,
  Settings,
  LogOut,
  Shield,
  ArrowLeft,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

const NAV = [
  { name: 'Overview', href: '/admin', icon: LayoutGrid },
  { name: 'Restaurants', href: '/admin/restaurants', icon: Store },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Activity Log', href: '/admin/logs', icon: ScrollText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <aside className="w-64 shrink-0 bg-[#0D4247] text-white flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-custom flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">MenuFlow</p>
            <p className="text-[10px] text-amber-custom uppercase tracking-wider font-bold">
              Super Admin
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {NAV.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
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
                    layoutId="active-admin-nav"
                    className="absolute inset-0 bg-gradient-to-r from-amber-custom/30 to-amber-custom/10 rounded-xl border border-amber-custom/40"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={18} className="relative shrink-0" />
                <span className="relative">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User + Actions */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <div className="px-3 py-2 mb-1">
          <p className="text-[10px] text-white/40 uppercase tracking-wider">
            Logged in as
          </p>
          <p className="text-xs text-white/90 truncate font-medium">{email}</p>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

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