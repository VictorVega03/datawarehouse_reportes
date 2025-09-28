// frontend/src/types/index.ts
// Barrel exports - Import central para todos los types del proyecto

import React from 'react'

// API Types
export type {
  ApiResponse,
  ApiError,
  PaginationParams,
  SortParams,
  FilterParams,
  QueryParams,
  ApiStatus,
  ApiTestResponse,
  HealthResponse
} from './api.types'

// Import types for local usage
import type { ApiResponse, ApiError } from './api.types'
import type { DashboardFilters } from './dashboard.types'

// Dashboard Types
export type {
  DashboardMetrics,
  DashboardOverview,
  HourlyTransactionData,
  HourlyTransactionSummary,
  HourlyTransactions,
  PaymentMethodData,
  TransactionsSummary,
  CustomerSegmentData,
  VipCustomerData,
  CustomerSegmentation,
  UseCaseItem,
  ChartDataPoint,
  BarChartData,
  PieChartData,
  LineChartData,
  DashboardFilters,
  MetricCardData,
  NavigationItem,
  PageMeta
} from './dashboard.types'

// Entity Types
export type {
  Transaction,
  Customer,
  Product,
  InventoryLog,
  ProductBatch,
  PriceAnalysis,
  InventoryStatus,
  ReturnPattern,
  Location,
  User
} from './entities.types'

// Enums
export {
  PaymentMethod,
  CustomerType,
  InventoryChangeType,
  BatchStatus,
  UserRole,
  Permission
} from './entities.types'

// Store & UI Types
export type {
  DashboardState,
  FiltersState,
  UIState,
  AuthState,
  SettingsState,
  Notification,
  Breadcrumb,
  LoginCredentials,
  UserPreferences,
  ComponentBaseProps,
  LoadingStateProps,
  ErrorBoundaryState,
  ChartProps,
  TableColumn,
  TableProps
} from './store.types'

// Common utility types
export interface SelectOption<T = string> {
  value: T
  label: string
  disabled?: boolean
  icon?: string
}

export interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  lastFetch: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date'
  required?: boolean
  placeholder?: string
  options?: SelectOption[]
  validation?: {
    min?: number
    max?: number
    pattern?: RegExp
    custom?: (value: any) => string | null
  }
}

export interface FormErrors {
  [fieldName: string]: string | null
}

// Route types
export interface Route {
  path: string
  name: string
  component: React.ComponentType<any>
  exact?: boolean
  protected?: boolean
  permissions?: string[]
  meta?: {
    title: string
    description?: string
    keywords?: string[]
  }
}

// Export format types
export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'pdf'
  filename?: string
  includeCharts?: boolean
  dateRange?: {
    start: Date
    end: Date
  }
  filters?: DashboardFilters
}

// Theme types
export interface ThemeColors {
  primary: {
    50: string
    100: string
    500: string
    600: string
    700: string
    900: string
  }
  gray: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
  }
  success: {
    500: string
    600: string
    700: string
  }
  error: {
    500: string
    600: string
    700: string
  }
  warning: {
    500: string
    600: string
    700: string
  }
}

// Constants for the project
export const USE_CASES = [
  { id: 1, name: 'Patrones Horarios', slug: 'horarios' },
  { id: 2, name: 'Control Caducidad', slug: 'caducidad' },
  { id: 3, name: 'Gestión Precios', slug: 'precios' },
  { id: 4, name: 'Identificación Clientes', slug: 'clientes' },
  { id: 5, name: 'Seguimiento Inventario', slug: 'inventario' },
  { id: 6, name: 'Métodos de Pago', slug: 'pagos' },
  { id: 7, name: 'Control Devoluciones', slug: 'devoluciones' }
] as const

export const PAYMENT_METHODS = [
  { value: 'CREDIT_CARD', label: 'Tarjeta de Crédito' },
  { value: 'CASH', label: 'Efectivo' },
  { value: 'VOUCHER', label: 'Vale' }
] as const

export const CUSTOMER_TYPES = [
  { value: 'VIP', label: 'VIP' },
  { value: 'REGULAR', label: 'Regular' },
  { value: 'ANONYMOUS', label: 'Anónimo' }
] as const

// Type guards
export const isApiError = (response: any): response is ApiError => {
  return response && response.success === false && 'error' in response
}

export const isApiSuccess = <T>(response: any): response is ApiResponse<T> => {
  return response && response.success === true && 'data' in response
}

// Utility types
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}