// frontend/src/features/casos/clientes/components/ClientesPieChart.tsx
// Gráfico Pie - Distribución: Identificados vs Anónimos

import { ResponsivePie } from '@nivo/pie'
import type { ClienteDistribution } from '../types'

interface ClientesPieChartProps {
  data: ClienteDistribution[]
}

export function ClientesPieChart({ data }: ClientesPieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-500">
        No hay datos disponibles
      </div>
    )
  }

  // Transformar datos para Nivo Pie
  const chartData = data.map((item) => ({
    id: item.tipo_cliente,
    label: item.tipo_cliente,
    value: item.transacciones,
    porcentaje: item.porcentaje,
    ingresos: item.ingresos,
    ticket_promedio: item.ticket_promedio
  }))

  // Colores personalizados
  const colors = {
    'Identificado': '#3B82F6', // Azul
    'Anónimo': '#9CA3AF'       // Gris
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          Distribución de Clientes
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Transacciones identificadas vs anónimas
        </p>
      </div>

      <div className="h-[400px]">
        <ResponsivePie
          data={chartData}
          margin={{ top: 40, right: 120, bottom: 80, left: 120 }}
          innerRadius={0.5}
          padAngle={2}
          cornerRadius={4}
          activeOuterRadiusOffset={8}
          colors={(d) => colors[d.id as keyof typeof colors] || '#94A3B8'}
          borderWidth={2}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#334155"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor="#ffffff"
          arcLabel={(d) => `${d.data.porcentaje}%`}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 20,
              itemWidth: 120,
              itemHeight: 18,
              itemTextColor: '#334155',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle'
            }
          ]}
          tooltip={({ datum }) => (
            <div className="bg-white px-4 py-3 shadow-lg rounded-lg border border-gray-200">
              <div className="font-semibold text-gray-800 mb-2">
                {datum.label}
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Transacciones:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('es-MX').format(datum.value)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Porcentaje:</span>
                  <span className="font-medium">{datum.data.porcentaje}%</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Ingresos:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('es-MX', {
                      style: 'currency',
                      currency: 'MXN',
                      minimumFractionDigits: 0
                    }).format(parseFloat(datum.data.ingresos))}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Ticket Promedio:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('es-MX', {
                      style: 'currency',
                      currency: 'MXN',
                      minimumFractionDigits: 2
                    }).format(parseFloat(datum.data.ticket_promedio))}
                  </span>
                </div>
              </div>
            </div>
          )}
        />
      </div>

      {/* Tabla resumen debajo del gráfico */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Tipo
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                Transacciones
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                Porcentaje
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                Ingresos
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800 font-medium">
                  {item.tipo_cliente}
                </td>
                <td className="px-4 py-3 text-right text-gray-800">
                  {new Intl.NumberFormat('es-MX').format(item.transacciones)}
                </td>
                <td className="px-4 py-3 text-right text-gray-800">
                  {item.porcentaje}%
                </td>
                <td className="px-4 py-3 text-right text-gray-800">
                  {new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                    minimumFractionDigits: 0
                  }).format(parseFloat(item.ingresos))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}