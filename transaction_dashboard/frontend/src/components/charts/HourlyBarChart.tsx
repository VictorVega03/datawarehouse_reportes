// frontend/src/components/charts/HourlyBarChart.tsx
import React from 'react'
import { ResponsiveBar } from '@nivo/bar'
import type { HourlyDataPoint } from '../../hooks/api/useHourlyData'

// Tipos inline del componente
interface HourlyBarChartProps {
  data: HourlyDataPoint[]
  totalTransactions: number
  height?: number
}

export const HourlyBarChart: React.FC<HourlyBarChartProps> = ({ 
  data,
  totalTransactions, 
  height = 400 
}) => {
  // Transformar datos para Nivo
  const chartData = data.map(item => ({
    hour: item.hour,
    transactions: item.transactions,
    transactionsColor: 'hsl(217, 91%, 60%)' // Azul
  }))

  return (
    <div style={{ height: `${height}px` }}>
      <ResponsiveBar
        data={chartData}
        keys={['transactions']}
        indexBy="hour"
        margin={{ top: 50, right: 60, bottom: 80, left: 80 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'blues' }}
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
          legend: 'Hora del Día',
          legendPosition: 'middle',
          legendOffset: 60
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Número de Transacciones',
          legendPosition: 'middle',
          legendOffset: -60,
          format: value => {
            // Formatear números grandes (ej: 441878 → 441.9K)
            if (value >= 1000000) {
              return `${(value / 1000000).toFixed(1)}M`
            } else if (value >= 1000) {
              return `${(value / 1000).toFixed(1)}K`
            }
            return value.toString()
          }
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
            anchor: 'top-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
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
        role="application"
        ariaLabel="Gráfico de distribución horaria de transacciones"
        tooltip={({ indexValue, value, color }) => (
          <div
            style={{
              padding: '12px 16px',
              background: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            <strong style={{ color }}>Hora: {indexValue}</strong>
            <br />
            <span>Transacciones: {value.toLocaleString()}</span>
            <br />
            <span style={{ fontSize: '0.875rem', color: '#666' }}>
              {((value / totalTransactions) * 100).toFixed(2)}% del total
            </span>
          </div>
        )}
        animate={true}
        motionConfig="gentle"
      />
    </div>
  )
}