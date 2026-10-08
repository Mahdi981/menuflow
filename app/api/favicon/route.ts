import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const logoUrl = searchParams.get('url');

  if (!logoUrl) {
    return NextResponse.redirect(new URL('/favicon.ico', request.url));
  }

  // Redirect to logo
  return NextResponse.redirect(logoUrl);
}