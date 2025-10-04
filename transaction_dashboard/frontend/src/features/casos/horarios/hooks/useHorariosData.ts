// frontend/src/features/casos/horarios/hooks/useHorariosData.ts
// Hooks API específicos para el caso de uso: Patrones Horarios

import { useQuery, UseQueryResult } from '@tanstack/react-query'
import apiClient from '../../../../services/api/client'
import { ApiResponse } from '../../../shared/types'
import {
  HorariosMetrics,
  HorariosAnalysis,
  HorariosOverview,
  TransactionsSummary,
  CustomerSegmentation,
} from '../types'

const HORARIOS_BASE = '/casos/horarios'

/**
 * Hook para obtener métricas principales de horarios
 */
export const useHorariosMetrics = (): UseQueryResult<HorariosMetrics, Error> => {
  return useQuery({
    queryKey: ['casos', 'horarios', 'metrics'],
    queryFn: async (): Promise<HorariosMetrics> => {
      const response = await apiClient.get<ApiResponse<HorariosMetrics>>(
        `${HORARIOS_BASE}/metrics`
      )
      if (!response.data.success) {
        throw new Error('Failed to fetch horarios metrics')
      }
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
  })
}

/**
 * Hook para obtener vista general de horarios
 */
export const useHorariosOverview = (): UseQueryResult<HorariosOverview, Error> => {
  return useQuery({
    queryKey: ['casos', 'horarios', 'overview'],
    queryFn: async (): Promise<HorariosOverview> => {
      const response = await apiClient.get<ApiResponse<HorariosOverview>>(
        `${HORARIOS_BASE}/overview`
      )
      if (!response.data.success) {
        throw new Error('Failed to fetch horarios overview')
      }
      return response.data.data
    },
    staleTime: 3 * 60 * 1000,
    gcTime: 8 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  })
}

/**
 * Hook para obtener análisis horario completo
 */
export const useHorariosAnalysis = (): UseQueryResult<HorariosAnalysis, Error> => {
  return useQuery({
    queryKey: ['casos', 'horarios', 'analysis'],
    queryFn: async (): Promise<HorariosAnalysis> => {
      const response = await apiClient.get<ApiResponse<HorariosAnalysis>>(
        `${HORARIOS_BASE}/analysis`
      )
      if (!response.data.success) {
        throw new Error('Failed to fetch horarios analysis')
      }
      return response.data.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  })
}

/**
 * Hook para obtener resumen de transacciones
 */
export const useTransactionsSummary = (): UseQueryResult<TransactionsSummary, Error> => {
  return useQuery({
    queryKey: ['casos', 'horarios', 'transactions', 'summary'],
    queryFn: async (): Promise<TransactionsSummary> => {
      const response = await apiClient.get<ApiResponse<TransactionsSummary>>(
        `${HORARIOS_BASE}/transactions/summary`
      )
      if (!response.data.success) {
        throw new Error('Failed to fetch transactions summary')
      }
      return response.data.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook para obtener segmentación de clientes
 */
export const useCustomerSegmentation = (): UseQueryResult<CustomerSegmentation, Error> => {
  return useQuery({
    queryKey: ['casos', 'horarios', 'customers', 'segmentation'],
    queryFn: async (): Promise<CustomerSegmentation> => {
      const response = await apiClient.get<ApiResponse<CustomerSegmentation>>(
        `${HORARIOS_BASE}/customers/segmentation`
      )
      if (!response.data.success) {
        throw new Error('Failed to fetch customer segmentation')
      }
      return response.data.data
    },
    staleTime: 8 * 60 * 1000,
    gcTime: 12 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook para test de conexión
 */
export const useHorariosConnectionTest = () => {
  return useQuery({
    queryKey: ['casos', 'horarios', 'connection-test'],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`${HORARIOS_BASE}/test`)
        return {
          connected: response.data?.success === true,
          timestamp: new Date().toISOString(),
        }
      } catch (error) {
        return {
          connected: false,
          timestamp: new Date().toISOString(),
        }
      }
    },
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 1,
  })
}

/**
 * Hook compuesto que carga todos los datos de horarios
 */
export const useHorariosData = () => {
  const metrics = useHorariosMetrics()
  const overview = useHorariosOverview()
  const analysis = useHorariosAnalysis()
  const transactionsSummary = useTransactionsSummary()
  const customerSegmentation = useCustomerSegmentation()
  
  return {
    metrics,
    overview,
    analysis,
    transactionsSummary,
    customerSegmentation,
    isLoading:
      metrics.isLoading ||
      overview.isLoading ||
      analysis.isLoading,
    isError:
      metrics.isError ||
      overview.isError ||
      analysis.isError,
    error: metrics.error || overview.error || analysis.error,
  }
}
