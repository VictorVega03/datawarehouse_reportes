// backend/src/features/casos/pagos/pagos.controller.ts

import pagosService from '@/services/pagos.service';
import { Request, Response } from 'express';


class PagosController {
  /**
   * GET /api/v1/casos/pagos/test
   * Endpoint de prueba para verificar que el módulo funciona
   */
  async test(_req: Request, res: Response) {
    try {
      console.log('✅ [Controller] Test endpoint - Caso 6: Métodos de Pago');
      
      res.json({
        success: true,
        message: '✅ Módulo de Métodos de Pago funcionando correctamente',
        caso: 6,
        nombre: 'Registro del Método de Pago',
        endpoints: [
          'GET /api/v1/casos/pagos/test',
          'GET /api/v1/casos/pagos/analysis',
          'GET /api/v1/casos/pagos/distribution',
          'GET /api/v1/casos/pagos/high-risk',
          'GET /api/v1/casos/pagos/trends',
          'GET /api/v1/casos/pagos/by-hour',
          'GET /api/v1/casos/pagos/recommendations'
        ],
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ [Controller] Error en test:', error);
      res.status(500).json({
        success: false,
        error: 'Error en endpoint de prueba'
      });
    }
  }

  /**
   * GET /api/v1/casos/pagos/analysis
   * Obtiene el análisis completo de métodos de pago
   */
  async getAnalysis(_req: Request, res: Response) {
    try {
      console.log('📊 [Controller] Solicitando análisis completo de métodos de pago...');
      
      const analysis = await pagosService.getPaymentAnalysis();
      
      res.json({
        success: true,
        data: analysis,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ [Controller] Error en análisis:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener análisis'
      });
    }
  }

  /**
   * GET /api/v1/casos/pagos/distribution
   * Obtiene la distribución de métodos de pago
   */
  async getDistribution(_req: Request, res: Response) {
    try {
      console.log('📊 [Controller] Solicitando distribución de métodos de pago...');
      
      const distribution = await pagosService.getPaymentDistribution();
      
      res.json({
        success: true,
        data: distribution,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ [Controller] Error en distribución:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener distribución'
      });
    }
  }

  /**
   * GET /api/v1/casos/pagos/high-risk?minAmount=10000
   * Obtiene transacciones de alto riesgo
   */
  async getHighRisk(req: Request, res: Response) {
    try {
      const minAmount = parseInt(req.query.minAmount as string) || 10000;
      
      console.log(`🚨 [Controller] Solicitando transacciones de alto riesgo (>= $${minAmount})...`);
      
      const riskData = await pagosService.getHighRiskTransactions(minAmount);
      
      res.json({
        success: true,
        data: riskData,
        params: { minAmount },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ [Controller] Error en transacciones de alto riesgo:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener transacciones de alto riesgo'
      });
    }
  }

  /**
   * GET /api/v1/casos/pagos/trends?days=30
   * Obtiene tendencias de métodos de pago
   */
  async getTrends(req: Request, res: Response) {
    try {
      const days = parseInt(req.query.days as string) || 30;
      
      console.log(`📈 [Controller] Solicitando tendencias de ${days} días...`);
      
      const trends = await pagosService.getPaymentTrends(days);
      
      res.json({
        success: true,
        data: trends,
        params: { days },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ [Controller] Error en tendencias:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener tendencias'
      });
    }
  }

  /**
   * GET /api/v1/casos/pagos/by-hour
   * Obtiene distribución de métodos de pago por hora
   */
  async getByHour(_req: Request, res: Response) {
    try {
      console.log('⏰ [Controller] Solicitando distribución por hora...');
      
      const hourlyData = await pagosService.getPaymentsByHour();
      
      res.json({
        success: true,
        data: hourlyData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ [Controller] Error en distribución horaria:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener distribución horaria'
      });
    }
  }

  /**
   * GET /api/v1/casos/pagos/recommendations
   * Obtiene recomendaciones basadas en análisis de métodos de pago
   */
  async getRecommendations(_req: Request, res: Response) {
    try {
      console.log('💡 [Controller] Solicitando recomendaciones...');
      
      const recommendations = await pagosService.getRecommendations();
      
      res.json({
        success: true,
        data: recommendations,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ [Controller] Error en recomendaciones:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al generar recomendaciones'
      });
    }
  }
}

// Singleton export
const pagosController = new PagosController();
export default pagosController;
export { PagosController };