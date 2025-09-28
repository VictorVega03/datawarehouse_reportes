// frontend/src/stores/dashboardStore.ts
// STORE DASHBOARD - VERSIÓN FUNCIONANDO
// Basado en el store básico que ya funciona + funcionalidad dashboard

import { create } from 'zustand'

// ✅ TIPOS INLINE - NO IMPORTS EXTERNOS (para evitar crashes)
interface DashboardMetrics {
  totalTransactions: string
  totalRevenue: string
  completedCases: string
  uniqueCustomers: string
  roiRange: string
  lastUpdated: string
}

interface HourlyPattern {
  hour: string
  transactions: number
  percentage: number
  classification: 'peak' | 'high' | 'normal' | 'low'
}

interface CaseProgress {
  caseId: string
  name: string
  status: 'completed' | 'in_progress' | 'pending'
  roi: string
  priority: 'critical' | 'high' | 'medium' | 'low'
}

interface DashboardFilters {
  dateRange: {
    start: string
    end: string
  }
  selectedCase: string
  customerType: 'all' | 'vip' | 'regular' | 'anonymous'
  paymentMethod: 'all' | 'credit_card' | 'cash' | 'voucher'
}

interface UIState {
  sidebarOpen: boolean
  currentPage: string
  theme: 'light' | 'dark'
  loading: {
    dashboard: boolean
    metrics: boolean
    charts: boolean
  }
}

// ✅ ESTADO COMPLETO DEL DASHBOARD
interface DashboardState {
  // === DATA ===
  metrics: DashboardMetrics | null
  hourlyPatterns: HourlyPattern[]
  casesProgress: CaseProgress[]
  
  // === UI ===
  ui: UIState
  
  // === FILTERS ===
  filters: DashboardFilters
  
  // === STATUS ===
  lastFetch: Date | null
  error: string | null
  
  // === ACTIONS - DATOS ===
  setMetrics: (metrics: DashboardMetrics) => void
  setHourlyPatterns: (patterns: HourlyPattern[]) => void
  setCasesProgress: (cases: CaseProgress[]) => void
  clearAllData: () => void
  
  // === ACTIONS - UI ===
  toggleSidebar: () => void
  setCurrentPage: (page: string) => void
  setTheme: (theme: 'light' | 'dark') => void
  setLoading: (section: keyof UIState['loading'], loading: boolean) => void
  
  // === ACTIONS - FILTERS ===
  updateFilters: (filters: Partial<DashboardFilters>) => void
  resetFilters: () => void
  
  // === ACTIONS - STATUS ===
  setError: (error: string | null) => void
  updateLastFetch: () => void
}

// ✅ VALORES INICIALES
const initialMetrics: DashboardMetrics = {
  totalTransactions: '2.92M',
  totalRevenue: '$220M+',
  completedCases: '70%',
  uniqueCustomers: '29,991',
  roiRange: '4,400% - 7,333%',
  lastUpdated: new Date().toLocaleTimeString()
}

const initialHourlyPatterns: HourlyPattern[] = [
  { hour: '18:00', transactions: 497234, percentage: 17.0, classification: 'peak' },
  { hour: '19:00', transactions: 498803, percentage: 17.1, classification: 'peak' },
  { hour: '12:00', transactions: 441878, percentage: 15.1, classification: 'high' },
  { hour: '13:00', transactions: 443305, percentage: 15.2, classification: 'high' },
  { hour: '08:00', transactions: 77697, percentage: 2.7, classification: 'low' },
  { hour: '21:00', transactions: 77038, percentage: 2.6, classification: 'low' }
]

const initialCasesProgress: CaseProgress[] = [
  { caseId: 'caso1', name: 'Patrones Horarios', status: 'completed', roi: '$6.7M', priority: 'high' },
  { caseId: 'caso2', name: 'Control Caducidad', status: 'completed', roi: '$3.8M', priority: 'high' },
  { caseId: 'caso3', name: 'Gestión Precios', status: 'completed', roi: '$150M', priority: 'critical' },
  { caseId: 'caso4', name: 'Identificación Clientes', status: 'completed', roi: '$1.35B', priority: 'high' },
  { caseId: 'caso5', name: 'Seguimiento Inventario', status: 'completed', roi: '$56.3M', priority: 'critical' },
  { caseId: 'caso6', name: 'Métodos de Pago', status: 'completed', roi: 'Control Riesgos', priority: 'medium' },
  { caseId: 'caso7', name: 'Control Devoluciones', status: 'completed', roi: '$1.13B', priority: 'high' }
]

const initialFilters: DashboardFilters = {
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  },
  selectedCase: 'all',
  customerType: 'all',
  paymentMethod: 'all'
}

const initialUI: UIState = {
  sidebarOpen: true,
  currentPage: 'dashboard',
  theme: 'light',
  loading: {
    dashboard: false,
    metrics: false,
    charts: false
  }
}

// ✅ STORE PRINCIPAL - SIN MIDDLEWARES PROBLEMÁTICOS
export const useDashboardStore = create<DashboardState>((set, get) => ({
  // === INITIAL STATE ===
  metrics: initialMetrics,
  hourlyPatterns: initialHourlyPatterns,
  casesProgress: initialCasesProgress,
  ui: initialUI,
  filters: initialFilters,
  lastFetch: new Date(),
  error: null,

  // === DATA ACTIONS ===
  setMetrics: (metrics) => set({ 
    metrics: {
      ...metrics,
      lastUpdated: new Date().toLocaleTimeString()
    },
    lastFetch: new Date(),
    error: null
  }),
  
  setHourlyPatterns: (hourlyPatterns) => set({ 
    hourlyPatterns,
    lastFetch: new Date(),
    error: null
  }),
  
  setCasesProgress: (casesProgress) => set({ 
    casesProgress,
    lastFetch: new Date(),
    error: null
  }),
  
  clearAllData: () => set({
    metrics: null,
    hourlyPatterns: [],
    casesProgress: [],
    lastFetch: null,
    error: null
  }),

  // === UI ACTIONS ===
  toggleSidebar: () => set((state) => ({
    ui: {
      ...state.ui,
      sidebarOpen: !state.ui.sidebarOpen
    }
  })),
  
  setCurrentPage: (currentPage) => set((state) => ({
    ui: {
      ...state.ui,
      currentPage
    }
  })),
  
  setTheme: (theme) => set((state) => ({
    ui: {
      ...state.ui,
      theme
    }
  })),
  
  setLoading: (section, loading) => set((state) => ({
    ui: {
      ...state.ui,
      loading: {
        ...state.ui.loading,
        [section]: loading
      }
    }
  })),

  // === FILTER ACTIONS ===
  updateFilters: (newFilters) => set((state) => ({
    filters: {
      ...state.filters,
      ...newFilters
    }
  })),
  
  resetFilters: () => set({ filters: initialFilters }),

  // === STATUS ACTIONS ===
  setError: (error) => set({ error }),
  
  updateLastFetch: () => set({ lastFetch: new Date() })
}))

// ✅ SELECTORES OPTIMIZADOS
export const selectMetrics = (state: DashboardState) => state.metrics
export const selectHourlyPatterns = (state: DashboardState) => state.hourlyPatterns
export const selectCasesProgress = (state: DashboardState) => state.casesProgress
export const selectUI = (state: DashboardState) => state.ui
export const selectFilters = (state: DashboardState) => state.filters
export const selectLoading = (state: DashboardState) => state.ui.loading
export const selectError = (state: DashboardState) => state.error

// ✅ HOOKS PERSONALIZADOS
export const useDashboardMetrics = () => useDashboardStore(selectMetrics)
export const useHourlyPatterns = () => useDashboardStore(selectHourlyPatterns)
export const useCasesProgress = () => useDashboardStore(selectCasesProgress)
export const useDashboardUI = () => useDashboardStore(selectUI)
export const useDashboardFilters = () => useDashboardStore(selectFilters)
export const useDashboardLoading = () => useDashboardStore(selectLoading)
export const useDashboardError = () => useDashboardStore(selectError)

// ✅ HOOK PARA ACTIONS
export const useDashboardActions = () => useDashboardStore((state) => ({
  setMetrics: state.setMetrics,
  setHourlyPatterns: state.setHourlyPatterns,
  setCasesProgress: state.setCasesProgress,
  clearAllData: state.clearAllData,
  toggleSidebar: state.toggleSidebar,
  setCurrentPage: state.setCurrentPage,
  setTheme: state.setTheme,
  setLoading: state.setLoading,
  updateFilters: state.updateFilters,
  resetFilters: state.resetFilters,
  setError: state.setError,
  updateLastFetch: state.updateLastFetch
}))

// ✅ UTILIDADES
export const getDashboardSnapshot = () => useDashboardStore.getState()

// ✅ DEBUG (solo en desarrollo)
if (import.meta.env.DEV) {
  // @ts-ignore
  window.__DASHBOARD_STORE__ = useDashboardStore
  console.log('🏪 DashboardStore disponible en window.__DASHBOARD_STORE__')
}