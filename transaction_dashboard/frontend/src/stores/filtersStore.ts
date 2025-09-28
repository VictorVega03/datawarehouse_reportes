// frontend/src/stores/filtersStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { DashboardFilters } from '@/types'

// Filters Store State Interface
interface FiltersState {
  // Current filters (being edited)
  filters: DashboardFilters
  
  // Applied filters (actual active filters)
  appliedFilters: DashboardFilters
  
  // UI state
  isFiltersPanelOpen: boolean
  hasUnsavedChanges: boolean
  isApplying: boolean
  
  // Quick filters
  quickFilters: {
    today: boolean
    thisWeek: boolean
    thisMonth: boolean
    vipOnly: boolean
    highValue: boolean
  }
  
  // Actions
  updateFilter: <K extends keyof DashboardFilters>(
    key: K,
    value: DashboardFilters[K]
  ) => void
  updateQuickFilter: (filter: keyof FiltersState['quickFilters'], value: boolean) => void
  applyFilters: () => void
  resetFilters: () => void
  clearAllFilters: () => void
  toggleFiltersPanel: () => void
  setUnsavedChanges: (hasChanges: boolean) => void
  setApplying: (applying: boolean) => void
  
  // Preset filters
  applyPreset: (preset: 'today' | 'week' | 'month' | 'quarter' | 'year') => void
  saveCustomPreset: (name: string) => void
  loadCustomPreset: (name: string) => void
}

// Default filters
const defaultFilters: DashboardFilters = {
  dateRange: {
    start: null,
    end: null,
  },
  paymentMethod: 'all',
  customerType: 'all',
  useCases: [],
}

// Create filters store
export const useFiltersStore = create<FiltersState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        filters: { ...defaultFilters },
        appliedFilters: { ...defaultFilters },
        isFiltersPanelOpen: false,
        hasUnsavedChanges: false,
        isApplying: false,
        quickFilters: {
          today: false,
          thisWeek: false,
          thisMonth: false,
          vipOnly: false,
          highValue: false,
        },

        // Actions
        updateFilter: (key, value) => {
          const state = get()
          const newFilters = { ...state.filters, [key]: value }
          
          // Check if filters changed
          const hasChanges = JSON.stringify(newFilters) !== JSON.stringify(state.appliedFilters)
          
          set(
            {
              filters: newFilters,
              hasUnsavedChanges: hasChanges,
            },
            false,
            'filters/updateFilter'
          )
        },

        updateQuickFilter: (filter, value) => {
          const state = get()
          const newQuickFilters = { ...state.quickFilters, [filter]: value }
          
          // Apply quick filter logic
          let newFilters = { ...state.filters }
          
          if (filter === 'today' && value) {
            const today = new Date()
            newFilters.dateRange = {
              start: new Date(today.setHours(0, 0, 0, 0)),
              end: new Date(today.setHours(23, 59, 59, 999)),
            }
          } else if (filter === 'thisWeek' && value) {
            const today = new Date()
            const firstDay = new Date(today.setDate(today.getDate() - today.getDay()))
            const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 6))
            newFilters.dateRange = {
              start: firstDay,
              end: lastDay,
            }
          } else if (filter === 'thisMonth' && value) {
            const today = new Date()
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
            newFilters.dateRange = {
              start: firstDay,
              end: lastDay,
            }
          } else if (filter === 'vipOnly' && value) {
            newFilters.customerType = 'vip'
          } else if (filter === 'highValue' && value) {
            // Could add amount filter in the future
          }
          
          const hasChanges = JSON.stringify(newFilters) !== JSON.stringify(state.appliedFilters)
          
          set(
            {
              quickFilters: newQuickFilters,
              filters: newFilters,
              hasUnsavedChanges: hasChanges,
            },
            false,
            'filters/updateQuickFilter'
          )
        },

        applyFilters: () => {
          const state = get()
          set(
            {
              appliedFilters: { ...state.filters },
              hasUnsavedChanges: false,
              isApplying: true,
            },
            false,
            'filters/applyFilters'
          )
          
          // Reset applying state after a short delay
          setTimeout(() => {
            set({ isApplying: false }, false, 'filters/applyFiltersComplete')
          }, 500)
        },

        resetFilters: () => {
          set(
            {
              filters: { ...defaultFilters },
              hasUnsavedChanges: false,
              quickFilters: {
                today: false,
                thisWeek: false,
                thisMonth: false,
                vipOnly: false,
                highValue: false,
              },
            },
            false,
            'filters/resetFilters'
          )
        },

        clearAllFilters: () => {
          set(
            {
              filters: { ...defaultFilters },
              appliedFilters: { ...defaultFilters },
              hasUnsavedChanges: false,
              quickFilters: {
                today: false,
                thisWeek: false,
                thisMonth: false,
                vipOnly: false,
                highValue: false,
              },
            },
            false,
            'filters/clearAllFilters'
          )
        },

        toggleFiltersPanel: () => {
          set(
            (state) => ({ isFiltersPanelOpen: !state.isFiltersPanelOpen }),
            false,
            'filters/toggleFiltersPanel'
          )
        },

        setUnsavedChanges: (hasChanges: boolean) => 
          set({ hasUnsavedChanges: hasChanges }, false, 'filters/setUnsavedChanges'),

        setApplying: (applying: boolean) => 
          set({ isApplying: applying }, false, 'filters/setApplying'),

        // Preset filters
        applyPreset: (preset) => {
          const today = new Date()
          let dateRange = { start: null as Date | null, end: null as Date | null }
          
          switch (preset) {
            case 'today':
              dateRange = {
                start: new Date(today.setHours(0, 0, 0, 0)),
                end: new Date(today.setHours(23, 59, 59, 999)),
              }
              break
            case 'week':
              const firstDayWeek = new Date(today.setDate(today.getDate() - today.getDay()))
              const lastDayWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6))
              dateRange = { start: firstDayWeek, end: lastDayWeek }
              break
            case 'month':
              const firstDayMonth = new Date(today.getFullYear(), today.getMonth(), 1)
              const lastDayMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
              dateRange = { start: firstDayMonth, end: lastDayMonth }
              break
            case 'quarter':
              const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1)
              const quarterEnd = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3 + 3, 0)
              dateRange = { start: quarterStart, end: quarterEnd }
              break
            case 'year':
              const yearStart = new Date(today.getFullYear(), 0, 1)
              const yearEnd = new Date(today.getFullYear(), 11, 31)
              dateRange = { start: yearStart, end: yearEnd }
              break
          }
          
          const newFilters = { ...get().filters, dateRange }
          const hasChanges = JSON.stringify(newFilters) !== JSON.stringify(get().appliedFilters)
          
          set(
            {
              filters: newFilters,
              hasUnsavedChanges: hasChanges,
            },
            false,
            'filters/applyPreset'
          )
        },

        saveCustomPreset: (name: string) => {
          // TODO: Implement custom presets save to localStorage
          console.log('Saving custom preset:', name, get().filters)
        },

        loadCustomPreset: (name: string) => {
          // TODO: Implement custom presets load from localStorage
          console.log('Loading custom preset:', name)
        },
      }),
      {
        name: 'filters-store',
        partialize: (state) => ({
          appliedFilters: state.appliedFilters,
          // Don't persist UI state
        }),
      }
    ),
    {
      name: 'filters-store',
    }
  )
)

// Selectors
export const useCurrentFilters = () => useFiltersStore((state) => state.filters)
export const useAppliedFilters = () => useFiltersStore((state) => state.appliedFilters)
export const useFiltersPanel = () => useFiltersStore((state) => state.isFiltersPanelOpen)
export const useFiltersUnsaved = () => useFiltersStore((state) => state.hasUnsavedChanges)
export const useQuickFilters = () => useFiltersStore((state) => state.quickFilters)

// Action selectors
export const useFiltersActions = () => useFiltersStore((state) => ({
  updateFilter: state.updateFilter,
  updateQuickFilter: state.updateQuickFilter,
  applyFilters: state.applyFilters,
  resetFilters: state.resetFilters,
  clearAllFilters: state.clearAllFilters,
  toggleFiltersPanel: state.toggleFiltersPanel,
  setUnsavedChanges: state.setUnsavedChanges,
  applyPreset: state.applyPreset,
  saveCustomPreset: state.saveCustomPreset,
  loadCustomPreset: state.loadCustomPreset,
}))

// Computed selectors
export const useActiveFiltersCount = () => useFiltersStore((state) => {
  const { appliedFilters } = state
  let count = 0
  
  if (appliedFilters.dateRange.start || appliedFilters.dateRange.end) count++
  if (appliedFilters.paymentMethod !== 'all') count++
  if (appliedFilters.customerType !== 'all') count++
  if (appliedFilters.useCases.length > 0) count++
  
  return count
})

export const useFiltersDescription = () => useFiltersStore((state) => {
  const { appliedFilters } = state
  const descriptions: string[] = []
  
  if (appliedFilters.dateRange.start) {
    descriptions.push(`From ${appliedFilters.dateRange.start.toLocaleDateString()}`)
  }
  if (appliedFilters.dateRange.end) {
    descriptions.push(`To ${appliedFilters.dateRange.end.toLocaleDateString()}`)
  }
  if (appliedFilters.paymentMethod !== 'all') {
    descriptions.push(`Payment: ${appliedFilters.paymentMethod}`)
  }
  if (appliedFilters.customerType !== 'all') {
    descriptions.push(`Customer: ${appliedFilters.customerType}`)
  }
  if (appliedFilters.useCases.length > 0) {
    descriptions.push(`Use cases: ${appliedFilters.useCases.length}`)
  }
  
  return descriptions.length > 0 ? descriptions.join(', ') : 'No filters applied'
})