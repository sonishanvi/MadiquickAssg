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
  // Ensure proper build process
  output: undefined, // Let Vercel handle the output
  // Disable static optimization for API routes during build
  generateStaticParams: false,
};

export default nextConfig;
