// Simplified dashboard store without middlewares and complex types
import { create } from 'zustand'

// Simple inline types instead of @/types imports
interface SimpleMetrics {
  totalTransactions: string
  totalRevenue: string
  roiAnnual: string
  completedCases: string
  uniqueCustomers: string
  averageTicket: string
}

interface SimpleDashboardState {
  metrics: SimpleMetrics | null
  isLoading: boolean
  error: string | null
  
  // Actions
  setMetrics: (metrics: SimpleMetrics) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useSimpleDashboardStore = create<SimpleDashboardState>((set) => ({
  // Initial state
  metrics: null,
  isLoading: false,
  error: null,
  
  // Actions
  setMetrics: (metrics) => set({ metrics }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error })
}))

// Selectors
export const useSimpleDashboardMetrics = () => useSimpleDashboardStore(state => state.metrics)
export const useSimpleDashboardActions = () => useSimpleDashboardStore(state => ({
  setMetrics: state.setMetrics,
  setLoading: state.setLoading,
  setError: state.setError
}))