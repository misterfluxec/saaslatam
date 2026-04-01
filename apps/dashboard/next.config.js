/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Configuración standalone para producción
  output: 'standalone',
  
  // ✅ Configuración de imágenes optimizada (Next.js 16+)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'app.labodegaec.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
  
  // ✅ Configuración de environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // ✅ Configuración de headers de seguridad
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  
  // ✅ Configuración de redirects (sin rewrites que causen bucles)
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
