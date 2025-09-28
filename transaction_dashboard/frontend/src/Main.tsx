import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App.tsx'
import './styles/globals.css'

// Configure TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
})

// Componente que oculta el loading screen cuando React está listo
const AppWithLoader: React.FC = () => {
  useEffect(() => {
    // Cuando este componente se monta, significa que React está listo
    console.log('🎯 React cargado - ocultando loading screen')
    
    const hideLoader = () => {
      const loader = document.getElementById('initial-loader')
      if (loader) {
        console.log('📱 Ocultando loading screen...')
        loader.style.opacity = '0'
        loader.style.transition = 'opacity 0.5s ease-out'
        
        setTimeout(() => {
          loader.style.display = 'none'
          document.body.classList.add('app-loaded')
          console.log('✅ Loading screen oculto - React funcionando')
        }, 500)
      }
    }

    // Pequeño delay para que se vea el efecto
    setTimeout(hideLoader, 800)
  }, [])

  return <App />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppWithLoader />
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  </React.StrictMode>,
)