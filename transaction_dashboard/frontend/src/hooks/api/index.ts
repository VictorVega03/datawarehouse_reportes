// frontend/src/hooks/api/index.ts
// Barrel exports para los hooks de API

export {
  useDashboardMetrics,
  useDashboardOverview,
  useHourlyTransactions,
  useTransactionsSummary,
  useCustomerSegmentation,
  useApiConnectionTest,
  useDashboardData,
} from './useDashboardMetrics'

export type {
  DashboardMetrics,
  DashboardOverview,
  TransactionsSummary,
  CustomerSegmentation,
} from './useDashboardMetrics'