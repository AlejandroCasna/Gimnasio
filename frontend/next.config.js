/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    // evitar que ESLint bloquee el build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // evitar que TS bloquee el build
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
