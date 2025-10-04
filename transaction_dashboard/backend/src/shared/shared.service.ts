// backend/src/features/shared/shared.service.ts
// Clase base para todos los servicios

import { logger } from '../utils/logger'

export class SharedService {
  protected logger: typeof logger

  constructor() {
    this.logger = logger
  }

  /**
   * Formatea números grandes a formato K/M
   */
  protected formatNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  /**
   * Calcula promedio diario de transacciones
   */
  protected calculateDailyAverage(total: number, startDate: Date | null, endDate: Date | null): number {
    if (!startDate || !endDate) return 0
    
    const daysDiff = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    
    return daysDiff > 0 ? Math.round(total / daysDiff) : 0
  }

  /**
   * Maneja errores de forma centralizada
   */
  protected handleError(error: unknown, operation: string): never {
    this.logger.error(`Error in ${operation}:`, error)
    throw error
  }
}
