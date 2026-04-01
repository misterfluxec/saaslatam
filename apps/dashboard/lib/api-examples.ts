// lib/api-examples.ts
// ✅ Ejemplos de uso del API client para el HotSpot Dashboard

import { 
  authenticateUser, 
  getUsers, 
  createUser, 
  getDashboardStats,
  getSessions,
  getClients,
  healthCheck,
  API_CONFIG 
} from './api';

// ✅ Ejemplo 1: Autenticación de usuario
export async function exampleLogin() {
  try {
    const result = await authenticateUser('admin', 'password123');
    console.log('✅ Login exitoso:', result);
    return result;
  } catch (error) {
    console.error('❌ Error en login:', error);
    throw error;
  }
}

// ✅ Ejemplo 2: Obtener estadísticas del dashboard
export async function exampleGetStats() {
  try {
    const stats = await getDashboardStats();
    console.log('📊 Estadísticas:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Error obteniendo stats:', error);
    throw error;
  }
}

// ✅ Ejemplo 3: Gestión de usuarios
export async function exampleUserManagement() {
  try {
    // Obtener todos los usuarios
    const users = await getUsers();
    console.log('👥 Usuarios existentes:', users);

    // Crear nuevo usuario
    const newUser = await createUser({
      username: 'newuser',
      password: 'securepassword',
      email: 'user@example.com',
      groups: ['user', 'premium']
    });
    console.log('✅ Usuario creado:', newUser);

    return { users, newUser };
  } catch (error) {
    console.error('❌ Error en gestión de usuarios:', error);
    throw error;
  }
}

// ✅ Ejemplo 4: Sesiones activas
export async function exampleSessions() {
  try {
    const sessions = await getSessions({
      startDate: '2026-04-01',
      endDate: '2026-04-02',
      limit: 50
    });
    console.log('🔄 Sesiones activas:', sessions);
    return sessions;
  } catch (error) {
    console.error('❌ Error obteniendo sesiones:', error);
    throw error;
  }
}

// ✅ Ejemplo 5: Health Check
export async function exampleHealthCheck() {
  try {
    const isHealthy = await healthCheck();
    console.log(isHealthy ? '✅ Sistema saludable' : '❌ Sistema con problemas');
    return isHealthy;
  } catch (error) {
    console.error('❌ Error en health check:', error);
    return false;
  }
}

// ✅ Ejemplo 6: Verificación de configuración
export function exampleConfigCheck() {
  console.log('🔧 Configuración API:', {
    baseUrl: API_CONFIG.baseUrl,
    hasSecretKey: !!API_CONFIG.secretKey,
    secretKeyLength: API_CONFIG.secretKey?.length || 0
  });
}

// ✅ Ejemplo 7: Uso en componente React (solo como referencia)
/*
export const useDashboardData = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, usersData] = await Promise.all([
          getDashboardStats(),
          getUsers()
        ]);
        
        setStats(statsData);
        setUsers(usersData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, users, loading, error };
};
*/

// ✅ Ejemplo 8: Error handling avanzado
export async function exampleWithErrorHandling() {
  try {
    const result = await getDashboardStats();
    
    // Validar respuesta
    if (!result || typeof result !== 'object') {
      throw new Error('Respuesta inválida del servidor');
    }
    
    // Validar datos específicos
    if (!result.totalUsers || result.totalUsers < 0) {
      throw new Error('Datos de usuarios inválidos');
    }
    
    return result;
  } catch (error: any) {
    // Manejo específico de errores
    if (error.message.includes('Configuración de API inválida')) {
      console.error('🔑 Error de configuración - revisar API_SECRET_KEY');
    } else if (error.message.includes('HTTP 401')) {
      console.error('🔒 Error de autenticación');
    } else if (error.message.includes('HTTP 403')) {
      console.error('🚫 Error de permisos');
    } else {
      console.error('❌ Error general:', error);
    }
    
    throw error;
  }
}

// ✅ Ejemplo 9: Retry automático
export async function exampleWithRetry(maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await getDashboardStats();
      console.log(`✅ Éxito en intento ${attempt}`);
      return result;
    } catch (error: any) {
      lastError = error;
      console.warn(`⚠️ Intento ${attempt} fallido:`, error.message);
      
      // Esperar antes del siguiente intento
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  
  throw lastError;
}

// ✅ Ejemplo 10: Cache simple
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export async function exampleWithCache(key: string, fetcher: () => Promise<any>) {
  const cached = cache.get(key);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('📦 Usando cache para:', key);
    return cached.data;
  }
  
  console.log('🔄 Obteniendo datos frescos para:', key);
  const data = await fetcher();
  
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
  
  return data;
}

// ✅ Exportar todos los ejemplos
export default {
  exampleLogin,
  exampleGetStats,
  exampleUserManagement,
  exampleSessions,
  exampleHealthCheck,
  exampleConfigCheck,
  exampleWithErrorHandling,
  exampleWithRetry,
  exampleWithCache
};
