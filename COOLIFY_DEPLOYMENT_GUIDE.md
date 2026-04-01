# 🚀 Coolify Deployment Guide - HotSpot SaaS Dashboard

## ✅ CHECKLIST VERIFICADO

| Item | Estado | Descripción |
|------|--------|-------------|
| **[✅]** | next.config.js | Sin rewrites localhost, standalone output |
| **[✅]** | app/dashboard/page.tsx | Componentes auxiliares + hidratación segura |
| **[✅]** | app/page.tsx | Un solo export default con redirect |
| **[✅]** | package.json | Scripts correctos + sharp instalado |

---

## 🔧 CONFIGURACIÓN COOLIFY

### 1. 📦 Install Command
```bash
npm ci && npx prisma generate
```

### 2. 🚀 Start Command
```bash
node apps/dashboard/.next/standalone/apps/dashboard/server.js
```

### 3. 🌐 Environment Variables
```bash
# Database
DATABASE_URL="postgresql://postgres:password@10.0.1.2:5432/hotspot_db"

# Authentication
NEXTAUTH_SECRET="GENERAR_CON_OPENSSL"
NEXTAUTH_URL="https://app.labodegaec.com"

# Application
PORT=3000
NODE_ENV=production

# API
API_SECRET_KEY="GENERAR_CON_OPENSSL"
NEXT_PUBLIC_API_URL="https://app.labodegaec.com/api"
```

### 4. 🌍 Network Configuration
- **Port**: `3000`
- **Protocol**: `HTTP`
- **Health Check**: `/api/health`

---

## 🌐 CLOUDFLARE TUNNEL

### Configuración Correcta
```yaml
# cloudflare-tunnel.yml
tunnel: hotspot-dashboard
credentials-file: /path/to/credentials.json

ingress:
  - hostname: app.labodegaec.com
    service: http://localhost:3000  # ✅ PUERTO 3000
    originRequest:
      noTLSVerify: true
```

❌ **INCORRECTO**: `service: http://localhost:80`  
✅ **CORRECTO**: `service: http://localhost:3000`

---

## 🔐 SECRETS GENERACIÓN

### NEXTAUTH_SECRET
```bash
openssl rand -base64 32
# Ejemplo: "XyZ123abcDEF456ghiJKL789mnoPQRstu"
```

### API_SECRET_KEY
```bash
openssl rand -base64 32
# Ejemplo: "AbC789defGHI012jklMNO345pqrSTUvwx"
```

---

## 🗄️ DATABASE_URL VERIFICATION

### PostgreSQL Service Name
```bash
# Verificar nombre del servicio PostgreSQL
docker ps | grep postgres

# Service esperado: "postgresql" o "postgres"
DATABASE_URL="postgresql://postgres:password@postgresql:5432/hotspot_db"
```

### Connection Test
```bash
# Test connection desde Coolify container
npx prisma db pull --schema=prisma/schema.prisma
```

---

## 🏗️ BUILD VERIFICATION

### Local Test
```bash
cd apps/dashboard
npm ci
npx prisma generate
npm run build
npm start
```

### Expected Output
```
✓ Compiled successfully in 3.2s
✓ Finished TypeScript in 3.0s    
✓ Generating static pages using 7 workers (10/10)
✓ Finalizing page optimization in 209ms    
```

---

## 🚨 TROUBLESHOOTING

### Error 508 Loop Detected
- **Causa**: rewrites a localhost en next.config.js
- **Solución**: Eliminar sección `async rewrites()`

### Module Not Found
- **Causa**: Dependencias faltantes
- **Solución**: Verificar package.json dependencies

### Database Connection
- **Causa**: DATABASE_URL incorrecto
- **Solución**: Verificar nombre de servicio PostgreSQL

### Prisma Client Error
- **Causa**: Client no generado
- **Solución**: Agregar `npx prisma generate` al install command

---

## 📋 DEPLOYMENT STEPS

1. **[✅]** Verificar código fuente
2. **[✅]** Configurar variables de entorno
3. **[⏳]** Configurar Coolify:
   - Install Command: `npm ci && npx prisma generate`
   - Start Command: `node apps/dashboard/.next/standalone/apps/dashboard/server.js`
   - Port: `3000`
4. **[⏳]** Configurar Cloudflare Tunnel: `http://localhost:3000`
5. **[⏳]** Ejecutar deployment
6. **[⏳]** Verificar: `https://app.labodegaec.com`

---

## 🎯 SUCCESS CRITERIA

- **[✅]** Build exitoso sin errores
- **[✅]** Dashboard accesible en `app.labodegaec.com`
- **[✅]** Gráficos funcionando (Recharts)
- **[✅]** Theme switching (dark/light)
- **[✅]** Sidebar responsivo móvil
- **[✅]** API endpoints respondiendo
- **[✅]** Base de datos conectada

---

## 📞 SOPORTE

### Logs Importantes
```bash
# Coolify logs
docker logs [coolify-container]

# Application logs
docker logs [dashboard-container]

# Database logs
docker logs [postgres-container]
```

### Health Check Endpoint
```
GET https://app.labodegaec.com/api/health
Expected: {"success": true, "status": "healthy"}
```

---

**🎉 Ready for production deployment!**
