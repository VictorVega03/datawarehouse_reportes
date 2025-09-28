import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/services/api/client'
import type { 
  ApiResponse, 
  DashboardMetrics, 
  DashboardOverview,
  HourlyTransactions,
  TransactionsSummary,
  CustomerSegmentation,
  ApiTestResponse
} from '@/types'

// Hook for testing API connection
export const useApiTest = () => {
  return useQuery({
    queryKey: ['dashboard', 'test'],
    queryFn: async (): Promise<ApiTestResponse> => {
      const response = await apiClient.get<ApiResponse<ApiTestResponse>>('/dashboard/test')
      return response.data.data
    },
    staleTime: 0, // Always fresh for testing
    refetchOnWindowFocus: true,
    retry: 1,
  })
}

// Hook for dashboard metrics
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: async (): Promise<DashboardMetrics> => {
      const response = await apiClient.get<ApiResponse<DashboardMetrics>>('/dashboard/metrics')
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    retry: 2,
  })
}

// Hook for dashboard overview
export const useDashboardOverview = () => {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: async (): Promise<DashboardOverview> => {
      const response = await apiClient.get<ApiResponse<DashboardOverview>>('/dashboard/overview')
      return response.data.data
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  })
}

// Hook for hourly transactions (Caso 1: Patrones Horarios)
export const useHourlyTransactions = () => {
  return useQuery({
    queryKey: ['dashboard', 'transactions', 'hourly'],
    queryFn: async (): Promise<HourlyTransactions> => {
      const response = await apiClient.get<ApiResponse<HourlyTransactions>>('/dashboard/transactions/hourly')
      return response.data.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutos para datos históricos
    refetchOnWindowFocus: false,
    retry: 2,
  })
}

// Hook for transactions summary
export const useTransactionsSummary = () => {
  return useQuery({
    queryKey: ['dashboard', 'transactions', 'summary'],
    queryFn: async (): Promise<TransactionsSummary> => {
      const response = await apiClient.get<ApiResponse<TransactionsSummary>>('/dashboard/transactions/summary')
      return response.data.data
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  })
}

// Hook for customer segmentation (Caso 4: Identificación Clientes)
export const useCustomerSegmentation = () => {
  return useQuery({
    queryKey: ['dashboard', 'customers', 'segmentation'],
    queryFn: async (): Promise<CustomerSegmentation> => {
      const response = await apiClient.get<ApiResponse<CustomerSegmentation>>('/dashboard/customers/segmentation')
      return response.data.data
    },
    staleTime: 15 * 60 * 1000, // 15 minutos
    refetchOnWindowFocus: false,
    retry: 2,
  })
}

// Hook para múltiples queries (dashboard completo)
export const useDashboardData = () => {
  const metrics = useDashboardMetrics()
  const overview = useDashboardOverview()
  const hourlyTransactions = useHourlyTransactions()
  const customerSegmentation = useCustomerSegmentation()

  return {
    metrics,
    overview,
    hourlyTransactions,
    customerSegmentation,
    isLoading: metrics.isLoading || overview.isLoading || 
               hourlyTransactions.isLoading || customerSegmentation.isLoading,
    isError: metrics.isError || overview.isError || 
             hourlyTransactions.isError || customerSegmentation.isError,
    errors: {
      metrics: metrics.error,
      overview: overview.error,
      hourlyTransactions: hourlyTransactions.error,
      customerSegmentation: customerSegmentation.error,
    }
  }
}