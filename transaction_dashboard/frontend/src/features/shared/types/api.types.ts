// frontend/src/features/shared/types/api.types.ts
// Tipos compartidos para respuestas API

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  timestamp: string
  error?: string
  message?: string
}

export interface ApiError {
  success: false
  error: string
  message: string
  timestamp: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface ConnectionStatus {
  backend: boolean
  database: boolean
  api: boolean
  timestamp: string
}
