import { useQuery } from '@tanstack/react-query'
import type { ExpiryControlData, RecommendationsData, CriticalProduct } from '../types'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1'

/**
 * Hook principal para obtener análisis completo de caducidad
 */
export function useCaducidadData() {
  return useQuery<ExpiryControlData>({
    queryKey: ['casos', 'caducidad', 'control'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/${API_VERSION}/casos/caducidad/analysis`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch caducidad data')
      }
      
      const json = await response.json()
      // Extraer data del wrapper { success: true, data: {...} }
      return json.data || json
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (antes cacheTime)
    refetchOnWindowFocus: false,
    retry: 2
  })
}

/**
 * Hook para obtener solo métricas de caducidad
 */
export function useCaducidadMetrics() {
  return useQuery({
    queryKey: ['casos', 'caducidad', 'metrics'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/${API_VERSION}/casos/caducidad/metrics`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch caducidad metrics')
      }
      
      return response.json()
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}

/**
 * Hook para obtener productos críticos con filtro de días
 */
export function useCriticalProducts(days: number = 7) {
  return useQuery<CriticalProduct[]>({
    queryKey: ['casos', 'caducidad', 'critical', days],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE}/api/${API_VERSION}/casos/caducidad/products/critical?days=${days}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch critical products')
      }
      
      return response.json()
    },
    staleTime: 2 * 60 * 1000, // 2 minutos (más frecuente por criticidad)
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true // Refetch al volver a la ventana
  })
}

/**
 * Hook para obtener recomendaciones
 */
export function useCaducidadRecommendations() {
  return useQuery<RecommendationsData>({
    queryKey: ['casos', 'caducidad', 'recommendations'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/${API_VERSION}/casos/caducidad/recommendations`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }
      
      return response.json()
    },
    staleTime: 10 * 60 * 1000, // 10 minutos (menos frecuente)
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}