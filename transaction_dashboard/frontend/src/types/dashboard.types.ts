// frontend/src/types/dashboard.types.ts
// Types específicos para dashboard y métricas

// Main dashboard metrics
export interface DashboardMetrics {
  totalTransactions: string | number
  totalRevenue: string | number
  completedCases: string | number
  uniqueCustomers: string | number
  roiAnnual: string | number
  averageTicket: string | number
}

// Dashboard overview
export interface DashboardOverview {
  progressPercentage: number
  casesCompleted: number
  totalCases: number
  paybackMonths: string
  roiRange: string
  keyHighlights: string[]
}

// Hourly transaction data (Caso 1: Patrones Horarios)
export interface HourlyTransactionData {
  hour: string
  transactions: number
  percentage: number
  classification: 'Pico' | 'Alto' | 'Medio' | 'Bajo' | 'Valle'
}

export interface HourlyTransactionSummary {
  peakHour: string
  peakPercentage: number
  concentrated4Hours: number
  peakValleyRatio: number
  roiPotential: string
}

export interface HourlyTransactions {
  hourlyData: HourlyTransactionData[]
  summary: HourlyTransactionSummary
}

// Payment methods (Caso 6: Métodos de Pago)
export interface PaymentMethodData {
  count: number
  percentage: number
  avgTicket: number
}

export interface TransactionsSummary {
  total: number
  totalFormatted: string
  byPaymentMethod: {
    creditCard: PaymentMethodData
    cash: PaymentMethodData
    voucher: PaymentMethodData
  }
  timeRange: {
    fastest: string
    fastCount: number
    fastPercentage: number
  }
  averageTicket: number
  totalRevenue: number
  revenueFormatted: string
}

// Customer segmentation (Caso 4: Identificación Clientes)
export interface CustomerSegmentData {
  count: number
  percentage: number
  revenue: number
  revenueFormatted: string
  avgPerCustomer: number
}

export interface VipCustomerData extends CustomerSegmentData {
  criteria: string
}

export interface CustomerSegmentation {
  total: number
  identified: CustomerSegmentData
  anonymous: CustomerSegmentData
  vip: VipCustomerData
  regular: VipCustomerData
  roiOpportunity: string
}

// Use cases overview
export interface UseCaseItem {
  id: number
  name: string
  status: 'Completado' | 'En Progreso' | 'Pendiente'
  roi: string
  keyFinding: string
  priority: 'Crítica' | 'Alta' | 'Media' | 'Baja'
  description?: string
  completedDate?: string
}

// Chart data types for Nivo
export interface ChartDataPoint {
  id: string | number
  label: string
  value: number
  color?: string
  [key: string]: any
}

export interface BarChartData {
  id: string
  [key: string]: string | number
}

export interface PieChartData {
  id: string
  label: string
  value: number
  color?: string
}

export interface LineChartData {
  x: string | number
  y: number
  [key: string]: any
}

// Filter types for dashboard
export interface DashboardFilters {
  dateRange: {
    start: Date | null
    end: Date | null
  }
  paymentMethod: 'all' | 'credit_card' | 'cash' | 'voucher'
  customerType: 'all' | 'vip' | 'regular' | 'anonymous'
  useCases: number[]
}

// Metric card props
export interface MetricCardData {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
    period: string
  }
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo' | 'pink'
  icon?: string
}

// Navigation types
export interface NavigationItem {
  id: string
  name: string
  href: string
  icon: string
  current: boolean
  badge?: string | number
}

// Page meta types
export interface PageMeta {
  title: string
  description: string
  keywords?: string[]
  ogTitle?: string
  ogDescription?: string
}