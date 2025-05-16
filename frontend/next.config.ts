// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // …tus otras opciones…
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*'  // redirige todo /api/... al Django
      }
    ]
  }
}

module.exports = nextConfig
