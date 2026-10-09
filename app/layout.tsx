import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'https://menu-restaurant.store'
  ),
  title: {
    default: 'MenuFlow — Restaurant Ordering Platform',
    template: '%s | MenuFlow',
  },
  description:
    'Digital menus, QR ordering, and powerful analytics for modern restaurants. No commission, no coding.',
  keywords: [
    'restaurant',
    'menu',
    'qr code',
    'ordering',
    'delivery',
    'pickup',
    'lebanon',
    'menufLow',
    'menu digital',
  ],
  authors: [{ name: 'MenuFlow' }],
  creator: 'MenuFlow',
  publisher: 'MenuFlow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'MenuFlow',
    title: 'MenuFlow — Restaurant Ordering Platform',
    description:
      'Digital menus, QR ordering, and powerful analytics for modern restaurants.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MenuFlow — Restaurant Ordering Platform',
    description:
      'Digital menus, QR ordering, and powerful analytics for modern restaurants.',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/apple-icon.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}