// frontend/src/features/casos/inventario/types.ts

// ============================================
// MÉTRICAS
// ============================================
export interface InventarioMetrics {
  total_productos_rastreados: number | string;
  total_movimientos: number | string;
  productos_con_stock_bajo: number | string;
  productos_requieren_reabasto: number | string;
}

// ============================================
// MOVIMIENTOS POR TIPO
// ============================================
export interface MovimientosPorTipo {
  tipo: string;
  cantidad_movimientos: number | string;
  total_unidades: number | string;
}

// ============================================
// PRODUCTO MÁS MOVIDO
// ============================================
export interface ProductoMasMovido {
  product_id: number;
  product_name: string;
  categories: string | null;
  total_movimientos: number | string;
  total_entradas: number | string;
  total_salidas: number | string;
  stock_calculado: number | string;
}

// ============================================
// MOVIMIENTO RECIENTE
// ============================================
export interface MovimientoReciente {
  id: number;
  product_id: number;
  product_name: string;
  tipo: string;
  cantidad: number;
  fecha_hora: string | Date;
  ref_type: string;
  ref_id: number | null;
}

// ============================================
// TENDENCIA
// ============================================
export interface TendenciaMovimientos {
  fecha: string;
  entradas: number | string;
  salidas: number | string;
  neto: number | string;
}

// ============================================
// ANÁLISIS COMPLETO
// ============================================
export interface InventarioAnalysisData {
  metrics: InventarioMetrics;
  movimientos_por_tipo: MovimientosPorTipo[];
  productos_mas_movidos: ProductoMasMovido[];
  movimientos_recientes: MovimientoReciente[];
  tendencia: TendenciaMovimientos[];
  productos_criticos: ProductoMasMovido[];
}