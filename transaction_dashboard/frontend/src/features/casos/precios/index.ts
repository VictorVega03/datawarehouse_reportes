// frontend/src/features/casos/precios/index.ts

// Pages
export { PreciosPage } from './pages/PreciosPage'

// Components
export { PreciosMetricsComponent } from './components/PreciosMetrics'
export { PreciosPieChart } from './components/PreciosPieChart'
export { PreciosBarChart } from './components/PreciosBarChart'
export { ProductosDescuentoTable } from './components/ProductosDescuentoTable'

// Hooks
export { 
  usePreciosAnalisis,
  useTopProductosDescuento,
  useCategoriasDescuentos
} from './hooks/usePreciosData'

// Types
export type * from './types'