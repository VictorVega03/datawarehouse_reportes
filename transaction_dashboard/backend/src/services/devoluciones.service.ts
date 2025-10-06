// backend/src/services/devoluciones.service.ts

import logger from '@/utils/logger';
import { devolucionesRepository } from '../repositories/devoluciones.repository';

// Tipos para respuestas formateadas
interface DevolucionesMetrics {
  totalDevoluciones: number;
  montoTotal: string;
  promedioMonto: string;
  tasaDevolucion: string;
}

interface DevolucionesDistribution {
  id: string;
  label: string;
  value: number;
  porcentaje: number;
}

interface DevolucionTrend {
  fecha: string;
  devoluciones: number;
  monto: string;
}

interface DevolucionDetail {
  id: number;
  transactionId: string;
  producto: string;
  cantidad: number;
  monto: string;
  motivo: string;
  fecha: string;
  empleado: number;
}

interface PatronSospechoso {
  transactionId: string;
  customerId: number | null;
  fecha: string;
  total: string;
  metodoPago: string;
  items: number;
  tiempoTranscurrido: string;
  nivelRiesgo: 'Alto' | 'Medio' | 'Bajo';
}

function deepBigIntToNumber(obj: any): any {
  if (typeof obj === 'bigint') return Number(obj);
  if (Array.isArray(obj)) return obj.map(deepBigIntToNumber);
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, deepBigIntToNumber(v)])
    );
  }
  return obj;
}

export class DevolucionesService {
  constructor() {
    console.log('✅ DevolucionesService initialized');
  }

  /**
   * Obtiene el análisis completo de devoluciones
   */
  async getDevolucionesAnalysis() {
    try {
      console.log('📊 Getting devoluciones analysis...');

      const [stats, byReason, trends, recent, suspicious] = await Promise.all([
        devolucionesRepository.getReturnStats(),
        devolucionesRepository.getReturnsByReason(),
        devolucionesRepository.getReturnTrends(30),
        devolucionesRepository.getRecentReturns(50),
        devolucionesRepository.getSuspiciousPatterns(5),
      ]);

      // Formatear métricas
      const metrics = this.formatMetrics(stats);

      // Formatear distribución por motivo
      const distribution = this.formatDistribution(byReason);

      // Formatear tendencias
      const trendsFormatted = this.formatTrends(trends);

      // Formatear devoluciones recientes
      const recentFormatted = this.formatRecentReturns(recent);

      // Formatear patrones sospechosos
      const suspiciousFormatted = this.formatSuspiciousPatterns(suspicious);

      const result = {
        metrics,
        distribution,
        trends: trendsFormatted,
        recentReturns: recentFormatted,
        suspiciousPatterns: suspiciousFormatted,
      };
      return deepBigIntToNumber(result);
    } catch (error) {
      console.error('❌ Error getting devoluciones analysis:', error);
      throw error;
    }
  }

  /**
   * Obtiene solo las métricas principales
   */
  async getMetrics() {
    try {
      console.log('📊 Getting devoluciones metrics...');
      const stats = await devolucionesRepository.getReturnStats();
      const metrics = this.formatMetrics(stats);
      console.log('✅ Metrics retrieved');
      return deepBigIntToNumber(metrics);
    } catch (error) {
      console.error('❌ Error getting metrics:', error);
      throw error;
    }
  }

  /**
   * Obtiene patrones sospechosos
   */
  async getSuspiciousPatterns(maxMinutes: number = 5) {
    try {
      console.log(`📊 Getting suspicious patterns (max ${maxMinutes} minutes)...`);
      const patterns = await devolucionesRepository.getSuspiciousPatterns(maxMinutes);
      const formatted = this.formatSuspiciousPatterns(patterns);
      console.log(`✅ Found ${formatted.length} suspicious patterns`);
      return deepBigIntToNumber(formatted);
    } catch (error) {
      console.error('❌ Error getting suspicious patterns:', error);
      throw error;
    }
  }

  /**
   * Obtiene productos más devueltos
   */
  async getTopReturnedProducts(limit: number = 10) {
    try {
      console.log(`📊 Getting top ${limit} returned products...`);
      const products = await devolucionesRepository.getTopReturnedProducts(limit);
      
      const formatted = products.map(p => ({
        id: p.id,
        nombre: p.product_name,
        categoria: p.categories,
        totalDevoluciones: Number(p.total_devoluciones),
        cantidadDevuelta: Number(p.cantidad_total_devuelta),
        montoTotal: this.formatCurrency(p.monto_total),
      }));

      console.log(`✅ Retrieved ${formatted.length} products`);
      return deepBigIntToNumber(formatted);
    } catch (error) {
      console.error('❌ Error getting top returned products:', error);
      throw error;
    }
  }

  /**
   * Obtiene recomendaciones basadas en el análisis
   */
  async getRecommendations() {
    try {
      console.log('📊 Generating recommendations...');
      
      const [stats, byReason, suspicious] = await Promise.all([
        devolucionesRepository.getReturnStats(),
        devolucionesRepository.getReturnsByReason(),
        devolucionesRepository.getSuspiciousPatterns(5),
      ]);

      const recommendations = [];

      // Recomendación 1: Basada en número de devoluciones
      const totalReturns = Number(stats.total_devoluciones);
      if (totalReturns === 0) {
        recommendations.push({
          tipo: 'control',
          prioridad: 'alta',
          titulo: 'Sistema de Devoluciones Inactivo',
          descripcion: 'No hay devoluciones registradas en el sistema. Verificar si el proceso de registro está funcionando correctamente.',
          accion: 'Implementar o revisar proceso de captura de devoluciones',
          impactoEstimado: 'Control de riesgo: $1.13B',
        });
      } else if (totalReturns > 100) {
        recommendations.push({
          tipo: 'alerta',
          prioridad: 'alta',
          titulo: 'Alto Volumen de Devoluciones',
          descripcion: `Se detectaron ${totalReturns} devoluciones. Analizar causas principales.`,
          accion: 'Revisar calidad de productos y proceso de venta',
          impactoEstimado: `Pérdida potencial: ${this.formatCurrency(stats.monto_total)}`,
        });
      }

      // Recomendación 2: Basada en motivos principales
      if (byReason.length > 0) {
        const motivoPrincipal = byReason[0];
        recommendations.push({
          tipo: 'mejora',
          prioridad: 'media',
          titulo: 'Motivo Principal de Devolución',
          descripcion: `${motivoPrincipal.porcentaje}% de devoluciones por: ${motivoPrincipal.motivo}`,
          accion: 'Implementar plan de mejora enfocado en este motivo',
          impactoEstimado: 'Reducción esperada: 30-40% de devoluciones',
        });
      }

      // Recomendación 3: Patrones sospechosos
      if (suspicious.length > 0) {
        const altosRiesgo = suspicious.filter(p => {
          const tiempo = parseFloat(p.tiempo_transcurrido);
          return tiempo <= 2;
        }).length;

        if (altosRiesgo > 0) {
          recommendations.push({
            tipo: 'control',
            prioridad: 'alta',
            titulo: 'Patrones Sospechosos Detectados',
            descripcion: `${suspicious.length} transacciones con patrones inusuales, ${altosRiesgo} de alto riesgo`,
            accion: 'Revisar transacciones e implementar controles adicionales',
            impactoEstimado: 'Prevención de fraude y errores operativos',
          });
        }
      }

      // Recomendación 4: Oportunidad de mejora
      recommendations.push({
        tipo: 'oportunidad',
        prioridad: 'media',
        titulo: 'Sistema de Análisis Predictivo',
        descripcion: 'Implementar machine learning para predecir devoluciones',
        accion: 'Desarrollar modelo predictivo basado en historial',
        impactoEstimado: 'Reducción proyectada: 15-25% en devoluciones',
      });

      console.log(`✅ Generated ${recommendations.length} recommendations`);
      return deepBigIntToNumber(recommendations);
    } catch (error) {
      console.error('❌ Error generating recommendations:', error);
      throw error;
    }
  }

  // ==========================================
  // MÉTODOS PRIVADOS DE FORMATEO
  // ==========================================

  private formatMetrics(stats: any): DevolucionesMetrics {
    const total = Number(stats.total_devoluciones);
    const monto = parseFloat(stats.monto_total);
    const promedio = total > 0 ? monto / total : 0;

    return {
      totalDevoluciones: total,
      montoTotal: this.formatCurrency(stats.monto_total),
      promedioMonto: this.formatCurrency(promedio.toString()),
      tasaDevolucion: total === 0 ? '0%' : 'Por calcular', // Se calcularía vs total de transacciones
    };
  }

  private formatDistribution(byReason: any[]): DevolucionesDistribution[] {
    return byReason.map(r => ({
      id: r.motivo,
      label: r.motivo,
      value: Number(r.cantidad),
      porcentaje: Number(r.porcentaje),
    }));
  }

  private formatTrends(trends: any[]): DevolucionTrend[] {
    return trends.map(t => ({
      fecha: t.fecha.toISOString().split('T')[0],
      devoluciones: Number(t.cantidad),
      monto: this.formatCurrency(t.monto_total),
    }));
  }

  private formatRecentReturns(returns: any[]): DevolucionDetail[] {
    return returns.map(r => ({
      id: r.id,
      transactionId: r.transaction_id_original.toString(),
      producto: r.producto_nombre || 'Producto desconocido',
      cantidad: r.cantidad_devuelta,
      monto: r.monto_estimado ? this.formatCurrency(r.monto_estimado) : '$0.00',
      motivo: r.motivo,
      fecha: r.fecha_hora.toISOString(),
      empleado: r.empleado_id,
    }));
  }

  private formatSuspiciousPatterns(patterns: any[]): PatronSospechoso[] {
    return patterns.map(p => {
      const tiempo = parseFloat(p.tiempo_transcurrido);
      let nivelRiesgo: 'Alto' | 'Medio' | 'Bajo' = 'Bajo';
      
      if (tiempo <= 2) nivelRiesgo = 'Alto';
      else if (tiempo <= 3) nivelRiesgo = 'Medio';

      return {
        transactionId: p.transaction_id.toString(),
        customerId: p.customer_id,
        fecha: p.fecha_hora.toISOString(),
        total: this.formatCurrency(p.total),
        metodoPago: p.metodo_pago,
        items: Number(p.num_items),
        tiempoTranscurrido: `${tiempo.toFixed(2)} min`,
        nivelRiesgo,
      };
    });
  }

  private formatCurrency(value: string | number): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(num);
  }

  /**
 * Refresca todas las vistas materializadas para reflejar cambios en la BD
 */
async refreshVistas(): Promise<{ message: string; duration: number; freshness?: any }> {
  try {
    logger.info('🔄 Iniciando refresh de vistas materializadas...')
    const startTime = Date.now()
    await devolucionesRepository.refreshMaterializedViews()
    const duration = Date.now() - startTime

    // Verificar freshness y convertir BigInt a Number
    let freshness: any = undefined
    try {
      const rawFreshness = await devolucionesRepository.getViewFreshness()
      freshness = Object.fromEntries(
        Object.entries(rawFreshness).map(([key, value]) => [
          key,
          typeof value === 'bigint' ? Number(value) : value
        ])
      )
    } catch (e) {
      logger.warn('No se pudo obtener freshness:', e)
    }

    logger.info(`✅ Vistas actualizadas en ${duration}ms`)
    return deepBigIntToNumber({
      message: 'Vistas materializadas actualizadas correctamente',
      duration,
      freshness
    })
  } catch (error) {
    logger.error('❌ Error en refreshVistas:', error)
    throw error
  }
}
}

// Singleton export
export const devolucionesService = new DevolucionesService();