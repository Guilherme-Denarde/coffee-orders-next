import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['https://coffee-orders-43801498060.us-central1.run.app', 'coffee-orders-43801498060.us-central1.run.app'],
    // For placeholder images when real images are not available
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
};

export default nextConfig;
