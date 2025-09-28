// frontend/src/stores/settingsStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { UserPreferences } from '@/types'

// Settings Store State Interface
interface SettingsState {
  // User preferences
  preferences: UserPreferences
  
  // App settings
  autoRefresh: boolean
  refreshInterval: number // in seconds
  defaultPageSize: number
  
  // Export settings
  exportFormat: 'csv' | 'xlsx' | 'pdf'
  includeCharts: boolean
  
  // Chart settings
  chartAnimationDuration: number
  showDataLabels: boolean
  defaultChartHeight: number
  
  // Performance settings
  enableVirtualization: boolean
  maxTableRows: number
  
  // Notification settings
  enableNotifications: boolean
  notificationSound: boolean
  
  // Actions
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void
  setAutoRefresh: (enabled: boolean) => void
  setRefreshInterval: (interval: number) => void
  setDefaultPageSize: (pageSize: number) => void
  setExportFormat: (format: 'csv' | 'xlsx' | 'pdf') => void
  setIncludeCharts: (include: boolean) => void
  updateChartSettings: (settings: Partial<{
    animationDuration: number
    showDataLabels: boolean
    defaultHeight: number
  }>) => void
  updatePerformanceSettings: (settings: Partial<{
    enableVirtualization: boolean
    maxTableRows: number
  }>) => void
  updateNotificationSettings: (settings: Partial<{
    enableNotifications: boolean
    notificationSound: boolean
  }>) => void
  resetToDefaults: () => void
  exportSettings: () => string
  importSettings: (settings: string) => boolean
}

// Default preferences
const defaultPreferences: UserPreferences = {
  language: 'es',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  currency: 'USD',
  numberFormat: 'en-US',
  defaultDashboard: 'overview',
  favoriteUseCases: [1, 3, 4], // Horarios, Precios, Clientes
}

// Default settings
const defaultSettings = {
  preferences: defaultPreferences,
  autoRefresh: true,
  refreshInterval: 300, // 5 minutes
  defaultPageSize: 25,
  exportFormat: 'xlsx' as const,
  includeCharts: true,
  chartAnimationDuration: 300,
  showDataLabels: true,
  defaultChartHeight: 400,
  enableVirtualization: true,
  maxTableRows: 1000,
  enableNotifications: true,
  notificationSound: false,
}

// Create settings store
export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set, get) => ({
        ...defaultSettings,

        // Actions
        updatePreference: (key, value) => 
          set(
            (state) => ({
              preferences: { ...state.preferences, [key]: value }
            }),
            false,
            'settings/updatePreference'
          ),

        setAutoRefresh: (autoRefresh: boolean) => 
          set({ autoRefresh }, false, 'settings/setAutoRefresh'),

        setRefreshInterval: (refreshInterval: number) => {
          // Validate interval (min 30 seconds, max 1 hour)
          const validInterval = Math.max(30, Math.min(3600, refreshInterval))
          set({ refreshInterval: validInterval }, false, 'settings/setRefreshInterval')
        },

        setDefaultPageSize: (defaultPageSize: number) => {
          // Validate page size (min 10, max 100)
          const validPageSize = Math.max(10, Math.min(100, defaultPageSize))
          set({ defaultPageSize: validPageSize }, false, 'settings/setDefaultPageSize')
        },

        setExportFormat: (exportFormat: 'csv' | 'xlsx' | 'pdf') => 
          set({ exportFormat }, false, 'settings/setExportFormat'),

        setIncludeCharts: (includeCharts: boolean) => 
          set({ includeCharts }, false, 'settings/setIncludeCharts'),

        updateChartSettings: (settings) => {
          const updates: Partial<SettingsState> = {}
          
          if (settings.animationDuration !== undefined) {
            updates.chartAnimationDuration = Math.max(0, Math.min(2000, settings.animationDuration))
          }
          if (settings.showDataLabels !== undefined) {
            updates.showDataLabels = settings.showDataLabels
          }
          if (settings.defaultHeight !== undefined) {
            updates.defaultChartHeight = Math.max(200, Math.min(800, settings.defaultHeight))
          }
          
          set(updates, false, 'settings/updateChartSettings')
        },

        updatePerformanceSettings: (settings) => {
          const updates: Partial<SettingsState> = {}
          
          if (settings.enableVirtualization !== undefined) {
            updates.enableVirtualization = settings.enableVirtualization
          }
          if (settings.maxTableRows !== undefined) {
            updates.maxTableRows = Math.max(100, Math.min(10000, settings.maxTableRows))
          }
          
          set(updates, false, 'settings/updatePerformanceSettings')
        },

        updateNotificationSettings: (settings) => {
          const updates: Partial<SettingsState> = {}
          
          if (settings.enableNotifications !== undefined) {
            updates.enableNotifications = settings.enableNotifications
          }
          if (settings.notificationSound !== undefined) {
            updates.notificationSound = settings.notificationSound
          }
          
          set(updates, false, 'settings/updateNotificationSettings')
        },

        resetToDefaults: () => 
          set(
            { ...defaultSettings },
            false,
            'settings/resetToDefaults'
          ),

        exportSettings: () => {
          const state = get()
          return JSON.stringify(state, null, 2)
        },

        importSettings: (settingsJson: string) => {
          try {
            const importedSettings = JSON.parse(settingsJson)
            
            // Validate imported settings
            if (typeof importedSettings === 'object' && importedSettings !== null) {
              set(
                { ...defaultSettings, ...importedSettings },
                false,
                'settings/importSettings'
              )
              return true
            }
            return false
          } catch (error) {
            console.error('Failed to import settings:', error)
            return false
          }
        },
      }),
      {
        name: 'settings-store',
        // Persist all settings
      }
    ),
    {
      name: 'settings-store',
    }
  )
)

// Selectors
export const useUserPreferences = () => useSettingsStore((state) => state.preferences)
export const useAutoRefresh = () => useSettingsStore((state) => ({
  enabled: state.autoRefresh,
  interval: state.refreshInterval,
}))

export const useExportSettings = () => useSettingsStore((state) => ({
  format: state.exportFormat,
  includeCharts: state.includeCharts,
}))

export const useChartSettings = () => useSettingsStore((state) => ({
  animationDuration: state.chartAnimationDuration,
  showDataLabels: state.showDataLabels,
  defaultHeight: state.defaultChartHeight,
}))

export const usePerformanceSettings = () => useSettingsStore((state) => ({
  enableVirtualization: state.enableVirtualization,
  maxTableRows: state.maxTableRows,
  defaultPageSize: state.defaultPageSize,
}))

export const useNotificationSettings = () => useSettingsStore((state) => ({
  enabled: state.enableNotifications,
  sound: state.notificationSound,
}))

// Action selectors
export const useSettingsActions = () => useSettingsStore((state) => ({
  updatePreference: state.updatePreference,
  setAutoRefresh: state.setAutoRefresh,
  setRefreshInterval: state.setRefreshInterval,
  setDefaultPageSize: state.setDefaultPageSize,
  setExportFormat: state.setExportFormat,
  setIncludeCharts: state.setIncludeCharts,
  updateChartSettings: state.updateChartSettings,
  updatePerformanceSettings: state.updatePerformanceSettings,
  updateNotificationSettings: state.updateNotificationSettings,
  resetToDefaults: state.resetToDefaults,
  exportSettings: state.exportSettings,
  importSettings: state.importSettings,
}))

// Computed selectors
export const useFormattedCurrency = () => useSettingsStore((state) => {
  const { currency, numberFormat } = state.preferences
  
  return (amount: number) => {
    return new Intl.NumberFormat(numberFormat, {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }
})

export const useFormattedNumber = () => useSettingsStore((state) => {
  const { numberFormat } = state.preferences
  
  return (number: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(numberFormat, options).format(number)
  }
})

export const useFormattedDate = () => useSettingsStore((state) => {
  const { timeFormat } = state.preferences
  
  return (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    // Convert dateFormat to Intl options
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }
    
    if (timeFormat === '12h') {
      dateOptions.hour = 'numeric'
      dateOptions.minute = '2-digit'
      dateOptions.hour12 = true
    } else {
      dateOptions.hour = '2-digit'
      dateOptions.minute = '2-digit'
      dateOptions.hour12 = false
    }
    
    return dateObj.toLocaleString('en-US', dateOptions)
  }
})

export const useFavoriteUseCases = () => useSettingsStore((state) => 
  state.preferences.favoriteUseCases
)

export const useIsUseCaseFavorite = (useCaseId: number) => useSettingsStore((state) => 
  state.preferences.favoriteUseCases.includes(useCaseId)
)