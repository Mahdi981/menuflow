"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingCart,
  Menu as MenuIcon,
  Grid3x3,
  Tag,
  Users,
  BarChart3,
  QrCode,
  Settings,
  UtensilsCrossed,
  X,
  LogOut,
} from "lucide-react";

const navItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Orders", icon: ShoppingCart, href: "/dashboard/orders" },
  { name: "Menu", icon: MenuIcon, href: "/dashboard/menu" },
  { name: "Categories", icon: Grid3x3, href: "/dashboard/categories" },
  { name: "Offers", icon: Tag, href: "/dashboard/offers" },
  { name: "Customers", icon: Users, href: "/dashboard/customers" },
  { name: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { name: "QR Menu", icon: QrCode, href: "/dashboard/qr" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3" onClick={onLinkClick}>
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-amber-500 rounded-xl flex items-center justify-center">
            <UtensilsCrossed size={20} className="text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white">MenuFlow</span>
            <p className="text-[10px] text-amber-400 tracking-widest uppercase">Dashboard</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} onClick={onLinkClick}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-red-600/20 to-amber-500/10 text-amber-400 border border-red-600/30"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                <span className="font-medium">{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-amber-500 rounded-full flex items-center justify-center text-sm font-bold">
            M
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Mahdi Alkara</p>
            <p className="text-xs text-gray-500 truncate">Admin</p>
          </div>
        </div>
        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-red-600/10 hover:text-red-400 transition">
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

export function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  return (
    <>
      <aside className="hidden md:flex w-64 bg-[#0F0F0F] border-r border-white/10 flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-[#0F0F0F] border-r border-white/10 z-50 md:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
              <SidebarContent onLinkClick={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}