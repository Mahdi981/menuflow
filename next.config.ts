import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.bing.net' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;