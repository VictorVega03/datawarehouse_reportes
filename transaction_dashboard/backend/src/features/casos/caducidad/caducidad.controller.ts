// backend/src/features/casos/caducidad/caducidad.controller.ts
// Controller para el caso de uso: Control de Caducidad

import { Request, Response } from 'express'
import { logger } from '../../../utils/logger'
import { caducidadService } from './caducidad.service'

class CaducidadController {
  // Endpoint de prueba
  testEndpoint = async (_req: Request, res: Response) => {
    try {
      logger.info('🧪 Caducidad test endpoint called')
      
      res.status(200).json({
        success: true,
        message: '🎉 Caducidad API funcionando correctamente!',
        service: 'Control de Caducidad - Transaction Analytics',
        endpoint: '/api/v1/casos/caducidad/test',
        status: '⏳ Pendiente de implementación',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      })
    } catch (error) {
      logger.error('❌ Caducidad test endpoint error:', error)
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
      logger.info('📊 Getting caducidad metrics')
      
      const metrics = await caducidadService.getMetrics()
      
      logger.info('✅ Caducidad metrics retrieved successfully')
      res.status(200).json({
        success: true,
        data: metrics,
        status: 'pending_implementation',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      logger.error('❌ Error getting caducidad metrics:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener métricas de caducidad',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Análisis de caducidad
  getCaducidadAnalysis = async (_req: Request, res: Response) => {
    try {
      logger.info('📋 Getting caducidad analysis')
      
      const analysis = await caducidadService.getCaducidadAnalysis()
      
      logger.info('✅ Caducidad analysis retrieved successfully')
      res.status(200).json({
        success: true,
        data: analysis,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      logger.error('❌ Error getting caducidad analysis:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener análisis de caducidad',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Productos críticos
  getCriticalProducts = async (req: Request, res: Response) => {
    try {
      const daysThreshold = parseInt(req.query.days as string) || 7
      
      logger.info(`⚠️ Getting critical products (<${daysThreshold} days)`)
      
      const products = await caducidadService.getCriticalProducts(daysThreshold)
      
      logger.info('✅ Critical products retrieved successfully')
      res.status(200).json({
        success: true,
        data: products,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      logger.error('❌ Error getting critical products:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener productos críticos',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Recomendaciones
  getRecommendations = async (_req: Request, res: Response) => {
    try {
      logger.info('💡 Getting caducidad recommendations')
      
      const recommendations = await caducidadService.getRecommendations()
      
      logger.info('✅ Recommendations retrieved successfully')
      res.status(200).json({
        success: true,
        data: recommendations,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      logger.error('❌ Error getting recommendations:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener recomendaciones',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}

export const caducidadController = new CaducidadController()
