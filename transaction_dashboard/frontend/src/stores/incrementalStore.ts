// frontend/src/stores/incrementalStore.ts
// STORE INCREMENTAL - PROBANDO UNA CARACTERÍSTICA A LA VEZ

import { create } from 'zustand'

// ✅ VERSION 1: BÁSICO + INTERFACE ANIDADA (SOSPECHOSO #1)
interface SimpleMetrics {
  totalTransactions: string
  totalRevenue: string
}

interface StoreVersion1 {
  message: string
  count: number
  metrics: SimpleMetrics  // 🔍 DIFERENCIA: objeto anidado (pero no null)
  updateMessage: (msg: string) => void
  increment: () => void
  updateMetrics: (metrics: SimpleMetrics) => void
}

export const useStoreVersion1 = create<StoreVersion1>((set) => ({
  message: "Store v1 funcionando",
  count: 0,
  metrics: {  // 🔍 DIFERENCIA: valor objeto inline
    totalTransactions: '2.92M',
    totalRevenue: '$220M+'
  },
  updateMessage: (msg) => set({ message: msg }),
  increment: () => set((state) => ({ count: state.count + 1 })),
  updateMetrics: (metrics) => set({ metrics })  // 🔍 DIFERENCIA: set objeto
}))

// ===================================

// ✅ VERSION 2: BÁSICO + NULL TYPES (SOSPECHOSO #3)
interface StoreVersion2 {
  message: string
  count: number
  nullableData: string | null  // 🔍 DIFERENCIA: tipo nullable
  updateMessage: (msg: string) => void
  increment: () => void
  setNullableData: (data: string | null) => void
}

export const useStoreVersion2 = create<StoreVersion2>((set) => ({
  message: "Store v2 funcionando",
  count: 0,
  nullableData: null,  // 🔍 DIFERENCIA: valor null inicial
  updateMessage: (msg) => set({ message: msg }),
  increment: () => set((state) => ({ count: state.count + 1 })),
  setNullableData: (data) => set({ nullableData: data })
}))

// ===================================

// ✅ VERSION 3: BÁSICO + SPREAD OPERATOR (SOSPECHOSO #4)
interface NestedUI {
  sidebarOpen: boolean
  currentPage: string
}

interface StoreVersion3 {
  message: string
  count: number
  ui: NestedUI
  updateMessage: (msg: string) => void
  increment: () => void
  toggleSidebar: () => void
}

export const useStoreVersion3 = create<StoreVersion3>((set) => ({
  message: "Store v3 funcionando",
  count: 0,
  ui: {
    sidebarOpen: true,
    currentPage: 'dashboard'
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

// ===================================

// ✅ VERSION 4: BÁSICO + new Date() (SOSPECHOSO #5)
interface StoreVersion4 {
  message: string
  count: number
  lastUpdated: string
  updateMessage: (msg: string) => void
  increment: () => void
  updateTimestamp: () => void
}

export const useStoreVersion4 = create<StoreVersion4>((set) => ({
  message: "Store v4 funcionando",
  count: 0,
  lastUpdated: new Date().toLocaleTimeString(),  // 🔍 DIFERENCIA: new Date() en initial
  updateMessage: (msg) => set({ message: msg }),
  increment: () => set((state) => ({ count: state.count + 1 })),
  updateTimestamp: () => set({
    lastUpdated: new Date().toLocaleTimeString()  // 🔍 DIFERENCIA: new Date() en action
  })
}))

// ===================================

// ✅ VERSION 5: BÁSICO + CONST EXTERNOS (SOSPECHOSO #6)
const externalData = {
  totalTransactions: '2.92M',
  totalRevenue: '$220M+'
}

interface StoreVersion5 {
  message: string
  count: number
  data: typeof externalData
  updateMessage: (msg: string) => void
  increment: () => void
  updateData: () => void
}

export const useStoreVersion5 = create<StoreVersion5>((set) => ({
  message: "Store v5 funcionando",
  count: 0,
  data: externalData,  // 🔍 DIFERENCIA: const externo
  updateMessage: (msg) => set({ message: msg }),
  increment: () => set((state) => ({ count: state.count + 1 })),
  updateData: () => set({ data: { ...externalData } })
}))

// ===================================

// ✅ VERSION 6: BÁSICO + SELECTORES (SOSPECHOSO #7)
interface StoreVersion6 {
  message: string
  count: number
  updateMessage: (msg: string) => void
  increment: () => void
}

export const useStoreVersion6 = create<StoreVersion6>((set) => ({
  message: "Store v6 funcionando",
  count: 0,
  updateMessage: (msg) => set({ message: msg }),
  increment: () => set((state) => ({ count: state.count + 1 }))
}))

// 🔍 DIFERENCIA: selectores exportados
export const useMessage = () => useStoreVersion6((state) => state.message)
export const useCount = () => useStoreVersion6((state) => state.count)
export const useActions = () => useStoreVersion6((state) => ({
  updateMessage: state.updateMessage,
  increment: state.increment
}))

// ===================================

// ✅ STORE BÁSICO DE CONTROL (SABEMOS QUE FUNCIONA)
interface BasicStoreControl {
  message: string
  count: number
  updateMessage: (msg: string) => void
  increment: () => void
}

export const useBasicStoreControl = create<BasicStoreControl>((set) => ({
  message: "Store control funcionando ✅",
  count: 0,
  updateMessage: (msg) => set({ message: msg }),
  increment: () => set((state) => ({ count: state.count + 1 }))
}))