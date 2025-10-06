// backend/src/controllers/inventario.controller.ts

import { Request, Response } from 'express';
import { inventarioService } from '../services/inventario.service';
import { inventarioRepository } from '../repositories/inventario.repository';

export class InventarioController {
  
  // ============================================
  // 1. TEST ENDPOINT
  // ============================================
  
  testEndpoint = async (_req: Request, res: Response): Promise<void> => {
    try {
      console.log('[InventarioController] Test endpoint called');
      const result = await inventarioService.testConnection();
      
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('[InventarioController] Error en testEndpoint:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error interno del servidor',
        timestamp: new Date().toISOString()
      });
    }
  };

  // ============================================
  // 2. OBTENER SOLO MÉTRICAS
  // ============================================
  
  getMetrics = async (_req: Request, res: Response): Promise<void> => {
    try {
      console.log('[InventarioController] getMetrics called');
      const metrics = await inventarioService.getMetrics();
      
      res.json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('[InventarioController] Error en getMetrics:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error al obtener métricas',
        timestamp: new Date().toISOString()
      });
    }
  };

  // ============================================
  // 3. OBTENER MOVIMIENTOS POR TIPO
  // ============================================
  
  getMovimientosPorTipo = async (_req: Request, res: Response): Promise<void> => {
    try {
      console.log('[InventarioController] getMovimientosPorTipo called');
      const movimientos = await inventarioService.getMovimientosPorTipo();
      
      res.json({
        success: true,
        data: movimientos,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('[InventarioController] Error en getMovimientosPorTipo:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error al obtener movimientos',
        timestamp: new Date().toISOString()
      });
    }
  };

  // ============================================
  // 4. OBTENER PRODUCTOS MÁS MOVIDOS
  // ============================================
  
  getProductosMasMovidos = async (_req: Request, res: Response): Promise<void> => {
    try {
      console.log('[InventarioController] getProductosMasMovidos called');
      const productos = await inventarioService.getProductosMasMovidos();
      
      res.json({
        success: true,
        data: productos,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('[InventarioController] Error en getProductosMasMovidos:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error al obtener productos',
        timestamp: new Date().toISOString()
      });
    }
  };

  // ============================================
  // 5. OBTENER MOVIMIENTOS RECIENTES
  // ============================================
  
  getMovimientosRecientes = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('[InventarioController] getMovimientosRecientes called');
      const limit = parseInt(req.query.limit as string) || 50;
      console.log('[InventarioController] Limit:', limit);
      
      const movimientos = await inventarioRepository.getMovimientosRecientes(limit);
      
      res.json({
        success: true,
        data: movimientos,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('[InventarioController] Error en getMovimientosRecientes:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error al obtener movimientos recientes',
        timestamp: new Date().toISOString()
      });
    }
  };

  // ============================================
  // 6. OBTENER ANÁLISIS COMPLETO
  // ============================================
  
  getAnalisisCompleto = async (_req: Request, res: Response): Promise<void> => {
    try {
      console.log('[InventarioController] getAnalisisCompleto called');
      const analisis = await inventarioService.getInventarioAnalysis();
      
      res.json({
        success: true,
        data: analisis,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('[InventarioController] Error en getAnalisisCompleto:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error al obtener análisis',
        timestamp: new Date().toISOString()
      });
    }
  };

  // ============================================
  // 7. OBTENER TENDENCIA
  // ============================================
  
  getTendencia = async (_req: Request, res: Response): Promise<void> => {
    try {
      console.log('[InventarioController] getTendencia called');
      const tendencia = await inventarioService.getTendencia();
      
      res.json({
        success: true,
        data: tendencia,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('[InventarioController] Error en getTendencia:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error al obtener tendencia',
        timestamp: new Date().toISOString()
      });
    }
  };

  // ============================================
  // 8. OBTENER PRODUCTOS CRÍTICOS
  // ============================================
  
  getProductosCriticos = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('[InventarioController] getProductosCriticos called');
      const umbral = parseInt(req.query.umbral as string) || 20;
      console.log('[InventarioController] Umbral:', umbral);
      
      const productos = await inventarioService.getProductosCriticos(umbral);
      
      res.json({
        success: true,
        data: productos,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('[InventarioController] Error en getProductosCriticos:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error al obtener productos críticos',
        timestamp: new Date().toISOString()
      });
    }
  };

  // ============================================
  // 9. REFRESCAR VISTAS MATERIALIZADAS (NUEVO)
  // ============================================
  
  refreshVistas = async (_req: Request, res: Response): Promise<void> => {
    try {
      console.log('[InventarioController] refreshVistas called');
      console.log('[InventarioController] ⚠️ Esto puede tardar 2-3 minutos...');
      
      const result = await inventarioService.refreshVistas();
      
      res.json({
        success: true,
        message: result.message,
        duration_ms: result.duration,
        duration_seconds: Math.round(result.duration / 1000),
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('[InventarioController] Error al refrescar vistas:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error al refrescar vistas materializadas',
        timestamp: new Date().toISOString()
      });
    }
  };
}

// Singleton export
export const inventarioController = new InventarioController();