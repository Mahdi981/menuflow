import { createServerSupabaseClient } from './server';

export type SuperAdmin = {
  id: string;
  user_id: string;
  email: string;
  name: string | null;
  role: 'owner' | 'admin' | 'moderator';
  is_active: boolean;
};

/**
 * تحقق من Super Admin — server-side
 * يرجع الـ Super Admin أو null
 */
export async function getSuperAdmin(): Promise<SuperAdmin | null> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) return null;

  const { data, error } = await supabase
    .from('super_admins')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) return null;

  return data as SuperAdmin;
}

/**
 * تحقق سريع — يرجع boolean
 */
export async function isSuperAdmin(): Promise<boolean> {
  const admin = await getSuperAdmin();
  return admin !== null;
}

/**
 * سجّل عملية في admin_logs
 */
export async function logAdminAction(params: {
  action: string;
  target_type?: string;
  target_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const admin = await getSuperAdmin();

  if (!admin) return;

  await supabase.from('admin_logs').insert({
    admin_user_id: admin.user_id,
    admin_email: admin.email,
    action: params.action,
    target_type: params.target_type ?? null,
    target_id: params.target_id ?? null,
    details: params.details ?? null,
    ip_address: params.ip_address ?? null,
    user_agent: params.user_agent ?? null,
  });
}