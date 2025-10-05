// frontend/src/features/casos/clientes/components/ClientesBarChart.tsx
// Gráfico de Barras - Top 20 Clientes

import { ResponsiveBar } from '@nivo/bar'
import type { TopCliente } from '../types'

interface ClientesBarChartProps {
  data: TopCliente[]
  type: 'frequency' | 'value'
}

export function ClientesBarChart({ data, type }: ClientesBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-500">
        No hay datos disponibles
      </div>
    )
  }

  // Transformar datos para Nivo Bar
  const chartData = data.slice(0, 20).map((item) => ({
    customer_id: `Cliente ${item.customer_id}`,
    transacciones: item.num_transacciones,
    valor: parseFloat(item.valor_total),
    ticket_promedio: parseFloat(item.ticket_promedio)
  }))

  const title = type === 'frequency' 
    ? 'Top 20 Clientes por Frecuencia'
    : 'Top 20 Clientes por Valor Total'

  const subtitle = type === 'frequency'
    ? 'Clientes con mayor número de transacciones'
    : 'Clientes con mayor valor total de compras'

  const key = type === 'frequency' ? 'transacciones' : 'valor'
  const label = type === 'frequency' ? 'Transacciones' : 'Valor Total'

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
      </div>

      <div className="h-[500px]">
        <ResponsiveBar
          data={chartData}
          keys={[key]}
          indexBy="customer_id"
          margin={{ top: 20, right: 30, bottom: 150, left: 80 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={type === 'frequency' ? '#8B5CF6' : '#10B981'}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          borderWidth={1}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: 'Cliente',
            legendPosition: 'middle',
            legendOffset: 120
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: label,
            legendPosition: 'middle',
            legendOffset: -60,
            format: (value) => 
              new Intl.NumberFormat('es-MX', {
                notation: 'compact',
                compactDisplay: 'short'
              }).format(value)
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor="#ffffff"
          role="application"
          ariaLabel={title}
          tooltip={({ indexValue, value, data }) => (
            <div className="bg-white px-4 py-3 shadow-lg rounded-lg border border-gray-200">
              <div className="font-semibold text-gray-800 mb-2">
                {indexValue}
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Transacciones:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('es-MX').format(data.transacciones)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Valor Total:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('es-MX', {
                      style: 'currency',
                      currency: 'MXN',
                      minimumFractionDigits: 0
                    }).format(data.valor)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Ticket Promedio:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('es-MX', {
                      style: 'currency',
                      currency: 'MXN',
                      minimumFractionDigits: 2
                    }).format(data.ticket_promedio)}
                  </span>
                </div>
              </div>
            </div>
          )}
        />
      </div>

      {/* Tabla resumen - Top 5 */}
      <div className="mt-6 overflow-x-auto">
        <div className="text-sm font-semibold text-gray-700 mb-3">
          Top 5 Clientes
        </div>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Cliente
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                Transacciones
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                Valor Total
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                Ticket Promedio
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.slice(0, 5).map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800 font-medium">
                  Cliente {item.customer_id}
                </td>
                <td className="px-4 py-3 text-right text-gray-800">
                  {new Intl.NumberFormat('es-MX').format(item.num_transacciones)}
                </td>
                <td className="px-4 py-3 text-right text-gray-800">
                  {new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                    minimumFractionDigits: 0
                  }).format(parseFloat(item.valor_total))}
                </td>
                <td className="px-4 py-3 text-right text-gray-800">
                  {new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                    minimumFractionDigits: 2
                  }).format(parseFloat(item.ticket_promedio))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}