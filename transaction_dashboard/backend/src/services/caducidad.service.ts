// backend/src/features/casos/caducidad/caducidad.service.ts
// Service para el caso de uso: Control de Caducidad

import { SharedService } from '../shared/shared.service'
import { caducidadRepository } from '../repositories/caducidad.repository'

// Tipos de respuesta
interface ExpiryControlResponse {
  metrics: {
    lotesVencidos: number;
    lotesCriticos: number;
    lotesUrgentes: number;
    lotesEnRiesgo: number;
    ahorroEstimado: string;
  };
  distribution: Array<{
    estado: string;
    lotes: number;
    productos: number;
    porcentaje: number;
  }>;
  categories: Array<{
    categoria: string;
    productosEnRiesgo: number;
    lotesEnRiesgo: number;
  }>;
  criticalProducts: Array<{
    id: number;
    nombre: string;
    categoria: string;
    lote: string;
    fechaCaducidad: Date;
    diasDiferencia: number;
    urgencia: string;
    accionRequerida: string;
  }>;
}

export class CaducidadService extends SharedService {
  
  /**
   * 📊 Obtiene el análisis completo de control de caducidad
   */
  async getExpiryControl(): Promise<ExpiryControlResponse> {
    try {
      // Obtener datos del repository
      const [metrics, distribution, categories, criticalProducts] = await Promise.all([
        caducidadRepository.getExpiryMetrics(),
        caducidadRepository.getExpiryDistribution(),
        caducidadRepository.getExpiryCategoriesAtRisk(),
        caducidadRepository.getCriticalExpiryProducts()
      ]);

      // Calcular totales para porcentajes
      const totalLotes = distribution.reduce((sum, item) => sum + Number(item.num_lotes), 0);

      // Formatear distribución con porcentajes
      const formattedDistribution = distribution.map(item => ({
        estado: item.estado,
        lotes: Number(item.num_lotes),
        productos: Number(item.num_productos),
        porcentaje: totalLotes > 0 
          ? Number(((Number(item.num_lotes) / totalLotes) * 100).toFixed(1))
          : 0
      }));

      // Formatear categorías
      const formattedCategories = categories.map(cat => ({
        categoria: cat.categories || 'Sin categoría',
        productosEnRiesgo: Number(cat.productos_en_riesgo),
        lotesEnRiesgo: Number(cat.lotes_en_riesgo)
      }));

      // Formatear productos críticos para tabla
      const formattedCriticalProducts = criticalProducts.map(prod => ({
        id: prod.id,
        nombre: prod.product_name,
        categoria: prod.categories || 'Sin categoría',
        lote: prod.lote_code,
        fechaCaducidad: prod.expiration_date,
        diasDiferencia: prod.dias_diferencia,
        urgencia: prod.nivel_urgencia,
        accionRequerida: this.getActionForProduct(prod.nivel_urgencia)
      }));

      return {
        metrics: {
          lotesVencidos: metrics.vencidos,
          lotesCriticos: metrics.criticos,
          lotesUrgentes: metrics.urgentes,
          lotesEnRiesgo: metrics.enRiesgo,
          ahorroEstimado: this.calculateSavings(metrics)
        },
        distribution: formattedDistribution,
        categories: formattedCategories,
        criticalProducts: formattedCriticalProducts
      };

    } catch (error) {
      console.error('Error en getExpiryControl:', error);
      throw new Error('Error al obtener datos de control de caducidad');
    }
  }

  /**
   * 📋 Obtiene solo las métricas de caducidad
   */
  async getExpiryMetrics() {
    try {
      const metrics = await caducidadRepository.getExpiryMetrics();
      
      return {
        lotesVencidos: metrics.vencidos,
        lotesCriticos: metrics.criticos,
        lotesUrgentes: metrics.urgentes,
        lotesEnRiesgo: metrics.enRiesgo,
        ahorroEstimado: this.calculateSavings(metrics),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error en getExpiryMetrics:', error);
      throw new Error('Error al obtener métricas de caducidad');
    }
  }

  /**
   * 🔍 Obtiene productos críticos con filtro de días
   */
  async getCriticalProducts(daysThreshold: number = 7) {
    try {
      const products = await caducidadRepository.getCriticalExpiryProducts();
      
      // Filtrar según umbral de días si se especifica
      const filtered = products.filter(p => p.dias_diferencia <= daysThreshold);
      
      return filtered.map(prod => ({
        id: prod.id,
        nombre: prod.product_name,
        categoria: prod.categories || 'Sin categoría',
        lote: prod.lote_code,
        fechaCaducidad: prod.expiration_date,
        diasDiferencia: prod.dias_diferencia,
        urgencia: prod.nivel_urgencia,
        accionRequerida: this.getActionForProduct(prod.nivel_urgencia)
      }));
    } catch (error) {
      console.error('Error en getCriticalProducts:', error);
      throw new Error('Error al obtener productos críticos');
    }
  }

  /**
   * 💡 Obtiene recomendaciones basadas en análisis de caducidad
   */
  async getRecommendations() {
    try {
      const [metrics, categories] = await Promise.all([
        caducidadRepository.getExpiryMetrics(),
        caducidadRepository.getExpiryCategoriesAtRisk()
      ]);

      const recommendations = [];

      // Recomendaciones basadas en métricas
      if (metrics.vencidos > 0) {
        recommendations.push({
          tipo: 'URGENTE',
          prioridad: 1,
          mensaje: `Hay ${metrics.vencidos} lotes vencidos que deben retirarse inmediatamente del inventario`,
          accion: 'Retirar productos vencidos',
          impacto: 'Alto'
        });
      }

      if (metrics.criticos > 10) {
        recommendations.push({
          tipo: 'CRÍTICO',
          prioridad: 2,
          mensaje: `${metrics.criticos} lotes caducan en los próximos 3 días`,
          accion: 'Aplicar descuentos agresivos (50%+) para liquidación',
          impacto: 'Alto'
        });
      }

      if (metrics.urgentes > 20) {
        recommendations.push({
          tipo: 'IMPORTANTE',
          prioridad: 3,
          mensaje: `${metrics.urgentes} lotes caducan en 4-7 días`,
          accion: 'Promociones especiales y notificación a clientes',
          impacto: 'Medio'
        });
      }

      // Recomendaciones por categoría
      if (categories.length > 0) {
        const topCategory = categories[0];
        recommendations.push({
          tipo: 'ALERTA',
          prioridad: 4,
          mensaje: `Categoría "${topCategory.categories}" tiene ${topCategory.lotes_en_riesgo} lotes en riesgo`,
          accion: 'Revisar políticas de compra para esta categoría',
          impacto: 'Medio'
        });
      }

      // Siempre incluir recomendación preventiva
      recommendations.push({
        tipo: 'PREVENTIVO',
        prioridad: 5,
        mensaje: 'Implementar sistema FIFO (First In, First Out) para rotación de inventario',
        accion: 'Capacitar personal en manejo de fechas de caducidad',
        impacto: 'Bajo'
      });

      return {
        total: recommendations.length,
        recomendaciones: recommendations,
        ahorroEstimado: this.calculateSavings(metrics),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error en getRecommendations:', error);
      throw new Error('Error al obtener recomendaciones');
    }
  }

  // ==========================================
  // MÉTODOS PRIVADOS DE UTILIDAD
  // ==========================================

  /**
   * Determina la acción requerida según el nivel de urgencia
   */
  private getActionForProduct(urgencia: string): string {
    switch (urgencia) {
      case 'Vencido':
        return 'Retirar del inventario';
      case 'Crítico':
        return 'Liquidar inmediatamente (50%+ descuento)';
      case 'Urgente':
        return 'Promoción especial (30-40% descuento)';
      default:
        return 'Monitorear';
    }
  }

  /**
   * Calcula el ahorro estimado basado en los productos en riesgo
   */
  private calculateSavings(metrics: any): string {
    // Costo promedio por lote (valor estimado conservador)
    const avgCost = 150;
    
    // Factor de pérdida si no se toma acción
    // Vencidos: 100% pérdida, Críticos: 70%, Urgentes: 40%
    const vencidosLoss = metrics.vencidos * avgCost * 1.0;
    const criticosLoss = metrics.criticos * avgCost * 0.7;
    const urgentesLoss = metrics.urgentes * avgCost * 0.4;
    
    const totalPotentialLoss = vencidosLoss + criticosLoss + urgentesLoss;
    
    // Ahorro estimado al tomar acción (liquidar a 50% vs pérdida total)
    const savings = totalPotentialLoss * 0.5;
    
    // Formatear en K o M
    if (savings >= 1000000) {
      return `$${(savings / 1000000).toFixed(1)}M`;
    } else if (savings >= 1000) {
      return `$${(savings / 1000).toFixed(0)}K`;
    }
    return `$${savings.toFixed(0)}`;
  }
}

// Exportar instancia singleton
export const caducidadService = new CaducidadService()

export type { ExpiryControlResponse }