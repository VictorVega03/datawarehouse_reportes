// frontend/src/features/casos/clientes/hooks/useClientesData.ts
// Hooks para consumir la API del Caso de Uso 4: Identificación de Clientes

import { useQuery } from '@tanstack/react-query'

import type {
  ApiResponse,
  ClientesMetrics,
  ClientesOverview,
  ClienteDistribution,
  TopCliente,
  ClienteSegmentation,
  RecencyAnalysis,
  SpendingRange
} from '../types'
import client from '@/services/api/client'

// ===================================
// BASE URL
// ===================================

const BASE_URL = '/casos/clientes'

// ===================================
// 1. MÉTRICAS PRINCIPALES
// ===================================

export const useClientesMetrics = () => {
  return useQuery<ApiResponse<ClientesMetrics>>({
    queryKey: ['clientes', 'metrics'],
    queryFn: async () => {
      const { data } = await client.get<ApiResponse<ClientesMetrics>>(
        `${BASE_URL}/metrics`
      )
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (antes cacheTime)
    retry: 2
  })
}

// ===================================
// 2. VISTA GENERAL COMPLETA
// ===================================

export const useClientesOverview = () => {
  return useQuery<ApiResponse<ClientesOverview>>({
    queryKey: ['clientes', 'overview'],
    queryFn: async () => {
      const { data } = await client.get<ApiResponse<ClientesOverview>>(
        `${BASE_URL}/overview`
      )
      return data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2
  })
}

// ===================================
// 3. DISTRIBUCIÓN (Identificados vs Anónimos)
// ===================================

export const useClientesDistribution = () => {
  return useQuery<ApiResponse<ClienteDistribution[]>>({
    queryKey: ['clientes', 'distribution'],
    queryFn: async () => {
      const { data } = await client.get<ApiResponse<ClienteDistribution[]>>(
        `${BASE_URL}/distribution`
      )
      return data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2
  })
}

// ===================================
// 4. TOP CLIENTES
// ===================================

export const useTopClientes = (
  type: 'frequency' | 'value' = 'frequency',
  limit: number = 20
) => {
  return useQuery<ApiResponse<TopCliente[]>>({
    queryKey: ['clientes', 'top', type, limit],
    queryFn: async () => {
      const { data } = await client.get<ApiResponse<TopCliente[]>>(
        `${BASE_URL}/top?type=${type}&limit=${limit}`
      )
      return data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2
  })
}

// ===================================
// 5. SEGMENTACIÓN
// ===================================

export const useClientesSegmentation = () => {
  return useQuery<ApiResponse<ClienteSegmentation[]>>({
    queryKey: ['clientes', 'segmentation'],
    queryFn: async () => {
      const { data } = await client.get<ApiResponse<ClienteSegmentation[]>>(
        `${BASE_URL}/segmentation`
      )
      return data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2
  })
}

// ===================================
// 6. ANÁLISIS DE RECENCIA
// ===================================

export const useRecencyAnalysis = () => {
  return useQuery<ApiResponse<RecencyAnalysis[]>>({
    queryKey: ['clientes', 'recency'],
    queryFn: async () => {
      const { data } = await client.get<ApiResponse<RecencyAnalysis[]>>(
        `${BASE_URL}/recency`
      )
      return data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2
  })
}

// ===================================
// 7. RANGOS DE GASTO
// ===================================

export const useSpendingRanges = () => {
  return useQuery<ApiResponse<SpendingRange[]>>({
    queryKey: ['clientes', 'spending-ranges'],
    queryFn: async () => {
      const { data } = await client.get<ApiResponse<SpendingRange[]>>(
        `${BASE_URL}/spending-ranges`
      )
      return data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2
  })
}