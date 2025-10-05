// backend/src/services/precios.service.ts
import { preciosRepository, PreciosMetrics, DistribucionDescuento, ProductoDescuento, CategoriaDescuento } from '../repositories/precios.repository'

export class PreciosService {
  
  constructor() {
    console.log('✅ PreciosService initialized')
  }

  /**
   * Obtiene métricas generales de precios y descuentos
   */
  async getMetricsGenerales(): Promise<PreciosMetrics> {
    try {
      console.log('📊 Getting precios metrics generales...')
      const metrics = await preciosRepository.getMetricsGenerales()
      
      console.log('✅ Precios metrics retrieved successfully')
      return metrics
    } catch (error) {
      console.error('❌ Error getting precios metrics:', error)
      throw error
    }
  }

  /**
   * Obtiene análisis completo de precios y descuentos
   */
  async getAnalisisCompleto(): Promise<{
    metrics: PreciosMetrics,
    distribucion: DistribucionDescuento[]
  }> {
    try {
      console.log('📊 Getting análisis completo de precios...')
      
      const [
        metrics,
        distribucion
      ] = await Promise.all([
        preciosRepository.getMetricsGenerales(),
        preciosRepository.getDistribucionDescuentos()
      ])

      const data = {
        metrics,
        distribucion
      }

      console.log('✅ Análisis completo retrieved successfully')
      return data
    } catch (error) {
      console.error('❌ Error getting análisis completo:', error)
      throw error
    }
  }

  /**
   * Obtiene top productos con descuentos
   */
  async getTopProductosDescuento(limit: number = 20): Promise<ProductoDescuento[]> {
    try {
      console.log(`📊 Getting top ${limit} productos con descuento...`)
      const productos = await preciosRepository.getTopProductosDescuento(limit)
      
      console.log(`✅ Retrieved ${productos.length} productos`)
      return productos
    } catch (error) {
      console.error('❌ Error getting top productos descuento:', error)
      throw error
    }
  }

  /**
   * Obtiene categorías con más descuentos
   */
  async getCategoriasConDescuentos(limit: number = 15): Promise<CategoriaDescuento[]> {
    try {
      console.log(`📊 Getting top ${limit} categorías con descuentos...`)
      const categorias = await preciosRepository.getCategoriasConDescuentos(limit)
      
      console.log(`✅ Retrieved ${categorias.length} categorías`)
      return categorias
    } catch (error) {
      console.error('❌ Error getting categorías con descuentos:', error)
      throw error
    }
  }
}

export const preciosService = new PreciosService()