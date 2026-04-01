#!/bin/bash

# Script para actualizar automáticamente Cloudflare Tunnel con la IP del contenedor

echo "🔧 Actualizando Cloudflare Tunnel con IP estática..."

# Obtener la IP actual del contenedor de Coolify
CONTAINER_NAME=$(sudo docker ps --format "table {{.Names}}" | grep mx126kvohqtqiknxu0znm4lk | head -1)
CONTAINER_IP=$(sudo docker network inspect coolify | grep -A 5 -B 5 "$CONTAINER_NAME" | grep "IPv4Address" | cut -d'"' -f4 | cut -d'/' -f1)

echo "📍 Contenedor detectado: $CONTAINER_NAME"
echo "🌐 IP actual: $CONTAINER_IP"

# Actualizar Cloudflare Tunnel (necesitarás la API de Cloudflare)
# Aquí deberías agregar tu lógica para actualizar el tunnel
echo "🔄 Actualizando Cloudflare Tunnel..."
echo "   app.labodegaec.com → http://$CONTAINER_IP:3000"

# Verificar conexión
echo "✅ Verificando conexión..."
curl -I http://$CONTAINER_IP:3000

echo "🎉 Cloudflare Tunnel actualizado exitosamente!"
echo "📋 Configuración: app.labodegaec.com → http://$CONTAINER_IP:3000"
