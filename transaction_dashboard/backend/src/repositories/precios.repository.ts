// backend/src/repositories/precios.repository.ts
import { PrismaClient } from '@prisma/client'

export interface PreciosMetrics {
  totalTransaccionesDetalle: number
  transaccionesConDescuento: number
  porcentajeConDescuento: number
  ingresosSinDescuento: number
  totalDescuentos: number
  ingresosNetos: number
  porcentajeDescuentoPromedio: number
}

export interface DistribucionDescuento {
  rangoDescuento: string
  numTransacciones: number
  valorSubtotal: number
  montoDescuentos: number
  promedioPorcentaje: number
}

export interface ProductoDescuento {
  productoId: number
  productName: string
  categoria: string | null
  vecesVendido: number
  cantidadTotal: number
  precioPromedio: number
  descuentoTotal: number
  porcentajeDescuentoPromedio: number
}

export interface CategoriaDescuento {
  categoria: string | null
  transacciones: number
  productosVendidos: number
  descuentosTotales: number
  ingresosNetos: number
  porcentajeDescuentoPromedio: number
}

export class PreciosRepository {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  /**
   * 3.1 - Obtiene métricas generales de precios y descuentos
   */
  async getMetricsGenerales(): Promise<PreciosMetrics> {
    try {
      const result = await this.prisma.$queryRaw<PreciosMetrics[]>`
        WITH descuentos AS (
          SELECT 
            COUNT(*) as total_transacciones_detalle,
            COUNT(*) FILTER (WHERE descuento_monto > 0) as transacciones_con_descuento,
            SUM(precio_unitario * cantidad) as ingresos_sin_descuento,
            SUM(descuento_monto) as total_descuentos,
            SUM((precio_unitario * cantidad) - descuento_monto) as ingresos_netos
          FROM transaction_detail
        )
        SELECT 
          total_transacciones_detalle::INTEGER as "totalTransaccionesDetalle",
          transacciones_con_descuento::INTEGER as "transaccionesConDescuento",
          ROUND((transacciones_con_descuento * 100.0 / NULLIF(total_transacciones_detalle, 0)), 2)::NUMERIC as "porcentajeConDescuento",
          ingresos_sin_descuento::NUMERIC as "ingresosSinDescuento",
          total_descuentos::NUMERIC as "totalDescuentos",
          ingresos_netos::NUMERIC as "ingresosNetos",
          ROUND((total_descuentos * 100.0 / NULLIF(ingresos_sin_descuento, 0)), 2)::NUMERIC as "porcentajeDescuentoPromedio"
        FROM descuentos
      `
      
      return result[0]
    } catch (error) {
      console.error('Error getting precios metrics:', error)
      throw error
    }
  }

  /**
   * 3.2 - Obtiene distribución de descuentos por rango
   */
  async getDistribucionDescuentos(): Promise<DistribucionDescuento[]> {
    try {
      const result = await this.prisma.$queryRaw<DistribucionDescuento[]>`
        WITH descuentos_calc AS (
          SELECT 
            td.id,
            td.precio_unitario,
            td.cantidad,
            td.descuento_monto,
            (td.precio_unitario * td.cantidad) as subtotal,
            CASE 
              WHEN (td.precio_unitario * td.cantidad) > 0 
              THEN ROUND((td.descuento_monto * 100.0 / (td.precio_unitario * td.cantidad)), 2)
              ELSE 0
            END as porcentaje_descuento
          FROM transaction_detail td
          WHERE td.descuento_monto > 0
        ),
        rangos AS (
          SELECT 
            CASE 
              WHEN porcentaje_descuento >= 50 THEN 'Muy Alto (≥50%)'
              WHEN porcentaje_descuento >= 30 THEN 'Alto (30-49%)'
              WHEN porcentaje_descuento >= 20 THEN 'Medio (20-29%)'
              WHEN porcentaje_descuento >= 10 THEN 'Bajo (10-19%)'
              ELSE 'Mínimo (<10%)'
            END as rango_descuento,
            COUNT(*) as num_transacciones,
            SUM(subtotal) as valor_subtotal,
            SUM(descuento_monto) as monto_descuentos,
            ROUND(AVG(porcentaje_descuento), 2) as promedio_porcentaje
          FROM descuentos_calc
          GROUP BY 
            CASE 
              WHEN porcentaje_descuento >= 50 THEN 'Muy Alto (≥50%)'
              WHEN porcentaje_descuento >= 30 THEN 'Alto (30-49%)'
              WHEN porcentaje_descuento >= 20 THEN 'Medio (20-29%)'
              WHEN porcentaje_descuento >= 10 THEN 'Bajo (10-19%)'
              ELSE 'Mínimo (<10%)'
            END
        )
        SELECT 
          rango_descuento as "rangoDescuento",
          num_transacciones::INTEGER as "numTransacciones",
          valor_subtotal::NUMERIC as "valorSubtotal",
          monto_descuentos::NUMERIC as "montoDescuentos",
          promedio_porcentaje::NUMERIC as "promedioPorcentaje"
        FROM rangos
        ORDER BY 
          CASE rango_descuento
            WHEN 'Muy Alto (≥50%)' THEN 1
            WHEN 'Alto (30-49%)' THEN 2
            WHEN 'Medio (20-29%)' THEN 3
            WHEN 'Bajo (10-19%)' THEN 4
            ELSE 5
          END
      `
      
      return result
    } catch (error) {
      console.error('Error getting distribución descuentos:', error)
      throw error
    }
  }

  /**
   * 3.3 - Top productos con mayor descuento promedio
   */
  async getTopProductosDescuento(limit: number = 20): Promise<ProductoDescuento[]> {
    try {
      const result = await this.prisma.$queryRaw<ProductoDescuento[]>`
        SELECT 
          p.id as "productoId",
          p.product_name as "productName",
          p.categories as categoria,
          COUNT(td.id)::INTEGER as "vecesVendido",
          SUM(td.cantidad)::INTEGER as "cantidadTotal",
          ROUND(AVG(td.precio_unitario), 2)::NUMERIC as "precioPromedio",
          SUM(td.descuento_monto)::NUMERIC as "descuentoTotal",
          ROUND(AVG(
            CASE 
              WHEN (td.precio_unitario * td.cantidad) > 0 
              THEN (td.descuento_monto * 100.0 / (td.precio_unitario * td.cantidad))
              ELSE 0
            END
          ), 2)::NUMERIC as "porcentajeDescuentoPromedio"
        FROM transaction_detail td
        INNER JOIN products p ON td.producto_id = p.id
        WHERE td.descuento_monto > 0
        GROUP BY p.id, p.product_name, p.categories
        HAVING COUNT(td.id) >= 10
        ORDER BY "porcentajeDescuentoPromedio" DESC
        LIMIT ${limit}
      `
      
      return result
    } catch (error) {
      console.error('Error getting top productos descuento:', error)
      throw error
    }
  }

  /**
   * 3.6 - Top categorías con más descuentos
   */
  async getCategoriasConDescuentos(limit: number = 15): Promise<CategoriaDescuento[]> {
    try {
      const result = await this.prisma.$queryRaw<CategoriaDescuento[]>`
        SELECT 
          p.categories as categoria,
          COUNT(td.id)::INTEGER as transacciones,
          SUM(td.cantidad)::INTEGER as "productosVendidos",
          SUM(td.descuento_monto)::NUMERIC as "descuentosTotales",
          SUM((td.precio_unitario * td.cantidad) - td.descuento_monto)::NUMERIC as "ingresosNetos",
          ROUND(
            AVG(
              CASE 
                WHEN (td.precio_unitario * td.cantidad) > 0 
                THEN (td.descuento_monto * 100.0 / (td.precio_unitario * td.cantidad))
                ELSE 0
              END
            ), 
            2
          )::NUMERIC as "porcentajeDescuentoPromedio"
        FROM transaction_detail td
        INNER JOIN products p ON td.producto_id = p.id
        WHERE td.descuento_monto > 0
        GROUP BY p.categories
        ORDER BY "descuentosTotales" DESC
        LIMIT ${limit}
      `
      
      return result
    } catch (error) {
      console.error('Error getting categorías con descuentos:', error)
      throw error
    }
  }

  /**
   * Test connection
   */
  async testConnection() {
    try {
      const result = await this.prisma.$queryRaw<any[]>`SELECT NOW() as now`
      return {
        message: 'Precios repository connection OK',
        timestamp: result[0].now
      }
    } catch (error) {
      console.error('Error in testConnection:', error)
      throw new Error('Database connection failed')
    }
  }

  /**
   * Cierra la conexión
   */
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect()
  }
}

export const preciosRepository = new PreciosRepository()