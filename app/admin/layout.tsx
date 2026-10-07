import { redirect } from 'next/navigation';
import { getSuperAdmin } from '@/lib/supabase/admin';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Super Admin — MenuFlow',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getSuperAdmin();

  // ❌ مش Super Admin → redirect
  if (!admin) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminSidebar email={admin.email} />
      <main className="flex-1 min-w-0 bg-cream">{children}</main>
    </div>
  );
}