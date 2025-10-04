// backend/src/features/shared/shared.repository.ts
// Clase base para todos los repositorios

import { PrismaClient } from '@prisma/client'

// ✅ SINGLETON: Una sola instancia de PrismaClient para toda la app
const prisma = new PrismaClient()

export class SharedRepository {
  protected prisma: PrismaClient

  constructor() {
    this.prisma = prisma // ✅ Usar la misma instancia
  }

  /**
   * Verifica la salud de la conexión a la base de datos
   */
  async checkDatabaseHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`
      const count = await this.prisma.transaction.count()
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

  /**
   * Obtiene el rango de fechas de las transacciones
   */
  async getDateRange() {
    try {
      const result = await this.prisma.transaction.aggregate({
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

  /**
   * Obtiene métricas agregadas generales
   */
  async getDashboardMetrics() {
    try {
      console.log('🔍 SharedRepository: Ejecutando getDashboardMetrics...')
      const [statsResult] = await this.prisma.$queryRaw<Array<{
        total_transactions: bigint
        unique_customers: bigint
        total_revenue: number
        avg_transaction: number
      }>>`
        SELECT 
          COUNT(*)::BIGINT as total_transactions,
          COUNT(DISTINCT customer_id) FILTER (WHERE customer_id IS NOT NULL)::BIGINT as unique_customers,
          SUM(total)::DECIMAL as total_revenue,
          AVG(total)::DECIMAL as avg_transaction
        FROM transactions
      `
      
      console.log('✅ getDashboardMetrics result:', {
        totalTransactions: Number(statsResult.total_transactions),
        uniqueCustomers: Number(statsResult.unique_customers)
      })
      
      const result = {
        totalTransactions: Number(statsResult.total_transactions),
        uniqueCustomers: Number(statsResult.unique_customers),
        totalRevenue: Number(statsResult.total_revenue || 0),
        averageTransaction: Number(statsResult.avg_transaction || 0)
      }
      
      console.log('✅ SharedRepository: getDashboardMetrics completado exitosamente')
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
      const paymentData = await this.prisma.$queryRaw<Array<{
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
      
      const totalResult = await this.prisma.$queryRaw<Array<{ total: bigint }>>`
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
   * Obtiene la distribución de transacciones por hora
   */
  async getHourlyDistribution() {
    try {
      const hourlyData = await this.prisma.$queryRaw<Array<{
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
      
      const totalResult = await this.prisma.$queryRaw<Array<{ total: bigint }>>`
        SELECT COUNT(*)::BIGINT as total FROM transactions
      `
      const total = Number(totalResult[0].total)
      
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
}

// ✅ Exportar también la instancia de Prisma para uso directo si es necesario
export { prisma }
