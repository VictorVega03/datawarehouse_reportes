// frontend/src/types/api.types.ts
// Types para todas las respuestas de API

// Base API Response estructura
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  timestamp: string
  message?: string
}

// Error response estructura
export interface ApiError {
  success: false
  error: string
  message?: string
  timestamp: string
  path?: string
  method?: string
}

// Request base types
export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface SortParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface FilterParams {
  startDate?: string
  endDate?: string
  search?: string
}

// Combined query params
export interface QueryParams extends PaginationParams, SortParams, FilterParams {
  [key: string]: any
}

// API status types
export interface ApiStatus {
  status: 'healthy' | 'unhealthy' | 'loading'
  timestamp: string
  uptime?: number
  version?: string
}

// Connection test response
export interface ApiTestResponse {
  success: boolean
  message: string
  timestamp: string
  version: string
  endpoints: string[]
  status: {
    database: string
    server: string
    port: number
  }
}

// Health check response
export interface HealthResponse {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  uptime: number
  version: string
  memory?: {
    used: number
    total: number
    external: number
  }
  system?: {
    node_version: string
    platform: string
    arch: string
    pid: number
  }
}