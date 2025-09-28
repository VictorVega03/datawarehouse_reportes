// Dashboard store without problematic middlewares
import { create } from 'zustand'
import type { 
  DashboardMetrics, 
  DashboardOverview, 
  UseCaseItem 
} from '@/types'

interface DashboardState {
  // Main dashboard data
  metrics: DashboardMetrics | null
  overview: DashboardOverview | null
  useCases: UseCaseItem[]
  
  // Loading states
  isLoading: boolean
  error: string | null
  lastUpdated: string | null

  // Actions
  setMetrics: (metrics: DashboardMetrics) => void
  setOverview: (overview: DashboardOverview) => void
  setUseCases: (useCases: UseCaseItem[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearData: () => void
}

const initialState = {
  metrics: null,
  overview: null,
  useCases: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
}

// Create the dashboard store WITHOUT middlewares
export const useDashboardStore = create<DashboardState>((set) => ({
  ...initialState,

  // Actions
  setMetrics: (metrics) => 
    set({ metrics, lastUpdated: new Date().toISOString() }),

  setOverview: (overview) => 
    set({ overview, lastUpdated: new Date().toISOString() }),

  setUseCases: (useCases) => 
    set({ useCases, lastUpdated: new Date().toISOString() }),

  setLoading: (isLoading) => 
    set({ isLoading }),

  setError: (error) => 
    set({ error, isLoading: false }),

  clearData: () => 
    set({ ...initialState }),
}))

// Selectors
export const useDashboardMetrics = () => useDashboardStore(state => state.metrics)
export const useDashboardOverview = () => useDashboardStore(state => state.overview)
export const useDashboardUseCases = () => useDashboardStore(state => state.useCases)
export const useDashboardLoading = () => useDashboardStore(state => state.isLoading)
export const useDashboardError = () => useDashboardStore(state => state.error)

export const useDashboardActions = () => useDashboardStore(state => ({
  setMetrics: state.setMetrics,
  setOverview: state.setOverview,
  setUseCases: state.setUseCases,
  setLoading: state.setLoading,
  setError: state.setError,
  clearData: state.clearData,
}))