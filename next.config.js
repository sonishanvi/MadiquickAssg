/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure compatibility with Vercel deployment
  output: 'standalone',
  // External packages for server components
  serverExternalPackages: ['mongoose'],
  // Ensure proper build output
  trailingSlash: false,
}

module.exports = nextConfig
