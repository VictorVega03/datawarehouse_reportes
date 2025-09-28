// frontend/src/stores/index.ts
// Barrel exports for all stores

// Dashboard Store
export {
  useDashboardStore,
  useDashboardMetrics,
  //useDashboardOverview,
  //useDashboardUseCases,
  useDashboardLoading,
  useDashboardError,
  //useSelectedUseCase,
  //useDashboardStats,
  useDashboardActions,
} from './dashboardStore'

// Filters Store
export {
  useFiltersStore,
  useCurrentFilters,
  useAppliedFilters,
  useFiltersPanel,
  useFiltersUnsaved,
  useQuickFilters,
  useFiltersActions,
  useActiveFiltersCount,
  useFiltersDescription,
} from './filtersStore'

// UI Store
export {
  useUIStore,
  useSidebar,
  useTheme,
  useNotifications,
  useModals,
  useLoadingStates,
  usePageContext,
  useResponsive,
  useChartPreferences,
  useUIActions,
  useModalState,
  useUnreadNotificationsCount,
  useIsModalOpen,
  useNotificationHelpers,
} from './uiStore'

// Settings Store
export {
  useSettingsStore,
  useUserPreferences,
  useAutoRefresh,
  useExportSettings,
  useChartSettings,
  usePerformanceSettings,
  useNotificationSettings,
  useSettingsActions,
  useFormattedCurrency,
  useFormattedNumber,
  useFormattedDate,
  useFavoriteUseCases,
  useIsUseCaseFavorite,
} from './settingsStore'

// Store integration utilities
export { 
  useDashboardDataSync,
  useDashboardEssentialSync,
  useAutoRefreshData,
  useFilteredDataSync,
  useComponentDataSync
} from './integrations'