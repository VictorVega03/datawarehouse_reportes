// frontend/src/stores/basicStore.ts
// VERSIÓN ULTRA-BÁSICA PARA DEBUGGING - SIN IMPORTS EXTERNOS

import { create } from 'zustand'

// ✅ INTERFAZ MÁS SIMPLE POSIBLE
interface BasicState {
  message: string
  count: number
  updateMessage: (msg: string) => void
  increment: () => void
}

// ✅ STORE MÁS BÁSICO POSIBLE - SIN NADA COMPLEJO
export const useBasicStore = create<BasicState>((set) => ({
  message: "Store funcionando ✅",
  count: 0,
  updateMessage: (msg) => set({ message: msg }),
  increment: () => set((state) => ({ count: state.count + 1 }))
}))

// ✅ EXPORT SIMPLE PARA TESTING
export default useBasicStore