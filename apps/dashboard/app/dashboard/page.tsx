'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { 
  Users, Wifi, TrendingUp, Activity, Moon, Sun, 
  Menu, X, LayoutDashboard, Globe, Settings, Sparkles 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ✅ DATOS FUERA DEL COMPONENTE: Evita recreación en cada render
const DASHBOARD_DATA = [
  { name: 'Lun', usuarios: 400, sesiones: 240 },
  { name: 'Mar', usuarios: 300, sesiones: 221 },
  { name: 'Mié', usuarios: 200, sesiones: 229 },
  { name: 'Jue', usuarios: 278, sesiones: 200 },
  { name: 'Vie', usuarios: 189, sesiones: 220 },
  { name: 'Sáb', usuarios: 239, sesiones: 250 },
  { name: 'Dom', usuarios: 349, sesiones: 210 },
];

// ✅ COMPONENTE AUXILIAR: StatsCard reutilizable
function StatsCard({ title, value, trend, icon, trendPositive = true }: {
  title: string; value: string; trend: string; icon: React.ReactNode; trendPositive?: boolean;
}) {
  return (
    <Card className="border-none shadow-sm bg-card/50 hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs mt-1 ${trendPositive ? 'text-green-500' : 'text-blue-500'}`}>
          {trend}
        </p>
      </CardContent>
    </Card>
  );
}

// ✅ COMPONENTE AUXILIAR: ChartCard con estilo consistente
function ChartCard({ title, subtitle, children }: {
  title: string; subtitle: string; children: React.ReactNode;
}) {
  return (
    <Card className="border-none shadow-sm overflow-hidden bg-card/50">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// ✅ COMPONENTE AUXILIAR: NavItem para sidebar limpio
function NavItem({ icon, label, active = false, onClick }: {
  icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        active 
          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
          : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
      }`}
    >
      {icon} {label}
    </button>
  );
}

export default function PremiumDashboard() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ✅ HIDRATACIÓN SEGURA: Evita error "Text content does not match"
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Cargando dashboard...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* ✅ HEADER CON GLASSMORPHISM */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Wifi className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg sm:text-xl tracking-tight hidden sm:block">
                SaaSLatam <span className="text-blue-500 text-xs">PRO</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ✅ SIDEBAR RESPONSIVO */}
        <aside className={`
          ${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-0 md:translate-x-0'} 
          transition-all duration-300 border-r border-border bg-card/30 backdrop-blur-sm 
          fixed md:static inset-y-0 left-0 z-40 overflow-hidden
        `}>
          <nav className="p-4 space-y-2 mt-16 md:mt-0">
            <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
            <NavItem icon={<Globe size={18} />} label="Sucursales" />
            <NavItem icon={<Users size={18} />} label="Clientes" />
            <NavItem icon={<Sparkles size={18} />} label="IA Marketing" />
            <NavItem icon={<Settings size={18} />} label="Configuración" />
          </nav>
        </aside>

        {/* ✅ MAIN CONTENT CON SCROLL INDEPENDIENTE */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 dark:bg-transparent">
          
          {/* Stats Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard 
              title="Usuarios Activos" 
              value="2,847" 
              trend="+12% vs ayer" 
              icon={<Users className="h-4 w-4 text-blue-500" />} 
            />
            <StatsCard 
              title="Portales Activos" 
              value="24" 
              trend="100% online" 
              icon={<Wifi className="h-4 w-4 text-indigo-500" />} 
            />
            <StatsCard 
              title="Ancho de Banda" 
              value="1.2 TB" 
              trend="Estable" 
              icon={<TrendingUp className="h-4 w-4 text-green-500" />} 
            />
            <StatsCard 
              title="Latencia IA" 
              value="120ms" 
              trend="Óptimo" 
              icon={<Activity className="h-4 w-4 text-orange-500" />} 
            />
          </div>

          {/* Charts - Responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Crecimiento de Usuarios" subtitle="Tráfico semanal por sucursal">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={DASHBOARD_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Bar dataKey="usuarios" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Sesiones Activas" subtitle="Tendencia en tiempo real">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={DASHBOARD_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sesiones" 
                    stroke="#6366f1" 
                    strokeWidth={2} 
                    dot={{ r: 3, fill: '#6366f1' }} 
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* System Status - Multi-tenant ready */}
          <Card className="border-none shadow-sm bg-card/50">
            <CardHeader>
              <CardTitle>Estado del Sistema</CardTitle>
              <CardDescription>Monitoreo de servicios críticos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { service: 'PostgreSQL', status: 'Operacional' },
                { service: 'Redis Cache', status: 'Operacional' },
                { service: 'FreeRADIUS', status: 'Operacional' },
                { service: 'Ollama IA', status: 'Operacional' },
              ].map((item) => (
                <div key={item.service} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm font-medium">{item.service}</span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-muted-foreground">{item.status}</span>
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
