// frontend/src/features/casos/precios/hooks/usePreciosData.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import apiClient from '../../../../services/api/client'
import type { 
  PreciosAnalisisData, 
  ProductoDescuento,
  CategoriaDescuento
} from '../types'

/**
 * Hook para obtener análisis completo de precios
 */
export const usePreciosAnalisis = (): UseQueryResult<PreciosAnalisisData, Error> => {
  return useQuery({
    queryKey: ['precios', 'analisis'],
    queryFn: async (): Promise<PreciosAnalisisData> => {
      try {
        console.log('🔍 Fetching precios analisis...')
        const response = await apiClient.get('/casos/precios/analisis')
        
        console.log('📦 Raw response:', response)
        console.log('📦 Response data:', response.data)
        
        if (!response.data) {
          throw new Error('No data in response')
        }
        
        // Si la respuesta tiene success y data, extraemos data
        if (response.data.success && response.data.data) {
          console.log('✅ Returning nested data:', response.data.data)
          return response.data.data
        }
        
        // Si no, retornamos la data directamente
        console.log('✅ Returning direct data:', response.data)
        return response.data
      } catch (error) {
        console.error('❌ Error in usePreciosAnalisis:', error)
        throw error
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  })
}

/**
 * Hook para obtener top productos con descuentos
 */
export const useTopProductosDescuento = (limit: number = 20): UseQueryResult<ProductoDescuento[], Error> => {
  return useQuery({
    queryKey: ['precios', 'productos-descuento', limit],
    queryFn: async (): Promise<ProductoDescuento[]> => {
      try {
        console.log(`🔍 Fetching top ${limit} productos...`)
        const response = await apiClient.get(`/casos/precios/productos/top-descuentos?limit=${limit}`)
        
        console.log('📦 Response data:', response.data)
        
        if (!response.data) {
          throw new Error('No data in response')
        }
        
        // Si la respuesta tiene success y data, extraemos data
        if (response.data.success && response.data.data) {
          console.log('✅ Returning nested data:', response.data.data)
          return response.data.data
        }
        
        // Si no, retornamos la data directamente
        console.log('✅ Returning direct data:', response.data)
        return response.data
      } catch (error) {
        console.error('❌ Error in useTopProductosDescuento:', error)
        throw error
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  })
}

/**
 * Hook para obtener categorías con descuentos
 */
export const useCategoriasDescuentos = (limit: number = 15): UseQueryResult<CategoriaDescuento[], Error> => {
  return useQuery({
    queryKey: ['precios', 'categorias-descuentos', limit],
    queryFn: async (): Promise<CategoriaDescuento[]> => {
      try {
        console.log(`🔍 Fetching top ${limit} categorías...`)
        const response = await apiClient.get(`/casos/precios/categorias/descuentos?limit=${limit}`)
        
        console.log('📦 Response data:', response.data)
        
        if (!response.data) {
          throw new Error('No data in response')
        }
        
        // Si la respuesta tiene success y data, extraemos data
        if (response.data.success && response.data.data) {
          console.log('✅ Returning nested data:', response.data.data)
          return response.data.data
        }
        
        // Si no, retornamos la data directamente
        console.log('✅ Returning direct data:', response.data)
        return response.data
      } catch (error) {
        console.error('❌ Error in useCategoriasDescuentos:', error)
        throw error
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  })
}