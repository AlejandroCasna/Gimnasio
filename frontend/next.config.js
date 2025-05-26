/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    // deshabilita que errores de lint bloqueen el build
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig