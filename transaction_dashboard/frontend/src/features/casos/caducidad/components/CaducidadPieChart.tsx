// frontend/src/features/casos/caducidad/components/CaducidadPieChart.tsx

import { ResponsivePie } from '@nivo/pie'
import type { ExpiryDistributionItem } from '../types'

interface CaducidadPieChartProps {
  data: ExpiryDistributionItem[];
}

export function CaducidadPieChart({ data }: CaducidadPieChartProps) {
  // Si no hay datos, mostrar mensaje
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Distribución por Estado de Caducidad</h3>
        <div className="h-96 flex items-center justify-center text-gray-500">
          <div className="text-center">
            {/* Icono eliminado para profesionalismo */}
            <p>No hay datos de caducidad disponibles</p>
          </div>
        </div>
      </div>
    )
  }

  // Transformar datos para Nivo Pie
  const chartData = data.map(item => ({
    id: item.estado,
    label: item.estado,
    value: item.lotes,
    productos: item.productos,
    porcentaje: item.porcentaje
  }))

  // Colores según el estado
  const getColor = (estado: string) => {
    if (estado.includes('Vencido')) return '#dc2626' // rojo
    if (estado.includes('Crítico')) return '#ea580c' // naranja oscuro
    if (estado.includes('Urgente')) return '#f59e0b' // amarillo
    if (estado.includes('Riesgo')) return '#eab308' // amarillo claro
    if (estado.includes('Preventivo')) return '#84cc16' // verde lima
    return '#10b981' // verde
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Distribución por Estado de Caducidad
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Total de lotes: {data.reduce((sum, item) => sum + item.lotes, 0).toLocaleString()}
        </p>
      </div>

      <div className="h-96">
        <ResponsivePie
          data={chartData}
          margin={{ top: 40, right: 120, bottom: 80, left: 40 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={item => getColor(item.id as string)}
          borderWidth={1}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 0.2]]
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: 'color',
            modifiers: [['darker', 2]]
          }}
          arcLabel={d => `${d.value}`}
          valueFormat={value => value.toLocaleString()}
          legends={[
            {
              anchor: 'right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 8,
              itemWidth: 100,
              itemHeight: 20,
              itemTextColor: '#333',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 14,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000',
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          tooltip={({ datum }) => (
            <div className="bg-white px-3 py-2 shadow-lg rounded border border-gray-200">
              <div className="font-semibold text-gray-900">{datum.id}</div>
              <div className="text-sm text-gray-600 mt-1">
                <div>Lotes: <strong>{datum.value.toLocaleString()}</strong></div>
                <div>Productos: <strong>{datum.data.productos.toLocaleString()}</strong></div>
                <div>Porcentaje: <strong>{datum.data.porcentaje}%</strong></div>
              </div>
            </div>
          )}
          animate={true}
          motionConfig="gentle"
        />
      </div>

      {/* Leyenda adicional con información */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 p-2 bg-gray-50 rounded"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getColor(item.estado) }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{item.estado}</p>
              <p className="text-gray-600">
                {item.lotes} lotes ({item.porcentaje}%)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}