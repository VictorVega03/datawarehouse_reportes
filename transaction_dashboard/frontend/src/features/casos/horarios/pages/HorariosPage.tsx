// frontend/src/features/casos/horarios/pages/HorariosPage.tsx
// Página principal del caso de uso: Patrones Horarios

import React from 'react'
import { useHorariosAnalysis } from '../hooks/useHorariosData'
import { HorariosChart, HorariosMetrics, HorariosTable } from '../components'
import { Card } from '../../../../components/ui/Card'
import { Spinner } from '../../../../components/ui/Spinner'
import { Button } from '../../../../components/ui/Button'

export const HorariosPage: React.FC = () => {
  const { data, isLoading, isError, error } = useHorariosAnalysis()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-600">Cargando análisis de patrones horarios...</p>
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
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight drop-shadow-sm">
                <span className="block text-blue-700">Caso 1:</span>
                <span className="block text-gray-900">Análisis de Patrones Horarios</span>
              </h1>
          </div>
          <p className="text-gray-600">
            Optimización de operaciones basada en distribución temporal de ventas
          </p>
        </div>
      </div>

      {/* Métricas Principales */}
      <HorariosMetrics data={data} />

      {/* Gráfico Principal */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                  Distribución de Ventas por Hora
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Análisis de {data.totalTransactions.toLocaleString()} transacciones por horario
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="primary" onClick={() => window.location.reload()}>
                  Actualizar
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <HorariosChart data={data.hourlyDistribution} totalTransactions={data.totalTransactions} height={500} />
        </Card.Body>
      </Card>

      {/* Tabla de Datos */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-800">
              Análisis Detallado por Horarios
          </h2>
        </Card.Header>
        <Card.Body>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 shadow-sm">
              <HorariosTable data={data.hourlyDistribution} />
            </div>
        </Card.Body>
      </Card>

      {/* Insights y Recomendaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insights */}
        <Card className="border-blue-200 shadow-md bg-gradient-to-br from-blue-50 to-white">
          <Card.Header>
            <h3 className="text-lg font-bold text-blue-700 tracking-tight">
              Insights Clave
            </h3>
          </Card.Header>
          <Card.Body>
            {data.insights && data.insights.length > 0 ? (
              <ul className="space-y-3">
                {data.insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="rounded-md bg-blue-100 px-3 py-2 text-blue-900 shadow-sm w-full">
                      <p className="text-sm font-medium">{insight}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-3">
                <li>
                  <div className="rounded-md bg-blue-100 px-3 py-2 text-blue-900 shadow-sm">
                    <strong className="text-gray-900">Pico Principal:</strong>
                    <p className="text-sm text-gray-600">
                      El {data.peakPercentage}% de las transacciones ocurren en {data.peakHour}
                    </p>
                  </div>
                </li>
                <li>
                  <div className="rounded-md bg-blue-100 px-3 py-2 text-blue-900 shadow-sm">
                    <strong className="text-gray-900">Concentración:</strong>
                    <p className="text-sm text-gray-600">
                      El {data.concentration.percentage}% de las ventas se concentran en solo {data.concentration.hours} horas
                    </p>
                  </div>
                </li>
                <li>
                  <div className="rounded-md bg-blue-100 px-3 py-2 text-blue-900 shadow-sm">
                    <strong className="text-gray-900">Oportunidad:</strong>
                    <p className="text-sm text-gray-600">
                      ROI potencial de {data.potentialROI} con optimización de personal
                    </p>
                  </div>
                </li>
              </ul>
            )}
          </Card.Body>
        </Card>

        {/* Recomendaciones */}
        <Card className="border-green-200 shadow-md bg-gradient-to-br from-green-50 to-white">
          <Card.Header>
            <h3 className="text-lg font-bold text-green-700 tracking-tight">
              Recomendaciones
            </h3>
          </Card.Header>
          <Card.Body>
            {data.recommendations && data.recommendations.length > 0 ? (
              <ul className="space-y-3">
                {data.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="rounded-md bg-green-100 px-3 py-2 text-green-900 shadow-sm w-full flex gap-2 items-center">
                      <span className="text-green-700 font-bold">{index + 1}.</span>
                      <p className="text-sm font-medium">{recommendation}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-3">
                <li>
                  <div className="rounded-md bg-green-100 px-3 py-2 text-green-900 shadow-sm">
                    <strong className="text-gray-900">Personal en Horas Pico</strong>
                    <p className="text-sm text-gray-600">
                      Incrementar personal 50% en horario {data.peakHour}
                    </p>
                  </div>
                </li>
                <li>
                  <div className="rounded-md bg-green-100 px-3 py-2 text-green-900 shadow-sm">
                    <strong className="text-gray-900">Optimización Horas Valle</strong>
                    <p className="text-sm text-gray-600">
                      Reducir personal 30% en horarios de baja demanda
                    </p>
                  </div>
                </li>
                <li>
                  <div className="rounded-md bg-green-100 px-3 py-2 text-green-900 shadow-sm">
                    <strong className="text-gray-900">Promociones Estratégicas</strong>
                    <p className="text-sm text-gray-600">
                      Implementar descuentos en horas valle para equilibrar demanda
                    </p>
                  </div>
                </li>
              </ul>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}
