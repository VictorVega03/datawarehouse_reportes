// frontend/src/features/dashboard/types.ts
// Types para el feature de Dashboard

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  timestamp: string
}

export interface DashboardMetric {
  value: string
  numeric: number
  label: string
}

export interface DashboardMetrics {
  totalTransactions: DashboardMetric
  annualROI: DashboardMetric
  completionRate: DashboardMetric
  uniqueCustomers: DashboardMetric
  totalRevenue?: DashboardMetric
  averageTransaction?: DashboardMetric
}

export interface DashboardOverview {
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

export interface HourlyDistribution {
  hour: string
  transactions: number
  percentage: number
}

export interface HourlyAnalysis {
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

export interface PaymentMethod {
  percentage: number
  transactions: number
}

export interface TransactionsSummary {
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

export interface ConnectionStatus {
  backend: boolean
  database: boolean
  api: boolean
  timestamp: string
}
