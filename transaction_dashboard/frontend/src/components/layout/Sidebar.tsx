// frontend/src/components/layout/Sidebar.tsx

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export function Sidebar() {
  // Estado local - más simple, no requiere Context
  const [isExpanded, setIsExpanded] = useState(true)
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
      enabled: true,
      status: 'próximamente',
      path: '/casos/precios'
    },
    {
      id: 'caso4',
      name: 'Identificación de Clientes',
      icon: '👥',
      enabled: true,
      status: 'próximamente',
      path: '/casos/clientes'
    },
    {
      id: 'caso5',
      name: 'Seguimiento de Inventario',
      icon: '📋',
      enabled: true,
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
        ${isExpanded ? 'w-64' : 'w-20'}
      `}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className={`
          flex items-center p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600
          ${isExpanded ? 'justify-between' : 'justify-center'}
        `}>
          {isExpanded && (
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📈</span>
              <h2 className="text-lg font-bold text-white whitespace-nowrap">Analytics</h2>
            </div>
          )}
          
          {!isExpanded && (
            <span className="text-2xl">📈</span>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-blue-400 transition-colors text-white"
            aria-label={isExpanded ? "Contraer menú" : "Expandir menú"}
            title={isExpanded ? "Contraer menú" : "Expandir menú"}
          >
            <svg 
              className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
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
                        w-full flex items-center rounded-lg transition-all group
                        ${isExpanded ? 'justify-between p-3' : 'justify-center p-3'}
                        ${active
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'hover:bg-gray-100 text-gray-700'
                        }
                      `}
                      title={!isExpanded ? item.name : undefined}
                    >
                      <div className={`flex items-center ${isExpanded ? 'space-x-3' : ''}`}>
                        <span className="text-xl flex-shrink-0">{item.icon}</span>
                        {isExpanded && (
                          <span className="font-medium text-sm whitespace-nowrap">{item.name}</span>
                        )}
                      </div>

                      {isExpanded && item.status && (
                        <span
                          className={`
                            text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0
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

                      {!isExpanded && item.status === 'completado' && (
                        <span className="absolute right-2 top-2">
                          <span className="flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                        </span>
                      )}
                    </Link>
                  ) : (
                    <div
                      className={`
                        w-full flex items-center rounded-lg opacity-50 cursor-not-allowed text-gray-400
                        ${isExpanded ? 'justify-between p-3' : 'justify-center p-3'}
                      `}
                      title={!isExpanded ? `${item.name} (Próximamente)` : undefined}
                    >
                      <div className={`flex items-center ${isExpanded ? 'space-x-3' : ''}`}>
                        <span className="text-xl flex-shrink-0">{item.icon}</span>
                        {isExpanded && (
                          <span className="font-medium text-sm whitespace-nowrap">{item.name}</span>
                        )}
                      </div>

                      {isExpanded && item.status && (
                        <span className="text-xs px-2 py-1 rounded-full font-semibold bg-yellow-100 text-yellow-800 flex-shrink-0">
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
        {isExpanded && (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-blue-100 p-3 rounded-lg">
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
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: '29%' }} 
                />
              </div>
            </div>
          </div>
        )}

        {!isExpanded && (
          <div className="p-4 border-t border-gray-200 flex justify-center">
            <div className="relative">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                29%
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}