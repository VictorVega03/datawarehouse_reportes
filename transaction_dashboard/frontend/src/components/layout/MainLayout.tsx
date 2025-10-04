// frontend/src/components/layout/MainLayout.tsx

import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar, SidebarContext, useSidebar } from './Sidebar'

function ToggleButton() {
  const { isOpen, setIsOpen } = useSidebar()

  if (isOpen) return null

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed left-4 top-4 z-50 bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
      aria-label="Abrir menú"
      title="Abrir menú lateral"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  )
}

export function MainLayout() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 transition-all duration-300 ease-in-out overflow-x-hidden">
          {/* Botón para abrir sidebar cuando está cerrado */}
          <ToggleButton />
          
          {/* Contenido de las rutas */}
          <Outlet />
        </main>
      </div>
    </SidebarContext.Provider>
  )
}