// frontend/src/stores/uiStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Notification, Breadcrumb } from '@/types'

// UI Store State Interface
interface UIState {
  // Layout
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  
  // Theme
  theme: 'light' | 'dark' | 'system'
  
  // Modals
  modals: {
    [key: string]: boolean
  }
  
  // Notifications
  notifications: Notification[]
  
  // Loading states
  globalLoading: boolean
  pageLoading: boolean
  
  // Current page context
  currentPage: string
  breadcrumbs: Breadcrumb[]
  pageTitle: string
  
  // Mobile responsive
  isMobile: boolean
  
  // Chart preferences
  chartTheme: 'light' | 'dark'
  animationsEnabled: boolean
  
  // Actions
  toggleSidebar: () => void
  collapseSidebar: (collapsed: boolean) => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  closeAllModals: () => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  setGlobalLoading: (loading: boolean) => void
  setPageLoading: (loading: boolean) => void
  setCurrentPage: (page: string, title?: string) => void
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void
  setIsMobile: (isMobile: boolean) => void
  setChartTheme: (theme: 'light' | 'dark') => void
  toggleAnimations: () => void
}

// Generate unique ID for notifications
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Create UI store
export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        sidebarOpen: true,
        sidebarCollapsed: false,
        theme: 'light',
        modals: {},
        notifications: [],
        globalLoading: false,
        pageLoading: false,
        currentPage: 'dashboard',
        breadcrumbs: [],
        pageTitle: 'Transaction Analytics Dashboard',
        isMobile: false,
        chartTheme: 'light',
        animationsEnabled: true,

        // Layout actions
        toggleSidebar: () => 
          set(
            (state) => ({ sidebarOpen: !state.sidebarOpen }),
            false,
            'ui/toggleSidebar'
          ),

        collapseSidebar: (collapsed: boolean) => 
          set({ sidebarCollapsed: collapsed }, false, 'ui/collapseSidebar'),

        setSidebarOpen: (open: boolean) => 
          set({ sidebarOpen: open }, false, 'ui/setSidebarOpen'),

        // Theme actions
        setTheme: (theme: 'light' | 'dark' | 'system') => {
          set({ theme }, false, 'ui/setTheme')
          
          // Apply theme to document
          const root = document.documentElement
          if (theme === 'dark') {
            root.classList.add('dark')
          } else if (theme === 'light') {
            root.classList.remove('dark')
          } else {
            // System theme
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            if (prefersDark) {
              root.classList.add('dark')
            } else {
              root.classList.remove('dark')
            }
          }
        },

        // Modal actions
        openModal: (modalId: string) => 
          set(
            (state) => ({
              modals: { ...state.modals, [modalId]: true }
            }),
            false,
            'ui/openModal'
          ),

        closeModal: (modalId: string) => 
          set(
            (state) => ({
              modals: { ...state.modals, [modalId]: false }
            }),
            false,
            'ui/closeModal'
          ),

        closeAllModals: () => 
          set({ modals: {} }, false, 'ui/closeAllModals'),

        // Notification actions
        addNotification: (notification) => {
          const newNotification: Notification = {
            ...notification,
            id: generateId(),
            timestamp: new Date().toISOString(),
          }
          
          set(
            (state) => ({
              notifications: [newNotification, ...state.notifications]
            }),
            false,
            'ui/addNotification'
          )
          
          // Auto-remove notification after duration
          if (notification.duration && notification.duration > 0) {
            setTimeout(() => {
              get().removeNotification(newNotification.id)
            }, notification.duration)
          }
        },

        removeNotification: (id: string) => 
          set(
            (state) => ({
              notifications: state.notifications.filter(n => n.id !== id)
            }),
            false,
            'ui/removeNotification'
          ),

        clearNotifications: () => 
          set({ notifications: [] }, false, 'ui/clearNotifications'),

        // Loading actions
        setGlobalLoading: (globalLoading: boolean) => 
          set({ globalLoading }, false, 'ui/setGlobalLoading'),

        setPageLoading: (pageLoading: boolean) => 
          set({ pageLoading }, false, 'ui/setPageLoading'),

        // Page context actions
        setCurrentPage: (currentPage: string, title?: string) => 
          set(
            { 
              currentPage, 
              pageTitle: title || 'Transaction Analytics Dashboard' 
            }, 
            false, 
            'ui/setCurrentPage'
          ),

        setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => 
          set({ breadcrumbs }, false, 'ui/setBreadcrumbs'),

        // Responsive actions
        setIsMobile: (isMobile: boolean) => 
          set({ isMobile }, false, 'ui/setIsMobile'),

        // Chart preferences
        setChartTheme: (chartTheme: 'light' | 'dark') => 
          set({ chartTheme }, false, 'ui/setChartTheme'),

        toggleAnimations: () => 
          set(
            (state) => ({ animationsEnabled: !state.animationsEnabled }),
            false,
            'ui/toggleAnimations'
          ),
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({
          // Persist user preferences
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
          chartTheme: state.chartTheme,
          animationsEnabled: state.animationsEnabled,
          // Don't persist temporary UI state
        }),
      }
    ),
    {
      name: 'ui-store',
    }
  )
)

// Selectors for better performance
export const useSidebar = () => useUIStore((state) => ({
  isOpen: state.sidebarOpen,
  isCollapsed: state.sidebarCollapsed,
}))

export const useTheme = () => useUIStore((state) => state.theme)
export const useNotifications = () => useUIStore((state) => state.notifications)
export const useModals = () => useUIStore((state) => state.modals)
export const useLoadingStates = () => useUIStore((state) => ({
  global: state.globalLoading,
  page: state.pageLoading,
}))

export const usePageContext = () => useUIStore((state) => ({
  currentPage: state.currentPage,
  breadcrumbs: state.breadcrumbs,
  pageTitle: state.pageTitle,
}))

export const useResponsive = () => useUIStore((state) => ({
  isMobile: state.isMobile,
}))

export const useChartPreferences = () => useUIStore((state) => ({
  theme: state.chartTheme,
  animationsEnabled: state.animationsEnabled,
}))

// Action selectors
export const useUIActions = () => useUIStore((state) => ({
  toggleSidebar: state.toggleSidebar,
  collapseSidebar: state.collapseSidebar,
  setSidebarOpen: state.setSidebarOpen,
  setTheme: state.setTheme,
  openModal: state.openModal,
  closeModal: state.closeModal,
  closeAllModals: state.closeAllModals,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  clearNotifications: state.clearNotifications,
  setGlobalLoading: state.setGlobalLoading,
  setPageLoading: state.setPageLoading,
  setCurrentPage: state.setCurrentPage,
  setBreadcrumbs: state.setBreadcrumbs,
  setIsMobile: state.setIsMobile,
  setChartTheme: state.setChartTheme,
  toggleAnimations: state.toggleAnimations,
}))

// Computed selectors
export const useModalState = (modalId: string) => useUIStore((state) => state.modals[modalId] || false)

export const useUnreadNotificationsCount = () => useUIStore((state) => 
  state.notifications.filter(n => n.type === 'error' || n.type === 'warning').length
)

export const useIsModalOpen = () => useUIStore((state) => 
  Object.values(state.modals).some(isOpen => isOpen)
)

// Utility actions for common UI patterns
export const useNotificationHelpers = () => {
  const addNotification = useUIStore((state) => state.addNotification)
  
  return {
    notifySuccess: (title: string, message: string, duration = 5000) => 
      addNotification({ type: 'success', title, message, duration }),
      
    notifyError: (title: string, message: string, duration = 0) => 
      addNotification({ type: 'error', title, message, duration }),
      
    notifyWarning: (title: string, message: string, duration = 8000) => 
      addNotification({ type: 'warning', title, message, duration }),
      
    notifyInfo: (title: string, message: string, duration = 5000) => 
      addNotification({ type: 'info', title, message, duration }),
  }
}