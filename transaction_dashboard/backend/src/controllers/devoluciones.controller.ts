import { Request, Response } from 'express';
import { devolucionesService } from '../services/devoluciones.service';
import { devolucionesRepository } from '../repositories/devoluciones.repository';
import logger from '@/utils/logger';

class DevolucionesController {
  constructor() {
    console.log('✅ DevolucionesController initialized');
  }

  /**
   * Test endpoint para verificar que la API funciona
   */
  testEndpoint = async (_req: Request, res: Response) => {
    try {
      console.log('🧪 Test endpoint called for Devoluciones');

      // Probar conexión a DB
      const isConnected = await devolucionesRepository.testConnection();

      res.status(200).json({
        success: true,
        message: '🎉 Caso 7: Control de Devoluciones API funcionando!',
        database: isConnected ? 'Conectada' : 'Desconectada',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('❌ Error in test endpoint:', error);
      res.status(500).json({
        success: false,
        error: 'Error en endpoint de prueba',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * Obtiene el análisis completo de devoluciones
   */
getAnalysis = async (_req: Request, res: Response) => {
  try {
    console.log('🔍 [DEBUG] getAnalysis called');
    console.log('📊 Getting devoluciones analysis...');
    
    const data = await devolucionesService.getDevolucionesAnalysis();
    
    console.log('✅ [DEBUG] Data retrieved:', {
      hasMetrics: !!data.metrics,
      hasDistribution: !!data.distribution,
      distributionLength: data.distribution?.length
    });

    res.status(200).json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ [DEBUG] Error in getAnalysis:', error);
    console.error('❌ [DEBUG] Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    res.status(500).json({
      success: false,
      error: 'Error al obtener análisis de devoluciones',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

  /**
   * Obtiene solo las métricas principales
   */
  getMetrics = async (_req: Request, res: Response) => {
    try {
      console.log('📊 Getting devoluciones metrics...');
      const metrics = await devolucionesService.getMetrics();

      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('❌ Error getting metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener métricas de devoluciones',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * Obtiene patrones sospechosos
   */
  getSuspiciousPatterns = async (req: Request, res: Response) => {
    try {
      const maxMinutes = parseInt(req.query.maxMinutes as string) || 5;
      console.log(`📊 Getting suspicious patterns (${maxMinutes} minutes)...`);

      const patterns = await devolucionesService.getSuspiciousPatterns(maxMinutes);

      res.status(200).json({
        success: true,
        data: patterns,
        filters: { maxMinutes },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('❌ Error getting suspicious patterns:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener patrones sospechosos',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * Obtiene productos más devueltos
   */
  getTopReturnedProducts = async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      console.log(`📊 Getting top ${limit} returned products...`);

      const products = await devolucionesService.getTopReturnedProducts(limit);

      res.status(200).json({
        success: true,
        data: products,
        filters: { limit },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('❌ Error getting top returned products:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener productos más devueltos',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * Obtiene recomendaciones basadas en el análisis
   */
  getRecommendations = async (_req: Request, res: Response) => {
    try {
      console.log('📊 Getting devoluciones recommendations...');
      const recommendations = await devolucionesService.getRecommendations();

      res.status(200).json({
        success: true,
        data: recommendations,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('❌ Error getting recommendations:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener recomendaciones',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

refreshVistas = async (_req: Request, res: Response) => {
  try {
    logger.info('🔄 Endpoint refresh-vistas llamado')
    
    const result = await devolucionesService.refreshVistas()
    
    logger.info(`✅ Vistas actualizadas exitosamente en ${result.duration}ms`)
    
    res.status(200).json({
      success: true,
      message: result.message,
      duration_ms: result.duration,
      duration_seconds: Math.round(result.duration / 1000),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.error('❌ Error en refreshVistas:', error)
    res.status(500).json({
      success: false,
      error: 'Error al actualizar vistas materializadas',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
}

// Singleton export
export const devolucionesController = new DevolucionesController();