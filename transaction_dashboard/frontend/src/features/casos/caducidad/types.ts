export interface ExpiryMetrics {
  lotesVencidos: number;
  lotesCriticos: number;
  lotesUrgentes: number;
  lotesEnRiesgo: number;
  ahorroEstimado: string;
}

export interface ExpiryDistributionItem {
  estado: string;
  lotes: number;
  productos: number;
  porcentaje: number;
}

export interface CategoryRiskItem {
  categoria: string;
  productosEnRiesgo: number;
  lotesEnRiesgo: number;
}

export interface CriticalProduct {
  id: number;
  nombre: string;
  categoria: string;
  lote: string;
  fechaCaducidad: Date;
  diasDiferencia: number;
  urgencia: string;
  accionRequerida: string;
}

export interface ExpiryControlData {
  metrics: ExpiryMetrics;
  distribution: ExpiryDistributionItem[];
  categories: CategoryRiskItem[];
  criticalProducts: CriticalProduct[];
}

export interface RecommendationItem {
  tipo: string;
  prioridad: number;
  mensaje: string;
  accion: string;
  impacto: string;
}

export interface RecommendationsData {
  total: number;
  recomendaciones: RecommendationItem[];
  ahorroEstimado: string;
  timestamp: Date;
}