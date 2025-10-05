// frontend/src/features/casos/precios/components/PreciosPieChart.tsx
import React from 'react'
import { ResponsivePie } from '@nivo/pie'
import type { DistribucionDescuento } from '../types'

interface Props {
  data: DistribucionDescuento[]
}

export const PreciosPieChart: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return null

  // Transformar datos para Nivo Pie
  const chartData = data.map(item => ({
    id: item.rangoDescuento,
    label: item.rangoDescuento,
    value: typeof item.numTransacciones === 'string' ? parseInt(item.numTransacciones) : item.numTransacciones,
    porcentaje: typeof item.promedioPorcentaje === 'string' ? parseFloat(item.promedioPorcentaje) : item.promedioPorcentaje
  }))

  // Colores personalizados
  const colors = ['#ef4444', '#f59e0b', '#eab308', '#84cc16', '#10b981']

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        📊 Distribución de Descuentos por Rango
      </h3>
      <div style={{ height: '400px' }}>
        <ResponsivePie
          data={chartData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={colors}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          valueFormat={(value) => `${value.toLocaleString('es-MX')} trans.`}
          tooltip={({ datum }) => (
            <div className="bg-white px-3 py-2 shadow-lg rounded border border-gray-300">
              <strong>{datum.label}</strong>
              <div>Transacciones: {datum.value.toLocaleString('es-MX')}</div>
              <div>Descuento promedio: {datum.data.porcentaje}%</div>
            </div>
          )}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle'
            }
          ]}
        />
      </div>
    </div>
  )
}