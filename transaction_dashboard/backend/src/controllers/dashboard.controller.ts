import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { logger } from '../utils/logger';

class DashboardController {
  // Endpoint de prueba
  testEndpoint = async (_req: Request, res: Response) => {
    try {
      logger.info('Dashboard test endpoint called');
      
      res.status(200).json({
        message: '🎉 Dashboard API funcionando correctamente!',
        service: 'Transaction Analytics Dashboard',
        endpoint: '/api/v1/dashboard/test',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    } catch (error) {
      logger.error('Dashboard test endpoint error:', error);
      res.status(500).json({
        error: 'Error en endpoint de prueba',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Métricas principales del dashboard
  getDashboardMetrics = async (_req: Request, res: Response) => {
    try {
      logger.info('Getting dashboard metrics');
      
      const metrics = await dashboardService.getDashboardMetrics();
      
      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Error getting dashboard metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener métricas del dashboard',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Vista general del dashboard
  getDashboardOverview = async (_req: Request, res: Response) => {
    try {
      logger.info('Getting dashboard overview');
      
      const overview = await dashboardService.getDashboardOverview();
      
      res.status(200).json({
        success: true,
        data: overview,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Error getting dashboard overview:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener vista general del dashboard',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Análisis por horas
  getHourlyAnalysis = async (_req: Request, res: Response) => {
    try {
      logger.info('Getting hourly analysis');
      
      const hourlyData = await dashboardService.getHourlyAnalysis();
      
      res.status(200).json({
        success: true,
        data: hourlyData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Error getting hourly analysis:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener análisis por horas',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Resumen de transacciones
  getTransactionsSummary = async (_req: Request, res: Response) => {
    try {
      logger.info('Getting transactions summary');
      
      const summary = await dashboardService.getTransactionsSummary();
      
      res.status(200).json({
        success: true,
        data: summary,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Error getting transactions summary:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener resumen de transacciones',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Segmentación de clientes
  getCustomerSegmentation = async (_req: Request, res: Response) => {
    try {
      logger.info('Getting customer segmentation');
      
      const segmentation = await dashboardService.getCustomerSegmentation();
      
      res.status(200).json({
        success: true,
        data: segmentation,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Error getting customer segmentation:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener segmentación de clientes',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}

export const dashboardController = new DashboardController();