import axios, { AxiosResponse, AxiosError } from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1'

// Create axios instance
export const apiClient = axios.create({
  baseURL: `${API_URL}/api/${API_VERSION}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error: AxiosError) => {
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`)
    
    // Handle common errors
    if (error.response?.status === 404) {
      console.error('🔍 Endpoint not found')
    } else if (error.response?.status === 500) {
      console.error('🔥 Server error')
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🚫 Cannot connect to backend. Is it running on port 3001?')
    }
    
    return Promise.reject(error)
  }
)

// API response type
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  timestamp: string
  message?: string
}

// Export default
export default apiClient