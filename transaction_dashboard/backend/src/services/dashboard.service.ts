// backend/src/services/dashboard.service.ts - ARREGLADO
import { dashboardRepository } from '../repositories/dashboard.repository'
import { logger } from '../utils/logger'

export class DashboardService {
  constructor() {
    // Inicialización del service
    logger.info('DashboardService initialized')
  }

  // Métricas principales del dashboard
  async getDashboardMetrics() {
    try {
      logger.info('Service: Getting dashboard metrics')

      // Por ahora, datos de ejemplo basados en tu HTML
      // Más adelante conectaremos con Prisma queries
      const metrics = {
        totalTransactions: {
          value: '2.92M',
          numeric: 2920000,
          label: 'Transacciones Analizadas'
        },
        annualROI: {
          value: '$220M+',
          numeric: 220000000,
          label: 'ROI Anual Identificado'
        },
        completionRate: {
          value: '70%',
          numeric: 70,
          label: 'Casos Completados'
        },
        uniqueCustomers: {
          value: '29,991',
          numeric: 29991,
          label: 'Clientes Únicos'
        }
      }

      logger.info('Service: Dashboard metrics calculated successfully')
      return metrics
    } catch (error) {
      logger.error('Error in getDashboardMetrics service:', error)
      throw error
    }
  }

  // Vista general del dashboard
  async getDashboardOverview() {
    try {
      logger.info('Service: Getting dashboard overview')

      const overview = {
        projectProgress: {
          completed: 7,
          pending: 3,
          percentage: 70
        },
        roiConsolidated: {
          min: 4400,
          max: 7333,
          paybackMonths: '1-2'
        },
        useCases: [
          {
            name: 'Patrones Horarios',
            status: 'Completado',
            roi: '$6.7M',
            priority: 'Alta'
          },
          {
            name: 'Control Caducidad',
            status: 'Completado',
            roi: '$2.1M - $3.8M',
            priority: 'Alta'
          },
          {
            name: 'Gestión Precios',
            status: 'Completado',
            roi: '$150M',
            priority: 'Crítica'
          }
        ]
      }

      logger.info('Service: Dashboard overview calculated successfully')
      return overview
    } catch (error) {
      logger.error('Error in getDashboardOverview service:', error)
      throw error
    }
  }

  // Análisis por horas
  async getHourlyAnalysis() {
  try {
    logger.info('Service: Getting hourly analysis from real data')
    
    // 👇 USAR DATOS REALES DEL REPOSITORY
    const hourlyDistribution = await dashboardRepository.getHourlyDistribution()
    
    if (hourlyDistribution.length === 0) {
      throw new Error('No hay datos de transacciones disponibles')
    }
    
    // Calcular hora pico
    const peakHour = hourlyDistribution.reduce((max, item) => 
      item.transactions > max.transactions ? item : max
    )
    
    // Calcular hora valle
    const valleyHour = hourlyDistribution.reduce((min, item) => 
      item.transactions < min.transactions ? item : min
    )
    
    // Calcular diferencia pico/valle
    const peakValleDifference = peakHour.transactions / valleyHour.transactions
    
    // Identificar horas de concentración (top 4 horas)
    const topHours = [...hourlyDistribution]
      .sort((a, b) => b.transactions - a.transactions)
      .slice(0, 4)
    
    const concentrationPercentage = topHours.reduce((sum, h) => sum + h.percentage, 0)
    
    // Calcular total de transacciones
    const totalTransactions = hourlyDistribution.reduce((sum, h) => sum + h.transactions, 0)
    
    // Estimación de ROI basado en optimización de recursos
    const estimatedROI = 6700000
    
    // Clasificar horas
    const avgTransactions = totalTransactions / hourlyDistribution.length
    const classifiedHours = hourlyDistribution.map(hour => {
      let classification: 'Pico' | 'Alto' | 'Normal' | 'Bajo' | 'Valle'
      let recommendation: string
      
      if (hour.transactions >= peakHour.transactions * 0.9) {
        classification = 'Pico'
        recommendation = 'Personal completo + sistemas optimizados'
      } else if (hour.transactions >= avgTransactions * 1.5) {
        classification = 'Alto'
        recommendation = 'Personal completo'
      } else if (hour.transactions >= avgTransactions * 0.7) {
        classification = 'Normal'
        recommendation = 'Personal estándar'
      } else if (hour.transactions >= avgTransactions * 0.4) {
        classification = 'Bajo'
        recommendation = 'Personal reducido'
      } else {
        classification = 'Valle'
        recommendation = 'Personal mínimo'
      }
      
      return {
        ...hour,
        classification,
        recommendation
      }
    })
    
    const result = {
      peakHour: peakHour.hour,
      peakPercentage: Number(peakHour.percentage.toFixed(1)),
      peakTransactions: peakHour.transactions,
      
      valleyHour: valleyHour.hour,
      valleyPercentage: Number(valleyHour.percentage.toFixed(1)),
      valleyTransactions: valleyHour.transactions,
      
      concentration: {
        hours: topHours.length,
        percentage: Number(concentrationPercentage.toFixed(1)),
        hoursList: topHours.map(h => h.hour)
      },
      
      peakValleDifference: Number(peakValleDifference.toFixed(1)),
      
      potentialROI: `$${(estimatedROI / 1000000).toFixed(1)}M`,
      potentialROINumeric: estimatedROI,
      
      totalTransactions,
      averagePerHour: Math.round(avgTransactions),
      
      hourlyDistribution: classifiedHours,
      
      insights: [
        `Hora pico: ${peakHour.hour} con ${peakHour.transactions.toLocaleString()} transacciones (${peakHour.percentage.toFixed(1)}%)`,
        `Concentración: ${concentrationPercentage.toFixed(1)}% de las ventas en solo ${topHours.length} horas`,
        `Diferencia pico-valle: ${peakValleDifference.toFixed(1)}x`,
        `Oportunidad de optimización: ${(concentrationPercentage / 100 * estimatedROI / 1000000).toFixed(1)}M`
      ],
      
      recommendations: [
        'Aumentar personal durante horas pico identificadas',
        'Optimizar sistemas de punto de venta para períodos de alto tráfico',
        'Considerar horarios especiales de descuentos en horas valle',
        'Implementar sistema de turnos basado en patrones identificados'
      ]
    }
    
    logger.info('Service: Hourly analysis calculated successfully from real data')
    return result
    
  } catch (error) {
    logger.error('Error in getHourlyAnalysis service:', error)
    throw error
  }
}

  // Resumen de transacciones
  async getTransactionsSummary() {
    try {
      logger.info('Service: Getting transactions summary')

      const summary = {
        total: 2920000,
        dailyAverage: 8000,
        weeklyTrend: '+5.2%',
        monthlyTrend: '+12.8%',
        paymentMethods: {
          creditCard: { percentage: 46.6, transactions: 1312696 },
          cash: { percentage: 43.0, transactions: 1314761 },
          voucher: { percentage: 10.3, transactions: 292543 }
        },
        averageTicket: 288.92
      }

      logger.info('Service: Transactions summary calculated successfully')
      return summary
    } catch (error) {
      logger.error('Error in getTransactionsSummary service:', error)
      throw error
    }
  }

  // Segmentación de clientes
  async getCustomerSegmentation() {
    try {
      logger.info('Service: Getting customer segmentation')

      const segmentation = {
        total: 29991,
        identified: {
          count: 26392,
          percentage: 88.0
        },
        anonymous: {
          count: 3599,
          percentage: 12.0
        },
        vip: {
          count: 24631,
          percentage: 82.1
        },
        revenue: {
          identified: '$19.9B',
          anonymous: '$2.7B'
        }
      }

      logger.info('Service: Customer segmentation calculated successfully')
      return segmentation
    } catch (error) {
      logger.error('Error in getCustomerSegmentation service:', error)
      throw error
    }
  }
}

// ✅ EXPORTAR INSTANCIA CORRECTAMENTE
export const dashboardService = new DashboardService()

// ✅ EXPORT DEFAULT TAMBIÉN (por si acaso)
export default dashboardService