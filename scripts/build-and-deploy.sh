#!/bin/bash

echo "🔧 Construyendo HotSpot Dashboard con CSS optimizado..."

# Detener contenedor actual
echo "📦 Deteniendo contenedor actual..."
docker stop hotspot-dashboard 2>/dev/null || true
docker rm hotspot-dashboard 2>/dev/null || true

# Limpiar cache de Next.js
echo "🧹 Limpiando cache de Next.js..."
rm -rf apps/dashboard/.next
rm -rf apps/dashboard/node_modules

# Instalar dependencias y construir
echo "📦 Instalando dependencias..."
cd apps/dashboard
npm install

echo "🏗️ Construyendo aplicación..."
npm run build

# Verificar que se construyó CSS
echo "✅ Verificando archivos CSS..."
if [ -d ".next/static/css" ]; then
    echo "✅ CSS construido exitosamente"
    ls -la .next/static/css/
else
    echo "❌ ERROR: No se generó CSS"
    exit 1
fi

echo "🚀 Dashboard listo para producción"
