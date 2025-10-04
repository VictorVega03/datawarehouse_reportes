// frontend/src/router.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { DashboardHomePage } from './features/dashboard'
import { HorariosPage } from './features/casos/horarios'
import { CaducidadPage } from './features/casos/caducidad/pages/CaducidadPage'

/**
 * Router Configuration for Transaction Dashboard
 * 
 * Structure:
 * - / → Dashboard home with metrics and quick access
 * - /casos/horarios → Hourly patterns analysis
 * - /casos/caducidad → Expiration control (coming soon)
 * - /casos/precios → Price management (coming soon)
 * - ... more use cases
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardHomePage />,
      },
      {
        path: 'casos',
        children: [
          {
            path: 'horarios',
            element: <HorariosPage />,
          },
          // Future use cases will be added here
          {
             path: 'caducidad',
             element: <CaducidadPage />,
          },
          // {
          //   path: 'precios',
          //   element: <PreciosPage />,
          // },
        ],
      },
      // Redirect old route for backwards compatibility
      {
        path: 'patrones',
        element: <Navigate to="/casos/horarios" replace />,
      },
      // Catch-all 404 route
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
])
