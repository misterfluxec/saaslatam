# 🎯 CONFIGURACIÓN COOLIFY - HOTSPOT DASHBOARD

## ✅ CONFIGURACIÓN CORRECTA PARA COOLIFY

### **En la aplicación HotSpot Dashboard en Coolify:**

#### **1. Build Settings**
```
Install Command: npm install
Build Command: npm run build
Start Command: npm start --workspace=dashboard
Base Directory: /apps/dashboard
```

#### **2. Environment Variables**
```
NODE_ENV=production
DATABASE_URL=postgresql://postgres:password@coolify-db:5432/freeradius
NEXT_PUBLIC_API_URL=https://app.labodegaec.com/api
```

#### **3. Dominios Cloudflare Tunnel**
```
app.labodegaec.com → http://10.0.1.10:3000
api.labodegaec.com → http://10.0.1.2:3001
monitor.labodegaec.com → http://grafana:3000
saas.labodegaec.com → http://coolify-proxy:80
ai.labodegaec.com → http://ollama-docker:11434
```

## 🔧 SOLUCIÓN CSS PROBLEM

### **Causa:**
Next.js 16.2 requiere `npm run build` para generar CSS chunks correctamente.

### **Solución Aplicada:**
1. ✅ Build con `npm run build` 
2. ✅ CSS generado en `.next/static/chunks/0c1sd._2e74r1.css`
3. ✅ Configuración de producción activada

## 🚀 ESTADO FINAL

### **Dashboard:**
- ✅ Next.js 16.2 con Tailwind CSS
- ✅ API Routes funcionales
- ✅ PostgreSQL integrado
- ✅ Producción optimizada

### **Servicios:**
- ✅ HotSpot Dashboard: `http://10.0.1.10:3000`
- ✅ API Gateway: `http://10.0.1.2:3001`
- ✅ Grafana: `http://grafana:3000`
- ✅ Coolify Admin: `http://coolify-proxy:80`
- ✅ Ollama AI: `http://ollama-docker:11434`

### **Configuración Estable:**
- 🏷️ Contenedor: `hotspot-dashboard`
- 🌐 IP Fija: `10.0.1.10:3000`
- 🔗 Red: `coolify` + `hotspot-network`
- 📦 Build: Optimizado con CSS chunks

**¡Todo listo para producción estable!** 🎉
