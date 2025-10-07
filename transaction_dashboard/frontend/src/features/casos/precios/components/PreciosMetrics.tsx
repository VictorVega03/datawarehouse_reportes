// frontend/src/features/casos/precios/components/PreciosMetrics.tsx
import React from 'react'
import type { PreciosMetrics } from '../types'

interface Props {
  metrics: PreciosMetrics
}

export const PreciosMetricsComponent: React.FC<Props> = ({ metrics }) => {
  if (!metrics) return null

  const formatCurrency = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) return '$0'
    
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numValue)
  }

  const formatNumber = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) return '0'
    return new Intl.NumberFormat('es-MX').format(numValue)
  }

  const formatPercent = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) return '0%'
    return `${numValue.toFixed(2)}%`
  }

  const cards = [
    {
      title: 'Total Transacciones',
      value: formatNumber(metrics.totalTransaccionesDetalle),
      color: 'blue'
    },
    {
      title: 'Con Descuento',
      value: `${formatNumber(metrics.transaccionesConDescuento)} (${formatPercent(metrics.porcentajeConDescuento)})`,
      color: 'green'
    },
    {
      title: 'Total Descuentos',
      value: formatCurrency(metrics.totalDescuentos),
      color: 'red'
    },
    {
      title: 'Ingresos Netos',
      value: formatCurrency(metrics.ingresosNetos),
      color: 'emerald'
    },
    {
      title: 'Ingresos Sin Descuento',
      value: formatCurrency(metrics.ingresosSinDescuento),
      color: 'purple'
    },
    {
      title: 'Descuento Promedio',
      value: formatPercent(metrics.porcentajeDescuentoPromedio),
      color: 'orange'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      red: 'bg-red-50 border-red-200',
      emerald: 'bg-emerald-50 border-emerald-200',
      purple: 'bg-purple-50 border-purple-200',
      orange: 'bg-orange-50 border-orange-200'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const colorMap: Record<string, string> = {
          blue: 'text-blue-700',
          green: 'text-green-700',
          red: 'text-red-700',
          emerald: 'text-emerald-700',
          purple: 'text-purple-700',
          orange: 'text-orange-700'
        };
        const textColor = colorMap[card.color] || 'text-blue-700';
        return (
          <div 
            key={index}
            className={`${getColorClasses(card.color)} border-2 rounded-lg p-6 transition-all hover:shadow-lg`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className={`text-lg font-semibold mb-2 tracking-tight ${textColor}`}>
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}