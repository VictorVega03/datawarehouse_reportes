// frontend/src/features/casos/clientes/types.ts
// Tipos TypeScript para el Caso de Uso 4: Identificación de Clientes

// ===================================
// MÉTRICAS PRINCIPALES
// ===================================

export interface ClientesMetrics {
  clientesIdentificados: number
  transaccionesAnonimas: number
  clientesVIPPlatinum: number
  clientesVIPGold: number
  ingresosIdentificados: string
  ingresosAnonimos: string
  porcentajeIdentificados: string
}

// ===================================
// DISTRIBUCIÓN
// ===================================

export interface ClienteDistribution {
  tipo_cliente: string
  transacciones: number
  porcentaje: string
  ingresos: string
  ticket_promedio: string
}

// ===================================
// TOP CLIENTES
// ===================================

export interface TopCliente {
  customer_id: number
  num_transacciones: number
  valor_total: string
  ticket_promedio: string
  primera_compra: string | Date
  ultima_compra: string | Date
}

// ===================================
// SEGMENTACIÓN
// ===================================

export interface ClienteSegmentation {
  segmento: string
  num_clientes: number
  ingresos_totales: string
  ingreso_promedio_cliente: string
}

// ===================================
// RECENCIA
// ===================================

export interface RecencyAnalysis {
  estado_recencia: string
  num_clientes: number
  valor_total: string
}

// ===================================
// RANGOS DE GASTO
// ===================================

export interface SpendingRange {
  rango_gasto: string
  num_clientes: number
  ingresos_totales: string
  promedio_gasto: string
}

// ===================================
// OVERVIEW COMPLETO
// ===================================

export interface ClientesOverview {
  distribution: ClienteDistribution[]
  topClientesByFrequency: TopCliente[]
  topClientesByValue: TopCliente[]
  segmentation: ClienteSegmentation[]
  recencyAnalysis: RecencyAnalysis[]
  spendingRanges: SpendingRange[]
}

// ===================================
// RESPONSE TYPES (API)
// ===================================

export interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  meta?: any
}