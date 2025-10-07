// frontend/src/features/casos/precios/components/PreciosBarChart.tsx
import React from 'react'
import { ResponsiveBar } from '@nivo/bar'
import type { CategoriaDescuento } from '../types'

interface Props {
  data: CategoriaDescuento[]
}

export const PreciosBarChart: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return null

  // Transformar datos para Nivo Bar
  const chartData = data.map(item => {
    const descuentos = typeof item.descuentosTotales === 'string' ? parseFloat(item.descuentosTotales) : item.descuentosTotales
    const ingresos = typeof item.ingresosNetos === 'string' ? parseFloat(item.ingresosNetos) : item.ingresosNetos
    const porcentaje = typeof item.porcentajeDescuentoPromedio === 'string' ? parseFloat(item.porcentajeDescuentoPromedio) : item.porcentajeDescuentoPromedio
    
    return {
      categoria: item.categoria || 'Sin categoría',
      'Descuentos': Number(descuentos),
      'Ingresos Netos': Number(ingresos),
      porcentaje: Number(porcentaje)
    }
  })

  const formatCurrency = (value: number): string => {
    return `$${(value / 1000000).toFixed(1)}M`
  }

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
  Top Categorías con Descuentos
      </h3>
      <div style={{ height: '500px' }}>
        <ResponsiveBar
          data={chartData}
          keys={['Descuentos', 'Ingresos Netos']}
          indexBy="categoria"
          margin={{ top: 50, right: 130, bottom: 100, left: 80 }}
          padding={0.3}
          groupMode="grouped"
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={['#ef4444', '#10b981']}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: 'Categoría',
            legendPosition: 'middle',
            legendOffset: 80
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Monto (MXN)',
            legendPosition: 'middle',
            legendOffset: -60,
            format: formatCurrency
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          valueFormat={formatCurrency}
          tooltip={({ id, value, indexValue, data }) => (
            <div className="bg-white px-3 py-2 shadow-lg rounded border border-gray-300">
              <strong>{indexValue}</strong>
              <div className="text-sm">
                {id}: {formatCurrency(Number(value))}
              </div>
              <div className="text-xs text-gray-600">
                % Descuento: {data.porcentaje}%
              </div>
            </div>
          )}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20
            }
          ]}
          role="application"
          ariaLabel="Categorías con descuentos"
        />
      </div>
    </div>
  )
}