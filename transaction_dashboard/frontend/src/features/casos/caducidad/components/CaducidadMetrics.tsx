// frontend/src/features/casos/caducidad/components/CaducidadMetrics.tsx

import type { ExpiryMetrics } from '../types'

interface CaducidadMetricsProps {
  metrics: ExpiryMetrics;
}

export function CaducidadMetrics({ metrics }: CaducidadMetricsProps) {
  const cards = [
    {
      title: 'Lotes Vencidos',
      value: metrics.lotesVencidos,
      icon: '🚫',
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-700',
      valueColor: 'text-red-900',
      description: 'Requieren retiro inmediato'
    },
    {
      title: 'Lotes Críticos',
      value: metrics.lotesCriticos,
      icon: '⚠️',
      color: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-700',
      valueColor: 'text-orange-900',
      description: 'Caducan en 1-3 días'
    },
    {
      title: 'Lotes Urgentes',
      value: metrics.lotesUrgentes,
      icon: '⏰',
      color: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-700',
      valueColor: 'text-yellow-900',
      description: 'Caducan en 4-7 días'
    },
    {
      title: 'Ahorro Estimado',
      value: metrics.ahorroEstimado,
      icon: '💰',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-700',
      valueColor: 'text-green-900',
      description: 'Con acción preventiva'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.color} border rounded-lg p-6 transition-all hover:shadow-md`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className={`text-sm font-medium ${card.textColor} mb-1`}>
                {card.title}
              </p>
              <p className={`text-3xl font-bold ${card.valueColor} mb-2`}>
                {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
              </p>
              <p className={`text-xs ${card.textColor} opacity-75`}>
                {card.description}
              </p>
            </div>
            <span className="text-3xl ml-2">{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
  )
}