// frontend/src/stores/filtersStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Tipos definidos directamente aquí
interface DashboardDateFilter {
  startDate: Date
  endDate: Date
  preset: 'today' | 'yesterday' | 'week' | 'month' | 'quarter' | 'year' | 'custom'
}

interface DashboardFilters {
  dateRange: DashboardDateFilter
  customers?: string[]
  paymentMethods?: string[]
  products?: string[]
  categories?: string[]
  regions?: string[]
}

interface FiltersStore {
  dateRange: DashboardDateFilter
  customers: string[]
  paymentMethods: string[]
  products: string[]
  categories: string[]
  regions: string[]
  searchTerm: string
  
  setDateRange: (dateRange: DashboardDateFilter) => void
  setDatePreset: (preset: DashboardDateFilter['preset']) => void
  setCustomDateRange: (startDate: Date, endDate: Date) => void
  
  setCustomers: (customers: string[]) => void
  addCustomer: (customer: string) => void
  removeCustomer: (customer: string) => void
  
  setPaymentMethods: (methods: string[]) => void
  addPaymentMethod: (method: string) => void
  removePaymentMethod: (method: string) => void
  
  setProducts: (products: string[]) => void
  addProduct: (product: string) => void
  removeProduct: (product: string) => void
  
  setCategories: (categories: string[]) => void
  addCategory: (category: string) => void
  removeCategory: (category: string) => void
  
  setRegions: (regions: string[]) => void
  addRegion: (region: string) => void
  removeRegion: (region: string) => void
  
  setSearchTerm: (term: string) => void
  clearSearch: () => void
  
  clearAllFilters: () => void
  hasActiveFilters: () => boolean
  getActiveFiltersCount: () => number
  exportFilters: () => DashboardFilters
}

const getDateRangeFromPreset = (preset: DashboardDateFilter['preset']): { startDate: Date, endDate: Date } => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  switch (preset) {
    case 'today':
      return { startDate: today, endDate: now }
    case 'yesterday': {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      return { startDate: yesterday, endDate: today }
    }
    case 'week': {
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      return { startDate: weekAgo, endDate: now }
    }
    case 'month': {
      const monthAgo = new Date(today)
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return { startDate: monthAgo, endDate: now }
    }
    case 'quarter': {
      const quarterAgo = new Date(today)
      quarterAgo.setMonth(quarterAgo.getMonth() - 3)
      return { startDate: quarterAgo, endDate: now }
    }
    case 'year': {
      const yearAgo = new Date(today)
      yearAgo.setFullYear(yearAgo.getFullYear() - 1)
      return { startDate: yearAgo, endDate: now }
    }
    default:
      return { startDate: today, endDate: now }
  }
}

const initialDateRange: DashboardDateFilter = {
  ...getDateRangeFromPreset('month'),
  preset: 'month'
}

const initialState = {
  dateRange: initialDateRange,
  customers: [],
  paymentMethods: [],
  products: [],
  categories: [],
  regions: [],
  searchTerm: '',
}

export const useFiltersStore = create<FiltersStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        setDateRange: (dateRange) => set({ dateRange }),
        
        setDatePreset: (preset) => 
          set({ dateRange: { ...getDateRangeFromPreset(preset), preset } }),
        
        setCustomDateRange: (startDate, endDate) => 
          set({ dateRange: { startDate, endDate, preset: 'custom' } }),
        
        setCustomers: (customers) => set({ customers }),
        addCustomer: (customer) => 
          set((state) => ({ customers: [...state.customers, customer] })),
        removeCustomer: (customer) => 
          set((state) => ({ customers: state.customers.filter(c => c !== customer) })),
        
        setPaymentMethods: (methods) => set({ paymentMethods: methods }),
        addPaymentMethod: (method) => 
          set((state) => ({ paymentMethods: [...state.paymentMethods, method] })),
        removePaymentMethod: (method) => 
          set((state) => ({ paymentMethods: state.paymentMethods.filter(m => m !== method) })),
        
        setProducts: (products) => set({ products }),
        addProduct: (product) => 
          set((state) => ({ products: [...state.products, product] })),
        removeProduct: (product) => 
          set((state) => ({ products: state.products.filter(p => p !== product) })),
        
        setCategories: (categories) => set({ categories }),
        addCategory: (category) => 
          set((state) => ({ categories: [...state.categories, category] })),
        removeCategory: (category) => 
          set((state) => ({ categories: state.categories.filter(c => c !== category) })),
        
        setRegions: (regions) => set({ regions }),
        addRegion: (region) => 
          set((state) => ({ regions: [...state.regions, region] })),
        removeRegion: (region) => 
          set((state) => ({ regions: state.regions.filter(r => r !== region) })),
        
        setSearchTerm: (term) => set({ searchTerm: term }),
        clearSearch: () => set({ searchTerm: '' }),
        
        clearAllFilters: () => 
          set({ ...initialState, dateRange: get().dateRange }),
        
        hasActiveFilters: () => {
          const state = get()
          return (
            state.customers.length > 0 ||
            state.paymentMethods.length > 0 ||
            state.products.length > 0 ||
            state.categories.length > 0 ||
            state.regions.length > 0 ||
            state.searchTerm.length > 0
          )
        },
        
        getActiveFiltersCount: () => {
          const state = get()
          return (
            state.customers.length +
            state.paymentMethods.length +
            state.products.length +
            state.categories.length +
            state.regions.length +
            (state.searchTerm ? 1 : 0)
          )
        },
        
        exportFilters: (): DashboardFilters => {
          const state = get()
          return {
            dateRange: state.dateRange,
            customers: state.customers,
            paymentMethods: state.paymentMethods,
            products: state.products,
            categories: state.categories,
            regions: state.regions,
          }
        },
      }),
      {
        name: 'filters-storage',
        partialize: (state) => ({
          dateRange: state.dateRange,
          customers: state.customers,
          paymentMethods: state.paymentMethods,
          products: state.products,
          categories: state.categories,
          regions: state.regions,
        }),
      }
    ),
    { name: 'FiltersStore' }
  )
)