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
        hostname: "d2lptvt2jijg6f.cloudfront.net",//foundation need to remove
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "docs.jindalsteel.in",
        pathname: "/**",
      },
    ],
  },
  htmlLimitedBots: /.*/,
};

export default nextConfig;
