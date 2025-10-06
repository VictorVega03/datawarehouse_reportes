// frontend/src/features/casos/inventario/hooks/useInventarioData.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import apiClient from '../../../../services/api/client';
import type { InventarioAnalysisData } from '../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// ============================================
// HOOKS SEPARADOS - CARGA PROGRESIVA
// ============================================

// Hook para métricas (se carga primero - ~5 segundos)
export const useInventarioMetrics = () => {
  return useQuery({
    queryKey: ['inventario', 'metrics'],
    queryFn: async () => {
      console.log('[useInventarioMetrics] Fetching metrics...');
      const response = await apiClient.get('/casos/inventario/metrics');
      console.log('[useInventarioMetrics] Response:', response.data);
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  });
};

// Hook para movimientos por tipo (se carga segundo - ~5 segundos)
export const useMovimientosPorTipo = () => {
  return useQuery({
    queryKey: ['inventario', 'movimientos-tipo'],
    queryFn: async () => {
      console.log('[useMovimientosPorTipo] Fetching...');
      const response = await apiClient.get('/casos/inventario/movimientos-tipo');
      console.log('[useMovimientosPorTipo] Response:', response.data);
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

// Hook para productos más movidos (se carga tercero - ~35-50 segundos)
export const useProductosMasMovidos = () => {
  return useQuery({
    queryKey: ['inventario', 'productos-movidos'],
    queryFn: async () => {
      console.log('[useProductosMasMovidos] Fetching...');
      const response = await apiClient.get('/casos/inventario/productos-movidos', {
        timeout: 60000 // 60 segundos
      });
      console.log('[useProductosMasMovidos] Response:', response.data);
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos - se cachea más tiempo
    gcTime: 15 * 60 * 1000, // 15 minutos en cache
    retry: 1,
  });
};

// ============================================
// HOOK PARA TENDENCIA (NUEVO - HABILITADO)
// ============================================
export const useInventarioTendencia = () => {
  return useQuery({
    queryKey: ['inventario', 'tendencia'],
    queryFn: async () => {
      console.log('[useInventarioTendencia] Fetching tendencia...');
      const response = await apiClient.get('/casos/inventario/tendencia');
      console.log('[useInventarioTendencia] Response:', response.data);
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000,
    retry: 1,
    enabled: true, // ✅ HABILITADO
  });
};

// ============================================
// HOOK PARA MOVIMIENTOS RECIENTES (NUEVO)
// ============================================
export const useMovimientosRecientes = (limit: number = 50) => {
  return useQuery({
    queryKey: ['inventario', 'movimientos-recientes', limit],
    queryFn: async () => {
      console.log('[useMovimientosRecientes] Fetching...');
      const response = await apiClient.get(`/casos/inventario/movimientos-recientes?limit=${limit}`);
      console.log('[useMovimientosRecientes] Response:', response.data);
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos (datos cambian frecuentemente)
    retry: 1,
    enabled: true, // ✅ HABILITADO
  });
};

// ============================================
// HOOK PARA PRODUCTOS CRÍTICOS (ACTUALIZADO)
// ============================================
export const useProductosCriticos = (umbral: number = 20, shouldFetch: boolean = true) => {
  return useQuery({
    queryKey: ['inventario', 'criticos', umbral],
    queryFn: async () => {
      console.log('[useProductosCriticos] Fetching productos críticos...');
      const response = await apiClient.get(`/casos/inventario/productos/criticos?umbral=${umbral}`);
      console.log('[useProductosCriticos] Response:', response.data);
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: shouldFetch, // ✅ Controlado por parámetro
  });
};

// ============================================
// HOOK LEGACY (mantener para compatibilidad)
// ============================================
export const useInventarioAnalysis = (): UseQueryResult<InventarioAnalysisData, Error> => {
  return useQuery({
    queryKey: ['inventario', 'analysis'],
    queryFn: async () => {
      console.log('[useInventarioAnalysis] Fetching inventario analysis...');
      const response = await apiClient.get('/casos/inventario/analysis');
      console.log('[useInventarioAnalysis] Response:', response.data);
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// ============================================
// HOOK PARA REFRESCAR VISTAS MATERIALIZADAS
// ============================================
export const useRefreshVistas = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      console.log('[useRefreshVistas] Refrescando vistas materializadas...');
      const response = await apiClient.post('/casos/inventario/refresh-vistas', {}, {
        timeout: 180000 // 3 minutos de timeout
      });
      console.log('[useRefreshVistas] Response:', response.data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidar todas las queries de inventario para forzar re-fetch
      queryClient.invalidateQueries({ queryKey: ['inventario'] });
      console.log('[useRefreshVistas] Vistas actualizadas, invalidando cache...');
    },
    onError: (error) => {
      console.error('[useRefreshVistas] Error:', error);
    }
  });
};