// frontend/src/features/casos/clientes/index.ts
// Exports centralizados del caso de uso Clientes

// Página principal
export { ClientesPage } from './pages/ClientesPage'

// Componentes
export { ClientesMetrics } from './components/ClientesMetrics'
export { ClientesPieChart } from './components/ClientesPieChart'
export { ClientesBarChart } from './components/ClientesBarChart'
export { ClientesSegmentationTable } from './components/ClientesSegmentationTable'

// Hooks
export {
  useClientesMetrics,
  useClientesOverview,
  useClientesDistribution,
  useTopClientes,
  useClientesSegmentation,
  useRecencyAnalysis,
  useSpendingRanges
} from './hooks/useClientesData'

// Tipos
export type {
  ClientesMetrics as ClientesMetricsType,
  ClienteDistribution,
  TopCliente,
  ClienteSegmentation,
  RecencyAnalysis,
  SpendingRange,
  ClientesOverview,
  ApiResponse
} from './types'