// backend/src/features/casos/horarios/horarios.service.ts
// Service para el caso de uso: Patrones Horarios

import { SharedService } from '../../shared/shared.service'
import { horariosRepository } from './horarios.repository'

export class HorariosService extends SharedService {
  constructor() {
    super()
    this.logger.info('HorariosService initialized')
  }

  // ==========================================
  // MÉTRICAS PRINCIPALES
  // ==========================================
  
  async getMetrics() {
    try {
      this.logger.info('Service: Getting horarios metrics from real data')
      
      const metrics = await horariosRepository.getDashboardMetrics()
      
      return {
        totalTransactions: {
          value: this.formatNumber(metrics.totalTransactions),
          numeric: metrics.totalTransactions,
          label: 'Transacciones Analizadas'
        },
        annualROI: {
          value: '$220M+',
          numeric: 220000000,
          label: 'ROI Anual Identificado'
        },
        completionRate: {
          value: '14%',
          numeric: 14,
          label: 'Casos Completados (1/7)'
        },
        uniqueCustomers: {
          value: metrics.uniqueCustomers.toLocaleString(),
          numeric: metrics.uniqueCustomers,
          label: 'Clientes Únicos'
        },
        totalRevenue: {
          value: `$${(metrics.totalRevenue / 1000000).toFixed(1)}M`,
          numeric: metrics.totalRevenue,
          label: 'Ingresos Totales'
        },
        averageTransaction: {
          value: `$${metrics.averageTransaction.toFixed(2)}`,
          numeric: metrics.averageTransaction,
          label: 'Promedio por Transacción'
        }
      }
      
    } catch (error) {
      return this.handleError(error, 'getMetrics')
    }
  }

  // ==========================================
  // VISTA GENERAL
  // ==========================================
  
  async getOverview() {
    try {
      this.logger.info('Service: Getting horarios overview from real data')
      
      const [metrics, dateRange] = await Promise.all([
        horariosRepository.getDashboardMetrics(),
        horariosRepository.getDateRange()
      ])
      
      const overview = {
        summary: {
          totalTransactions: metrics.totalTransactions,
          totalRevenue: metrics.totalRevenue,
          uniqueCustomers: metrics.uniqueCustomers,
          averageTransaction: metrics.averageTransaction,
          dateRange: {
            start: dateRange.startDate,
            end: dateRange.endDate
          }
        },
        projectProgress: {
          completed: 1,
          pending: 6,
          percentage: 14
        },
        useCases: [
          {
            name: 'Patrones Horarios',
            status: 'Completado',
            roi: '$6.7M',
            priority: 'Alta',
            enabled: true
          },
          {
            name: 'Control Caducidad',
            status: 'Pendiente',
            roi: '$2.1M - $3.8M',
            priority: 'Alta',
            enabled: false
          },
          {
            name: 'Gestión Precios',
            status: 'Pendiente',
            roi: '$150M',
            priority: 'Crítica',
            enabled: false
          },
          {
            name: 'Identificación Clientes',
            status: 'Pendiente',
            roi: '$1.35B',
            priority: 'Crítica',
            enabled: false
          },
          {
            name: 'Seguimiento Inventario',
            status: 'Pendiente',
            roi: '$56.3M',
            priority: 'Media',
            enabled: false
          },
          {
            name: 'Métodos de Pago',
            status: 'Pendiente',
            roi: 'Control Riesgos',
            priority: 'Media',
            enabled: false
          },
          {
            name: 'Control Devoluciones',
            status: 'Pendiente',
            roi: '$1.13B',
            priority: 'Alta',
            enabled: false
          }
        ]
      }
      
      this.logger.info('Service: Horarios overview calculated successfully')
      return overview
      
    } catch (error) {
      return this.handleError(error, 'getOverview')
    }
  }

  // ==========================================
  // ANÁLISIS DE PATRONES HORARIOS
  // ==========================================
  
  async getHourlyAnalysis() {
    try {
      this.logger.info('Service: Getting hourly analysis from real data')
      
      const hourlyDistribution = await horariosRepository.getHourlyDistribution()
      
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
      
      this.logger.info('Service: Hourly analysis calculated successfully from real data')
      return result
      
    } catch (error) {
      return this.handleError(error, 'getHourlyAnalysis')
    }
  }

  // ==========================================
  // RESUMEN DE TRANSACCIONES
  // ==========================================
  
  async getTransactionsSummary() {
    try {
      this.logger.info('Service: Getting transactions summary from real data')
      
      const [
        metrics,
        paymentMethods,
        dateRange
      ] = await Promise.all([
        horariosRepository.getDashboardMetrics(),
        horariosRepository.getPaymentMethodDistribution(),
        horariosRepository.getDateRange()
      ])
      
      const dailyAverage = this.calculateDailyAverage(
        metrics.totalTransactions,
        dateRange.startDate,
        dateRange.endDate
      )
      
      return {
        total: metrics.totalTransactions,
        dailyAverage,
        weeklyTrend: 'N/A', // Requiere análisis temporal
        monthlyTrend: 'N/A', // Requiere análisis temporal
        paymentMethods: paymentMethods.reduce((acc, pm) => {
          const key = pm.paymentMethod.toLowerCase().replace(/[^a-z]/g, '')
          acc[key] = {
            percentage: Number(pm.percentage.toFixed(1)),
            transactions: pm.count,
            totalAmount: pm.totalAmount
          }
          return acc
        }, {} as Record<string, any>),
        averageTicket: metrics.averageTransaction,
        totalRevenue: metrics.totalRevenue,
        period: {
          start: dateRange.startDate,
          end: dateRange.endDate
        }
      }
      
    } catch (error) {
      return this.handleError(error, 'getTransactionsSummary')
    }
  }

  // ==========================================
  // SEGMENTACIÓN DE CLIENTES
  // ==========================================
  
  async getCustomerSegmentation() {
    try {
      this.logger.info('Service: Getting customer segmentation from real data')
      
      const metrics = await horariosRepository.getDashboardMetrics()
      
      const totalCustomers = metrics.uniqueCustomers
      
      // Distribución estimada (en el futuro vendría de queries específicas)
      const identifiedPercentage = 88.0
      const identifiedCount = Math.round(totalCustomers * (identifiedPercentage / 100))
      const anonymousCount = totalCustomers - identifiedCount
      
      const vipPercentage = 70.0
      const vipCount = Math.round(totalCustomers * (vipPercentage / 100))
      
      return {
        total: totalCustomers,
        identified: {
          count: identifiedCount,
          percentage: identifiedPercentage
        },
        anonymous: {
          count: anonymousCount,
          percentage: Number((100 - identifiedPercentage).toFixed(1))
        },
        vip: {
          count: vipCount,
          percentage: vipPercentage
        },
        revenue: {
          identified: `$${(metrics.totalRevenue * (identifiedPercentage / 100) / 1000000).toFixed(1)}M`,
          anonymous: `$${(metrics.totalRevenue * ((100 - identifiedPercentage) / 100) / 1000000).toFixed(1)}M`
        }
      }
      
    } catch (error) {
      return this.handleError(error, 'getCustomerSegmentation')
    }
  }
}

// Exportar instancia singleton
export const horariosService = new HorariosService()
