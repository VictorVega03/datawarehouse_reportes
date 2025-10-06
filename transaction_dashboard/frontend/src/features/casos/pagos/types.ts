// frontend/src/features/casos/pagos/types.ts

/**
 * IMPORTANTE: Todos los valores numéricos deben permitir string | number
 * porque el backend puede devolver strings en algunos casos
 */

export interface PaymentMethodDistribution {
  id: string;
  label: string;
  value: number | string;
  ingresos: number | string;
  porcentaje: number | string;
  ticket_promedio: number | string;
}

export interface PaymentAnalysisResumen {
  total_transacciones: number | string;
  total_ingresos: number | string;
  metodos_unicos: number | string;
  metodo_dominante: string;
  porcentaje_dominante: number | string;
  transacciones_alto_riesgo: number | string;
}

export interface RiskAnalysis {
  metodo_pago: string;
  transacciones_alto_valor: number | string;
  porcentaje_alto_valor: number | string;
  monto_alto_valor: number | string;
  total_transacciones: number | string;
}

export interface HighRiskTransaction {
  id: number | string;
  fecha_hora: string | Date;
  customer_id: number | null;
  metodo_pago: string;
  total: number | string;
  nivel_riesgo: string;
}

export interface RiskSummary {
  total_transacciones: number | string;
  monto_total: number | string;
  por_nivel: {
    critico: number | string;
    alto: number | string;
    moderado: number | string;
  };
}

export interface Recommendation {
  tipo: string;
  prioridad: 'crítica' | 'alta' | 'media' | 'baja';
  titulo: string;
  descripcion: string;
  impacto_estimado: string;
  acciones: string[];
}

export interface PaymentAnalysisData {
  resumen: PaymentAnalysisResumen;
  distribucion: Array<{
    metodo_pago: string;
    transacciones: number | string;
    porcentaje: number | string;
    ingresos: number | string;
    ticket_promedio: number | string;
    transaccion_minima: number | string;
    transaccion_maxima: number | string;
  }>;
  analisis_riesgo: RiskAnalysis[];
  timestamp: string;
}

export interface PaymentDistributionData {
  data: PaymentMethodDistribution[];
  timestamp: string;
}

export interface HighRiskData {
  summary: RiskSummary;
  transactions: HighRiskTransaction[];
  timestamp: string;
}

export interface RecommendationsData {
  recomendaciones: Recommendation[];
  resumen_analisis: {
    metodo_dominante: string;
    transacciones_alto_riesgo: number | string;
    metodos_disponibles: number | string;
  };
  timestamp: string;
}

export interface PaymentTrendsData {
  tendencias: Record<string, Array<{
    fecha: Date | string;
    transacciones: number | string;
    ingresos: number | string;
  }>>;
  periodo: {
    dias: number;
    desde: string;
    hasta: string;
  };
  timestamp: string;
}

export interface PaymentByHourData {
  data: Record<number, Array<{
    metodo_pago: string;
    transacciones: number | string;
    ingresos: number | string;
  }>>;
  timestamp: string;
}