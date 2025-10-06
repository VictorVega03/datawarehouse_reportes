// backend/src/services/inventario.service.ts

import { inventarioRepository } from '../repositories/inventario.repository';

// Tipos locales para consistencia con otros services
interface StockMetrics {
  total_productos_rastreados: number | string;
  total_movimientos: number | string;
  productos_con_stock_bajo: number | string;
  productos_requieren_reabasto: number | string;
}

interface MovimientosPorTipo {
  tipo: string;
  cantidad_movimientos: number | string;
  total_unidades: number | string;
}

interface ProductoMasMovido {
  product_id: number;
  product_name: string;
  categories: string | null;
  total_movimientos: number | string;
  total_entradas: number | string;
  total_salidas: number | string;
  stock_calculado: number | string;
}

interface MovimientoReciente {
  id: number;
  product_id: number;
  product_name: string;
  tipo: string;
  cantidad: number;
  fecha_hora: Date;
  ref_type: string;
  ref_id: number | null;
}

interface TendenciaMovimientos {
  fecha: string;
  entradas: number | string;
  salidas: number | string;
  neto: number | string;
}

interface InventarioAnalysisData {
  metrics: StockMetrics;
  movimientos_por_tipo: MovimientosPorTipo[];
  productos_mas_movidos: ProductoMasMovido[];
  movimientos_recientes: MovimientoReciente[];
  tendencia: TendenciaMovimientos[];
  productos_criticos: ProductoMasMovido[];
}

export class InventarioService {

  // ============================================
  // EXTRA: OBTENER MOVIMIENTOS POR TIPO
  // ============================================
  async getMovimientosPorTipo(): Promise<MovimientosPorTipo[]> {
    return inventarioRepository.getMovimientosPorTipo();
  }

  // ============================================
  // EXTRA: OBTENER PRODUCTOS MÁS MOVIDOS
  // ============================================
  async getProductosMasMovidos(limit: number = 10): Promise<ProductoMasMovido[]> {
    return inventarioRepository.getProductosMasMovidos(limit);
  }
  
  // ============================================
  // 1. OBTENER ANÁLISIS COMPLETO DE INVENTARIO
  // ============================================
  
  async getInventarioAnalysis(): Promise<InventarioAnalysisData> {
    try {
      console.log('[InventarioService] ========== INICIO ==========');
      console.log('[InventarioService] Obteniendo análisis de inventario...');
      
      console.log('[InventarioService] 1/3 - Obteniendo métricas...');
      const startMetrics = Date.now();
      const metrics: StockMetrics = await inventarioRepository.getInventarioMetrics();
      console.log(`[InventarioService] ✅ Métricas obtenidas en ${Date.now() - startMetrics}ms`);
      
      console.log('[InventarioService] 2/3 - Obteniendo movimientos por tipo...');
      const startMovimientos = Date.now();
      const movimientosPorTipo: MovimientosPorTipo[] = await inventarioRepository.getMovimientosPorTipo();
      console.log(`[InventarioService] ✅ Movimientos obtenidos en ${Date.now() - startMovimientos}ms`);
      
      console.log('[InventarioService] 3/3 - Obteniendo productos más movidos...');
      const startProductos = Date.now();
      const productosMasMovidos: ProductoMasMovido[] = await inventarioRepository.getProductosMasMovidos(10);
      console.log(`[InventarioService] ✅ Productos obtenidos en ${Date.now() - startProductos}ms`);

      console.log('[InventarioService] ========== FIN OK ==========');

      return {
        metrics,
        movimientos_por_tipo: movimientosPorTipo,
        productos_mas_movidos: productosMasMovidos,
        movimientos_recientes: [],
        tendencia: [],
        productos_criticos: []
      };
    } catch (error) {
      console.error('[InventarioService] ========== ERROR ==========');
      console.error('[InventarioService] Error en getInventarioAnalysis:', error);
      throw error;
    }
  }

  // ============================================
  // 2. OBTENER SOLO MÉTRICAS
  // ============================================
  
  async getMetrics(): Promise<StockMetrics> {
    try {
      console.log('[InventarioService] Obteniendo métricas de inventario...');
      const metrics = await inventarioRepository.getInventarioMetrics();
      console.log('[InventarioService] Métricas obtenidas');
      return metrics;
    } catch (error) {
      console.error('[InventarioService] Error en getMetrics:', error);
      throw error;
    }
  }

  // ============================================
  // 3. OBTENER TENDENCIA DE MOVIMIENTOS
  // ============================================
  
  async getTendencia(): Promise<TendenciaMovimientos[]> {
    try {
      console.log('[InventarioService] Obteniendo tendencia de movimientos...');
      const tendencia = await inventarioRepository.getTendenciaMovimientos();
      console.log('[InventarioService] Tendencia obtenida:', tendencia.length, 'días');
      return tendencia;
    } catch (error) {
      console.error('[InventarioService] Error en getTendencia:', error);
      throw error;
    }
  }

  // ============================================
  // 4. OBTENER PRODUCTOS CRÍTICOS
  // ============================================
  
  async getProductosCriticos(umbral: number = 20): Promise<ProductoMasMovido[]> {
    try {
      console.log('[InventarioService] Obteniendo productos críticos (umbral:', umbral, ')');
      const productos = await inventarioRepository.getProductosStockCritico(umbral);
      console.log('[InventarioService] Productos críticos encontrados:', productos.length);
      return productos;
    } catch (error) {
      console.error('[InventarioService] Error en getProductosCriticos:', error);
      throw error;
    }
  }

  // ============================================
  // 5. REFRESCAR VISTAS MATERIALIZADAS (NUEVO)
  // ============================================
  
  async refreshVistas(): Promise<{ message: string; duration: number }> {
    try {
      console.log('[InventarioService] Iniciando refresh de vistas materializadas...');
      const startTime = Date.now();
      
      await inventarioRepository.refreshMaterializedViews();
      
      const duration = Date.now() - startTime;
      console.log('[InventarioService] Vistas actualizadas correctamente');
      
      return {
        message: 'Vistas materializadas actualizadas correctamente',
        duration
      };
    } catch (error) {
      console.error('[InventarioService] Error al refrescar vistas:', error);
      throw error;
    }
  }

  // ============================================
  // 6. TEST ENDPOINT
  // ============================================
  
  async testConnection(): Promise<{ status: string; message: string; sample_data: StockMetrics }> {
    try {
      console.log('[InventarioService] Testing inventario service...');
      const metrics = await inventarioRepository.getInventarioMetrics();
      return {
        status: 'ok',
        message: 'Servicio de inventario funcionando correctamente (con vistas materializadas)',
        sample_data: metrics
      };
    } catch (error) {
      console.error('[InventarioService] Error en testConnection:', error);
      throw error;
    }
  }
}

// Singleton export
export const inventarioService = new InventarioService();