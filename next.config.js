/** @type {import('next').NextConfig} */
const nextConfig = {
  // External packages for server components
  serverExternalPackages: ['mongoose'],
  // Ensure proper build output
  trailingSlash: false,
}

module.exports = nextConfig
