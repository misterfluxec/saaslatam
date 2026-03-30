"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Wifi, 
  Activity, 
  TrendingUp, 
  Server, 
  Database, 
  Cpu,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Menu,
  X,
  Bell,
  Search,
  Settings,
  LogOut
} from "lucide-react";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Actualizar hora en tiempo real
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Datos de ejemplo (reemplazar con datos reales de tu API)
  const metrics = [
    { 
      title: "Clientes Activos", 
      value: "1,247", 
      change: "+12.5%", 
      trend: "up",
      icon: Users,
      color: "bg-blue-500"
    },
    { 
      title: "Sesiones WiFi", 
      value: "3,891", 
      change: "+8.2%", 
      trend: "up",
      icon: Wifi,
      color: "bg-emerald-500"
    },
    { 
      title: "Portales Activos", 
      value: "24", 
      change: "+2", 
      trend: "up",
      icon: Activity,
      color: "bg-violet-500"
    },
    { 
      title: "Ingresos del Mes", 
      value: "$4,280", 
      change: "+18.3%", 
      trend: "up",
      icon: TrendingUp,
      color: "bg-amber-500"
    },
  ];

  const services = [
    { name: "PostgreSQL", status: "healthy", latency: "12ms", icon: Database },
    { name: "Redis Cache", status: "healthy", latency: "3ms", icon: Server },
    { name: "Ollama IA", status: "healthy", latency: "2.1s", icon: Cpu },
    { name: "Cloudflare Tunnel", status: "healthy", latency: "45ms", icon: Activity },
  ];

  const recentActivity = [
    { action: "Nuevo cliente registrado", tenant: "Café Central", time: "hace 5 min", type: "success" },
    { action: "Portal actualizado", tenant: "Hotel Plaza", time: "hace 12 min", type: "info" },
    { action: "Campaña activada", tenant: "Farmacia Salud", time: "hace 28 min", type: "success" },
    { action: "Alerta de uso", tenant: "Restaurante El Sabor", time: "hace 1h", type: "warning" },
  ];

  const quickActions = [
    { label: "Crear Nuevo Cliente", icon: Users, action: () => {} },
    { label: "Configurar Portal", icon: Wifi, action: () => {} },
    { label: "Ver Reportes", icon: TrendingUp, action: () => {} },
    { label: "Gestionar Campañas", icon: Activity, action: () => {} },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "text-emerald-400 bg-emerald-400/10";
      case "warning": return "text-amber-400 bg-amber-400/10";
      case "error": return "text-red-400 bg-red-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy": return <CheckCircle className="w-4 h-4" />;
      case "warning": return <AlertCircle className="w-4 h-4" />;
      case "error": return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 border-r border-gray-800
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Wifi className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">HotSpot SaaS</span>
          </div>
          <button 
            className="lg:hidden p-1 hover:bg-gray-800 rounded"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {[
            { label: "Dashboard", icon: Activity, active: true },
            { label: "Clientes", icon: Users },
            { label: "Portales", icon: Wifi },
            { label: "Campañas", icon: TrendingUp },
            { label: "Reportes", icon: Database },
            { label: "Configuración", icon: Settings },
          ].map((item) => (
            <button
              key={item.label}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors duration-200
                ${item.active 
                  ? "bg-blue-600/20 text-blue-400 border border-blue-600/30" 
                  : "text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                }
              `}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-xs font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">admin@labodegaec.com</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
            <button className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-gray-100">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button 
                className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold">Dashboard</h1>
                <p className="text-xs text-gray-500">
                  {currentTime.toLocaleDateString("es-EC", { 
                    weekday: "long", 
                    year: "numeric", 
                    month: "long", 
                    day: "numeric" 
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-48 lg:w-64 pl-9 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
                />
              </div>
              <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-gray-100 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6 space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <div 
                key={index}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{metric.title}</p>
                    <p className="text-2xl font-bold mt-1">{metric.value}</p>
                    <div className={`flex items-center gap-1 mt-2 text-sm ${
                      metric.trend === "up" ? "text-emerald-400" : "text-red-400"
                    }`}>
                      {metric.trend === "up" ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      {metric.change}
                    </div>
                  </div>
                  <div className={`${metric.color} p-2.5 rounded-lg`}>
                    <metric.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Services Status & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Services Status */}
            <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-4">Estado de Servicios</h3>
              <div className="space-y-3">
                {services.map((service, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getStatusColor(service.status)}`}>
                        {getStatusIcon(service.status)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{service.name}</p>
                        <p className="text-xs text-gray-500">Latencia: {service.latency}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(service.status)}`}>
                      {service.status === "healthy" ? "Operativo" : service.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-4">Acciones Rápidas</h3>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-800 rounded-lg transition-colors group"
                  >
                    <div className="p-2 bg-gray-800 group-hover:bg-gray-700 rounded-lg transition-colors">
                      <action.icon className="w-4 h-4 text-gray-400 group-hover:text-gray-100" />
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Actividad Reciente</h3>
              <button className="text-xs text-blue-400 hover:text-blue-300">Ver todo</button>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  <div className={`mt-0.5 p-1.5 rounded-full ${
                    activity.type === "success" ? "bg-emerald-400/10 text-emerald-400" :
                    activity.type === "warning" ? "bg-amber-400/10 text-amber-400" :
                    "bg-blue-400/10 text-blue-400"
                  }`}>
                    {activity.type === "success" ? <CheckCircle className="w-3.5 h-3.5" /> :
                     activity.type === "warning" ? <AlertCircle className="w-3.5 h-3.5" /> :
                     <Clock className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.tenant}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/30 rounded-xl p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">👋 Bienvenido a HotSpot SaaS</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Gestiona tus portales cautivos, clientes y campañas desde un solo panel.
                  Tu infraestructura está 100% operativa.
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
                  Ver Documentación
                </button>
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-100 text-sm font-medium rounded-lg transition-colors">
                  Soporte
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
