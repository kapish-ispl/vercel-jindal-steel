import type { NextConfig } from "next";

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
        protocol: "https",
        hostname: "d2lptvt2jijg6f.cloudfront.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i3.ytimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.youtube.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d3vvmt2ub6odwk.cloudfront.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "docs.jindalsteel.in",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://d2lptvt2jijg6f.cloudfront.net https://i3.ytimg.com https://www.youtube.com https://d3vvmt2ub6odwk.cloudfront.net https://docs.jindalsteel.in",
              "media-src 'self' blob: https://docs.jindalsteel.in https://d2lptvt2jijg6f.cloudfront.net https://d3vvmt2ub6odwk.cloudfront.net https://www.youtube.com",

              "font-src 'self' https://fonts.gstatic.com data:",
              "connect-src 'self' https://api.jindalsteelpower.com https://www.googletagmanager.com https://www.google-analytics.com",
              "frame-src 'self' https://www.googletagmanager.com https://cmapis.cmots.com https://*.cmots.com https://www.youtube.com https://youtube.com https://esg.churchgatepartners.com",
              "frame-ancestors 'self'",
              // ── Hardening directives ──────────────────────────────────────
              "object-src 'none'",           // Block Flash, Java applets & all plugins
              "base-uri 'self'",             // Prevent <base> tag injection (base hijacking)
              "form-action 'self' https://api.jindalsteelpower.com", // Restrict form POST targets
              "worker-src 'self' blob:",     // Allow GSAP / Lenis / Framer Motion web workers
              "upgrade-insecure-requests",   // Force HTTP sub-resources to load over HTTPS
            ].join('; '),
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/.well-known/com.apple.remotemanagement",
        destination: "/.well-known/com.apple.remotemanagement.json",
      },
    ];
  },
  htmlLimitedBots: /.*/,
};

export default nextConfig;
