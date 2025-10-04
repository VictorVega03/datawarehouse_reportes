// frontend/src/pages/PatronesHorariosPage.tsx
import React from 'react'
import { useHourlyAnalysis } from '../hooks/api/useHourlyData'
import { HourlyBarChart } from '../components/charts/HourlyBarChart'
import { HourlyMetrics } from '../components/charts/HourlyMetrics'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

export const PatronesHorariosPage: React.FC = () => {
  const { data, isLoading, isError, error } = useHourlyAnalysis()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-600">Cargando datos horarios...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card padding="lg">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error al cargar datos
            </h2>
            <p className="text-gray-600 mb-4">
              {error instanceof Error ? error.message : 'Error desconocido'}
            </p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🕐</span>
            <h1 className="text-3xl font-bold text-gray-900">
              Caso 1: Análisis de Patrones Horarios
            </h1>
          </div>
          <p className="text-gray-600">
            Optimización de operaciones basada en distribución temporal de ventas
          </p>
        </div>
        <Badge variant="success" size="lg">
          Completado
        </Badge>
      </div>

      {/* Métricas Principales */}
      <HourlyMetrics data={data} />

      {/* Gráfico Principal */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                📊 Distribución de Transacciones por Horario
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Análisis de {(data.totalTransactions / 1000000).toFixed(2)}M transacciones por horario
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                📥 Exportar
              </Button>
              <Button size="sm" variant="primary">
                🔄 Actualizar
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <HourlyBarChart 
            data={data.hourlyDistribution} 
            totalTransactions={data.totalTransactions}
            height={500} 
          />
        </Card.Body>
      </Card>

      {/* Tabla de Datos */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-800">
            📋 Análisis Detallado por Horarios
          </h2>
        </Card.Header>
        <Card.Body>
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
                {data.hourlyDistribution.map((item) => {
                  const isPeak = item.percentage > 15
                  const isHigh = item.percentage > 10 && item.percentage <= 15
                  
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
                        {isPeak ? (
                          <Badge variant="danger">Pico</Badge>
                        ) : isHigh ? (
                          <Badge variant="warning">Alto</Badge>
                        ) : (
                          <Badge variant="default">Valle</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {isPeak
                          ? 'Reforzar personal'
                          : isHigh
                          ? 'Personal adicional'
                          : 'Personal mínimo'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>

      {/* Insights y Recomendaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-800">
              💡 Insights Clave
            </h3>
          </Card.Header>
          <Card.Body>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-xl">🎯</span>
                <div>
                  <strong className="text-gray-900">Pico Principal:</strong>
                  <p className="text-sm text-gray-600">
                    El {data.peakPercentage}% de las transacciones ocurren en {data.peakHour}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">📊</span>
                <div>
                  <strong className="text-gray-900">Concentración:</strong>
                  <p className="text-sm text-gray-600">
                    El {data.concentration.percentage}% de las ventas se concentran en solo {data.concentration.hours} horas
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">💰</span>
                <div>
                  <strong className="text-gray-900">Oportunidad:</strong>
                  <p className="text-sm text-gray-600">
                    ROI potencial de {data.potentialROI} con optimización de personal
                  </p>
                </div>
              </li>
            </ul>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-800">
              ✅ Recomendaciones
            </h3>
          </Card.Header>
          <Card.Body>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">1.</span>
                <div>
                  <strong className="text-gray-900">Personal en Horas Pico</strong>
                  <p className="text-sm text-gray-600">
                    Incrementar personal 50% en horario 18:00-19:00
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">2.</span>
                <div>
                  <strong className="text-gray-900">Optimización Horas Valle</strong>
                  <p className="text-sm text-gray-600">
                    Reducir personal 30% en horarios de baja demanda
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">3.</span>
                <div>
                  <strong className="text-gray-900">Promociones Estratégicas</strong>
                  <p className="text-sm text-gray-600">
                    Implementar descuentos en horas valle para equilibrar demanda
                  </p>
                </div>
              </li>
            </ul>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}