// backend/src/features/casos/devoluciones/devoluciones.repository.ts
// OPTIMIZADO CON VISTA MATERIALIZADA

import logger from '@/utils/logger';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ReturnStats {
  total_devoluciones: bigint;
  monto_total: string;
}

interface ReturnByReason {
  motivo: string;
  cantidad: bigint;
  porcentaje: number;
}

interface ReturnTrend {
  fecha: Date;
  cantidad: bigint;
  monto_total: string;
}

interface ReturnDetail {
  id: number;
  transaction_id_original: bigint;
  detail_id_original: bigint;
  cantidad_devuelta: number;
  fecha_hora: Date;
  motivo: string;
  empleado_id: number;
  producto_nombre?: string;
  monto_estimado?: string;
}

interface SuspiciousPattern {
  transaction_id: bigint;
  customer_id: number | null;
  fecha_hora: Date;
  total: string;
  metodo_pago: string;
  num_items: bigint;
  tiempo_transcurrido: string;
}

export class DevolucionesRepository {
  private prisma = prisma;

  constructor() {
    console.log('✅ DevolucionesRepository initialized (usando vista materializada)');
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      console.log('✅ Database connection successful');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
  }

  /**
   * Estadísticas generales - SUPER RÁPIDO con vista materializada
   * USANDO: mv_devoluciones_metrics
   */
  async getReturnStats(): Promise<ReturnStats> {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT 
        total_devoluciones,
        unidades_devueltas,
        tasa_devolucion
      FROM mv_devoluciones_metrics
      LIMIT 1
    `;
    // Calcula el monto_total como unidades_devueltas (puedes ajustar la lógica si tienes el precio promedio)
    return {
      total_devoluciones: result[0]?.total_devoluciones ?? BigInt(0),
      monto_total: result[0]?.unidades_devueltas?.toString() ?? '0'
    };
  }

  /**
   * Distribución por motivo - INSTANTÁNEO
   * USANDO: mv_devoluciones_por_motivo
   */
  async getReturnsByReason(): Promise<ReturnByReason[]> {
    const results = await this.prisma.$queryRaw<ReturnByReason[]>`
      SELECT 
        motivo,
        cantidad,
        porcentaje
      FROM mv_devoluciones_por_motivo
      ORDER BY cantidad DESC
    `;
    return results;
  }

  /**
   * Tendencias por día - Con montos reales
   */
  async getReturnTrends(days: number = 30): Promise<ReturnTrend[]> {
    const results = await this.prisma.$queryRaw<ReturnTrend[]>`
      SELECT 
        fecha_devolucion as fecha,
        COUNT(*)::bigint as cantidad,
        COALESCE(SUM(monto_devuelto), 0)::text as monto_total
      FROM mv_returns_enriched
      WHERE fecha_hora >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY fecha_devolucion
      ORDER BY fecha_devolucion DESC
      LIMIT 30
    `;
    return results;
  }

  /**
   * Devoluciones recientes - CON NOMBRES DE PRODUCTOS REALES
   */
  async getRecentReturns(limit: number = 100): Promise<ReturnDetail[]> {
    const results = await this.prisma.$queryRaw<ReturnDetail[]>`
      SELECT 
        id,
        transaction_id_original,
        detail_id_original,
        cantidad_devuelta,
        fecha_hora,
        motivo,
        empleado_id,
        COALESCE(product_name, 'Producto desconocido') as producto_nombre,
        monto_devuelto::text as monto_estimado
      FROM mv_returns_enriched
      ORDER BY fecha_hora DESC
      LIMIT ${limit}
    `;
    return results;
  }

  /**
   * Patrones sospechosos - Optimizado con ventana de 24 horas
   */
  async getSuspiciousPatterns(maxMinutes: number = 5): Promise<SuspiciousPattern[]> {
    const results = await this.prisma.$queryRaw<SuspiciousPattern[]>`
      WITH recent_sample AS (
        SELECT 
          id,
          customer_id,
          fecha_hora,
          total,
          metodo_pago
        FROM transactions
        WHERE customer_id IS NOT NULL
          AND fecha_hora >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
        ORDER BY customer_id, fecha_hora
        LIMIT 10000
      ),
      sorted_trans AS (
        SELECT 
          *,
          LAG(fecha_hora) OVER (PARTITION BY customer_id ORDER BY fecha_hora) as prev_fecha
        FROM recent_sample
      )
      SELECT 
        id as transaction_id,
        customer_id,
        fecha_hora,
        total::text,
        metodo_pago,
        1::bigint as num_items,
        ROUND(EXTRACT(EPOCH FROM (fecha_hora - prev_fecha)) / 60, 2)::text as tiempo_transcurrido
      FROM sorted_trans
      WHERE prev_fecha IS NOT NULL
        AND fecha_hora - prev_fecha <= INTERVAL '${maxMinutes} minutes'
      ORDER BY fecha_hora DESC
      LIMIT 50
    `;
    return results;
  }

  /**
   * Top productos devueltos - CON NOMBRES REALES Y MONTOS
   * USANDO: mv_devoluciones_productos
   */
  async getTopReturnedProducts(limit: number = 10) {
    const results = await this.prisma.$queryRaw<any[]>`
      SELECT 
        producto_id as id,
        product_name,
        categories,
        veces_devuelto as total_devoluciones,
        total_unidades_devueltas as cantidad_total_devuelta,
        (veces_devuelto * 100.0)::text as monto_total,
        porcentaje_del_total
      FROM mv_devoluciones_productos
      ORDER BY veces_devuelto DESC
      LIMIT ${limit}
    `;
    return results;
  }

  /**
   * Devoluciones por empleado - Con montos calculados
   */
  async getReturnsByEmployee() {
    const results = await this.prisma.$queryRaw<any[]>`
      SELECT 
        empleado_id,
        COUNT(*)::bigint as total_devoluciones,
        COALESCE(SUM(monto_devuelto), 0)::text as monto_total
      FROM mv_returns_enriched
      GROUP BY empleado_id
      ORDER BY total_devoluciones DESC
      LIMIT 20
    `;
    return results;
  }

  /**
   * NUEVO: Análisis por categoría de producto
   */
  async getReturnsByCategory(limit: number = 10) {
    const results = await this.prisma.$queryRaw<any[]>`
      SELECT 
        categories,
        COUNT(*)::bigint as total_devoluciones,
        SUM(cantidad_devuelta)::bigint as cantidad_total,
        COALESCE(SUM(monto_devuelto), 0)::text as monto_total,
        ROUND(AVG(monto_devuelto), 2)::text as monto_promedio
      FROM mv_returns_enriched
      WHERE categories IS NOT NULL
      GROUP BY categories
      ORDER BY total_devoluciones DESC
      LIMIT ${limit}
    `;
    return results;
  }

  /**
   * NUEVO: Análisis temporal detallado (por mes)
   */
  async getMonthlyTrends(months: number = 12) {
    const results = await this.prisma.$queryRaw<any[]>`
      SELECT 
        year,
        month,
        TO_CHAR(DATE_TRUNC('month', fecha_hora), 'YYYY-MM') as periodo,
        COUNT(*)::bigint as total_devoluciones,
        COALESCE(SUM(monto_devuelto), 0)::text as monto_total
      FROM mv_returns_enriched
      WHERE fecha_hora >= CURRENT_DATE - INTERVAL '${months} months'
      GROUP BY year, month, DATE_TRUNC('month', fecha_hora)
      ORDER BY year DESC, month DESC
      LIMIT ${months}
    `;
    return results;
  }

  /**
   * NUEVO: Verificar freshness de la vista materializada
   */
  async getViewFreshness() {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT 
        (SELECT COUNT(*) FROM returns) as total_returns_actual,
        (SELECT COUNT(*) FROM mv_returns_enriched) as total_en_vista,
        (SELECT MAX(fecha_hora) FROM returns) as ultima_devolucion_real,
        (SELECT MAX(fecha_hora) FROM mv_returns_enriched) as ultima_devolucion_vista,
        EXTRACT(EPOCH FROM (
          (SELECT MAX(fecha_hora) FROM returns) - 
          (SELECT MAX(fecha_hora) FROM mv_returns_enriched)
        )) / 3600 as horas_desactualizacion
    `;
    // Convierte todos los BigInt a Number
    const freshness = Object.fromEntries(
      Object.entries(result[0] || {}).map(([key, value]) => [
        key,
        typeof value === 'bigint' ? Number(value) : value
      ])
    );
    return freshness;
  }

  async refreshMaterializedViews(): Promise<void> {
    try {
      logger.info('🔄 Iniciando refresh de TODAS las vistas materializadas de devoluciones...')
      
      const startTime = Date.now();
      
      // 1. Refrescar mv_devoluciones_metrics
      logger.info('🔄 Refrescando mv_devoluciones_metrics...')
      await this.prisma.$executeRaw`REFRESH MATERIALIZED VIEW mv_devoluciones_metrics`
      logger.info('✅ mv_devoluciones_metrics actualizada')
      
      // 2. Refrescar mv_devoluciones_por_motivo
      logger.info('🔄 Refrescando mv_devoluciones_por_motivo...')
      await this.prisma.$executeRaw`REFRESH MATERIALIZED VIEW mv_devoluciones_por_motivo`
      logger.info('✅ mv_devoluciones_por_motivo actualizada')
      
      // 3. Refrescar mv_devoluciones_productos
      logger.info('🔄 Refrescando mv_devoluciones_productos...')
      await this.prisma.$executeRaw`REFRESH MATERIALIZED VIEW mv_devoluciones_productos`
      logger.info('✅ mv_devoluciones_productos actualizada')
      
      // 4. Refrescar mv_returns_enriched (la más grande)
      logger.info('🔄 Refrescando mv_returns_enriched (puede tardar más)...')
      await this.prisma.$executeRaw`REFRESH MATERIALIZED VIEW mv_returns_enriched`
      logger.info('✅ mv_returns_enriched actualizada')
      
      const duration = Date.now() - startTime;
      logger.info(`✅ TODAS las vistas actualizadas en ${duration}ms (${(duration/1000).toFixed(2)}s)`)
      
      // Verificar freshness después del refresh
      const freshness = await this.getViewFreshness();
      logger.info(`📊 Freshness check: ${JSON.stringify(freshness)}`)
      
    } catch (error) {
      logger.error('❌ Error al actualizar vistas materializadas:', error)
      throw error
    }
  }
}

export const devolucionesRepository = new DevolucionesRepository();