// frontend/src/features/casos/horarios/components/HorariosChart.tsx
// Componente de gráfico para patrones horarios con colores mejorados

import React from 'react'
import { ResponsiveBar } from '@nivo/bar'
import type { HourlyDataPoint } from '../types'

interface HorariosChartProps {
  data: HourlyDataPoint[]
  totalTransactions: number
  height?: number
}

export const HorariosChart: React.FC<HorariosChartProps> = ({ 
  data,
  totalTransactions, 
  height = 400 
}) => {
  // Función para obtener color según la hora del día
  const getColorByHour = (hour: string): string => {
    const hourNum = parseInt(hour.replace(':00', ''))
    
    // Madrugada (0-5): Azul oscuro/morado
    if (hourNum >= 0 && hourNum < 6) return '#667eea'
    
    // Mañana temprano (6-9): Naranja/Amarillo
    if (hourNum >= 6 && hourNum < 10) return '#fbbf24'
    
    // Media mañana (10-12): Verde
    if (hourNum >= 10 && hourNum < 12) return '#34d399'
    
    // Tarde (12-17): Azul cielo
    if (hourNum >= 12 && hourNum < 17) return '#60a5fa'
    
    // Tarde-noche (17-20): Naranja
    if (hourNum >= 17 && hourNum < 20) return '#fb923c'
    
    // Noche (20-24): Morado oscuro
    return '#a78bfa'
  }

  // Transformar datos para Nivo con colores personalizados
  const chartData = data.map(item => ({
    hour: item.hour,
    transactions: item.transactions,
    transactionsColor: getColorByHour(item.hour)
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
        colors={(bar) => {
          const colorKey = `${bar.id}Color` as keyof typeof bar.data
          return bar.data[colorKey] as string
        }}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.3]]
        }}
        borderWidth={1}
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
        labelTextColor="#ffffff"
        enableLabel={true}
        label={d => {
          const val = d.value as number
          if (val >= 1000000) {
            return `${(val / 1000000).toFixed(1)}M`
          } else if (val >= 1000) {
            return `${(val / 1000).toFixed(0)}K`
          }
          return val.toString()
        }}
        tooltip={({ indexValue, value, color }) => (
          <div
            style={{
              background: 'white',
              padding: '12px 16px',
              border: `2px solid ${color}`,
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  background: color,
                  borderRadius: '2px'
                }}
              />
              <strong style={{ fontSize: '14px', color: '#111827' }}>
                {indexValue}
              </strong>
            </div>
            <div style={{ marginTop: '4px', fontSize: '13px', color: '#6b7280' }}>
              {(value as number).toLocaleString()} transacciones
            </div>
            <div style={{ marginTop: '2px', fontSize: '12px', color: '#9ca3af' }}>
              {((value as number / totalTransactions) * 100).toFixed(2)}% del total
            </div>
          </div>
        )}
        animate={true}
        motionConfig="gentle"
        role="application"
        ariaLabel="Gráfico de distribución de transacciones por hora"
      />
    </div>
  )
}