// backend/src/features/casos/pagos/pagos.repository.ts


import { SharedRepository } from '@/shared/shared.repository';
import { Prisma } from '@prisma/client';

// Tipos inline - NO usar carpeta types/
interface PaymentMethodDistribution {
  metodo_pago: string;
  transacciones: bigint | string;
  porcentaje: number | string;
  ingresos: number | string;
  ticket_promedio: number | string;
  transaccion_minima: number | string;
  transaccion_maxima: number | string;
}

interface PaymentMethodByHour {
  hora: number;
  metodo_pago: string;
  transacciones: bigint | string;
  ingresos: number | string;
}

interface HighRiskTransaction {
  id: bigint;
  fecha_hora: Date;
  customer_id: number | null;
  metodo_pago: string;
  total: number | string;
  nivel_riesgo: string;
}

interface RiskSummary {
  metodo_pago: string;
  transacciones_alto_valor: bigint | string;
  porcentaje_alto_valor: number | string;
  monto_alto_valor: number | string;
  total_transacciones: bigint | string;
}

interface PaymentTrend {
  fecha: Date;
  metodo_pago: string;
  transacciones: bigint | string;
  ingresos: number | string;
}

class PagosRepository extends SharedRepository {
  /**
   * Obtiene la distribución detallada de métodos de pago
   * Incluye métricas adicionales como ticket promedio, min, max
   */
  async getPaymentMethodDistributionDetailed(): Promise<PaymentMethodDistribution[]> {
    console.log('📊 [Repository] Obteniendo distribución detallada de métodos de pago...');
    
    const query = Prisma.sql`
      SELECT 
        metodo_pago,
        COUNT(*) as transacciones,
        ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()), 2) as porcentaje,
        SUM(total) as ingresos,
        ROUND(AVG(total)::NUMERIC, 2) as ticket_promedio,
        MIN(total) as transaccion_minima,
        MAX(total) as transaccion_maxima
      FROM transactions
      GROUP BY metodo_pago
      ORDER BY transacciones DESC
    `;

    const results = await this.prisma.$queryRaw<PaymentMethodDistribution[]>(query);
    console.log(`✅ [Repository] ${results.length} métodos de pago encontrados`);
    
    return results;
  }

  /**
   * Obtiene métodos de pago por hora del día
   */
  async getPaymentMethodsByHour(): Promise<PaymentMethodByHour[]> {
    console.log('⏰ [Repository] Obteniendo métodos de pago por hora...');
    
    const query = Prisma.sql`
      SELECT 
        EXTRACT(HOUR FROM fecha_hora)::INTEGER as hora,
        metodo_pago,
        COUNT(*) as transacciones,
        SUM(total) as ingresos
      FROM transactions
      GROUP BY EXTRACT(HOUR FROM fecha_hora), metodo_pago
      ORDER BY hora, transacciones DESC
    `;

    const results = await this.prisma.$queryRaw<PaymentMethodByHour[]>(query);
    console.log(`✅ [Repository] ${results.length} registros por hora encontrados`);
    
    return results;
  }

  /**
   * Identifica transacciones de alto riesgo (efectivo >= $10,000)
   */
  async getHighRiskTransactions(minAmount: number = 10000): Promise<HighRiskTransaction[]> {
    console.log(`🚨 [Repository] Buscando transacciones de alto riesgo (>= ${minAmount})...`);
    
    const query = Prisma.sql`
      SELECT 
        id,
        fecha_hora,
        customer_id,
        metodo_pago,
        total,
        CASE 
          WHEN total >= 50000 THEN 'Crítico (>$50K)'
          WHEN total >= 20000 THEN 'Alto (>$20K)'
          ELSE 'Moderado ($10K-$20K)'
        END as nivel_riesgo
      FROM transactions
      WHERE metodo_pago = 'efectivo' 
        AND total >= ${minAmount}
      ORDER BY total DESC
    `;

    const results = await this.prisma.$queryRaw<HighRiskTransaction[]>(query);
    console.log(`✅ [Repository] ${results.length} transacciones de alto riesgo encontradas`);
    
    return results;
  }

  /**
   * Resumen de riesgos por método de pago
   */
  async getRiskSummaryByPaymentMethod(minAmount: number = 10000): Promise<RiskSummary[]> {
    console.log('📈 [Repository] Calculando resumen de riesgos por método de pago...');
    
    const query = Prisma.sql`
      SELECT 
        metodo_pago,
        COUNT(*) FILTER (WHERE total >= ${minAmount}) as transacciones_alto_valor,
        ROUND((COUNT(*) FILTER (WHERE total >= ${minAmount}) * 100.0 / COUNT(*)), 2) as porcentaje_alto_valor,
        SUM(total) FILTER (WHERE total >= ${minAmount}) as monto_alto_valor,
        COUNT(*) as total_transacciones
      FROM transactions
      GROUP BY metodo_pago
      ORDER BY transacciones_alto_valor DESC
    `;

    const results = await this.prisma.$queryRaw<RiskSummary[]>(query);
    console.log(`✅ [Repository] Resumen de riesgos calculado para ${results.length} métodos`);
    
    return results;
  }

  /**
   * Tendencia de métodos de pago por día
   */
  async getPaymentTrendsByDay(days: number = 30): Promise<PaymentTrend[]> {
    console.log(`📅 [Repository] Obteniendo tendencias de los últimos ${days} días...`);
    
    const query = Prisma.sql`
      SELECT 
        fecha_hora::DATE as fecha,
        metodo_pago,
        COUNT(*) as transacciones,
        SUM(total) as ingresos
      FROM transactions
      WHERE fecha_hora >= CURRENT_DATE - INTERVAL '${Prisma.raw(days.toString())} days'
      GROUP BY fecha_hora::DATE, metodo_pago
      ORDER BY fecha DESC, transacciones DESC
    `;

    const results = await this.prisma.$queryRaw<PaymentTrend[]>(query);
    console.log(`✅ [Repository] ${results.length} registros de tendencias encontrados`);
    
    return results;
  }

  /**
   * Obtiene métricas generales de métodos de pago
   */
  async getPaymentMetrics() {
    console.log('📊 [Repository] Calculando métricas generales de métodos de pago...');
    
    const [distribution, riskSummary, totalStats] = await Promise.all([
      this.getPaymentMethodDistributionDetailed(),
      this.getRiskSummaryByPaymentMethod(),
      this.prisma.$queryRaw<Array<{
        total_transacciones: bigint;
        total_ingresos: number;
        metodos_unicos: bigint;
      }>>`
        SELECT 
          COUNT(*) as total_transacciones,
          SUM(total) as total_ingresos,
          COUNT(DISTINCT metodo_pago) as metodos_unicos
        FROM transactions
      `
    ]);

    return {
      distribution,
      riskSummary,
      stats: totalStats[0]
    };
  }
}

// Singleton export
const pagosRepository = new PagosRepository();
export default pagosRepository;
export { PagosRepository };
export type {
  PaymentMethodDistribution,
  PaymentMethodByHour,
  HighRiskTransaction,
  RiskSummary,
  PaymentTrend
};