// frontend/src/features/casos/clientes/components/ClientesMetrics.tsx
// Componente de métricas principales para Identificación de Clientes

import type { ClientesMetrics } from '../types'

interface ClientesMetricsProps {
  metrics: ClientesMetrics
}

export function ClientesMetrics({ metrics }: ClientesMetricsProps) {
  // Formatear números con separadores de miles
  const formatNumber = (num: number | string): string => {
    const value = typeof num === 'string' ? parseFloat(num) : num
    return new Intl.NumberFormat('es-MX').format(value)
  }

  // Formatear moneda
  const formatCurrency = (value: string): string => {
    const num = parseFloat(value)
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Tarjeta 1: Clientes Identificados */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold">Identificados</span>
          <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
            {metrics.porcentajeIdentificados}%
          </span>
        </div>
        <div className="text-3xl font-bold mb-2">
          {formatNumber(metrics.clientesIdentificados)}
        </div>
        <div className="text-blue-100 text-sm">Clientes Identificados</div>
        <div className="mt-4 text-xs text-blue-100">
          Ingresos: {formatCurrency(metrics.ingresosIdentificados)}
        </div>
      </div>

      {/* Tarjeta 2: Transacciones Anónimas */}
      <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold">Anónimos</span>
          <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
            Anónimos
          </span>
        </div>
        <div className="text-3xl font-bold mb-2">
          {formatNumber(metrics.transaccionesAnonimas)}
        </div>
        <div className="text-gray-100 text-sm">Transacciones Anónimas</div>
        <div className="mt-4 text-xs text-gray-100">
          Ingresos: {formatCurrency(metrics.ingresosAnonimos)}
        </div>
      </div>

      {/* Tarjeta 3: Clientes VIP Platinum */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold">VIP Platinum</span>
          <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
            50+ compras
          </span>
        </div>
        <div className="text-3xl font-bold mb-2">
          {formatNumber(metrics.clientesVIPPlatinum)}
        </div>
        <div className="text-purple-100 text-sm">Clientes VIP Platinum</div>
        <div className="mt-4 text-xs text-purple-100">
          Alta frecuencia de compra
        </div>
      </div>

      {/* Tarjeta 4: Clientes VIP Gold */}
      <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold">VIP Gold</span>
          <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
            20-49 compras
          </span>
        </div>
        <div className="text-3xl font-bold mb-2">
          {formatNumber(metrics.clientesVIPGold)}
        </div>
        <div className="text-yellow-100 text-sm">Clientes VIP Gold</div>
        <div className="mt-4 text-xs text-yellow-100">
          Frecuencia media-alta
        </div>
      </div>
    </div>
  )
}