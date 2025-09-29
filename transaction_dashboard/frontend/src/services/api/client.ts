// frontend/src/services/api/client.ts
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'

// Tipos definidos directamente aquí
interface ApiResponse<T = any> {
  success: true
  data: T
  timestamp: string
  message?: string
}

interface ApiError {
  success: false
  error: string
  message?: string
  details?: string
  timestamp: string
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1'
const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/api'

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}${API_PREFIX}/${API_VERSION}`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.VITE_APP_ENV === 'development') {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.VITE_APP_ENV === 'development') {
      console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`)
    }
    return response
  },
  (error: AxiosError) => {
    console.error('API Response Error:', error.response?.status)
    return Promise.reject(error)
  }
)

export const healthClient = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const apiUtils = {
  async checkHealth(): Promise<boolean> {
    try {
      const response = await healthClient.get('/health')
      return response.data?.success === true
    } catch (error) {
      return false
    }
  },

  async checkDatabase(): Promise<boolean> {
    try {
      const response = await healthClient.get('/health/database')
      return response.data?.success === true
    } catch (error) {
      return false
    }
  },

  async testConnection(): Promise<{ backend: boolean; database: boolean; api: boolean }> {
    const results = { backend: false, database: false, api: false }
    try {
      results.backend = await this.checkHealth()
      results.database = await this.checkDatabase()
      const apiResponse = await apiClient.get('/dashboard/test')
      results.api = apiResponse.data?.success === true
    } catch (error) {
      console.error('Connection test failed:', error)
    }
    return results
  }
}

export default apiClient

// Exportar tipos para que otros archivos los usen
export type { ApiResponse, ApiError }