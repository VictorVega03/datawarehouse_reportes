// backend/src/controllers/dashboard.controller.ts - IMPORT ARREGLADO
import { Request, Response } from 'express'
import { logger } from '../utils/logger'

// ✅ IMPORT CORREGIDO - usar default import si named import falla
let dashboardService: any

try {
  // Intentar import named primero
  const serviceModule = require('../services/dashboard.service')
  dashboardService = serviceModule.dashboardService || serviceModule.default
  
  if (!dashboardService) {
    throw new Error('DashboardService not found in module')
  }
  
  logger.info('✅ DashboardService imported successfully')
} catch (error) {
  logger.error('❌ Error importing DashboardService:', error)
  dashboardService = null
}

class DashboardController {
  // Endpoint de prueba
  testEndpoint = async (_req: Request, res: Response) => {
    try {
      logger.info('🧪 Dashboard test endpoint called')
      
      res.status(200).json({
        success: true,
        message: '🎉 Dashboard API funcionando correctamente!',
        service: 'Transaction Analytics Dashboard',
        endpoint: '/api/v1/dashboard/test',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      })
    } catch (error) {
      logger.error('❌ Dashboard test endpoint error:', error)
      res.status(500).json({
        success: false,
        error: 'Error en endpoint de prueba',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Métricas principales del dashboard
  getDashboardMetrics = async (_req: Request, res: Response) => {
    try {
      logger.info('📊 Getting dashboard metrics')
      
      // Verificar que dashboardService existe y tiene el método
      if (!dashboardService) {
        throw new Error('DashboardService not initialized')
      }
      
      if (typeof dashboardService.getDashboardMetrics !== 'function') {
        throw new Error('getDashboardMetrics method not available')
      }
      
      const metrics = await dashboardService.getDashboardMetrics()
      
      logger.info('✅ Dashboard metrics retrieved successfully')
      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      logger.error('❌ Error getting dashboard metrics:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener métricas del dashboard',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Vista general del dashboard
  getDashboardOverview = async (_req: Request, res: Response) => {
    try {
      logger.info('📋 Getting dashboard overview')
      
      if (!dashboardService || typeof dashboardService.getDashboardOverview !== 'function') {
        throw new Error('DashboardService not properly initialized')
      }
      
      const overview = await dashboardService.getDashboardOverview()
      
      logger.info('✅ Dashboard overview retrieved successfully')
      res.status(200).json({
        success: true,
        data: overview,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      logger.error('❌ Error getting dashboard overview:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener vista general del dashboard',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Análisis por horas
  getHourlyAnalysis = async (_req: Request, res: Response) => {
    try {
      logger.info('⏰ Getting hourly analysis')
      
      if (!dashboardService || typeof dashboardService.getHourlyAnalysis !== 'function') {
        throw new Error('DashboardService not properly initialized')
      }
      
      const hourlyData = await dashboardService.getHourlyAnalysis()
      
      logger.info('✅ Hourly analysis retrieved successfully')
      res.status(200).json({
        success: true,
        data: hourlyData,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      logger.error('❌ Error getting hourly analysis:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener análisis por horas',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Resumen de transacciones
  getTransactionsSummary = async (_req: Request, res: Response) => {
    try {
      logger.info('📈 Getting transactions summary')
      
      if (!dashboardService || typeof dashboardService.getTransactionsSummary !== 'function') {
        throw new Error('DashboardService not properly initialized')
      }
      
      const summary = await dashboardService.getTransactionsSummary()
      
      logger.info('✅ Transactions summary retrieved successfully')
      res.status(200).json({
        success: true,
        data: summary,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      logger.error('❌ Error getting transactions summary:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener resumen de transacciones',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Segmentación de clientes
  getCustomerSegmentation = async (_req: Request, res: Response) => {
    try {
      logger.info('👥 Getting customer segmentation')
      
      if (!dashboardService || typeof dashboardService.getCustomerSegmentation !== 'function') {
        throw new Error('DashboardService not properly initialized')
      }
      
      const segmentation = await dashboardService.getCustomerSegmentation()
      
      logger.info('✅ Customer segmentation retrieved successfully')
      res.status(200).json({
        success: true,
        data: segmentation,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      logger.error('❌ Error getting customer segmentation:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener segmentación de clientes',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}

export const dashboardController = new DashboardController()