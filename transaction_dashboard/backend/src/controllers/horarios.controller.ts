// backend/src/features/casos/horarios/horarios.controller.ts
// Controller para el caso de uso: Patrones Horarios

import { Request, Response } from 'express'
import { logger } from '../utils/logger'
import { horariosService } from '../services/horarios.service'

class HorariosController {
  // Endpoint de prueba
  testEndpoint = async (_req: Request, res: Response) => {
    try {
      logger.info('🧪 Horarios test endpoint called')
      
      res.status(200).json({
        success: true,
        message: '🎉 Horarios API funcionando correctamente!',
        service: 'Patrones Horarios - Transaction Analytics',
        endpoint: '/api/v1/casos/horarios/test',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      })
    } catch (error) {
      logger.error('❌ Horarios test endpoint error:', error)
      res.status(500).json({
        success: false,
        error: 'Error en endpoint de prueba',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Métricas principales
  getMetrics = async (_req: Request, res: Response) => {
    try {
      logger.info('📊 Getting horarios metrics')
      
      const metrics = await horariosService.getMetrics()
      
      logger.info('✅ Horarios metrics retrieved successfully')
      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      logger.error('❌ Error getting horarios metrics:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener métricas de horarios',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Vista general
  getOverview = async (_req: Request, res: Response) => {
    try {
      logger.info('📋 Getting horarios overview')
      
      const overview = await horariosService.getOverview()
      
      logger.info('✅ Horarios overview retrieved successfully')
      res.status(200).json({
        success: true,
        data: overview,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      logger.error('❌ Error getting horarios overview:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener vista general de horarios',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Análisis por horas
  getHourlyAnalysis = async (_req: Request, res: Response) => {
    try {
      logger.info('⏰ Getting hourly analysis')
      
      const hourlyData = await horariosService.getHourlyAnalysis()
      
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
      
      const summary = await horariosService.getTransactionsSummary()
      
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
      
      const segmentation = await horariosService.getCustomerSegmentation()
      
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

export const horariosController = new HorariosController()
