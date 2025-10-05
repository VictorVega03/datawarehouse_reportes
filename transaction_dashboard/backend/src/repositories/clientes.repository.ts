// backend/src/features/casos/clientes/clientes.repository.ts
// Repository para el Caso de Uso 4: Identificación de Clientes
// SOLO DATOS REALES - NO HARDCODEAR

import { PrismaClient } from '@prisma/client'

// ===================================
// TIPOS INLINE (NO usar carpeta types/)
// ===================================

interface ClienteDistribution {
  tipo_cliente: string
  transacciones: bigint
  porcentaje: string
  ingresos: string
  ticket_promedio: string
}

interface TopCliente {
  customer_id: number
  num_transacciones: bigint
  valor_total: string
  ticket_promedio: string
  primera_compra: Date
  ultima_compra: Date
}

interface ClienteSegmentation {
  segmento: string
  num_clientes: bigint
  ingresos_totales: string
  ingreso_promedio_cliente: string
}

interface RecencyAnalysis {
  estado_recencia: string
  num_clientes: bigint
  valor_total: string
}

interface SpendingRangeDistribution {
  rango_gasto: string
  num_clientes: bigint
  ingresos_totales: string
  promedio_gasto: string
}

// ===================================
// SINGLETON REPOSITORY
// ===================================

class ClientesRepository {
  private static instance: ClientesRepository
  private prisma: PrismaClient

  private constructor() {
    this.prisma = new PrismaClient()
  }

  public static getInstance(): ClientesRepository {
    if (!ClientesRepository.instance) {
      ClientesRepository.instance = new ClientesRepository()
    }
    return ClientesRepository.instance
  }

  // ===================================
  // 1. DISTRIBUCIÓN: Identificados vs Anónimos
  // ===================================
  async getClienteDistribution(): Promise<ClienteDistribution[]> {
    const result = await this.prisma.$queryRaw<ClienteDistribution[]>`
      SELECT 
        CASE 
          WHEN customer_id IS NULL THEN 'Anónimo' 
          ELSE 'Identificado' 
        END as tipo_cliente,
        COUNT(*) as transacciones,
        ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER())::NUMERIC, 2)::TEXT as porcentaje,
        SUM(total)::TEXT as ingresos,
        ROUND(AVG(total)::NUMERIC, 2)::TEXT as ticket_promedio
      FROM transactions
      GROUP BY CASE WHEN customer_id IS NULL THEN 'Anónimo' ELSE 'Identificado' END
      ORDER BY transacciones DESC
    `
    return result
  }

  // ===================================
  // 2. TOP 20 CLIENTES por Frecuencia
  // ===================================
  async getTopClientesByFrequency(limit: number = 20): Promise<TopCliente[]> {
    const result = await this.prisma.$queryRaw<TopCliente[]>`
      SELECT 
        customer_id,
        COUNT(*) as num_transacciones,
        SUM(total)::TEXT as valor_total,
        ROUND(AVG(total)::NUMERIC, 2)::TEXT as ticket_promedio,
        MIN(fecha_hora) as primera_compra,
        MAX(fecha_hora) as ultima_compra
      FROM transactions
      WHERE customer_id IS NOT NULL
      GROUP BY customer_id
      ORDER BY num_transacciones DESC
      LIMIT ${limit}
    `
    return result
  }

  // ===================================
  // 3. TOP 20 CLIENTES por Valor Total
  // ===================================
  async getTopClientesByValue(limit: number = 20): Promise<TopCliente[]> {
    const result = await this.prisma.$queryRaw<TopCliente[]>`
      SELECT 
        customer_id,
        COUNT(*) as num_transacciones,
        SUM(total)::TEXT as valor_total,
        ROUND(AVG(total)::NUMERIC, 2)::TEXT as ticket_promedio,
        MIN(fecha_hora) as primera_compra,
        MAX(fecha_hora) as ultima_compra
      FROM transactions
      WHERE customer_id IS NOT NULL
      GROUP BY customer_id
      ORDER BY SUM(total) DESC
      LIMIT ${limit}
    `
    return result
  }

  // ===================================
  // 4. SEGMENTACIÓN por Frecuencia
  // ===================================
  async getClienteSegmentation(): Promise<ClienteSegmentation[]> {
    const result = await this.prisma.$queryRaw<ClienteSegmentation[]>`
      SELECT 
        CASE 
          WHEN num_compras >= 50 THEN 'VIP Platinum (50+)'
          WHEN num_compras >= 20 THEN 'VIP Gold (20-49)'
          WHEN num_compras >= 10 THEN 'Frecuente (10-19)'
          WHEN num_compras >= 5 THEN 'Regular (5-9)'
          ELSE 'Ocasional (1-4)'
        END as segmento,
        COUNT(DISTINCT customer_id) as num_clientes,
        SUM(total_compras)::TEXT as ingresos_totales,
        ROUND(AVG(total_compras)::NUMERIC, 2)::TEXT as ingreso_promedio_cliente
      FROM (
        SELECT 
          customer_id,
          COUNT(*) as num_compras,
          SUM(total) as total_compras
        FROM transactions
        WHERE customer_id IS NOT NULL
        GROUP BY customer_id
      ) subquery
      GROUP BY 
        CASE 
          WHEN num_compras >= 50 THEN 'VIP Platinum (50+)'
          WHEN num_compras >= 20 THEN 'VIP Gold (20-49)'
          WHEN num_compras >= 10 THEN 'Frecuente (10-19)'
          WHEN num_compras >= 5 THEN 'Regular (5-9)'
          ELSE 'Ocasional (1-4)'
        END
      ORDER BY SUM(total_compras) DESC
    `
    return result
  }

  // ===================================
  // 5. DISTRIBUCIÓN por Rango de Gasto
  // ===================================
  async getSpendingRangeDistribution(): Promise<SpendingRangeDistribution[]> {
    const result = await this.prisma.$queryRaw<SpendingRangeDistribution[]>`
      SELECT 
        CASE 
          WHEN total_gastado >= 100000 THEN 'Alto Valor (>$100K)'
          WHEN total_gastado >= 50000 THEN 'Medio-Alto ($50K-$100K)'
          WHEN total_gastado >= 20000 THEN 'Medio ($20K-$50K)'
          WHEN total_gastado >= 10000 THEN 'Medio-Bajo ($10K-$20K)'
          ELSE 'Bajo (<$10K)'
        END as rango_gasto,
        COUNT(*) as num_clientes,
        SUM(total_gastado)::TEXT as ingresos_totales,
        ROUND(AVG(total_gastado)::NUMERIC, 2)::TEXT as promedio_gasto
      FROM (
        SELECT 
          customer_id,
          SUM(total) as total_gastado
        FROM transactions
        WHERE customer_id IS NOT NULL
        GROUP BY customer_id
      ) subquery
      GROUP BY 
        CASE 
          WHEN total_gastado >= 100000 THEN 'Alto Valor (>$100K)'
          WHEN total_gastado >= 50000 THEN 'Medio-Alto ($50K-$100K)'
          WHEN total_gastado >= 20000 THEN 'Medio ($20K-$50K)'
          WHEN total_gastado >= 10000 THEN 'Medio-Bajo ($10K-$20K)'
          ELSE 'Bajo (<$10K)'
        END
      ORDER BY SUM(total_gastado) DESC
    `
    return result
  }

  // ===================================
  // 6. ANÁLISIS DE RECENCIA (última compra)
  // ===================================
  async getRecencyAnalysis(): Promise<RecencyAnalysis[]> {
    const result = await this.prisma.$queryRaw<RecencyAnalysis[]>`
      SELECT 
        CASE 
          WHEN dias_desde_ultima_compra <= 7 THEN 'Activo (última semana)'
          WHEN dias_desde_ultima_compra <= 30 THEN 'Reciente (último mes)'
          WHEN dias_desde_ultima_compra <= 90 THEN 'Inactivo (1-3 meses)'
          ELSE 'Perdido (>3 meses)'
        END as estado_recencia,
        COUNT(*) as num_clientes,
        SUM(total_gastado)::TEXT as valor_total
      FROM (
        SELECT 
          customer_id,
          MAX(fecha_hora) as ultima_compra,
          CURRENT_DATE - MAX(fecha_hora)::DATE as dias_desde_ultima_compra,
          SUM(total) as total_gastado
        FROM transactions
        WHERE customer_id IS NOT NULL
        GROUP BY customer_id
      ) subquery
      GROUP BY 
        CASE 
          WHEN dias_desde_ultima_compra <= 7 THEN 'Activo (última semana)'
          WHEN dias_desde_ultima_compra <= 30 THEN 'Reciente (último mes)'
          WHEN dias_desde_ultima_compra <= 90 THEN 'Inactivo (1-3 meses)'
          ELSE 'Perdido (>3 meses)'
        END
      ORDER BY COUNT(*) DESC
    `
    return result
  }

  // ===================================
  // 7. MÉTRICAS GENERALES
  // ===================================
  async getClientesMetrics() {
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT 
        COUNT(DISTINCT customer_id) FILTER (WHERE customer_id IS NOT NULL) as clientes_identificados,
        COUNT(*) FILTER (WHERE customer_id IS NULL) as transacciones_anonimas,
        COUNT(DISTINCT customer_id) FILTER (WHERE customer_id IS NOT NULL AND num_transacciones >= 50) as clientes_vip_platinum,
        COUNT(DISTINCT customer_id) FILTER (WHERE customer_id IS NOT NULL AND num_transacciones >= 20 AND num_transacciones < 50) as clientes_vip_gold,
        SUM(total) FILTER (WHERE customer_id IS NOT NULL)::TEXT as ingresos_identificados,
        SUM(total) FILTER (WHERE customer_id IS NULL)::TEXT as ingresos_anonimos
      FROM (
        SELECT 
          t.customer_id,
          t.total,
          COUNT(*) OVER (PARTITION BY t.customer_id) as num_transacciones
        FROM transactions t
      ) subquery
    `

    return result[0] || {}
  }
}

// ===================================
// EXPORT SINGLETON
// ===================================
export const clientesRepository = ClientesRepository.getInstance()