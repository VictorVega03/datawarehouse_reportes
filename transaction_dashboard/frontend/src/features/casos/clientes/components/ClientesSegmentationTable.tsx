// frontend/src/features/casos/clientes/components/ClientesSegmentationTable.tsx
// Tabla de Segmentación de Clientes

import type { ClienteSegmentation } from '../types'

interface ClientesSegmentationTableProps {
  data: ClienteSegmentation[]
}

export function ClientesSegmentationTable({ data }: ClientesSegmentationTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center h-32 text-gray-500">
          No hay datos disponibles
        </div>
      </div>
    )
  }

  // Definir colores por segmento
  const getSegmentColor = (segmento: string) => {
    if (segmento.includes('Platinum')) return 'bg-purple-100 text-purple-800'
    if (segmento.includes('Gold')) return 'bg-yellow-100 text-yellow-800'
    if (segmento.includes('Frecuente')) return 'bg-blue-100 text-blue-800'
    if (segmento.includes('Regular')) return 'bg-green-100 text-green-800'
    return 'bg-gray-100 text-gray-800'
  }

  // Definir emoji por segmento
  const getSegmentEmoji = (segmento: string) => {
    if (segmento.includes('Platinum')) return '💎'
    if (segmento.includes('Gold')) return '⭐'
    if (segmento.includes('Frecuente')) return '🔵'
    if (segmento.includes('Regular')) return '🟢'
    return '⚪'
  }

  // Calcular totales
  const totales = data.reduce((acc, item) => ({
    num_clientes: acc.num_clientes + item.num_clientes,
    ingresos_totales: acc.ingresos_totales + parseFloat(item.ingresos_totales)
  }), { num_clientes: 0, ingresos_totales: 0 })

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          Segmentación de Clientes
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Clasificación por frecuencia de compra
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Segmento
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Clientes
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                % del Total
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Ingresos Totales
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                % Ingresos
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Ingreso Promedio
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => {
              const porcentajeClientes = ((item.num_clientes / totales.num_clientes) * 100).toFixed(1)
              const porcentajeIngresos = ((parseFloat(item.ingresos_totales) / totales.ingresos_totales) * 100).toFixed(1)

              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getSegmentEmoji(item.segmento)}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSegmentColor(item.segmento)}`}>
                        {item.segmento}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right text-gray-800 font-medium">
                    {new Intl.NumberFormat('es-MX').format(item.num_clientes)}
                  </td>
                  <td className="px-4 py-4 text-right text-gray-600">
                    {porcentajeClientes}%
                  </td>
                  <td className="px-4 py-4 text-right text-gray-800 font-medium">
                    {new Intl.NumberFormat('es-MX', {
                      style: 'currency',
                      currency: 'MXN',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(parseFloat(item.ingresos_totales))}
                  </td>
                  <td className="px-4 py-4 text-right text-gray-600">
                    {porcentajeIngresos}%
                  </td>
                  <td className="px-4 py-4 text-right text-gray-800">
                    {new Intl.NumberFormat('es-MX', {
                      style: 'currency',
                      currency: 'MXN',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(parseFloat(item.ingreso_promedio_cliente))}
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot className="bg-gray-100 border-t-2 border-gray-300">
            <tr>
              <td className="px-4 py-4 text-sm font-bold text-gray-800">
                TOTAL
              </td>
              <td className="px-4 py-4 text-right text-sm font-bold text-gray-800">
                {new Intl.NumberFormat('es-MX').format(totales.num_clientes)}
              </td>
              <td className="px-4 py-4 text-right text-sm font-bold text-gray-800">
                100%
              </td>
              <td className="px-4 py-4 text-right text-sm font-bold text-gray-800">
                {new Intl.NumberFormat('es-MX', {
                  style: 'currency',
                  currency: 'MXN',
                  minimumFractionDigits: 0
                }).format(totales.ingresos_totales)}
              </td>
              <td className="px-4 py-4 text-right text-sm font-bold text-gray-800">
                100%
              </td>
              <td className="px-4 py-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Insights debajo de la tabla */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="text-sm font-medium text-purple-800 mb-1">
            💎 VIP Platinum
          </div>
          <div className="text-xs text-purple-600">
            Clientes con 50+ transacciones - Alta prioridad para retención
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="text-sm font-medium text-yellow-800 mb-1">
            ⭐ VIP Gold
          </div>
          <div className="text-xs text-yellow-600">
            Clientes con 20-49 transacciones - Oportunidad de upgrade
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="text-sm font-medium text-gray-800 mb-1">
            ⚪ Ocasionales
          </div>
          <div className="text-xs text-gray-600">
            Clientes con 1-4 transacciones - Enfoque en reactivación
          </div>
        </div>
      </div>
    </div>
  )
}