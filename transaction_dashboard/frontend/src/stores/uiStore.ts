// frontend/src/stores/uiStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'auto'
type Language = 'es' | 'en'
type ViewMode = 'summary' | 'detailed' | 'analysis'
type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
}

interface UIStore {
  // Estado de UI
  theme: Theme
  language: Language
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  viewMode: ViewMode
  notifications: Notification[]
  modals: Record<string, boolean>
  loading: Record<string, boolean>
  
  // Acciones para tema
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  
  // Acciones para idioma
  setLanguage: (language: Language) => void
  
  // Acciones para sidebar
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebarCollapsed: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  
  // Acciones para view mode
  setViewMode: (mode: ViewMode) => void
  
  // Acciones para notificaciones
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  
  // Acciones para modales
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  toggleModal: (modalId: string) => void
  isModalOpen: (modalId: string) => boolean
  
  // Acciones para loading states
  setLoading: (key: string, loading: boolean) => void
  isLoading: (key: string) => boolean
  clearLoading: () => void
  
  // Reset
  reset: () => void
}

const initialState = {
  theme: 'light' as Theme,
  language: 'es' as Language,
  sidebarOpen: true,
  sidebarCollapsed: false,
  viewMode: 'summary' as ViewMode,
  notifications: [],
  modals: {},
  loading: {},
}

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Acciones para tema
        setTheme: (theme) => 
          set({ theme }, false, 'setTheme'),
        
        toggleTheme: () => 
          set((state) => ({ 
            theme: state.theme === 'light' ? 'dark' : 'light' 
          }), false, 'toggleTheme'),
        
        // Acciones para idioma
        setLanguage: (language) => 
          set({ language }, false, 'setLanguage'),
        
        // Acciones para sidebar
        toggleSidebar: () => 
          set((state) => ({ 
            sidebarOpen: !state.sidebarOpen 
          }), false, 'toggleSidebar'),
        
        setSidebarOpen: (open) => 
          set({ sidebarOpen: open }, false, 'setSidebarOpen'),
        
        toggleSidebarCollapsed: () => 
          set((state) => ({ 
            sidebarCollapsed: !state.sidebarCollapsed 
          }), false, 'toggleSidebarCollapsed'),
        
        setSidebarCollapsed: (collapsed) => 
          set({ sidebarCollapsed: collapsed }, false, 'setSidebarCollapsed'),
        
        // Acciones para view mode
        setViewMode: (mode) => 
          set({ viewMode: mode }, false, 'setViewMode'),
        
        // Acciones para notificaciones
        addNotification: (notification) => {
          const id = `notification-${Date.now()}-${Math.random()}`
          const newNotification: Notification = {
            ...notification,
            id,
            duration: notification.duration || 5000,
          }
          
          set((state) => ({
            notifications: [...state.notifications, newNotification]
          }), false, 'addNotification')
          
          // Auto-remove después de duration
          if (newNotification.duration && newNotification.duration > 0) {
            setTimeout(() => {
              get().removeNotification(id)
            }, newNotification.duration)
          }
        },
        
        removeNotification: (id) => 
          set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id)
          }), false, 'removeNotification'),
        
        clearNotifications: () => 
          set({ notifications: [] }, false, 'clearNotifications'),
        
        // Acciones para modales
        openModal: (modalId) => 
          set((state) => ({
            modals: { ...state.modals, [modalId]: true }
          }), false, 'openModal'),
        
        closeModal: (modalId) => 
          set((state) => ({
            modals: { ...state.modals, [modalId]: false }
          }), false, 'closeModal'),
        
        toggleModal: (modalId) => 
          set((state) => ({
            modals: { 
              ...state.modals, 
              [modalId]: !state.modals[modalId] 
            }
          }), false, 'toggleModal'),
        
        isModalOpen: (modalId) => 
          get().modals[modalId] === true,
        
        // Acciones para loading states
        setLoading: (key, loading) => 
          set((state) => ({
            loading: { ...state.loading, [key]: loading }
          }), false, 'setLoading'),
        
        isLoading: (key) => 
          get().loading[key] === true,
        
        clearLoading: () => 
          set({ loading: {} }, false, 'clearLoading'),
        
        // Reset
        reset: () => 
          set(initialState, false, 'reset'),
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
          sidebarCollapsed: state.sidebarCollapsed,
          viewMode: state.viewMode,
        }),
      }
    ),
    { name: 'UIStore' }
  )
)