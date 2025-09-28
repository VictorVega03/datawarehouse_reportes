// frontend/src/types/store.types.ts
// Types para Zustand stores y componentes UI

import { DashboardFilters, DashboardMetrics, DashboardOverview, UseCaseItem } from './dashboard.types'
import { User } from './entities.types'

// Dashboard Store State
export interface DashboardState {
  // Data
  metrics: DashboardMetrics | null
  overview: DashboardOverview | null
  useCases: UseCaseItem[]
  
  // UI State
  isLoading: boolean
  error: string | null
  lastUpdated: string | null
  
  // Actions
  setMetrics: (metrics: DashboardMetrics) => void
  setOverview: (overview: DashboardOverview) => void
  setUseCases: (useCases: UseCaseItem[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  refreshData: () => Promise<void>
}

// Filters Store State
export interface FiltersState {
  // Current filters
  filters: DashboardFilters
  
  // Applied filters (for reset functionality)
  appliedFilters: DashboardFilters
  
  // UI state
  isFiltersPanelOpen: boolean
  hasUnsavedChanges: boolean
  
  // Actions
  updateFilter: <K extends keyof DashboardFilters>(
    key: K,
    value: DashboardFilters[K]
  ) => void
  applyFilters: () => void
  resetFilters: () => void
  clearAllFilters: () => void
  toggleFiltersPanel: () => void
  setUnsavedChanges: (hasChanges: boolean) => void
}

// UI Store State
export interface UIState {
  // Layout
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  
  // Theme
  theme: 'light' | 'dark' | 'system'
  
  // Modals
  modals: {
    [key: string]: boolean
  }
  
  // Notifications
  notifications: Notification[]
  
  // Loading states
  globalLoading: boolean
  pageLoading: boolean
  
  // Current page
  currentPage: string
  breadcrumbs: Breadcrumb[]
  
  // Actions
  toggleSidebar: () => void
  collapseSidebar: (collapsed: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  setGlobalLoading: (loading: boolean) => void
  setPageLoading: (loading: boolean) => void
  setCurrentPage: (page: string) => void
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void
}

// Auth Store State (para futuro)
export interface AuthState {
  // User data
  user: User | null
  isAuthenticated: boolean
  
  // Loading/error state
  isLoading: boolean
  error: string | null
  
  // Session
  token: string | null
  refreshToken: string | null
  expiresAt: number | null
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  refreshSession: () => Promise<void>
  setUser: (user: User) => void
  clearError: () => void
}

// Settings Store State
export interface SettingsState {
  // User preferences
  preferences: UserPreferences
  
  // App settings
  autoRefresh: boolean
  refreshInterval: number
  defaultPageSize: number
  
  // Export settings
  exportFormat: 'csv' | 'xlsx' | 'pdf'
  includeCharts: boolean
  
  // Chart settings
  chartTheme: 'light' | 'dark'
  animationDuration: number
  
  // Actions
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void
  setAutoRefresh: (enabled: boolean) => void
  setRefreshInterval: (interval: number) => void
  setExportFormat: (format: 'csv' | 'xlsx' | 'pdf') => void
  resetToDefaults: () => void
}

// Supporting types

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  timestamp: string
  action?: {
    label: string
    handler: () => void
  }
}

export interface Breadcrumb {
  label: string
  href?: string
  current: boolean
}

export interface LoginCredentials {
  username: string
  password: string
  rememberMe?: boolean
}

export interface UserPreferences {
  language: 'es' | 'en'
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
  timeFormat: '12h' | '24h'
  currency: 'USD' | 'MXN' | 'EUR'
  numberFormat: 'en-US' | 'es-MX' | 'es-ES'
  defaultDashboard: string
  favoriteUseCases: number[]
}

// Component Props Types

export interface ComponentBaseProps {
  className?: string
  children?: React.ReactNode
}

export interface LoadingStateProps {
  isLoading: boolean
  error?: string | null
  children: React.ReactNode
  loadingText?: string
  errorText?: string
  retryButton?: boolean
  onRetry?: () => void
}

export interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

// Chart component props
export interface ChartProps extends ComponentBaseProps {
  data: any[]
  loading?: boolean
  error?: string | null
  height?: number
  responsive?: boolean
  theme?: 'light' | 'dark'
  onDataPointClick?: (data: any) => void
}

// Table component props
export interface TableColumn<T = any> {
  key: keyof T | string
  label: string
  sortable?: boolean
  width?: string | number
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: T, index: number) => React.ReactNode
}

export interface TableProps<T = any> extends ComponentBaseProps {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  error?: string | null
  pagination?: {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
  }
  sorting?: {
    sortBy: string | null
    sortOrder: 'asc' | 'desc'
    onSort: (column: string) => void
  }
  selection?: {
    selectedRows: string[]
    onSelectionChange: (selectedRows: string[]) => void
  }
}