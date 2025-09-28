// frontend/src/stores/dashboardStoreGradual.ts
// STORE GRADUAL - AGREGANDO COMPLEJIDAD PASO A PASO

import { create } from 'zustand'

// ✅ PASO 1: TIPOS MUY SIMPLES (como el store básico que funciona)
interface SimpleMetrics {
  totalTransactions: string
  totalRevenue: string
  completedCases: string
  uniqueCustomers: string
}

// ✅ PASO 2: AGREGAR UN TIPO MÁS (sin arrays complejos aún)
interface SimpleUI {
  sidebarOpen: boolean
  currentPage: string
}

// ✅ PASO 3: ESTADO GRADUAL - EMPEZAR SIMPLE
interface DashboardStoreGradual {
  // === ESTADO BÁSICO ===
  metrics: SimpleMetrics | null
  ui: SimpleUI
  lastUpdated: string
  
  // === ACTIONS BÁSICAS ===
  setMetrics: (metrics: SimpleMetrics) => void
  toggleSidebar: () => void
  setCurrentPage: (page: string) => void
  updateTimestamp: () => void
}

// ✅ VALORES INICIALES SIMPLES
const initialMetrics: SimpleMetrics = {
  totalTransactions: '2.92M',
  totalRevenue: '$220M+',
  completedCases: '70%',
  uniqueCustomers: '29,991'
}

const initialUI: SimpleUI = {
  sidebarOpen: true,
  currentPage: 'dashboard'
}

// ✅ STORE GRADUAL - SIN COMPLEJIDAD ADICIONAL
export const useDashboardStoreGradual = create<DashboardStoreGradual>((set) => ({
  // === ESTADO INICIAL ===
  metrics: initialMetrics,
  ui: initialUI,
  lastUpdated: new Date().toLocaleTimeString(),

  // === ACTIONS SIMPLES ===
  setMetrics: (metrics) => set({ 
    metrics,
    lastUpdated: new Date().toLocaleTimeString()
  }),
  
  toggleSidebar: () => set((state) => ({
    ui: {
      ...state.ui,
      sidebarOpen: !state.ui.sidebarOpen
    },
    lastUpdated: new Date().toLocaleTimeString()
  })),
  
  setCurrentPage: (currentPage) => set((state) => ({
    ui: {
      ...state.ui,
      currentPage
    },
    lastUpdated: new Date().toLocaleTimeString()
  })),
  
  updateTimestamp: () => set({
    lastUpdated: new Date().toLocaleTimeString()
  })
}))

// ✅ SELECTORES SIMPLES
export const useMetrics = () => useDashboardStoreGradual((state) => state.metrics)
export const useUI = () => useDashboardStoreGradual((state) => state.ui)
export const useLastUpdated = () => useDashboardStoreGradual((state) => state.lastUpdated)

// ✅ HOOK PARA ACTIONS
export const useDashboardActionsGradual = () => useDashboardStoreGradual((state) => ({
  setMetrics: state.setMetrics,
  toggleSidebar: state.toggleSidebar,
  setCurrentPage: state.setCurrentPage,
  updateTimestamp: state.updateTimestamp
}))

// ✅ DEBUG
if (import.meta.env.DEV) {
  // @ts-ignore
  window.__DASHBOARD_STORE_GRADUAL__ = useDashboardStoreGradual
  console.log('🏪 DashboardStoreGradual disponible en window.__DASHBOARD_STORE_GRADUAL__')
}