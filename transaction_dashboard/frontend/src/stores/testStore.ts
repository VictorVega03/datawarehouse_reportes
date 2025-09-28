// Test store with relative imports instead of @ aliases
import { create } from 'zustand'
// Using relative path instead of @/types
import type { DashboardMetrics } from '../types/dashboard.types'

interface TestDashboardState {
  metrics: DashboardMetrics | null
  setMetrics: (metrics: DashboardMetrics) => void
}

export const useTestDashboardStore = create<TestDashboardState>((set) => ({
  metrics: null,
  setMetrics: (metrics) => set({ metrics })
}))

export const useTestDashboardMetrics = () => useTestDashboardStore(state => state.metrics)
export const useTestDashboardActions = () => useTestDashboardStore(state => ({
  setMetrics: state.setMetrics
}))