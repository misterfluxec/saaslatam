/** @type {import('next').NextConfig} */
const nextConfig = {
  // CRÍTICO para Coolify/Docker: genera build autocontenido
  output: 'standalone',
  
  // Optimizaciones de producción
  productionBrowserSourceMaps: false,
  compress: true,
  reactStrictMode: true,
  
  // Permitir imágenes externas (logos de clientes multi-tenant)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' }
    ],
  },

  // Headers de seguridad empresarial
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }
        ]
      }
    ]
  },

  // ✅ ELIMINADO: rewrites a localhost (causaba error 508 Loop Detected)
}

export default nextConfig
