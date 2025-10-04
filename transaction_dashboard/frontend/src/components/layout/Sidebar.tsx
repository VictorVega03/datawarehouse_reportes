// frontend/src/components/layout/Sidebar.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../ui/Badge'

interface SidebarProps {
  isOpen: boolean
  onClose?: () => void
  currentPath: string
}

interface MenuItem {
  id: string
  title: string
  icon: string
  path: string
  badge?: string
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  roi?: string
  enabled: boolean
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard Principal',
    icon: '📊',
    path: '/',
    badge: 'Activo',
    badgeVariant: 'success',
    enabled: true
  },
  {
    id: 'horarios',
    title: 'Patrones Horarios',
    icon: '🕐',
    path: '/casos/horarios',
    roi: '$6.7M',
    badgeVariant: 'primary',
    enabled: true
  },
  {
    id: 'caducidad',
    title: 'Control Caducidad',
    icon: '📅',
    path: '/casos/caducidad',
    roi: '$3.8M',
    badge: 'Próximamente',
    badgeVariant: 'warning',
    enabled: true
  },
  {
    id: 'precios',
    title: 'Gestión Precios',
    icon: '💰',
    path: '/casos/precios',
    roi: '$150M',
    badge: 'Próximamente',
    badgeVariant: 'warning',
    enabled: false
  },
  {
    id: 'clientes',
    title: 'Identificación Clientes',
    icon: '👥',
    path: '/casos/clientes',
    roi: '$1.35B',
    badge: 'Próximamente',
    badgeVariant: 'warning',
    enabled: false
  },
  {
    id: 'inventario',
    title: 'Seguimiento Inventario',
    icon: '📦',
    path: '/casos/inventario',
    roi: '$56.3M',
    badge: 'Próximamente',
    badgeVariant: 'warning',
    enabled: false
  },
  {
    id: 'pagos',
    title: 'Métodos de Pago',
    icon: '💳',
    path: '/casos/pagos',
    badge: 'Próximamente',
    badgeVariant: 'warning',
    enabled: false
  },
  {
    id: 'devoluciones',
    title: 'Control Devoluciones',
    icon: '↩️',
    path: '/casos/devoluciones',
    roi: '$1.13B',
    badge: 'Próximamente',
    badgeVariant: 'warning',
    enabled: false
  }
]

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose,
  currentPath
}) => {
  const navigate = useNavigate()

  const handleItemClick = (item: MenuItem) => {
    if (!item.enabled) return

    navigate(item.path)
    
    // En mobile, cerrar sidebar al seleccionar
    if (window.innerWidth < 1024 && onClose) {
      onClose()
    }
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/'
    }
    return currentPath.startsWith(path)
  }

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🚀</div>
            <div>
              <h2 className="font-bold text-gray-900">Menú</h2>
              <p className="text-xs text-gray-500">Casos de Uso</p>
            </div>
          </div>
          
          {/* Close button (solo mobile) */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 overflow-y-auto h-[calc(100vh-88px)]">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                disabled={!item.enabled}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${isActive(item.path)
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : item.enabled
                    ? 'text-gray-700 hover:bg-gray-50 cursor-pointer'
                    : 'text-gray-400 cursor-not-allowed opacity-60'
                  }
                `}
              >
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1 text-left">
                  <div className="text-sm">{item.title}</div>
                  {item.roi && (
                    <div className="text-xs text-gray-500 font-normal">
                      ROI: {item.roi}
                    </div>
                  )}
                </div>
                {item.badge && (
                  <Badge 
                    variant={item.badgeVariant} 
                    size="sm"
                  >
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
          </div>

          {/* Separator */}
          <div className="my-4 border-t border-gray-200"></div>

          {/* Additional Menu Items */}
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed opacity-60">
              <span className="text-xl">⚙️</span>
              <span className="text-sm">Configuración</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed opacity-60">
              <span className="text-xl">📈</span>
              <span className="text-sm">Reportes</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed opacity-60">
              <span className="text-xl">❓</span>
              <span className="text-sm">Ayuda</span>
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Total Casos:</span>
                <span className="font-semibold">1/7</span>
              </div>
              <div className="flex justify-between">
                <span>Completitud:</span>
                <span className="font-semibold text-green-600">14%</span>
              </div>
              <div className="flex justify-between">
                <span>ROI Total:</span>
                <span className="font-semibold text-blue-600">$220M+</span>
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}