import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactStrictMode: true,
  // swcMinify: true,
  output: "standalone",
  images: {
    domains: [
      'github.com',
      'raw.githubusercontent.com',
      'meal-images.ams1.vultrobjects.com',
      'meal-videos.ams1.vultrobjects.com',
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL || 'http://backend:80/:path*',
      }
    ];
  }
};

export default nextConfig;