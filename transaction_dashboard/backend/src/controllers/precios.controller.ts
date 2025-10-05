// backend/src/controllers/precios.controller.ts
import { Request, Response } from 'express'
import { preciosService } from '../services/precios.service'

class PreciosController {
  
  /**
   * Test endpoint para verificar conectividad
   * GET /api/v1/casos/precios/test
   */
  testEndpoint = async (_req: Request, res: Response) => {
    try {
      console.log('🧪 Precios test endpoint called')
      
      res.status(200).json({
        success: true,
        message: '🎉 Caso 3: Gestión de Precios API funcionando correctamente!',
        timestamp: new Date().toISOString(),
        caso: 'Gestión de Precios y Descuentos',
        roi_estimado: '$150M'
      })
    } catch (error) {
      console.error('❌ Precios test endpoint error:', error)
      res.status(500).json({
        success: false,
        error: 'Error en endpoint de prueba'
      })
    }
  }

  /**
   * Obtiene métricas generales de precios y descuentos
   * GET /api/v1/casos/precios/metrics
   */
  getMetrics = async (_req: Request, res: Response) => {
    try {
      console.log('📊 Getting precios metrics...')
      
      const metrics = await preciosService.getMetricsGenerales()
      
      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('❌ Error getting precios metrics:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener métricas de precios',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * Obtiene análisis completo de precios y descuentos
   * GET /api/v1/casos/precios/analisis
   */
  getAnalisisCompleto = async (_req: Request, res: Response) => {
    try {
      console.log('📊 Getting análisis completo de precios...')
      
      const data = await preciosService.getAnalisisCompleto()
      
      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('❌ Error getting análisis completo:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener análisis completo',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * Obtiene top productos con mayor descuento
   * GET /api/v1/casos/precios/productos/top-descuentos?limit=20
   */
  getTopProductosDescuento = async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20
      console.log(`📊 Getting top ${limit} productos con descuento...`)
      
      const productos = await preciosService.getTopProductosDescuento(limit)
      
      res.status(200).json({
        success: true,
        data: productos,
        count: productos.length,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('❌ Error getting top productos descuento:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener productos con descuento',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * Obtiene categorías con más descuentos
   * GET /api/v1/casos/precios/categorias/descuentos?limit=15
   */
  getCategoriasDescuentos = async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 15
      console.log(`📊 Getting top ${limit} categorías con descuentos...`)
      
      const categorias = await preciosService.getCategoriasConDescuentos(limit)
      
      res.status(200).json({
        success: true,
        data: categorias,
        count: categorias.length,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('❌ Error getting categorías descuentos:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener categorías con descuentos',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}

export const preciosController = new PreciosController()