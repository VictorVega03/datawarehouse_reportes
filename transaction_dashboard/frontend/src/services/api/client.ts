// frontend/src/services/api/client.ts
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import type { ApiResponse, ApiError } from '@/types'

// Configuración base de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1'
const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/api'

// Cliente HTTP configurado
export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}${API_PREFIX}/${API_VERSION}`,
  timeout: 15000, // 15 segundos timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Interceptor para requests (agregar logs en desarrollo)
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.VITE_APP_ENV === 'development') {
      console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Interceptor para responses (manejo de errores global)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.VITE_APP_ENV === 'development') {
      console.log(`🟢 API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
    }
    return response
  },
  (error: AxiosError) => {
    console.error('❌ API Response Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    })

    // Manejo específico de errores
    if (error.response?.status === 404) {
      console.warn('⚠️ Endpoint no encontrado')
    } else if (error.response?.status === 500) {
      console.error('🔥 Error interno del servidor')
    } else if (error.code === 'ECONNABORTED') {
      console.error('⏰ Timeout en la petición')
    } else if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Error de red - verificar que el backend esté corriendo')
    }

    return Promise.reject(error)
  }
)

// Tipos para las respuestas de la API
// ...existing code...

// Cliente HTTP básico para health checks
export const healthClient = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Funciones utilitarias para la API
export const apiUtils = {
  // Health check básico
  async checkHealth(): Promise<boolean> {
    try {
      const response = await healthClient.get('/health')
      return response.data?.success === true
    } catch (error) {
      console.error('❌ Health check falló:', error)
      return false
    }
  },

  // Health check detallado
  async checkDetailedHealth(): Promise<ApiResponse | null> {
    try {
      const response = await healthClient.get('/health/detailed')
      return response.data
    } catch (error) {
      console.error('❌ Detailed health check falló:', error)
      return null
    }
  },

  // Verificar conexión a base de datos
  async checkDatabase(): Promise<boolean> {
    try {
      const response = await healthClient.get('/health/database')
      return response.data?.success === true
    } catch (error) {
      console.error('❌ Database check falló:', error)
      return false
    }
  },

  // Test de conectividad general
  async testConnection(): Promise<{
    backend: boolean
    database: boolean
    api: boolean
  }> {
    const results = {
      backend: false,
      database: false,
      api: false,
    }

    try {
      // Test backend
      results.backend = await this.checkHealth()
      
      // Test database
      results.database = await this.checkDatabase()
      
      // Test API endpoints
      const apiResponse = await apiClient.get('/dashboard/test')
      results.api = apiResponse.data?.success === true
      
    } catch (error) {
      console.error('❌ Connection test failed:', error)
    }

    return results
  }
}

// Export default del cliente principal
export default apiClient