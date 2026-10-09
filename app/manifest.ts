import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MenuFlow — Restaurant Ordering Platform',
    short_name: 'MenuFlow',
    description:
      'Digital menus, QR ordering, and powerful analytics for modern restaurants.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F0EEE9',
    theme_color: '#1C7E84',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-icon.svg',
        sizes: '180x180',
        type: 'image/svg+xml',
      },
    ],
  };
}