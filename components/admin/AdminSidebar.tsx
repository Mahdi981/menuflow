'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  Store,
  Users,
  ScrollText,
  Settings,
  LogOut,
  Shield,
  ArrowLeft,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Wallet,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

const NAV = [
  { name: 'Overview', href: '/admin', icon: LayoutGrid },
  { name: 'Restaurants', href: '/admin/restaurants', icon: Store },
  { name: 'Payments', href: '/admin/payments', icon: Wallet },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Activity Log', href: '/admin/logs', icon: ScrollText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

type Props = {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  email: string;
};

export default function AdminSidebar({
  isMobileOpen,
  onMobileClose,
  isCollapsed,
  onToggleCollapse,
  email,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      onMobileClose();
    }
  };

  const NavContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <>
      {/* Logo */}
      <div
        className={`p-4 border-b border-white/10 flex items-center ${
          collapsed ? 'justify-center' : 'gap-3'
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-amber-custom flex items-center justify-center shrink-0">
          <Shield size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-bold text-sm leading-tight">MenuFlow</p>
            <p className="text-[10px] text-amber-custom uppercase tracking-wider font-bold">
              Super Admin
            </p>
          </div>
        )}
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
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className="relative block"
              title={collapsed ? item.name : undefined}
            >
              <div
                className={`relative flex items-center rounded-xl text-sm font-medium transition-colors ${
                  collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'
                } ${
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
                {!collapsed && <span className="relative">{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User + Actions */}
      <div className="p-3 border-t border-white/10 space-y-1">
        {!collapsed && (
          <div className="px-3 py-2 mb-1">
            <p className="text-[10px] text-white/40 uppercase tracking-wider">
              Logged in as
            </p>
            <p className="text-xs text-white/90 truncate font-medium">
              {email}
            </p>
          </div>
        )}

        <Link
          href="/dashboard"
          className={`flex items-center w-full rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors ${
            collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'
          }`}
          title={collapsed ? 'Back to Dashboard' : undefined}
        >
          <ArrowLeft size={18} />
          {!collapsed && <span>Back to Dashboard</span>}
        </Link>

        <button
          onClick={handleLogout}
          className={`flex items-center w-full rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-red-500/20 transition-colors ${
            collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'
          }`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ============ DESKTOP SIDEBAR ============ */}
      <aside
        className={`hidden lg:flex flex-col bg-[#0D4247] text-white h-screen sticky top-0 transition-all duration-300 relative ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <NavContent collapsed={isCollapsed} />

        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-amber-custom border-2 border-cream text-white flex items-center justify-center hover:bg-amber-custom-dark transition shadow-lg z-10"
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? (
            <PanelLeftOpen size={12} />
          ) : (
            <PanelLeftClose size={12} />
          )}
        </button>
      </aside>

      {/* ============ MOBILE SIDEBAR ============ */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-[#0D4247] text-white flex flex-col z-50 lg:hidden shadow-2xl"
            >
              <button
                onClick={onMobileClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition z-10"
              >
                <X size={20} />
              </button>
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}