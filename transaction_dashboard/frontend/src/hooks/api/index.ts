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

// Note: Types are not exported from useDashboardMetrics.ts
// If needed, they should be moved to a separate types file
