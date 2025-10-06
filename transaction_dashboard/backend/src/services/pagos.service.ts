// backend/src/features/casos/pagos/pagos.service.ts

import pagosRepository from '@/repositories/pagos.repository';
import { SharedService } from '@/shared/shared.service';

class PagosService extends SharedService {
  /**
   * Obtiene el análisis completo de métodos de pago
   */
  async getPaymentAnalysis() {
    try {
      console.log('🔍 [Service] Iniciando análisis de métodos de pago...');

      const metrics = await pagosRepository.getPaymentMetrics();
      
      // Convertir BigInt a number/string para JSON
      const distribution = metrics.distribution.map(item => ({
        metodo_pago: item.metodo_pago,
        transacciones: Number(item.transacciones),
        porcentaje: Number(item.porcentaje),
        ingresos: Number(item.ingresos),
        ticket_promedio: Number(item.ticket_promedio),
        transaccion_minima: Number(item.transaccion_minima),
        transaccion_maxima: Number(item.transaccion_maxima)
      }));

      const riskSummary = metrics.riskSummary.map(item => ({
        metodo_pago: item.metodo_pago,
        transacciones_alto_valor: Number(item.transacciones_alto_valor),
        porcentaje_alto_valor: Number(item.porcentaje_alto_valor),
        monto_alto_valor: Number(item.monto_alto_valor),
        total_transacciones: Number(item.total_transacciones)
      }));

      // Encontrar método de pago dominante
      const dominante = distribution[0];
      
      // Calcular transacciones de alto riesgo totales
      const totalHighRisk = riskSummary.reduce(
        (sum, item) => sum + item.transacciones_alto_valor, 
        0
      );

      const result = {
        resumen: {
          total_transacciones: Number(metrics.stats.total_transacciones),
          total_ingresos: Number(metrics.stats.total_ingresos),
          metodos_unicos: Number(metrics.stats.metodos_unicos),
          metodo_dominante: dominante.metodo_pago,
          porcentaje_dominante: dominante.porcentaje,
          transacciones_alto_riesgo: totalHighRisk
        },
        distribucion: distribution,
        analisis_riesgo: riskSummary,
        timestamp: new Date().toISOString()
      };

      console.log('✅ [Service] Análisis de métodos de pago completado');
      return result;
    } catch (error) {
      console.error('❌ [Service] Error en análisis de métodos de pago:', error);
      throw this.handleError(error, 'Error al obtener análisis de métodos de pago');
    }
  }

  /**
   * Obtiene la distribución de métodos de pago
   */
  async getPaymentDistribution() {
    try {
      console.log('📊 [Service] Obteniendo distribución de métodos de pago...');

      const distribution = await pagosRepository.getPaymentMethodDistributionDetailed();
      
      const formattedData = distribution.map((item) => ({
        id: item.metodo_pago,
        label: item.metodo_pago,
        value: Number(item.transacciones),
        ingresos: Number(item.ingresos),
        porcentaje: Number(item.porcentaje),
        ticket_promedio: Number(item.ticket_promedio)
      }));

      console.log('✅ [Service] Distribución formateada correctamente');
      return {
        data: formattedData,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ [Service] Error en distribución:', error);
      throw this.handleError(error, 'Error al obtener distribución de métodos de pago');
    }
  }

  /**
   * Obtiene transacciones de alto riesgo
   */
  async getHighRiskTransactions(minAmount: number = 10000) {
    try {
      console.log(`🚨 [Service] Buscando transacciones de alto riesgo (>= $${minAmount})...`);

      const transactions = await pagosRepository.getHighRiskTransactions(minAmount);
      
      const formattedData = transactions.map(item => ({
        id: Number(item.id),
        fecha_hora: item.fecha_hora,
        customer_id: item.customer_id,
        metodo_pago: item.metodo_pago,
        total: Number(item.total),
        nivel_riesgo: item.nivel_riesgo
      }));

      const summary = {
        total_transacciones: formattedData.length,
        monto_total: formattedData.reduce((sum, t) => sum + t.total, 0),
        por_nivel: {
          critico: formattedData.filter(t => t.nivel_riesgo.includes('Crítico')).length,
          alto: formattedData.filter(t => t.nivel_riesgo.includes('Alto')).length,
          moderado: formattedData.filter(t => t.nivel_riesgo.includes('Moderado')).length
        }
      };

      console.log('✅ [Service] Transacciones de alto riesgo procesadas');
      return {
        summary,
        transactions: formattedData,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ [Service] Error en transacciones de alto riesgo:', error);
      throw this.handleError(error, 'Error al obtener transacciones de alto riesgo');
    }
  }

  /**
   * Obtiene tendencias de métodos de pago
   */
  async getPaymentTrends(days: number = 30) {
    try {
      console.log(`📈 [Service] Calculando tendencias de ${days} días...`);

      const trends = await pagosRepository.getPaymentTrendsByDay(days);
      
      // Agrupar por método de pago
      const groupedByMethod = trends.reduce((acc, item) => {
        if (!acc[item.metodo_pago]) {
          acc[item.metodo_pago] = [];
        }
        acc[item.metodo_pago].push({
          fecha: item.fecha,
          transacciones: Number(item.transacciones),
          ingresos: Number(item.ingresos)
        });
        return acc;
      }, {} as Record<string, Array<{fecha: Date, transacciones: number, ingresos: number}>>);

      console.log('✅ [Service] Tendencias calculadas correctamente');
      return {
        tendencias: groupedByMethod,
        periodo: {
          dias: days,
          desde: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
          hasta: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ [Service] Error en tendencias:', error);
      throw this.handleError(error, 'Error al obtener tendencias de métodos de pago');
    }
  }

  /**
   * Obtiene métodos de pago por hora del día
   */
  async getPaymentsByHour() {
    try {
      console.log('⏰ [Service] Obteniendo distribución horaria de métodos de pago...');

      const hourlyData = await pagosRepository.getPaymentMethodsByHour();
      
      // Agrupar por hora
      const groupedByHour = hourlyData.reduce((acc, item) => {
        if (!acc[item.hora]) {
          acc[item.hora] = [];
        }
        acc[item.hora].push({
          metodo_pago: item.metodo_pago,
          transacciones: Number(item.transacciones),
          ingresos: Number(item.ingresos)
        });
        return acc;
      }, {} as Record<number, Array<{metodo_pago: string, transacciones: number, ingresos: number}>>);

      console.log('✅ [Service] Distribución horaria procesada');
      return {
        data: groupedByHour,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ [Service] Error en distribución horaria:', error);
      throw this.handleError(error, 'Error al obtener distribución horaria');
    }
  }

  /**
   * Obtiene recomendaciones basadas en el análisis de métodos de pago
   */
  async getRecommendations() {
    try {
      console.log('💡 [Service] Generando recomendaciones...');

      const [analysis, riskTransactions] = await Promise.all([
        this.getPaymentAnalysis(),
        this.getHighRiskTransactions()
      ]);

      const recommendations = [];

      // Recomendación 1: Alto porcentaje de efectivo
      const efectivo = analysis.distribucion.find(d => d.metodo_pago === 'efectivo');
      if (efectivo && efectivo.porcentaje > 30) {
        recommendations.push({
          tipo: 'alto_efectivo',
          prioridad: 'alta',
          titulo: 'Alto porcentaje de transacciones en efectivo',
          descripcion: `El ${efectivo.porcentaje}% de las transacciones son en efectivo. Considerar incentivar pagos electrónicos para reducir riesgos.`,
          impacto_estimado: `$${this.formatNumber(efectivo.ingresos * 0.1)}`,
          acciones: [
            'Implementar descuentos por pago con tarjeta',
            'Capacitar al personal en seguridad del manejo de efectivo',
            'Instalar más terminales de pago electrónico'
          ]
        });
      }

      // Recomendación 2: Transacciones de alto riesgo
      if (riskTransactions.summary.total_transacciones > 50) {
        recommendations.push({
          tipo: 'alto_riesgo',
          prioridad: 'crítica',
          titulo: 'Alta cantidad de transacciones de alto valor en efectivo',
          descripcion: `Se detectaron ${riskTransactions.summary.total_transacciones} transacciones en efectivo superiores a $10,000.`,
          impacto_estimado: 'Riesgo de seguridad y pérdidas',
          acciones: [
            'Implementar límites para pagos en efectivo',
            'Requerir autorizaciones para transacciones grandes',
            'Mejorar sistemas de seguridad y videovigilancia'
          ]
        });
      }

      // Recomendación 3: Diversificación de métodos de pago
      if (analysis.resumen.metodos_unicos < 3) {
        recommendations.push({
          tipo: 'diversificacion',
          prioridad: 'media',
          titulo: 'Poca diversificación en métodos de pago',
          descripcion: 'Solo se utilizan pocos métodos de pago. Ampliar opciones puede aumentar las ventas.',
          impacto_estimado: '+10% en conversión estimada',
          acciones: [
            'Integrar pagos móviles (Apple Pay, Google Pay)',
            'Aceptar transferencias bancarias directas',
            'Evaluar sistemas de pago a plazos'
          ]
        });
      }

      console.log(`✅ [Service] ${recommendations.length} recomendaciones generadas`);
      return {
        recomendaciones: recommendations,
        resumen_analisis: {
          metodo_dominante: analysis.resumen.metodo_dominante,
          transacciones_alto_riesgo: analysis.resumen.transacciones_alto_riesgo,
          metodos_disponibles: analysis.resumen.metodos_unicos
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ [Service] Error generando recomendaciones:', error);
      throw this.handleError(error, 'Error al generar recomendaciones');
    }
  }
}

// Singleton export
const pagosService = new PagosService();
export default pagosService;
export { PagosService };