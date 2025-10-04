// frontend/src/components/layout/Sidebar.tsx

import { useState, createContext, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'

// Contexto para compartir el estado del sidebar
interface SidebarContextType {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const SidebarContext = createContext<SidebarContextType>({
  isOpen: true,
  setIsOpen: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

export function Sidebar() {
  const { isOpen, setIsOpen } = useSidebar()
  const location = useLocation()

  const menuItems = [
    {
      id: 'home',
      name: 'Dashboard',
      icon: '📊',
      enabled: true,
      path: '/'
    },
    {
      id: 'caso1',
      name: 'Patrones Horarios',
      icon: '⏰',
      enabled: true,
      status: 'completado',
      path: '/casos/horarios'
    },
    {
      id: 'caso2',
      name: 'Control de Caducidad',
      icon: '📦',
      enabled: true,
      status: 'completado',
      path: '/casos/caducidad'
    },
    {
      id: 'caso3',
      name: 'Gestión de Precios',
      icon: '💰',
      enabled: false,
      status: 'próximamente',
      path: '/casos/precios'
    },
    {
      id: 'caso4',
      name: 'Identificación de Clientes',
      icon: '👥',
      enabled: false,
      status: 'próximamente',
      path: '/casos/clientes'
    },
    {
      id: 'caso5',
      name: 'Seguimiento de Inventario',
      icon: '📋',
      enabled: false,
      status: 'próximamente',
      path: '/casos/inventario'
    },
    {
      id: 'caso6',
      name: 'Métodos de Pago',
      icon: '💳',
      enabled: false,
      status: 'próximamente',
      path: '/casos/pagos'
    },
    {
      id: 'caso7',
      name: 'Control de Devoluciones',
      icon: '↩️',
      enabled: false,
      status: 'próximamente',
      path: '/casos/devoluciones'
    }
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <aside
      className={`
        bg-white border-r border-gray-200 shadow-lg
        transition-all duration-300 ease-in-out
        flex-shrink-0 h-screen overflow-hidden
        ${isOpen ? 'w-64' : 'w-0'}
      `}
    >
      <div className="h-full flex flex-col w-64">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📈</span>
            <h2 className="text-lg font-bold text-white whitespace-nowrap">Analytics</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-blue-500 transition-colors text-white flex-shrink-0"
            aria-label="Cerrar menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const active = isActive(item.path)
              
              return (
                <li key={item.id}>
                  {item.enabled ? (
                    <Link
                      to={item.path}
                      className={`
                        w-full flex items-center justify-between p-3 rounded-lg transition-all
                        ${active
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'hover:bg-gray-100 text-gray-700'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <span className="text-xl flex-shrink-0">{item.icon}</span>
                        <span className="font-medium text-sm whitespace-nowrap">{item.name}</span>
                      </div>

                      {item.status && (
                        <span
                          className={`
                            text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 ml-2
                            ${item.status === 'completado'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                            }
                            ${active ? 'bg-white bg-opacity-30 text-white' : ''}
                          `}
                        >
                          {item.status === 'completado' ? '✓' : '⏳'}
                        </span>
                      )}
                    </Link>
                  ) : (
                    <div
                      className="w-full flex items-center justify-between p-3 rounded-lg opacity-50 cursor-not-allowed text-gray-400"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <span className="text-xl flex-shrink-0">{item.icon}</span>
                        <span className="font-medium text-sm whitespace-nowrap">{item.name}</span>
                      </div>

                      {item.status && (
                        <span className="text-xs px-2 py-1 rounded-full font-semibold bg-yellow-100 text-yellow-800 flex-shrink-0 ml-2">
                          ⏳
                        </span>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs font-semibold text-blue-900 mb-1">
              Progreso General
            </p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-blue-700 whitespace-nowrap">
                2 de 7 casos completados
              </span>
              <span className="text-xs font-bold text-blue-900">29%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: '29%' }} 
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}