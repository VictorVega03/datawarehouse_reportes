// frontend/src/features/casos/devoluciones/types.ts

/**
 * Tipos para el Caso 7: Control de Devoluciones
 * Definidos inline según las mejores prácticas del proyecto
 */

export interface DevolucionesMetrics {
  totalDevoluciones: number | string;
  montoTotal: string;
  promedioMonto: string;
  tasaDevolucion: string;
}

export interface DevolucionesDistributionItem {
  id: string;
  label: string;
  value: number | string;
  porcentaje: number | string;
}

export interface DevolucionTrend {
  fecha: string;
  devoluciones: number | string;
  monto: string;
}

export interface DevolucionDetail {
  id: number | string;
  transactionId: string;
  producto: string;
  cantidad: number | string;
  monto: string;
  motivo: string;
  fecha: string;
  empleado: number | string;
}

export interface PatronSospechoso {
  transactionId: string;
  customerId: number | string | null;
  fecha: string;
  total: string;
  metodoPago: string;
  items: number | string;
  tiempoTranscurrido: string;
  nivelRiesgo: 'Alto' | 'Medio' | 'Bajo';
}

export interface ProductoDevuelto {
  id: number | string;
  nombre: string;
  categoria: string;
  totalDevoluciones: number | string;
  cantidadDevuelta: number | string;
  montoTotal: string;
}

export interface Recomendacion {
  tipo: string;
  prioridad: string;
  titulo: string;
  descripcion: string;
  accion: string;
  impactoEstimado: string;
}

export interface DevolucionesAnalysisData {
  metrics: DevolucionesMetrics;
  distribution: DevolucionesDistributionItem[];
  trends: DevolucionTrend[];
  recentReturns: DevolucionDetail[];
  suspiciousPatterns: PatronSospechoso[];
}