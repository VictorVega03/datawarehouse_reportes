// Working dashboard store with inline types (no @/types imports)
import { create } from 'zustand'

// Inline types to avoid @/types imports
interface Metrics {
  totalTransactions: string | number
  totalRevenue: string | number  
  roiAnnual: string | number
  completedCases: string | number
  uniqueCustomers: string | number
  averageTicket: string | number
}

interface WorkingDashboardState {
  metrics: Metrics | null
  isLoading: boolean
  error: string | null
  
  // Actions
  setMetrics: (metrics: Metrics) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearData: () => void
}

export const useWorkingDashboardStore = create<WorkingDashboardState>((set) => ({
  metrics: null,
  isLoading: false,
  error: null,
  
  setMetrics: (metrics) => set({ metrics }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearData: () => set({ metrics: null, error: null, isLoading: false })
}))

// Selectors
export const useWorkingDashboardMetrics = () => useWorkingDashboardStore(state => state.metrics)
export const useWorkingDashboardActions = () => useWorkingDashboardStore(state => ({
  setMetrics: state.setMetrics,
  setLoading: state.setLoading,
  setError: state.setError,
  clearData: state.clearData
}))