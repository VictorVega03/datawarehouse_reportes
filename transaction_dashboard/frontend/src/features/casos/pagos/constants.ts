// frontend/src/features/casos/pagos/constants.ts

/**
 * Constantes para el módulo de Métodos de Pago
 */

// Niveles de riesgo para transacciones
export const RISK_LEVELS = {
  CRITICAL: {
    threshold: 50000,
    label: 'Crítico',
    color: 'red',
    icon: '🔴'
  },
  HIGH: {
    threshold: 20000,
    label: 'Alto',
    color: 'orange',
    icon: '🟠'
  },
  MODERATE: {
    threshold: 10000,
    label: 'Moderado',
    color: 'yellow',
    icon: '🟡'
  },
  LOW: {
    threshold: 0,
    label: 'Bajo',
    color: 'green',
    icon: '🟢'
  }
} as const;

// Umbrales por defecto
export const DEFAULT_THRESHOLDS = {
  HIGH_RISK_MIN_AMOUNT: 10000,
  TREND_DAYS: 30,
  MAX_TABLE_ROWS: 20
} as const;

// Métodos de pago conocidos
export const PAYMENT_METHODS = {
  CASH: 'efectivo',
  CREDIT_CARD: 'tarjeta_credito',
  DEBIT_CARD: 'tarjeta_debito',
  TRANSFER: 'transferencia',
  OTHER: 'otro'
} as const;

// Colores para gráficos (siguiendo esquema Nivo)
export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4'
} as const;

// Prioridades de recomendaciones
export const RECOMMENDATION_PRIORITIES = {
  CRITICAL: 'crítica',
  HIGH: 'alta',
  MEDIUM: 'media',
  LOW: 'baja'
} as const;

// Configuración de refetch para queries
export const QUERY_CONFIG = {
  STALE_TIME: {
    ANALYSIS: 5 * 60 * 1000,      // 5 minutos
    DISTRIBUTION: 5 * 60 * 1000,  // 5 minutos
    HIGH_RISK: 3 * 60 * 1000,     // 3 minutos (más frecuente)
    TRENDS: 5 * 60 * 1000,        // 5 minutos
    RECOMMENDATIONS: 10 * 60 * 1000 // 10 minutos
  },
  RETRY: 2
} as const;

// Mensajes de la UI
export const UI_MESSAGES = {
  LOADING: 'Cargando datos de métodos de pago...',
  ERROR: 'Error al cargar datos',
  EMPTY: 'No hay datos disponibles para mostrar',
  NO_RECOMMENDATIONS: 'No hay recomendaciones disponibles en este momento'
} as const;

// Formato de números
export const NUMBER_FORMAT = {
  LOCALE: 'es-MX',
  CURRENCY: 'MXN'
} as const;