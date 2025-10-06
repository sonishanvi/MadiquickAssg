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
  // Disable telemetry to prevent build issues
  telemetry: false,
  // Ensure proper build process
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
