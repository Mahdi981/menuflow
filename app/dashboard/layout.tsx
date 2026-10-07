'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import TopBar from '@/components/dashboard/TopBar';

type SidebarProps = {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const DashboardSidebar = Sidebar as React.ComponentType<SidebarProps>;

  // إغلاق الـ sidebar تلقائياً عند تغيير حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // منع scroll خلف الـ sidebar على الموبايل
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar */}
      <DashboardSidebar
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((c) => !c)}
      />

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* TopBar (mobile only) */}
        <TopBar onMenuClick={() => setIsMobileOpen(true)} />

        {/* Content */}
        <main className="flex-1 min-w-0 bg-cream">{children}</main>
      </div>
    </div>
  );
}