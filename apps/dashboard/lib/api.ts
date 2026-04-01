// lib/api.ts
// ✅ API client seguro con validación de clave secreta

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://app.labodegaec.com',
  secretKey: process.env.API_SECRET_KEY,
} as const;

// ✅ Función para validar que la clave esté configurada
export function validateApiConfig() {
  if (!API_CONFIG.secretKey || API_CONFIG.secretKey.length < 20) {
    console.error('❌ API_SECRET_KEY no configurada correctamente');
    return false;
  }
  return true;
}

// ✅ Headers seguros para todas las peticiones
export function getSecureHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Client-Version': '1.0.0',
  };
  
  if (API_CONFIG.secretKey) {
    headers['X-API-Key'] = API_CONFIG.secretKey;
  }
  
  return headers;
}

// ✅ Fetch wrapper con manejo de errores
export async function secureFetch(endpoint: string, options: RequestInit = {}) {
  if (!validateApiConfig()) {
    throw new Error('Configuración de API inválida');
  }

  const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
    ...options,
    headers: {
      ...getSecureHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ✅ Funciones específicas para el HotSpot Dashboard

// Authentication
export async function authenticateUser(username: string, password: string) {
  return secureFetch('/api/auth', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

// Users Management
export async function getUsers() {
  return secureFetch('/api/users');
}

export async function createUser(userData: {
  username: string;
  password: string;
  email?: string;
  groups?: string[];
}) {
  return secureFetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function deleteUser(userId: string) {
  return secureFetch(`/api/users/${userId}`, {
    method: 'DELETE',
  });
}

// Clients/Access Points Management
export async function getClients() {
  return secureFetch('/api/clients');
}

export async function createClient(clientData: {
  client_id: string;
  secret: string;
  shortname: string;
  nastype?: string;
  description?: string;
}) {
  return secureFetch('/api/clients', {
    method: 'POST',
    body: JSON.stringify(clientData),
  });
}

// Sessions Management
export async function getSessions(filters?: {
  username?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}) {
  const params = new URLSearchParams(filters as any).toString();
  return secureFetch(`/api/sessions${params ? `?${params}` : ''}`);
}

export async function createSessionBandwidth(sessionId: string, bandwidthData: {
  upload: number;
  download: number;
}) {
  return secureFetch(`/api/sessions/${sessionId}/bandwidth`, {
    method: 'POST',
    body: JSON.stringify(bandwidthData),
  });
}

// Statistics and Analytics
export async function getDashboardStats() {
  return secureFetch('/api/stats');
}

export async function getUsageReport(timeframe: 'hour' | 'day' | 'week' | 'month' = 'day') {
  return secureFetch(`/api/stats/usage?timeframe=${timeframe}`);
}

export async function getActiveUsersCount() {
  return secureFetch('/api/stats/active-users');
}

// Tenant Management (Multi-tenant SaaS)
export async function getTenants() {
  return secureFetch('/api/tenants');
}

export async function createTenant(tenantData: {
  name: string;
  email: string;
  subdomain: string;
  logo?: string;
}) {
  return secureFetch('/api/tenants', {
    method: 'POST',
    body: JSON.stringify(tenantData),
  });
}

export async function updateTenant(tenantId: string, updates: Partial<{
  name: string;
  email: string;
  logo: string;
  isActive: boolean;
}>) {
  return secureFetch(`/api/tenants/${tenantId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

// Campaign Management
export async function getCampaigns(tenantId?: string) {
  const url = tenantId ? `/api/campaigns?tenantId=${tenantId}` : '/api/campaigns';
  return secureFetch(url);
}

export async function createCampaign(campaignData: {
  tenantId: string;
  name: string;
  type: 'login' | 'advertisement' | 'promotion';
  content: string;
  isActive?: boolean;
}) {
  return secureFetch('/api/campaigns', {
    method: 'POST',
    body: JSON.stringify(campaignData),
  });
}

// Portal Management
export async function getPortals(tenantId?: string) {
  const url = tenantId ? `/api/portals?tenantId=${tenantId}` : '/api/portals';
  return secureFetch(url);
}

export async function updatePortalTheme(portalId: string, themeData: {
  primaryColor?: string;
  secondaryColor?: string;
  logo?: string;
  backgroundImage?: string;
  customCSS?: string;
}) {
  return secureFetch(`/api/portals/${portalId}/theme`, {
    method: 'PUT',
    body: JSON.stringify(themeData),
  });
}

// Health Check
export async function healthCheck() {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}

// WebSocket Connection (Real-time updates)
export function createWebSocketConnection(endpoint: string) {
  if (!validateApiConfig()) {
    throw new Error('Configuración de API inválida');
  }

  const wsUrl = API_CONFIG.baseUrl.replace('http', 'ws') + endpoint;
  return new WebSocket(wsUrl);
}

// File Upload (for logos, images, etc.)
export async function uploadFile(file: File, type: 'logo' | 'background' | 'document') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  return secureFetch('/api/upload', {
    method: 'POST',
    body: formData,
    headers: {
      // No Content-Type para multipart/form-data
    },
  });
}

// Export Functions
export async function exportData(type: 'users' | 'sessions' | 'stats', format: 'csv' | 'json' | 'pdf') {
  return secureFetch(`/api/export/${type}?format=${format}`);
}

// Rate Limiting Check
export async function checkRateLimit(action: string) {
  return secureFetch(`/api/rate-limit/check?action=${action}`);
}

// Cache Management
export async function clearCache(pattern?: string) {
  const url = pattern ? `/api/cache/clear?pattern=${pattern}` : '/api/cache/clear';
  return secureFetch(url, { method: 'POST' });
}

// ✅ Utilidades adicionales
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  CLIENTS: '/api/clients',
  SESSIONS: '/api/sessions',
  STATS: '/api/stats',
  TENANTS: '/api/tenants',
  CAMPAIGNS: '/api/campaigns',
  PORTALS: '/api/portals',
  HEALTH: '/api/health',
  UPLOAD: '/api/upload',
  EXPORT: '/api/export',
} as const;

export default {
  secureFetch,
  validateApiConfig,
  getSecureHeaders,
  // Authentication
  authenticateUser,
  // Users
  getUsers,
  createUser,
  deleteUser,
  // Clients
  getClients,
  createClient,
  // Sessions
  getSessions,
  createSessionBandwidth,
  // Stats
  getDashboardStats,
  getUsageReport,
  getActiveUsersCount,
  // Tenants
  getTenants,
  createTenant,
  updateTenant,
  // Campaigns
  getCampaigns,
  createCampaign,
  // Portals
  getPortals,
  updatePortalTheme,
  // Utils
  healthCheck,
  createWebSocketConnection,
  uploadFile,
  exportData,
  checkRateLimit,
  clearCache,
  API_CONFIG,
  API_ENDPOINTS,
};
