import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['coffee-orders-43801498060.us-central1.run.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true, // 301 redirect (set to false for 302 temporary)
      },
    ];
  },
};

export default nextConfig;
