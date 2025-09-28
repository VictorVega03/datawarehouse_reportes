// frontend/src/hooks/api/useDashboardMetrics.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import apiClient, { ApiResponse } from '@/services/api/client'

// Tipos para las métricas del dashboard
export interface DashboardMetrics {
  totalTransactions: number
  totalRevenue: number
  roiAnnual: number
  casesCompleted: number
  uniqueCustomers: number
  completionPercentage: number
  averageTicket: number
}

export interface DashboardOverview {
  metrics: DashboardMetrics
  cases: Array<{
    id: string
    name: string
    status: 'completed' | 'in_progress' | 'pending'
    roi: string
    priority: 'critical' | 'high' | 'medium' | 'low'
    description: string
  }>
  hourlyData: Array<{
    hour: number
    transactions: number
    percentage: number
  }>
}

export interface TransactionsSummary {
  totalTransactions: number
  totalAmount: string
  averageTicket: string
  paymentMethods: Array<{
    method: string
    count: number
    percentage: number
    averageAmount: string
  }>
  topHours: Array<{
    hour: number
    transactions: number
    percentage: number
  }>
}

export interface CustomerSegmentation {
  totalCustomers: number
  identified: {
    count: number
    percentage: number
    totalRevenue: string
  }
  anonymous: {
    count: number
    percentage: number
    totalRevenue: string
  }
  vip: {
    count: number
    percentage: number
    totalRevenue: string
  }
}

// Hook para obtener métricas principales del dashboard
export const useDashboardMetrics = (): UseQueryResult<DashboardMetrics, Error> => {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: async (): Promise<DashboardMetrics> => {
      console.log('🔄 Fetching dashboard metrics...')
      const response = await apiClient.get<ApiResponse<DashboardMetrics>>('/dashboard/metrics')
      
      if (!response.data.success) {
        throw new Error('Failed to fetch dashboard metrics')
      }
      
      console.log('✅ Dashboard metrics loaded:', response.data.data)
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (antes era cacheTime)
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

// Hook para obtener overview completo del dashboard
export const useDashboardOverview = (): UseQueryResult<DashboardOverview, Error> => {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: async (): Promise<DashboardOverview> => {
      console.log('🔄 Fetching dashboard overview...')
      const response = await apiClient.get<ApiResponse<DashboardOverview>>('/dashboard/overview')
      
      if (!response.data.success) {
        throw new Error('Failed to fetch dashboard overview')
      }
      
      console.log('✅ Dashboard overview loaded:', response.data.data)
      return response.data.data
    },
    staleTime: 3 * 60 * 1000, // 3 minutos
    gcTime: 8 * 60 * 1000, // 8 minutos
    refetchOnWindowFocus: false,
    retry: 2,
  })
}

// Hook para obtener análisis horario de transacciones
export const useHourlyTransactions = (): UseQueryResult<Array<{hour: number, transactions: number, percentage: number}>, Error> => {
  return useQuery({
    queryKey: ['dashboard', 'transactions', 'hourly'],
    queryFn: async () => {
      console.log('🔄 Fetching hourly transactions...')
      const response = await apiClient.get<ApiResponse<Array<{hour: number, transactions: number, percentage: number}>>>('/dashboard/transactions/hourly')
      
      if (!response.data.success) {
        throw new Error('Failed to fetch hourly transactions')
      }
      
      console.log('✅ Hourly transactions loaded:', response.data.data)
      return response.data.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutos (datos más estables)
    gcTime: 15 * 60 * 1000, // 15 minutos
    refetchOnWindowFocus: false,
  })
}

// Hook para obtener resumen de transacciones
export const useTransactionsSummary = (): UseQueryResult<TransactionsSummary, Error> => {
  return useQuery({
    queryKey: ['dashboard', 'transactions', 'summary'],
    queryFn: async (): Promise<TransactionsSummary> => {
      console.log('🔄 Fetching transactions summary...')
      const response = await apiClient.get<ApiResponse<TransactionsSummary>>('/dashboard/transactions/summary')
      
      if (!response.data.success) {
        throw new Error('Failed to fetch transactions summary')
      }
      
      console.log('✅ Transactions summary loaded:', response.data.data)
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

// Hook para obtener segmentación de clientes
export const useCustomerSegmentation = (): UseQueryResult<CustomerSegmentation, Error> => {
  return useQuery({
    queryKey: ['dashboard', 'customers', 'segmentation'],
    queryFn: async (): Promise<CustomerSegmentation> => {
      console.log('🔄 Fetching customer segmentation...')
      const response = await apiClient.get<ApiResponse<CustomerSegmentation>>('/dashboard/customers/segmentation')
      
      if (!response.data.success) {
        throw new Error('Failed to fetch customer segmentation')
      }
      
      console.log('✅ Customer segmentation loaded:', response.data.data)
      return response.data.data
    },
    staleTime: 8 * 60 * 1000, // 8 minutos
    gcTime: 12 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

// Hook para test de conectividad (útil para debugging)
export const useApiConnectionTest = () => {
  return useQuery({
    queryKey: ['api', 'connection-test'],
    queryFn: async () => {
      console.log('🔄 Testing API connection...')
      
      try {
        // Test básico del endpoint test
        const testResponse = await apiClient.get('/dashboard/test')
        
        return {
          success: true,
          backend: true,
          api: testResponse.data?.success === true,
          timestamp: new Date().toISOString(),
        }
      } catch (error) {
        console.error('❌ API connection test failed:', error)
        return {
          success: false,
          backend: false,
          api: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        }
      }
    },
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: true, // Refresca al enfocar para detectar problemas
    retry: 1, // Solo un retry para tests rápidos
  })
}

// Hook compuesto para cargar todos los datos del dashboard
export const useDashboardData = () => {
  const metrics = useDashboardMetrics()
  const overview = useDashboardOverview()
  const hourlyTransactions = useHourlyTransactions()
  const transactionsSummary = useTransactionsSummary()
  const customerSegmentation = useCustomerSegmentation()
  
  return {
    metrics,
    overview,
    hourlyTransactions,
    transactionsSummary,
    customerSegmentation,
    isLoading: metrics.isLoading || overview.isLoading || hourlyTransactions.isLoading,
    isError: metrics.isError || overview.isError || hourlyTransactions.isError,
    error: metrics.error || overview.error || hourlyTransactions.error,
  }
}