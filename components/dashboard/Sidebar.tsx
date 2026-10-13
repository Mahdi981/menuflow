'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
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
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Shield,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export const NAV = [
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

export function isNavActive(href: string, pathname: string) {
  return href === '/dashboard'
    ? pathname === '/dashboard'
    : pathname.startsWith(href);
}

const SUPER_ADMIN_EMAIL = 'mahdi.dev.dev@gmail.com';

type Props = {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
};

export default function Sidebar({
  isMobileOpen,
  onMobileClose,
  isCollapsed,
  onToggleCollapse,
}: Props) {
  const router = useRouter();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // التحقق من Super Admin
  useEffect(() => {
    const supabase = createClient();
    const checkAdmin = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user?.email) return;

        // 1. إيميل ثابت
        if (user.email === SUPER_ADMIN_EMAIL) {
          setIsSuperAdmin(true);
          return;
        }

        // 2. من جدول super_admins
        const { data } = await supabase
          .from('super_admins')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .maybeSingle();

        if (data) setIsSuperAdmin(true);
      } catch {
        // silently fail
      }
    };

    checkAdmin();
  }, []);

  const handleLogout = async () => {
    await createClient().auth.signOut();
    router.push('/auth/login');
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      onMobileClose();
    }
  };

  // Escape يسكّر الـ drawer على الموبايل
  useEffect(() => {
    if (!isMobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onMobileClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isMobileOpen, onMobileClose]);

  return (
    <>
      {/* ============ DESKTOP SIDEBAR ============ */}
      <aside
        className={`hidden lg:flex flex-col bg-brand-dark text-white h-screen sticky top-0 transition-[width] duration-300 ease-out-soft relative shrink-0 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <NavContent
          collapsed={isCollapsed}
          isSuperAdmin={isSuperAdmin}
          onNavClick={handleNavClick}
          onLogout={handleLogout}
          layoutPrefix="desktop"
        />

        {/* Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-brand border-2 border-cream text-white flex items-center justify-center hover:bg-brand-dark transition shadow-lg z-10"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? (
            <PanelLeftOpen size={12} />
          ) : (
            <PanelLeftClose size={12} />
          )}
        </button>
      </aside>

      {/* ============ MOBILE SIDEBAR (Drawer) ============ */}
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
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              className="fixed left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-brand-dark text-white flex flex-col z-50 lg:hidden shadow-2xl"
            >
              <button
                onClick={onMobileClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition z-10"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
              <NavContent
                isSuperAdmin={isSuperAdmin}
                onNavClick={handleNavClick}
                onLogout={handleLogout}
                layoutPrefix="mobile"
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// برّا الـ Sidebar عشان ما ينعاد إنشاؤه مع كل render (كان بيقطع أنيميشن التحديد)
function NavContent({
  collapsed = false,
  isSuperAdmin,
  onNavClick,
  onLogout,
  layoutPrefix,
}: {
  collapsed?: boolean;
  isSuperAdmin: boolean;
  onNavClick: () => void;
  onLogout: () => void;
  layoutPrefix: string;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Logo */}
      <div
        className={`h-16 px-4 border-b border-white/10 flex items-center shrink-0 ${
          collapsed ? 'justify-center' : 'gap-3'
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center shrink-0">
          <ChefHat size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-bold text-sm leading-tight">MenuFlow</p>
            <p className="text-[10px] text-white/60 uppercase tracking-wider">
              Dashboard
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {NAV.map((item) => {
          const isActive = isNavActive(item.href, pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className="relative block rounded-xl"
              title={collapsed ? item.name : undefined}
              aria-current={isActive ? 'page' : undefined}
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
                    layoutId={`${layoutPrefix}-active-nav`}
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-xl border border-white/20"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={18} className="relative shrink-0" />
                {!collapsed && (
                  <>
                    <span className="relative">{item.name}</span>
                    {isActive && (
                      <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-amber-custom" />
                    )}
                  </>
                )}
              </div>
            </Link>
          );
        })}

        {/* Admin Panel — يظهر فقط للـ Super Admin */}
        {isSuperAdmin && (
          <div className="pt-2 mt-2 border-t border-white/10">
            <Link
              href="/admin"
              onClick={onNavClick}
              className="relative block rounded-xl"
              title={collapsed ? 'Admin Panel' : undefined}
            >
              <div
                className={`relative flex items-center rounded-xl text-sm font-bold transition-colors ${
                  collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'
                } bg-amber-custom/10 hover:bg-amber-custom/20 text-amber-custom border border-amber-custom/30`}
              >
                <Shield size={18} className="relative shrink-0" />
                {!collapsed && (
                  <span className="relative uppercase tracking-wider text-xs">
                    Admin Panel
                  </span>
                )}
              </div>
            </Link>
          </div>
        )}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={onLogout}
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
}
