// frontend/src/components/layout/MainLayout.tsx

import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - ahora maneja su propio estado internamente */}
      <Sidebar />

      {/* Main Content con padding consistente */}
      <main className="flex-1 transition-all duration-300 ease-in-out overflow-x-hidden p-6">
        <Outlet />
      </main>
    </div>
  )
}