// frontend/src/features/casos/horarios/types.ts
// Tipos específicos para el caso de uso: Patrones Horarios

import { Metric } from '../../shared/types'

export interface HorariosMetrics {
  totalTransactions: Metric
  annualROI: Metric
  completionRate: Metric
  uniqueCustomers: Metric
  totalRevenue?: Metric
  averageTransaction?: Metric
}

export interface HourlyDataPoint {
  hour: string
  hourNumeric?: number
  transactions: number
  percentage: number
  totalAmount?: number
  classification?: 'Pico' | 'Alto' | 'Normal' | 'Bajo' | 'Valle'
  recommendation?: string
}

export interface HorariosAnalysis {
  peakHour: string
  peakPercentage: number
  peakTransactions: number
  
  valleyHour?: string
  valleyPercentage?: number
  valleyTransactions?: number
  
  concentration: {
    hours: number
    percentage: number
    hoursList?: string[]
  }
  
  peakValleDifference: number
  potentialROI: string
  potentialROINumeric?: number
  
  totalTransactions: number
  averagePerHour?: number
  
  hourlyDistribution: HourlyDataPoint[]
  
  insights?: string[]
  recommendations?: string[]
}

export interface HorariosOverview {
  summary: {
    totalTransactions: number
    totalRevenue: number
    uniqueCustomers: number
    averageTransaction: number
    dateRange: {
      start: Date | null
      end: Date | null
    }
  }
  projectProgress: {
    completed: number
    pending: number
    percentage: number
  }
  useCases: Array<{
    name: string
    status: string
    roi: string
    priority: string
    enabled: boolean
  }>
}

export interface PaymentMethod {
  percentage: number
  transactions: number
  totalAmount: number
}

export interface TransactionsSummary {
  total: number
  dailyAverage: number
  weeklyTrend: string
  monthlyTrend: string
  paymentMethods: Record<string, PaymentMethod>
  averageTicket: number
  totalRevenue: number
  period: {
    start: Date | null
    end: Date | null
  }
}

export interface CustomerSegment {
  count: number
  percentage: number
}

export interface CustomerSegmentation {
  total: number
  identified: CustomerSegment
  anonymous: CustomerSegment
  vip: CustomerSegment
  revenue: {
    identified: string
    anonymous: string
  }
}
