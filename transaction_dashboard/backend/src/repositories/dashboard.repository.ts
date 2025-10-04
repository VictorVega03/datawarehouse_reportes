import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class DashboardRepository {
  
  // ==========================================
  // CASO 1: PATRONES HORARIOS
  // ==========================================
  
  /**
   * Obtiene la distribución de transacciones por hora
   * Agrupa todas las transacciones por hora del día (0-23)
   */
  async getHourlyDistribution() {
    try {
      // Query con SQL raw para extraer la hora del timestamp
      const hourlyData = await prisma.$queryRaw<Array<{
        hour: number
        transaction_count: bigint
        total_amount: number
      }>>`
        SELECT 
          EXTRACT(HOUR FROM fecha_hora)::INTEGER as hour,
          COUNT(*)::BIGINT as transaction_count,
          SUM(total)::DECIMAL as total_amount
        FROM transactions
        GROUP BY EXTRACT(HOUR FROM fecha_hora)
        ORDER BY hour ASC
      `
      
      // Obtener total para calcular porcentajes
      const totalResult = await prisma.$queryRaw<Array<{ total: bigint }>>`
        SELECT COUNT(*)::BIGINT as total FROM transactions
      `
      const total = Number(totalResult[0].total)
      
      // Formatear resultados
      return hourlyData.map(item => ({
        hour: `${item.hour.toString().padStart(2, '0')}:00`,
        hourNumeric: Number(item.hour),
        transactions: Number(item.transaction_count),
        percentage: total > 0 ? (Number(item.transaction_count) / total) * 100 : 0,
        totalAmount: Number(item.total_amount || 0)
      }))
      
    } catch (error) {
      console.error('Error in getHourlyDistribution:', error)
      throw error
    }
  }
  
  /**
   * Obtiene estadísticas de transacciones por día de la semana
   */
  async getWeekdayDistribution() {
    try {
      const weekdayData = await prisma.$queryRaw<Array<{
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
   * Obtiene el rango de fechas de las transacciones
   */
  async getDateRange() {
    try {
      const result = await prisma.transaction.aggregate({
        _min: { fechaHora: true },
        _max: { fechaHora: true }
      })
      
      return {
        startDate: result._min.fechaHora,
        endDate: result._max.fechaHora
      }
    } catch (error) {
      console.error('Error in getDateRange:', error)
      throw error
    }
  }
  
  // ==========================================
  // MÉTRICAS GENERALES DEL DASHBOARD
  // ==========================================
  
  /**
   * Obtiene métricas agregadas del dashboard
   * OPTIMIZADO: Queries separadas para evitar timeout
   */
  async getDashboardMetrics() {
    try {
      console.log('🔍 getDashboardMetrics: Starting optimized queries...')
      
      // Query 1: Métricas básicas (rápida)
      const [basicStats] = await prisma.$queryRaw<Array<{
        total_transactions: bigint
        total_revenue: number
        avg_transaction: number
      }>>`
        SELECT 
          COUNT(*)::BIGINT as total_transactions,
          SUM(total)::DECIMAL as total_revenue,
          AVG(total)::DECIMAL as avg_transaction
        FROM transactions
      `
      
      console.log('✅ Basic stats completed')
      
      // Query 2: Clientes únicos (puede ser más lenta pero separada)
      const [customerStats] = await prisma.$queryRaw<Array<{
        unique_customers: bigint
      }>>`
        SELECT 
          COUNT(DISTINCT customer_id)::BIGINT as unique_customers
        FROM transactions
        WHERE customer_id IS NOT NULL
      `
      
      console.log('✅ Customer stats completed')
      
      const result = {
        totalTransactions: Number(basicStats.total_transactions),
        uniqueCustomers: Number(customerStats.unique_customers),
        totalRevenue: Number(basicStats.total_revenue || 0),
        averageTransaction: Number(basicStats.avg_transaction || 0)
      }
      
      console.log('✅ getDashboardMetrics completed:', {
        totalTransactions: result.totalTransactions,
        uniqueCustomers: result.uniqueCustomers
      })
      
      return result
      
    } catch (error) {
      console.error('❌ Error in getDashboardMetrics:', error)
      throw error
    }
  }
  
  /**
   * Obtiene distribución de métodos de pago
   */
  async getPaymentMethodDistribution() {
    try {
      const paymentData = await prisma.$queryRaw<Array<{
        metodo_pago: string
        count: bigint
        total_amount: number
      }>>`
        SELECT 
          metodo_pago,
          COUNT(*)::BIGINT as count,
          SUM(total)::DECIMAL as total_amount
        FROM transactions
        GROUP BY metodo_pago
        ORDER BY count DESC
      `
      
      const totalResult = await prisma.$queryRaw<Array<{ total: bigint }>>`
        SELECT COUNT(*)::BIGINT as total FROM transactions
      `
      const total = Number(totalResult[0].total)
      
      return paymentData.map(item => ({
        paymentMethod: item.metodo_pago,
        count: Number(item.count),
        percentage: total > 0 ? (Number(item.count) / total) * 100 : 0,
        totalAmount: Number(item.total_amount || 0)
      }))
      
    } catch (error) {
      console.error('Error in getPaymentMethodDistribution:', error)
      throw error
    }
  }
  
  /**
   * Obtiene transacciones en un rango horario específico
   */
  async getTransactionsByHourRange(startHour: number, endHour: number) {
    try {
      const result = await prisma.$queryRaw<Array<{
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
  
  /**
   * Verifica la salud de la conexión a la base de datos
   */
  async checkDatabaseHealth() {
    try {
      await prisma.$queryRaw`SELECT 1`
      const count = await prisma.transaction.count()
      return { 
        healthy: true, 
        transactionCount: count,
        message: `Conexión exitosa - ${count.toLocaleString()} transacciones en DB`
      }
    } catch (error) {
      console.error('Database health check failed:', error)
      return { 
        healthy: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
}

// Exportar instancia singleton
export const dashboardRepository = new DashboardRepository()