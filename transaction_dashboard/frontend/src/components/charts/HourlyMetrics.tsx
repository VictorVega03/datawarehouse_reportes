// frontend/src/components/charts/HourlyMetrics.tsx
import React from 'react'
import { Card } from '../ui/Card'
import type { HorariosAnalysis } from '../../features/casos/horarios'

interface HourlyMetricsProps {
  data: HorariosAnalysis
}

export const HourlyMetrics: React.FC<HourlyMetricsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Métrica 1: Pico Principal */}
      <Card padding="md" hover>
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {data.peakPercentage}%
          </div>
          <div className="text-sm text-gray-600">Pico {data.peakHour}</div>
        </div>
      </Card>

      {/* Métrica 2: Concentración */}
      <Card padding="md" hover>
        <div className="text-center">
          <div className="text-4xl font-bold text-purple-600 mb-2">
            {data.concentration.percentage}%
          </div>
          <div className="text-sm text-gray-600">
            Concentrado en {data.concentration.hours} horas
          </div>
        </div>
      </Card>

      {/* Métrica 3: Diferencia Pico/Valle */}
      <Card padding="md" hover>
        <div className="text-center">
          <div className="text-4xl font-bold text-orange-600 mb-2">
            {data.peakValleDifference}x
          </div>
          <div className="text-sm text-gray-600">Diferencia Pico/Valle</div>
        </div>
      </Card>

      {/* Métrica 4: ROI Potencial */}
      <Card padding="md" hover>
        <div className="text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">
            {data.potentialROI}
          </div>
          <div className="text-sm text-gray-600">ROI Anual Potencial</div>
        </div>
      </Card>
    </div>
  )
}