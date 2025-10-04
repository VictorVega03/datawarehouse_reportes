// frontend/src/features/dashboard/index.ts
// Barrel export para el feature de Dashboard

// Pages
export { DashboardHomePage } from './pages/DashboardHomePage'

// Hooks
export {
  useDashboardMetrics,
  useDashboardOverview,
  useHourlyTransactions,
  useTransactionsSummary,
  useCustomerSegmentation,
  useApiConnectionTest,
  useDashboardData
} from './hooks/useDashboardMetrics'

// Types
export type {
  ApiResponse,
  DashboardMetric,
  DashboardMetrics,
  DashboardOverview,
  HourlyDistribution,
  HourlyAnalysis,
  PaymentMethod,
  TransactionsSummary,
  CustomerSegment,
  CustomerSegmentation,
  ConnectionStatus
} from './types'
