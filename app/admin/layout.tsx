'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createClient());
  const [admin, setAdmin] = useState<{ email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !user.email) {
        window.location.href = '/auth/login';
        return;
      }

      const { data } = await supabase
        .from('super_admins')
        .select('email, is_active')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (!data) {
        window.location.href = '/dashboard';
        return;
      }

      setAdmin({ email: data.email });
      setIsLoading(false);
    };

    checkAdmin();
  }, [supabase]);

  // Close sidebar on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scroll when sidebar open
  useEffect(() => {
    if (isMobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-amber-custom border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminSidebar
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((c) => !c)}
        email={admin.email}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <AdminTopBar onMenuClick={() => setIsMobileOpen(true)} />
        <main className="flex-1 min-w-0 bg-cream">{children}</main>
      </div>
    </div>
  );
}