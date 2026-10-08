import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from('restaurants')
    .select('name, logo_url, favicon_url')
    .eq('slug', slug)
    .single();

  if (!data) return {};

  const iconUrl = data.favicon_url ?? data.logo_url ?? '/favicon.ico';

  return {
    title: data.name,
    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
      apple: iconUrl,
    },
  };
}

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}