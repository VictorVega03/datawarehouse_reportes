import { Request, Response } from 'express'
import { logger } from '../utils/logger'
import { caducidadService } from '../services/caducidad.service'

class CaducidadController {
  // ===================================
  // ENDPOINT DE PRUEBA
  // ===================================
  
  testEndpoint = async (_req: Request, res: Response) => {
    try {
      logger.info('Caducidad test endpoint called')
      
      res.status(200).json({
        success: true,
        message: 'Caducidad API funcionando correctamente!',
        service: 'Control de Caducidad - Transaction Analytics',
        endpoint: '/api/v1/casos/caducidad/test',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      })
    } catch (error) {
      logger.error('Caducidad test endpoint error:', error)
      res.status(500).json({
        success: false,
        error: 'Error en endpoint de prueba',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // ===================================
  // MÉTRICAS PRINCIPALES
  // ===================================
  
  getMetrics = async (_req: Request, res: Response) => {
    try {
      logger.info('Getting caducidad metrics')
      
      const metrics = await caducidadService.getExpiryMetrics()
      
      logger.info('Caducidad metrics retrieved successfully')
      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      logger.error('Error getting caducidad metrics:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener métricas de caducidad',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // ===================================
  // ANÁLISIS COMPLETO DE CADUCIDAD
  // ===================================
  
  getCaducidadAnalysis = async (_req: Request, res: Response) => {
    try {
      logger.info('📋 Getting caducidad analysis')
      
      const analysis = await caducidadService.getExpiryControl()
      
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

  // ===================================
  // PRODUCTOS CRÍTICOS
  // ===================================
  
  getCriticalProducts = async (req: Request, res: Response) => {
    try {
      // Obtener parámetro de días (por defecto 7)
      const daysThreshold = parseInt(req.query.days as string) || 7
      
      logger.info(`⚠️ Getting critical products (threshold: ${daysThreshold} days)`)
      
      const products = await caducidadService.getCriticalProducts(daysThreshold)
      
      logger.info(`✅ Retrieved ${products.length} critical products`)
      res.status(200).json({
        success: true,
        data: products,
        count: products.length,
        threshold: daysThreshold,
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

  // ===================================
  // RECOMENDACIONES
  // ===================================
  
  getRecommendations = async (_req: Request, res: Response) => {
    try {
      logger.info('💡 Getting caducidad recommendations')
      
      const recommendations = await caducidadService.getRecommendations()
      
      logger.info(`✅ Retrieved ${recommendations.total} recommendations`)
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

// Exportar instancia singleton
export const caducidadController = new CaducidadController()