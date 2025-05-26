/** @type {import('next').NextConfig} */
const nextConfig = {
  // Para poder usar `next export`
  output: 'export',
  // Para rutas con slash al final
  trailingSlash: true,
  // Ignorar errores de ESLint que detengan el build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignorar errores de TypeScript que detengan el build
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
