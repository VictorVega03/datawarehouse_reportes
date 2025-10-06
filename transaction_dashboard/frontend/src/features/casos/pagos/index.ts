// frontend/src/features/casos/pagos/index.ts

// Exportar página principal
export { PagosPage } from './pages/PagosPage';

// Exportar componentes
export { PagosMetrics } from './components/PagosMetrics';
export { PagosPieChart } from './components/PagosPieChart';
export { HighRiskTable } from './components/HighRiskTable';

// Exportar hooks
export {
  usePagosAnalysis,
  usePagosDistribution,
  usePagosHighRisk,
  usePagosRecommendations,
  usePagedosTrends,
  usePagosByHour
} from './hooks/usePagosData';

// Exportar tipos
export type {
  PaymentMethodDistribution,
  PaymentAnalysisResumen,
  RiskAnalysis,
  HighRiskTransaction,
  RiskSummary,
  Recommendation,
  PaymentAnalysisData,
  PaymentDistributionData,
  HighRiskData,
  RecommendationsData,
  PaymentTrendsData,
  PaymentByHourData
} from './types';