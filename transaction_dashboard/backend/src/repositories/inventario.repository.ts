// backend/src/repositories/inventario.repository.ts

import { prisma } from '../config/database';

// ============================================
// INTERFACES - Tipos inline
// ============================================

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

// ============================================
// REPOSITORY CLASS
// ============================================

export class InventarioRepository {
  
  // ============================================
  // 1. MÉTRICAS GENERALES - VISTA MATERIALIZADA
  // ============================================
  
  async getInventarioMetrics(): Promise<StockMetrics> {
    try {
      console.log('[Repository] ========================================');
      console.log('[Repository] 📊 MÉTRICAS: Consultando vista materializada...');
      const startTime = Date.now();
      
      const result = await prisma.$queryRaw<StockMetrics[]>`
        SELECT * FROM mv_inventario_metrics;
      `;
      
      const elapsed = Date.now() - startTime;
      console.log(`[Repository] ✅ Métricas obtenidas en ${elapsed}ms (vista materializada)`);
      console.log('[Repository] ========================================');
      
      return result[0] || {
        total_productos_rastreados: '0',
        total_movimientos: '0',
        productos_con_stock_bajo: '0',
        productos_requieren_reabasto: '0'
      };
    } catch (error) {
      console.error('Error en getInventarioMetrics:', error);
      throw error;
    }
  }

  // ============================================
  // 2. MOVIMIENTOS POR TIPO - VISTA MATERIALIZADA
  // ============================================
  
  async getMovimientosPorTipo(): Promise<MovimientosPorTipo[]> {
    try {
      console.log('[Repository] ========================================');
      console.log('[Repository] 📊 MOVIMIENTOS POR TIPO: Consultando vista materializada...');
      const startTime = Date.now();
      
      const result = await prisma.$queryRaw<MovimientosPorTipo[]>`
        SELECT * FROM mv_inventario_movimientos_tipo;
      `;
      
      const elapsed = Date.now() - startTime;
      console.log(`[Repository] ✅ Movimientos obtenidos en ${elapsed}ms (vista materializada)`);
      console.log(`[Repository] 📤 Tipos devueltos: ${result.length}`);
      console.log('[Repository] ========================================');
      return result;
    } catch (error) {
      console.error('Error en getMovimientosPorTipo:', error);
      throw error;
    }
  }

  // ============================================
  // 3. PRODUCTOS MÁS MOVIDOS - VISTA MATERIALIZADA
  // ============================================
  
  async getProductosMasMovidos(limit: number = 20): Promise<ProductoMasMovido[]> {
    try {
      console.log('[Repository] ========================================');
      console.log('[Repository] 📊 PRODUCTOS MÁS MOVIDOS: Consultando vista materializada...');
      console.log(`[Repository] 🎯 Límite solicitado: ${limit} productos`);
      const startTime = Date.now();
      
      const result = await prisma.$queryRaw<ProductoMasMovido[]>`
        SELECT * FROM mv_inventario_productos_movidos
        ORDER BY total_movimientos::bigint DESC
        LIMIT ${limit};
      `;
      
      const elapsed = Date.now() - startTime;
      console.log(`[Repository] ✅ Top ${limit} productos obtenidos en ${elapsed}ms (vista materializada)`);
      console.log(`[Repository] 📤 Productos devueltos: ${result.length}`);
      if (result.length > 0) {
        console.log(`[Repository] 🔝 Producto #1: ${result[0]?.product_name} (${result[0]?.total_movimientos} movimientos)`);
      }
      console.log('[Repository] ========================================');
      return result;
    } catch (error) {
      console.error('Error en getProductosMasMovidos:', error);
      throw error;
    }
  }

  // ============================================
  // 4. MOVIMIENTOS RECIENTES (SIN CAMBIOS)
  // ============================================
  
  async getMovimientosRecientes(limit: number = 50): Promise<MovimientoReciente[]> {
    try {
      console.log(`[Repository] Obteniendo últimos ${limit} movimientos...`);
      const startTime = Date.now();
      
      const result = await prisma.$queryRaw<MovimientoReciente[]>`
        SELECT 
          im.id,
          im.product_id,
          p.product_name,
          im.tipo,
          im.cantidad,
          im.fecha_hora,
          im.ref_type,
          im.ref_id
        FROM inventory_moves im
        INNER JOIN products p ON im.product_id = p.id
        ORDER BY im.fecha_hora DESC
        LIMIT ${limit}
      `;
      
      console.log(`[Repository] Movimientos recientes obtenidos en ${Date.now() - startTime}ms`);
      return result;
    } catch (error) {
      console.error('Error en getMovimientosRecientes:', error);
      throw error;
    }
  }

  // ============================================
  // 5. TENDENCIA DE MOVIMIENTOS (SIN CAMBIOS)
  // ============================================
  
  async getTendenciaMovimientos(): Promise<TendenciaMovimientos[]> {
    try {
      const result = await prisma.$queryRaw<TendenciaMovimientos[]>`
        SELECT 
          DATE(fecha_hora)::text as fecha,
          SUM(CASE WHEN tipo = 'IN' THEN cantidad ELSE 0 END)::text as entradas,
          SUM(CASE WHEN tipo = 'OUT' THEN cantidad ELSE 0 END)::text as salidas,
          SUM(CASE WHEN tipo = 'IN' THEN cantidad ELSE -cantidad END)::text as neto
        FROM inventory_moves
        WHERE fecha_hora >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(fecha_hora)
        ORDER BY DATE(fecha_hora) ASC;
      `;
      
      return result;
    } catch (error) {
      console.error('Error en getTendenciaMovimientos:', error);
      throw error;
    }
  }

  // ============================================
  // 6. PRODUCTOS CON STOCK CRÍTICO
  // ============================================
  
  async getProductosStockCritico(umbral: number = 20): Promise<ProductoMasMovido[]> {
    try {
      console.log('[Repository] ========================================');
      console.log('[Repository] ⚠️ PRODUCTOS CRÍTICOS: Consultando vista materializada...');
      console.log(`[Repository] Umbral: ${umbral}`);
      const startTime = Date.now();
      
      const result = await prisma.$queryRaw<ProductoMasMovido[]>`
        SELECT * FROM mv_inventario_productos_movidos
        WHERE stock_calculado::bigint < ${umbral}
        ORDER BY stock_calculado::bigint ASC
        LIMIT 100;
      `;
      
      const elapsed = Date.now() - startTime;
      console.log(`[Repository] ✅ Productos críticos obtenidos en ${elapsed}ms (vista materializada)`);
      console.log(`[Repository] 📤 Productos en riesgo: ${result.length}`);
      console.log('[Repository] ========================================');
      return result;
    } catch (error) {
      console.error('Error en getProductosStockCritico:', error);
      throw error;
    }
  }

  // ============================================
  // 7. REFRESCAR VISTAS MATERIALIZADAS
  // ============================================
  
  async refreshMaterializedViews(): Promise<void> {
    try {
      console.log('[Repository] ========================================');
      console.log('[Repository] 🔄 REFRESCANDO VISTAS MATERIALIZADAS...');
      const startTime = Date.now();
      
      console.log('[Repository] Refrescando vista de métricas...');
      await prisma.$executeRaw`REFRESH MATERIALIZED VIEW mv_inventario_metrics`;
      
      console.log('[Repository] Refrescando vista de productos movidos...');
      await prisma.$executeRaw`REFRESH MATERIALIZED VIEW mv_inventario_productos_movidos`;
      
      console.log('[Repository] Refrescando vista de movimientos por tipo...');
      await prisma.$executeRaw`REFRESH MATERIALIZED VIEW mv_inventario_movimientos_tipo`;
      
      const elapsed = Date.now() - startTime;
      console.log(`[Repository] ✅ Vistas materializadas actualizadas en ${elapsed}ms`);
      console.log('[Repository] ========================================');
    } catch (error) {
      console.error('Error al refrescar vistas materializadas:', error);
      throw error;
    }
  }
}

// Singleton export
export const inventarioRepository = new InventarioRepository();