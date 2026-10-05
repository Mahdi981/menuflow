import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { FullMenu, Product, Category } from '@/lib/types/menu';
import MenuClient from './MenuClient';

export const revalidate = 60;

async function getMenu(slug: string): Promise<FullMenu | null> {
  const supabase = await createServerSupabaseClient();

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (!restaurant) return null;

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .order('sort_order', { ascending: true });

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .eq('available', true)
    .order('sort_order', { ascending: true });

  const cats = (categories ?? []) as Category[];
  const prods = (products ?? []) as Product[];

  const withProducts = cats.map((c) => ({
    ...c,
    products: prods.filter((p) => p.category_id === c.id),
  }));

  const uncategorized = prods.filter((p) => !p.category_id);

  return {
    ...restaurant,
    categories: withProducts,
    uncategorized,
  } as FullMenu;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('restaurants')
    .select('name, description, logo_url')
    .eq('slug', slug)
    .single();

  if (!data) return { title: 'Menu' };

  return {
    title: `${data.name} — Menu`,
    description: data.description ?? `Order online from ${data.name}`,
    openGraph: {
      title: data.name,
      description: data.description ?? undefined,
      images: data.logo_url ? [data.logo_url] : undefined,
    },
  };
}

export default async function MenuPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const menu = await getMenu(slug);

  if (!menu) notFound();

  return <MenuClient menu={menu} />;
}