// frontend/src/stores/integration.ts
// Integration between TanStack Query and Zustand stores

import { useEffect } from 'react'
import { 
  useDashboardMetrics as useApiDashboardMetrics,
  useDashboardOverview as useApiDashboardOverview,
  useHourlyTransactions as useApiHourlyTransactions,
  useCustomerSegmentation as useApiCustomerSegmentation,
  useTransactionsSummary as useApiTransactionsSummary,
} from '@/hooks/api/useDashboardMetrics'
import { useDashboardActions } from './dashboardStore'
import { useNotificationHelpers, useUIActions } from './uiStore'
import { useAutoRefresh as useAutoRefreshSettings } from './settingsStore'
import { useAppliedFilters } from './filtersStore'

// Custom hook that syncs TanStack Query data with Zustand stores
export const useDashboardDataSync = () => {
  // API hooks
  const metrics = useApiDashboardMetrics()
  const overview = useApiDashboardOverview()
  const hourlyTransactions = useApiHourlyTransactions()
  const customerSegmentation = useApiCustomerSegmentation()
  const transactionsSummary = useApiTransactionsSummary()

  // Store actions
  const dashboardActions = useDashboardActions()
  const { notifyError, notifySuccess } = useNotificationHelpers()
  const { setGlobalLoading } = useUIActions()

  // Sync metrics data
  useEffect(() => {
    if (metrics.data) {
      dashboardActions.setMetrics(metrics.data)
    }
    if (metrics.error) {
      dashboardActions.setError(`Failed to load metrics: ${metrics.error.message}`)
      notifyError('Data Error', 'Failed to load dashboard metrics')
    }
  }, [metrics.data, metrics.error, dashboardActions, notifyError])

  // Sync overview data
  useEffect(() => {
    if (overview.data) {
      dashboardActions.setOverview(overview.data)
    }
    if (overview.error) {
      dashboardActions.setError(`Failed to load overview: ${overview.error.message}`)
      notifyError('Data Error', 'Failed to load dashboard overview')
    }
  }, [overview.data, overview.error, dashboardActions, notifyError])

  // Sync hourly transactions data
  useEffect(() => {
    if (hourlyTransactions.data) {
      dashboardActions.setHourlyTransactions(hourlyTransactions.data)
    }
    if (hourlyTransactions.error) {
      notifyError('Data Error', 'Failed to load hourly transactions data')
    }
  }, [hourlyTransactions.data, hourlyTransactions.error, dashboardActions, notifyError])

  // Sync customer segmentation data
  useEffect(() => {
    if (customerSegmentation.data) {
      dashboardActions.setCustomerSegmentation(customerSegmentation.data)
    }
    if (customerSegmentation.error) {
      notifyError('Data Error', 'Failed to load customer segmentation data')
    }
  }, [customerSegmentation.data, customerSegmentation.error, dashboardActions, notifyError])

  // Sync transactions summary data
  useEffect(() => {
    if (transactionsSummary.data) {
      dashboardActions.setTransactionsSummary(transactionsSummary.data)
    }
    if (transactionsSummary.error) {
      notifyError('Data Error', 'Failed to load transactions summary')
    }
  }, [transactionsSummary.data, transactionsSummary.error, dashboardActions, notifyError])

  // Manage global loading state
  useEffect(() => {
    const isLoading = metrics.isLoading || overview.isLoading || 
                     hourlyTransactions.isLoading || customerSegmentation.isLoading ||
                     transactionsSummary.isLoading
    
    dashboardActions.setLoading(isLoading)
    setGlobalLoading(isLoading)
  }, [
    metrics.isLoading, 
    overview.isLoading, 
    hourlyTransactions.isLoading,
    customerSegmentation.isLoading,
    transactionsSummary.isLoading,
    dashboardActions,
    setGlobalLoading
  ])

  // Show success notification when all initial data is loaded
  useEffect(() => {
    const hasAllData = metrics.data && overview.data && hourlyTransactions.data && 
                      customerSegmentation.data && transactionsSummary.data
    const isInitialLoad = !metrics.isFetching && !overview.isFetching && 
                         !hourlyTransactions.isFetching && !customerSegmentation.isFetching &&
                         !transactionsSummary.isFetching

    if (hasAllData && isInitialLoad) {
      notifySuccess(
        'Dashboard Ready', 
        'All dashboard data loaded successfully',
        3000
      )
    }
  }, [
    metrics.data, overview.data, hourlyTransactions.data,
    customerSegmentation.data, transactionsSummary.data,
    metrics.isFetching, overview.isFetching, hourlyTransactions.isFetching,
    customerSegmentation.isFetching, transactionsSummary.isFetching,
    notifySuccess
  ])

  return {
    // Return query states for components that need them
    metrics,
    overview,
    hourlyTransactions,
    customerSegmentation,
    transactionsSummary,
    
    // Computed states
    isLoading: metrics.isLoading || overview.isLoading || 
               hourlyTransactions.isLoading || customerSegmentation.isLoading ||
               transactionsSummary.isLoading,
    
    hasError: metrics.isError || overview.isError || 
              hourlyTransactions.isError || customerSegmentation.isError ||
              transactionsSummary.isError,
    
    isSuccess: metrics.isSuccess && overview.isSuccess && 
               hourlyTransactions.isSuccess && customerSegmentation.isSuccess &&
               transactionsSummary.isSuccess,

    // Refetch functions
    refetchAll: () => {
      metrics.refetch()
      overview.refetch()
      hourlyTransactions.refetch()
      customerSegmentation.refetch()
      transactionsSummary.refetch()
    },
  }
}

// Hook for syncing only essential dashboard data (metrics + overview)
export const useDashboardEssentialSync = () => {
  const metrics = useApiDashboardMetrics()
  const overview = useApiDashboardOverview()
  
  const dashboardActions = useDashboardActions()
  const { notifyError } = useNotificationHelpers()

  useEffect(() => {
    if (metrics.data) dashboardActions.setMetrics(metrics.data)
    if (metrics.error) {
      dashboardActions.setError(`Metrics error: ${metrics.error.message}`)
      notifyError('Connection Error', 'Failed to load dashboard metrics')
    }
  }, [metrics.data, metrics.error, dashboardActions, notifyError])

  useEffect(() => {
    if (overview.data) dashboardActions.setOverview(overview.data)
    if (overview.error) {
      dashboardActions.setError(`Overview error: ${overview.error.message}`)
      notifyError('Connection Error', 'Failed to load dashboard overview')
    }
  }, [overview.data, overview.error, dashboardActions, notifyError])

  useEffect(() => {
    const isLoading = metrics.isLoading || overview.isLoading
    dashboardActions.setLoading(isLoading)
  }, [metrics.isLoading, overview.isLoading, dashboardActions])

  return {
    metrics,
    overview,
    isLoading: metrics.isLoading || overview.isLoading,
    hasError: metrics.isError || overview.isError,
    isSuccess: metrics.isSuccess && overview.isSuccess,
    refetch: () => {
      metrics.refetch()
      overview.refetch()
    },
  }
}

// Auto-refresh hook based on user settings
export const useAutoRefreshData = () => {
  const { enabled, interval } = useAutoRefreshSettings()
  const { refetchAll } = useDashboardDataSync()

  useEffect(() => {
    if (!enabled) return

    const intervalId = setInterval(() => {
      refetchAll()
    }, interval * 1000)

    return () => clearInterval(intervalId)
  }, [enabled, interval, refetchAll])
}

// Hook for managing filter-based data refetching
export const useFilteredDataSync = () => {
  const appliedFilters = useAppliedFilters()
  const { refetchAll } = useDashboardDataSync()

  // Refetch data when filters change
  useEffect(() => {
    // Add a small delay to avoid too many rapid requests
    const timeoutId = setTimeout(() => {
      refetchAll()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [appliedFilters, refetchAll])
}

// Utility hook for component-level data synchronization
export const useComponentDataSync = <T>(
  queryResult: { data: T | undefined; error: any; isLoading: boolean },
  onSuccess: (data: T) => void,
  onError?: (error: any) => void
) => {
  useEffect(() => {
    if (queryResult.data) {
      onSuccess(queryResult.data)
    }
  }, [queryResult.data, onSuccess])

  useEffect(() => {
    if (queryResult.error && onError) {
      onError(queryResult.error)
    }
  }, [queryResult.error, onError])

  return {
    isLoading: queryResult.isLoading,
    hasError: !!queryResult.error,
    hasData: !!queryResult.data,
  }
}