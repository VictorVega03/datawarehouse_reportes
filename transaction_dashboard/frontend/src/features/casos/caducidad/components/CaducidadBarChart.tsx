// frontend/src/features/casos/caducidad/components/CaducidadBarChart.tsx

import { ResponsiveBar } from '@nivo/bar'
import type { CategoryRiskItem } from '../types'

interface CaducidadBarChartProps {
  data: CategoryRiskItem[];
}

export function CaducidadBarChart({ data }: CaducidadBarChartProps) {
  // Si no hay datos, mostrar mensaje
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Categorías en Riesgo</h3>
        <div className="h-96 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <span className="text-6xl mb-4 block">📊</span>
            <p>No hay categorías en riesgo actualmente</p>
          </div>
        </div>
      </div>
    )
  }

  // Transformar datos para Nivo Bar
  const chartData = data.map(item => ({
    categoria: item.categoria.length > 20 
      ? item.categoria.substring(0, 20) + '...' 
      : item.categoria,
    categoriaCompleta: item.categoria,
    'Lotes en Riesgo': item.lotesEnRiesgo,
    'Productos Afectados': item.productosEnRiesgo
  }))

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Top 10 Categorías con Productos en Riesgo
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Productos que caducan en los próximos 7 días
        </p>
      </div>

      <div className="h-96">
        <ResponsiveBar
          data={chartData}
          keys={['Lotes en Riesgo', 'Productos Afectados']}
          indexBy="categoria"
          margin={{ top: 20, right: 140, bottom: 80, left: 60 }}
          padding={0.3}
          groupMode="grouped"
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={['#f59e0b', '#dc2626']} // Amarillo y rojo
          borderColor={{
            from: 'color',
            modifiers: [['darker', 1.6]]
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: 'Categoría',
            legendPosition: 'middle',
            legendOffset: 60,
            truncateTickAt: 0
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Cantidad',
            legendPosition: 'middle',
            legendOffset: -50,
            format: value => value.toLocaleString()
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 1.6]]
          }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 8,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 14,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          tooltip={({ id, value, data }) => (
            <div className="bg-white px-3 py-2 shadow-lg rounded border border-gray-200">
              <div className="font-semibold text-gray-900">
                {data.categoriaCompleta}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                <div><strong>{id}:</strong> {value.toLocaleString()}</div>
              </div>
            </div>
          )}
          animate={true}
          motionConfig="gentle"
          role="application"
          ariaLabel="Categorías con productos en riesgo de caducidad"
        />
      </div>

      {/* Tabla resumen debajo del gráfico */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Categoría
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                Lotes en Riesgo
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                Productos Afectados
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.slice(0, 5).map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-900">
                  {item.categoria}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 text-right font-medium">
                  {item.lotesEnRiesgo.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 text-right font-medium">
                  {item.productosEnRiesgo.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}