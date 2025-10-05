import { clientesRepository } from '../repositories/clientes.repository'

// ===================================
// TIPOS DE RESPUESTA
// ===================================

interface ClientesMetricsResponse {
  clientesIdentificados: number | string
  transaccionesAnonimas: number | string
  clientesVIPPlatinum: number | string
  clientesVIPGold: number | string
  ingresosIdentificados: string
  ingresosAnonimos: string
  porcentajeIdentificados: string
}

interface ClientesOverviewResponse {
  distribution: any[]
  topClientesByFrequency: any[]
  topClientesByValue: any[]
  segmentation: any[]
  recencyAnalysis: any[]
  spendingRanges: any[]
}

// ===================================
// SINGLETON SERVICE
// ===================================

class ClientesService {
  private static instance: ClientesService

  private constructor() {}

  public static getInstance(): ClientesService {
    if (!ClientesService.instance) {
      ClientesService.instance = new ClientesService()
    }
    return ClientesService.instance
  }

  // ===================================
  // 1. MÉTRICAS PRINCIPALES
  // ===================================
  async getMetrics(): Promise<ClientesMetricsResponse> {
    const metrics = await clientesRepository.getClientesMetrics()

    // Convertir BigInt a number si es necesario
    const clientesIdentificados = Number(metrics.clientes_identificados || 0)
    const transaccionesAnonimas = Number(metrics.transacciones_anonimas || 0)
    const clientesVIPPlatinum = Number(metrics.clientes_vip_platinum || 0)
    const clientesVIPGold = Number(metrics.clientes_vip_gold || 0)

    // Calcular porcentaje de identificación
    const totalTransacciones = clientesIdentificados + transaccionesAnonimas
    const porcentajeIdentificados = totalTransacciones > 0
      ? ((clientesIdentificados / totalTransacciones) * 100).toFixed(2)
      : '0.00'

    return {
      clientesIdentificados,
      transaccionesAnonimas,
      clientesVIPPlatinum,
      clientesVIPGold,
      ingresosIdentificados: metrics.ingresos_identificados || '0',
      ingresosAnonimos: metrics.ingresos_anonimos || '0',
      porcentajeIdentificados
    }
  }

  // ===================================
  // 2. VISTA GENERAL COMPLETA
  // ===================================
  async getOverview(): Promise<ClientesOverviewResponse> {
    const [
      distribution,
      topClientesByFrequency,
      topClientesByValue,
      segmentation,
      recencyAnalysis,
      spendingRanges
    ] = await Promise.all([
      clientesRepository.getClienteDistribution(),
      clientesRepository.getTopClientesByFrequency(20),
      clientesRepository.getTopClientesByValue(20),
      clientesRepository.getClienteSegmentation(),
      clientesRepository.getRecencyAnalysis(),
      clientesRepository.getSpendingRangeDistribution()
    ])

    // Convertir BigInt a number en todos los arrays
    return {
      distribution: this.convertBigIntToNumber(distribution),
      topClientesByFrequency: this.convertBigIntToNumber(topClientesByFrequency),
      topClientesByValue: this.convertBigIntToNumber(topClientesByValue),
      segmentation: this.convertBigIntToNumber(segmentation),
      recencyAnalysis: this.convertBigIntToNumber(recencyAnalysis),
      spendingRanges: this.convertBigIntToNumber(spendingRanges)
    }
  }

  // ===================================
  // 3. DISTRIBUCIÓN (Identificados vs Anónimos)
  // ===================================
  async getDistribution() {
    const distribution = await clientesRepository.getClienteDistribution()
    return this.convertBigIntToNumber(distribution)
  }

  // ===================================
  // 4. TOP CLIENTES
  // ===================================
  async getTopClientes(type: 'frequency' | 'value' = 'frequency', limit: number = 20) {
    const topClientes = type === 'frequency'
      ? await clientesRepository.getTopClientesByFrequency(limit)
      : await clientesRepository.getTopClientesByValue(limit)

    return this.convertBigIntToNumber(topClientes)
  }

  // ===================================
  // 5. SEGMENTACIÓN
  // ===================================
  async getSegmentation() {
    const segmentation = await clientesRepository.getClienteSegmentation()
    return this.convertBigIntToNumber(segmentation)
  }

  // ===================================
  // 6. ANÁLISIS DE RECENCIA
  // ===================================
  async getRecencyAnalysis() {
    const recency = await clientesRepository.getRecencyAnalysis()
    return this.convertBigIntToNumber(recency)
  }

  // ===================================
  // 7. DISTRIBUCIÓN POR RANGO DE GASTO
  // ===================================
  async getSpendingRanges() {
    const ranges = await clientesRepository.getSpendingRangeDistribution()
    return this.convertBigIntToNumber(ranges)
  }

  // ===================================
  // UTILIDAD: Convertir BigInt a Number
  // ===================================
  private convertBigIntToNumber(data: any): any {
    if (Array.isArray(data)) {
      return data.map(item => this.convertBigIntToNumber(item))
    }

    if (data && typeof data === 'object') {
      const converted: any = {}
      for (const key in data) {
        if (typeof data[key] === 'bigint') {
          converted[key] = Number(data[key])
        } else if (typeof data[key] === 'object') {
          converted[key] = this.convertBigIntToNumber(data[key])
        } else {
          converted[key] = data[key]
        }
      }
      return converted
    }

    return data
  }
}

// ===================================
// EXPORT SINGLETON
// ===================================
export const clientesService = ClientesService.getInstance()