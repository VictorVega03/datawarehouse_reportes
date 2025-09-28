// frontend/src/stores/testStores.ts
// STORES DE PRUEBA ULTRA-SIMPLES

import { create } from 'zustand'

// ✅ TEST 1: STORE CON OBJETO ANIDADO
interface TestMetrics {
  transactions: string
  revenue: string
}

interface StoreWithObject {
  message: string
  count: number
  metrics: TestMetrics  // 🔍 DIFERENCIA: objeto anidado
  updateMessage: (msg: string) => void
  increment: () => void
  updateMetrics: (metrics: TestMetrics) => void
}

export const useStoreWithObject = create<StoreWithObject>((set) => ({
  message: "Store con objeto",
  count: 0,
  metrics: {
    transactions: '2.92M',
    revenue: '$220M+'
  },
  updateMessage: (msg) => set({ message: msg }),
  increment: () => set((state) => ({ count: state.count + 1 })),
  updateMetrics: (metrics) => set({ metrics })
}))

// ✅ TEST 2: STORE CON TIPOS NULL
interface StoreWithNull {
  message: string
  count: number
  nullData: string | null  // 🔍 DIFERENCIA: tipo nullable
  updateMessage: (msg: string) => void
  increment: () => void
  setNull: (data: string | null) => void
}

export const useStoreWithNull = create<StoreWithNull>((set) => ({
  message: "Store con null",
  count: 0,
  nullData: null,  // 🔍 DIFERENCIA: valor null inicial
  updateMessage: (msg) => set({ message: msg }),
  increment: () => set((state) => ({ count: state.count + 1 })),
  setNull: (data) => set({ nullData: data })
}))

// ✅ TEST 3: STORE CON SPREAD OPERATOR
interface UIState {
  sidebarOpen: boolean
  theme: string
}

interface StoreWithSpread {
  message: string
  count: number
  ui: UIState
  updateMessage: (msg: string) => void
  increment: () => void
  toggleSidebar: () => void
}

export const useStoreWithSpread = create<StoreWithSpread>((set) => ({
  message: "Store con spread",
  count: 0,
  ui: {
    sidebarOpen: true,
    theme: 'light'
  },
  updateMessage: (msg) => set({ message: msg }),
  increment: () => set((state) => ({ count: state.count + 1 })),
  toggleSidebar: () => set((state) => ({  // 🔍 DIFERENCIA: spread operator
    ui: {
      ...state.ui,
      sidebarOpen: !state.ui.sidebarOpen
    }
  }))
}))

// ✅ TEST 4: STORE CON DATE
interface StoreWithDate {
  message: string
  count: number
  lastUpdated: string
  updateMessage: (msg: string) => void
  increment: () => void
  updateTime: () => void
}

export const useStoreWithDate = create<StoreWithDate>((set) => ({
  message: "Store con date",
  count: 0,
  lastUpdated: new Date().toLocaleTimeString(),  // 🔍 DIFERENCIA: new Date()
  updateMessage: (msg) => set({ message: msg }),
  increment: () => set((state) => ({ count: state.count + 1 })),
  updateTime: () => set({
    lastUpdated: new Date().toLocaleTimeString()  // 🔍 DIFERENCIA: new Date() en action
  })
}))