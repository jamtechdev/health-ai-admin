import type { NextConfig } from "next";

const API_BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/uploads/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${API_BACKEND}/api/v1/:path*`,
      },
      {
        source: '/api/public/delete-account',
        destination: `${API_BACKEND}/delete-account`,
      },
      {
        source: '/api/public/contact',
        destination: `${API_BACKEND}/contact`,
      },
      {
        source: '/.well-known/apple-app-site-association',
        destination: '/api/apple-app-site-association',
      },
    ];
  },
};

export default nextConfig;
