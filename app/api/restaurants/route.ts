import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function POST(request: Request) {
  try {
    // 1. تحقق من المستخدم
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized — please log in again' },
        { status: 401 }
      );
    }

    // 2. استقبل البيانات
    const body = await request.json();
    const { name, slug, phone, address, logo_url } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // 3. تحقق إنه الـ slug مش مستخدم
    const serviceClient = createServiceRoleClient();
    const { data: existing } = await serviceClient
      .from('restaurants')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: 'This URL slug is already taken' },
        { status: 409 }
      );
    }

    // 4. تحقق إنه المستخدم ما عندوش مطعم بعد
    const { data: owned } = await serviceClient
      .from('restaurants')
      .select('id')
      .eq('owner_id', user.id)
      .maybeSingle();

    if (owned) {
      return NextResponse.json(
        { error: 'You already have a restaurant' },
        { status: 409 }
      );
    }

    // 5. INSERT باستخدام service role
    const { data: restaurant, error: insertError } = await serviceClient
      .from('restaurants')
      .insert({
        name,
        slug,
        owner_id: user.id,
        phone: phone ?? null,
        address: address ?? null,
        logo_url: logo_url ?? null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: insertError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ restaurant });
  } catch (err: any) {
    console.error('Route error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Server error' },
      { status: 500 }
    );
  }
}