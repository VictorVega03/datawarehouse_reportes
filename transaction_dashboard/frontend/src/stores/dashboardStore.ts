// frontend/src/stores/dashboardStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Tipos definidos directamente aquí
interface DashboardMetric {
  value: string
  numeric: number
  label: string
}

interface DashboardMetrics {
  totalTransactions: DashboardMetric
  annualROI: DashboardMetric
  completionRate: DashboardMetric
  uniqueCustomers: DashboardMetric
}

interface UseCase {
  name: string
  status: string
  roi: string
  priority: string
}

interface DashboardOverview {
  projectProgress: {
    completed: number
    pending: number
    percentage: number
  }
  roiConsolidated: {
    min: number
    max: number
    paybackMonths: string
  }
  useCases: UseCase[]
}

interface DashboardStore {
  metrics: DashboardMetrics | null
  overview: DashboardOverview | null
  selectedCases: string[]
  refreshInterval: number | null
  lastUpdated: Date | null
  isRefreshing: boolean
  
  setMetrics: (metrics: DashboardMetrics) => void
  setOverview: (overview: DashboardOverview) => void
  clearMetrics: () => void
  
  toggleCase: (caseId: string) => void
  selectAllCases: () => void
  clearSelectedCases: () => void
  
  setRefreshInterval: (interval: number | null) => void
  setLastUpdated: (date: Date) => void
  setIsRefreshing: (isRefreshing: boolean) => void
  refresh: () => void
  
  reset: () => void
}

const initialState = {
  metrics: null,
  overview: null,
  selectedCases: [],
  refreshInterval: null,
  lastUpdated: null,
  isRefreshing: false,
}

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        
        setMetrics: (metrics) => 
          set({ metrics, lastUpdated: new Date() }),
        
        setOverview: (overview) => 
          set({ overview, lastUpdated: new Date() }),
        
        clearMetrics: () => 
          set({ metrics: null, overview: null }),
        
        toggleCase: (caseId) => 
          set((state) => {
            const isSelected = state.selectedCases.includes(caseId)
            return {
              selectedCases: isSelected
                ? state.selectedCases.filter(id => id !== caseId)
                : [...state.selectedCases, caseId]
            }
          }),
        
        selectAllCases: () =>
          set((state) => {
            if (!state.overview || !state.overview.useCases) {
              return { selectedCases: [] }
            }
            return {
              selectedCases: state.overview.useCases.map((_, index) => `case-${index}`)
            }
          }),
        
        clearSelectedCases: () => 
          set({ selectedCases: [] }),
        
        setRefreshInterval: (interval) => 
          set({ refreshInterval: interval }),
        
        setLastUpdated: (date) => 
          set({ lastUpdated: date }),
        
        setIsRefreshing: (isRefreshing) => 
          set({ isRefreshing }),
        
        refresh: () => {
          set({ isRefreshing: true })
          setTimeout(() => {
            set({ isRefreshing: false, lastUpdated: new Date() })
          }, 1000)
        },
        
        reset: () => 
          set(initialState),
      }),
      {
        name: 'dashboard-storage',
        partialize: (state) => ({
          selectedCases: state.selectedCases,
          refreshInterval: state.refreshInterval,
        }),
      }
    ),
    { name: 'DashboardStore' }
  )
)

// Exportar tipos para que otros archivos los usen si necesitan
export type { DashboardMetrics, DashboardOverview }