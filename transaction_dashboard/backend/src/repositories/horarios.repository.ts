// backend/src/features/casos/horarios/horarios.repository.ts
// Repository para el caso de uso: Patrones Horarios

import { SharedRepository } from '../shared/shared.repository'

export class HorariosRepository extends SharedRepository {
  
  // ==========================================
  // PATRONES HORARIOS - QUERIES
  // ==========================================
  // ✅ getHourlyDistribution() heredado de SharedRepository
  // ✅ getDashboardMetrics() heredado de SharedRepository
  // ✅ getDateRange() heredado de SharedRepository
  // ✅ getPaymentMethodDistribution() heredado de SharedRepository
  
  /**
   * Obtiene estadísticas de transacciones por día de la semana
   */
  async getWeekdayDistribution() {
    try {
      const weekdayData = await this.prisma.$queryRaw<Array<{
        day_of_week: number
        transaction_count: bigint
        total_amount: number
      }>>`
        SELECT 
          EXTRACT(DOW FROM fecha_hora)::INTEGER as day_of_week,
          COUNT(*)::BIGINT as transaction_count,
          SUM(total)::DECIMAL as total_amount
        FROM transactions
        GROUP BY EXTRACT(DOW FROM fecha_hora)
        ORDER BY day_of_week ASC
      `
      
      const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
      
      return weekdayData.map(item => ({
        dayOfWeek: Number(item.day_of_week),
        dayName: dayNames[Number(item.day_of_week)],
        transactions: Number(item.transaction_count),
        totalAmount: Number(item.total_amount)
      }))
      
    } catch (error) {
      console.error('Error in getWeekdayDistribution:', error)
      throw error
    }
  }
  
  /**
   * Obtiene transacciones en un rango horario específico
   */
  async getTransactionsByHourRange(startHour: number, endHour: number) {
    try {
      const result = await this.prisma.$queryRaw<Array<{
        count: bigint
        total_amount: number
      }>>`
        SELECT 
          COUNT(*)::BIGINT as count,
          SUM(total)::DECIMAL as total_amount
        FROM transactions
        WHERE EXTRACT(HOUR FROM fecha_hora)::INTEGER BETWEEN ${startHour} AND ${endHour}
      `
      
      return {
        count: Number(result[0]?.count || 0),
        totalAmount: Number(result[0]?.total_amount || 0)
      }
      
    } catch (error) {
      console.error('Error in getTransactionsByHourRange:', error)
      throw error
    }
  }
  
  // Métodos específicos de horarios pueden agregarse aquí en el futuro
}

// Exportar instancia singleton
export const horariosRepository = new HorariosRepository()
