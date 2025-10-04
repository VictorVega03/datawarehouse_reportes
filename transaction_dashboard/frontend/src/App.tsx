// frontend/src/App.tsx
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

/**
 * App Component
 * 
 * Root component that provides React Router navigation
 * to the entire application using the configured router.
 * 
 * The router configuration handles:
 * - MainLayout wrapper for all pages
 * - Route definitions for all use cases
 * - 404 redirects
 * - Backwards compatibility with old routes
 */
function App() {
  return <RouterProvider router={router} />
}

export default App
