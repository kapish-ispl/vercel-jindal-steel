import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd2lptvt2jijg6f.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i3.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'd3vvmt2ub6odwk.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'docs.jindalsteel.in',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/.well-known/com.apple.remotemanagement',
        destination: '/.well-known/com.apple.remotemanagement.json',
      },
    ];
  },
    async redirects() {
    return [
      {
        source: '/admin/:path*',
        destination: process.env.NEXT_PUBLIC_ADMIN_URL || 'https://jsp.jindalsteelpower.com/admin/auth/login',
        permanent: false,
        
      },
    ];
  },
  htmlLimitedBots: /.*/,
};

export default nextConfig;
