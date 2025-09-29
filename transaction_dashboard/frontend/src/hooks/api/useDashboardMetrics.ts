// frontend/src/hooks/api/useDashboardMetrics.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import apiClient from '../../services/api/client'

// Tipos definidos directamente aquí
interface ApiResponse<T = any> {
  success: boolean
  data: T
  timestamp: string
}

interface DashboardMetric {
  value: string
  numeric: number
  label: string
}

interface DashboardMetrics {
  totalTransactions: DashboardMetric
  annualROI: DashboardMetric
  completionRate: DashboardMetric
  uniqueCustomers: DashboardMetric
}

interface DashboardOverview {
  projectProgress: {
    completed: number
    pending: number
    percentage: number
  }
  roiConsolidated: {
    min: number
    max: number
    paybackMonths: string
  }
  useCases: Array<{
    name: string
    status: string
    roi: string
    priority: string
  }>
}

interface HourlyDistribution {
  hour: string
  transactions: number
  percentage: number
}

interface HourlyAnalysis {
  peakHour: string
  peakPercentage: number
  concentration: {
    hours: number
    percentage: number
  }
  peakValleDifference: number
  potentialROI: string
  hourlyDistribution: HourlyDistribution[]
}

interface PaymentMethod {
  percentage: number
  transactions: number
}

interface TransactionsSummary {
  total: number
  dailyAverage: number
  weeklyTrend: string
  monthlyTrend: string
  paymentMethods: {
    creditCard: PaymentMethod
    cash: PaymentMethod
    voucher: PaymentMethod
  }
  averageTicket: number
}

interface CustomerSegment {
  count: number
  percentage: number
}

interface CustomerSegmentation {
  total: number
  identified: CustomerSegment
  anonymous: CustomerSegment
  vip: CustomerSegment
  revenue: {
    identified: string
    anonymous: string
  }
}

interface ConnectionStatus {
  backend: boolean
  database: boolean
  api: boolean
  timestamp: string
}

export const useDashboardMetrics = (): UseQueryResult<DashboardMetrics, Error> => {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: async (): Promise<DashboardMetrics> => {
      const response = await apiClient.get<ApiResponse<DashboardMetrics>>('/dashboard/metrics')
      if (!response.data.success) {
        throw new Error('Failed to fetch dashboard metrics')
      }
      return response.data.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
  })
}

export const useDashboardOverview = (): UseQueryResult<DashboardOverview, Error> => {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: async (): Promise<DashboardOverview> => {
      const response = await apiClient.get<ApiResponse<DashboardOverview>>('/dashboard/overview')
      if (!response.data.success) {
        throw new Error('Failed to fetch dashboard overview')
      }
      return response.data.data
    },
    staleTime: 3 * 60 * 1000,
    gcTime: 8 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  })
}

export const useHourlyTransactions = (): UseQueryResult<HourlyAnalysis, Error> => {
  return useQuery({
    queryKey: ['dashboard', 'transactions', 'hourly'],
    queryFn: async (): Promise<HourlyAnalysis> => {
      const response = await apiClient.get<ApiResponse<HourlyAnalysis>>('/dashboard/transactions/hourly')
      if (!response.data.success) {
        throw new Error('Failed to fetch hourly transactions')
      }
      return response.data.data
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useTransactionsSummary = (): UseQueryResult<TransactionsSummary, Error> => {
  return useQuery({
    queryKey: ['dashboard', 'transactions', 'summary'],
    queryFn: async (): Promise<TransactionsSummary> => {
      const response = await apiClient.get<ApiResponse<TransactionsSummary>>('/dashboard/transactions/summary')
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

export const useCustomerSegmentation = (): UseQueryResult<CustomerSegmentation, Error> => {
  return useQuery({
    queryKey: ['dashboard', 'customers', 'segmentation'],
    queryFn: async (): Promise<CustomerSegmentation> => {
      const response = await apiClient.get<ApiResponse<CustomerSegmentation>>('/dashboard/customers/segmentation')
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

export const useApiConnectionTest = () => {
  return useQuery({
    queryKey: ['api', 'connection-test'],
    queryFn: async (): Promise<ConnectionStatus> => {
      try {
        const testResponse = await apiClient.get('/dashboard/test')
        return {
          backend: true,
          database: true,
          api: testResponse.data?.success === true,
          timestamp: new Date().toISOString(),
        }
      } catch (error) {
        return {
          backend: false,
          database: false,
          api: false,
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