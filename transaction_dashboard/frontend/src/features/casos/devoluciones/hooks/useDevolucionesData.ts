// frontend/src/features/casos/devoluciones/hooks/useDevolucionesData.ts

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query';

import type {
  DevolucionesAnalysisData,
  DevolucionesMetrics,
  PatronSospechoso,
  ProductoDevuelto,
  Recomendacion,
} from '../types';
import client from '@/services/api/client';
import apiClient from '@/services/api/client';

/**
 * Hook principal para obtener el análisis completo de devoluciones
 */
export const useDevolucionesData = () => {
  return useQuery({
    queryKey: ['devoluciones', 'analysis'],
    queryFn: async () => {
      console.log('🔄 Fetching devoluciones analysis...');
      
      const response = await client.get<{ 
        success: boolean; 
        data: DevolucionesAnalysisData 
      }>('/casos/devoluciones/analysis', {
        timeout: 30000, // 30 segundos
      });
      
      console.log('✅ Devoluciones analysis fetched:', response.data);
      
      // Extraer data del wrapper si existe
      const data = response.data?.data || response.data;
      return data as DevolucionesAnalysisData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1, // Solo 1 reintento
  });
};

/**
 * Hook para obtener solo las métricas principales
 */
export const useDevolucionesMetrics = () => {
  return useQuery({
    queryKey: ['devoluciones', 'metrics'],
    queryFn: async () => {
      console.log('🔄 Fetching devoluciones metrics...');
      
      const response = await client.get<{
        success: boolean;
        data: DevolucionesMetrics;
      }>('/casos/devoluciones/metrics');
      
      console.log('✅ Metrics fetched:', response.data);
      
      const data = response.data?.data || response.data;
      return data as DevolucionesMetrics;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Hook para obtener patrones sospechosos
 */
export const useSuspiciousPatterns = (maxMinutes: number = 5) => {
  return useQuery({
    queryKey: ['devoluciones', 'suspicious-patterns', maxMinutes],
    queryFn: async () => {
      console.log(`🔄 Fetching suspicious patterns (${maxMinutes} minutes)...`);
      
      const response = await client.get<{
        success: boolean;
        data: PatronSospechoso[];
      }>(`/casos/devoluciones/suspicious-patterns?maxMinutes=${maxMinutes}`);
      
      console.log('✅ Suspicious patterns fetched:', response.data);
      
      const data = response.data?.data || response.data;
      return data as PatronSospechoso[];
    },
    staleTime: 3 * 60 * 1000, // 3 minutos
    retry: 2,
  });
};

/**
 * Hook para obtener productos más devueltos
 */
export const useTopReturnedProducts = (limit: number = 10) => {
  return useQuery({
    queryKey: ['devoluciones', 'top-returned-products', limit],
    queryFn: async () => {
      console.log(`🔄 Fetching top ${limit} returned products...`);
      
      const response = await client.get<{
        success: boolean;
        data: ProductoDevuelto[];
      }>(`/casos/devoluciones/top-returned-products?limit=${limit}`);
      
      console.log('✅ Top returned products fetched:', response.data);
      
      const data = response.data?.data || response.data;
      return data as ProductoDevuelto[];
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Hook para obtener recomendaciones
 */
export const useDevolucionesRecommendations = () => {
  return useQuery({
    queryKey: ['devoluciones', 'recommendations'],
    queryFn: async () => {
      console.log('🔄 Fetching devoluciones recommendations...');
      
      const response = await client.get<{
        success: boolean;
        data: Recomendacion[];
      }>('/casos/devoluciones/recommendations');
      
      console.log('✅ Recommendations fetched:', response.data);
      
      const data = response.data?.data || response.data;
      return data as Recomendacion[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
  });
};

export const useRefreshVistas = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(
        '/casos/devoluciones/refresh-vistas',
        {},
        {
          timeout: 180000 // 3 minutos
        }
      )
      return response.data
    },
    onSuccess: () => {
      // Invalidar todas las queries de devoluciones para refrescar datos
      queryClient.invalidateQueries({ queryKey: ['devoluciones'] })
    }
  })
}