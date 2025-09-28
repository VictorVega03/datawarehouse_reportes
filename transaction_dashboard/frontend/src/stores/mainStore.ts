// frontend/src/stores/mainStore.ts
// SOLUCIÓN AL PROBLEMA ZUSTAND - ALL-IN-ONE STORE SIN MIDDLEWARES

import { create } from 'zustand'

// ✅ TIPOS INLINE - NO IMPORTS EXTERNOS (evita crashes)
interface DashboardMetrics {
  totalTransactions: string
  totalRevenue: string
  completedCases: string
  uniqueCustomers: string
  roiRange: string
}

interface HourlyData {
  hour: string
  transactions: number
  percentage: number
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

interface ApiStatus {
  isLoading: boolean
  error: string | null
  lastFetch: Date | null
}

// ✅ ALL-IN-ONE STATE INTERFACE
interface AppState {
  // === DASHBOARD DATA ===
  metrics: DashboardMetrics | null
  hourlyData: HourlyData[]
  
  // === UI STATE ===
  sidebarOpen: boolean
  currentPage: string
  loadingStates: {
    dashboard: boolean
    metrics: boolean
    charts: boolean
  }
  
  // === FILTERS ===
  filters: DashboardFilters
  
  // === API STATUS ===
  apiStatus: ApiStatus
  
  // === ACTIONS - DASHBOARD ===
  setMetrics: (metrics: DashboardMetrics) => void
  setHourlyData: (data: HourlyData[]) => void
  clearDashboardData: () => void
  
  // === ACTIONS - UI ===
  toggleSidebar: () => void
  setCurrentPage: (page: string) => void
  setLoading: (type: keyof AppState['loadingStates'], loading: boolean) => void
  
  // === ACTIONS - FILTERS ===
  setFilters: (filters: Partial<DashboardFilters>) => void
  resetFilters: () => void
  
  // === ACTIONS - API ===
  setApiStatus: (status: Partial<ApiStatus>) => void
  setApiLoading: (loading: boolean) => void
  setApiError: (error: string | null) => void
}

// ✅ VALORES INICIALES
const initialFilters: DashboardFilters = {
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 días atrás
    end: new Date().toISOString().split('T')[0]
  },
  selectedCase: 'all',
  customerType: 'all',
  paymentMethod: 'all'
}

const initialLoadingStates = {
  dashboard: false,
  metrics: false,
  charts: false
}

const initialApiStatus: ApiStatus = {
  isLoading: false,
  error: null,
  lastFetch: null
}

// ✅ STORE PRINCIPAL - SIN MIDDLEWARES (evita crashes)
export const useAppStore = create<AppState>((set, get) => ({
  // === INITIAL STATE ===
  metrics: null,
  hourlyData: [],
  sidebarOpen: true,
  currentPage: 'dashboard',
  loadingStates: initialLoadingStates,
  filters: initialFilters,
  apiStatus: initialApiStatus,

  // === DASHBOARD ACTIONS ===
  setMetrics: (metrics) => set({ 
    metrics,
    apiStatus: { ...get().apiStatus, lastFetch: new Date() }
  }),
  
  setHourlyData: (hourlyData) => set({ 
    hourlyData,
    apiStatus: { ...get().apiStatus, lastFetch: new Date() }
  }),
  
  clearDashboardData: () => set({
    metrics: null,
    hourlyData: [],
    apiStatus: initialApiStatus
  }),

  // === UI ACTIONS ===
  toggleSidebar: () => set((state) => ({ 
    sidebarOpen: !state.sidebarOpen 
  })),
  
  setCurrentPage: (currentPage) => set({ currentPage }),
  
  setLoading: (type, loading) => set((state) => ({
    loadingStates: {
      ...state.loadingStates,
      [type]: loading
    }
  })),

  // === FILTER ACTIONS ===
  setFilters: (newFilters) => set((state) => ({
    filters: {
      ...state.filters,
      ...newFilters
    }
  })),
  
  resetFilters: () => set({ filters: initialFilters }),

  // === API ACTIONS ===
  setApiStatus: (status) => set((state) => ({
    apiStatus: {
      ...state.apiStatus,
      ...status
    }
  })),
  
  setApiLoading: (isLoading) => set((state) => ({
    apiStatus: {
      ...state.apiStatus,
      isLoading
    }
  })),
  
  setApiError: (error) => set((state) => ({
    apiStatus: {
      ...state.apiStatus,
      error,
      isLoading: false
    }
  }))
}))

// ✅ SELECTORES PARA MEJOR PERFORMANCE
export const selectMetrics = (state: AppState) => state.metrics
export const selectHourlyData = (state: AppState) => state.hourlyData
export const selectFilters = (state: AppState) => state.filters
export const selectSidebarOpen = (state: AppState) => state.sidebarOpen
export const selectCurrentPage = (state: AppState) => state.currentPage
export const selectLoadingStates = (state: AppState) => state.loadingStates
export const selectApiStatus = (state: AppState) => state.apiStatus

// ✅ HOOKS PERSONALIZADOS PARA CASOS ESPECÍFICOS
export const useDashboardMetrics = () => useAppStore(selectMetrics)
export const useHourlyData = () => useAppStore(selectHourlyData)
export const useFilters = () => useAppStore(selectFilters)
export const useSidebar = () => useAppStore(selectSidebarOpen)
export const useCurrentPage = () => useAppStore(selectCurrentPage)
export const useLoadingStates = () => useAppStore(selectLoadingStates)
export const useApiStatus = () => useAppStore(selectApiStatus)

// ✅ HOOK PARA ACTIONS (evita re-renders innecesarios)
export const useAppActions = () => useAppStore((state) => ({
  setMetrics: state.setMetrics,
  setHourlyData: state.setHourlyData,
  clearDashboardData: state.clearDashboardData,
  toggleSidebar: state.toggleSidebar,
  setCurrentPage: state.setCurrentPage,
  setLoading: state.setLoading,
  setFilters: state.setFilters,
  resetFilters: state.resetFilters,
  setApiStatus: state.setApiStatus,
  setApiLoading: state.setApiLoading,
  setApiError: state.setApiError
}))

// ✅ UTILITY FUNCTIONS PARA EL STORE
export const getStoreSnapshot = () => useAppStore.getState()

export const subscribeToMetrics = (callback: (metrics: DashboardMetrics | null) => void) => {
  let previousMetrics = useAppStore.getState().metrics
  
  return useAppStore.subscribe((state) => {
    if (state.metrics !== previousMetrics) {
      previousMetrics = state.metrics
      callback(state.metrics)
    }
  })
}

// ✅ DEBUG HELPERS (solo en desarrollo)
if (import.meta.env.DEV) {
  // @ts-ignore
  window.__APP_STORE__ = useAppStore
  console.log('🏪 AppStore disponible en window.__APP_STORE__ para debugging')
}