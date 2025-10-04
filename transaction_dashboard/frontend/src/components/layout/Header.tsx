// frontend/src/components/layout/Header.tsx
import React, { useState } from 'react'
import { Badge } from '../ui/Badge'  // ✅ Ruta relativa específica
import { useDashboardMetrics } from '../../features/dashboard'

interface HeaderProps {
  onToggleSidebar?: () => void
  sidebarOpen?: boolean
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleSidebar,
  sidebarOpen = true 
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { data: metrics } = useDashboardMetrics()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        
        {/* Left section: Logo + Toggle */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            <svg 
              className="w-6 h-6 text-gray-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-3xl">📊</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Transaction Analytics
              </h1>
              <p className="text-xs text-gray-500">Dashboard v1.0</p>
            </div>
          </div>
        </div>

        {/* Center section: Stats */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
            <span className="text-2xl font-bold text-blue-600">
              {metrics?.totalTransactions?.value || '...'}
            </span>
            <span className="text-sm text-gray-600">Transacciones</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
            <span className="text-2xl font-bold text-green-600">
              {metrics?.annualROI?.value || '...'}
            </span>
            <span className="text-sm text-gray-600">ROI Anual</span>
          </div>
        </div>

        {/* Right section: Actions + User */}
        <div className="flex items-center gap-4">
          
          {/* Status Badge */}
          <Badge variant="success" className="hidden sm:flex">
            Sistema Activo
          </Badge>

          {/* Notifications */}
          <button 
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Notificaciones"
          >
            <svg 
              className="w-6 h-6 text-gray-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
              />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                VV
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900">Victor Vega</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
              <svg 
                className={`w-4 h-4 text-gray-600 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Mi Perfil
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Configuración
                </a>
                <hr className="my-1 border-gray-200" />
                <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  Cerrar Sesión
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}