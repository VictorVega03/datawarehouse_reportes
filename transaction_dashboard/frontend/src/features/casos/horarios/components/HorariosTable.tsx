// frontend/src/features/casos/horarios/components/HorariosTable.tsx
// Componente de tabla para patrones horarios

import React from 'react'
import { Badge } from '../../../../components/ui/Badge'
import type { HourlyDataPoint } from '../types'

interface HorariosTableProps {
  data: HourlyDataPoint[]
}

export const HorariosTable: React.FC<HorariosTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hora
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Transacciones
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              % del Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Clasificación
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recomendación
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => {
            // Determinar clasificación si no viene del backend
            const classification = item.classification || (
              item.percentage > 15 ? 'Pico' :
              item.percentage > 10 ? 'Alto' :
              item.percentage > 5 ? 'Normal' :
              item.percentage > 2 ? 'Bajo' : 'Valle'
            )
            
            const recommendation = item.recommendation || (
              classification === 'Pico' ? 'Reforzar personal' :
              classification === 'Alto' ? 'Personal adicional' :
              'Personal mínimo'
            )
            
            return (
              <tr key={item.hour} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.hour}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.transactions.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.percentage.toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {classification === 'Pico' ? (
                    <Badge variant="danger">Pico</Badge>
                  ) : classification === 'Alto' ? (
                    <Badge variant="warning">Alto</Badge>
                  ) : classification === 'Normal' ? (
                    <Badge variant="info">Normal</Badge>
                  ) : classification === 'Bajo' ? (
                    <Badge variant="default">Bajo</Badge>
                  ) : (
                    <Badge variant="default">Valle</Badge>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {recommendation}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
