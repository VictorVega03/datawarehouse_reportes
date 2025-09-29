// frontend/src/components/layout/MainLayout.tsx
import React, { useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface MainLayoutProps {
  children: React.ReactNode
  onNavigate?: (page: string) => void  // ✅ NUEVO
  activePage?: string  // ✅ NUEVO
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children,
  onNavigate,  // ✅ NUEVO
  activePage  // ✅ NUEVO
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        onToggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />

      {/* Main Container */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          onNavigate={onNavigate}  // ✅ NUEVO
          activePage={activePage}  // ✅ NUEVO
        />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}