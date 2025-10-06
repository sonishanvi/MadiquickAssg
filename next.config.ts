import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure compatibility with Vercel
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  // Ensure proper build output for Vercel
  trailingSlash: false,
  // Enable static optimization
  swcMinify: true,
};

export default nextConfig;
