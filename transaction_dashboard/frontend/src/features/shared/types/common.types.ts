// frontend/src/features/shared/types/common.types.ts
// Tipos comunes compartidos entre casos de uso

export interface Metric {
  value: string
  numeric: number
  label: string
}

export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface ChartDataPoint {
  label: string
  value: number
  percentage?: number
}

export type Priority = 'Alta' | 'Media' | 'Baja' | 'Crítica'
export type Status = 'Completado' | 'Pendiente' | 'En Progreso'
