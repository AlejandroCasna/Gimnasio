/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  trailingSlash: true,

  async rewrites() {
    return [
      {
        source: '/api/:path*',                   // sin barra aquí
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`,  // ni aquí
      },
    ]
  },
}

module.exports = nextConfig
