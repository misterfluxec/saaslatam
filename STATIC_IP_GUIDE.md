# 🎯 GUÍA DE IP ESTÁTICA PARA HOTSPOT DASHBOARD

## ✅ OPCIÓN 1: DOCKER COMPOSE CON IP FIJA (RECOMENDADA)

### Configuración:
```
IP Estable: 10.0.1.100:3000
Contenedor: hotspot-dashboard
Red: coolify + hotspot-network
```

### Pasos:
1. **Detener Coolify auto-deployment**
2. **Usar Docker Compose**:
   ```bash
   cd /home/mister/saaslatam
   docker-compose up -d dashboard
   ```
3. **Configurar Cloudflare Tunnel**:
   ```
   app.labodegaec.com → http://10.0.1.100:3000
   ```

## ✅ OPCIÓN 2: CONFIGURAR COOLIFY CON IP FIJA

### En Coolify Dashboard:
1. **Ve a la aplicación HotSpot Dashboard**
2. **Settings > Advanced**
3. **Agrega estas variables**:
   ```
   STATIC_IP=10.0.1.100
   CONTAINER_NAME=hotspot-dashboard
   ```
4. **Custom Start Command**:
   ```bash
   docker run --name hotspot-dashboard --network coolify --ip 10.0.1.100 -p 3000:3000 mx126kvohqtqiknxu0znm4lk:latest npm start
   ```

## ✅ OPCIÓN 3: SCRIPT AUTOMÁTICO

### Ejecutar después de cada deployment:
```bash
./scripts/update-cloudflare-tunnel.sh
```

### Agregar a CRON (cada 5 minutos):
```bash
*/5 * * * * /home/mister/saaslatam/scripts/update-cloudflare-tunnel.sh
```

## 🎯 CONFIGURACIÓN FINAL RECOMENDADA

### Docker Compose (IP Fija):
```yaml
networks:
  coolify:
    external: true
    ipam:
      config:
        - subnet: 10.0.1.0/24
          gateway: 10.0.1.1

services:
  dashboard:
    networks:
      coolify:
        ipv4_address: 10.0.1.100  # IP FIJA
```

### Cloudflare Tunnel:
```
app.labodegaec.com → http://10.0.1.100:3000
```

### Beneficios:
- ✅ IP nunca cambia
- ✅ Sin actualizaciones manuales
- ✅ Configuración estable
- ✅ Fácil de mantener

## 🚀 IMPLEMENTACIÓN INMEDIATA

1. **Ejecutar Docker Compose con IP fija**:
   ```bash
   cd /home/mister/saaslatam
   docker-compose down
   docker-compose up -d dashboard
   ```

2. **Verificar IP estática**:
   ```bash
   docker network inspect coolify | grep 10.0.1.100
   ```

3. **Actualizar Cloudflare Tunnel** a `http://10.0.1.100:3000`

4. **Listo! IP estática para siempre** 🎉
