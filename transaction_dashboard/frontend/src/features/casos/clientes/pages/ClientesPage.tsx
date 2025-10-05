// frontend/src/features/casos/clientes/pages/ClientesPage.tsx
// Página principal del Caso de Uso 4: Identificación de Clientes

import { useState } from 'react'
import { ClientesMetrics } from '../components/ClientesMetrics'
import { ClientesPieChart } from '../components/ClientesPieChart'
import { ClientesBarChart } from '../components/ClientesBarChart'
import { ClientesSegmentationTable } from '../components/ClientesSegmentationTable'
import {
  useClientesMetrics,
  useClientesDistribution,
  useTopClientes,
  useClientesSegmentation
} from '../hooks/useClientesData'

export function ClientesPage() {
  const [topType, setTopType] = useState<'frequency' | 'value'>('frequency')

  // Consumir todos los hooks
  const { data: metricsData, isLoading: metricsLoading, error: metricsError } = useClientesMetrics()
  const { data: distributionData, isLoading: distributionLoading, error: distributionError } = useClientesDistribution()
  const { data: topData, isLoading: topLoading, error: topError } = useTopClientes(topType, 20)
  const { data: segmentationData, isLoading: segmentationLoading, error: segmentationError } = useClientesSegmentation()

  // Estados de carga
  const isLoading = metricsLoading || distributionLoading || topLoading || segmentationLoading
  const error = metricsError || distributionError || topError || segmentationError

  // 1. ESTADO: LOADING
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando análisis de clientes...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 2. ESTADO: ERROR
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-3xl">⚠️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Error al cargar datos
                </h3>
                <p className="text-sm text-red-700">
                  {error instanceof Error ? error.message : 'Error desconocido'}
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 3. ESTADO: EMPTY (sin datos)
  if (!metricsData?.data || !distributionData?.data || !topData?.data || !segmentationData?.data) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📭</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sin datos</h3>
            <p className="text-gray-600">No hay datos de clientes disponibles</p>
          </div>
        </div>
      </div>
    )
  }

  // 4. ESTADO: SUCCESS - Renderizar página completa
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🎯 Identificación de Clientes
              </h1>
              <p className="text-gray-600">
                Análisis de segmentación y comportamiento de clientes
              </p>
            </div>
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium">
              📊 Datos en Tiempo Real
            </div>
          </div>
        </div>

        {/* Métricas principales */}
        <ClientesMetrics metrics={metricsData.data} />

        {/* Gráfico Pie - Distribución */}
        <div className="mb-8">
          <ClientesPieChart data={distributionData.data} />
        </div>

        {/* Toggle para cambiar tipo de Top */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Ver Top 20 por:</span>
          <button
            onClick={() => setTopType('frequency')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              topType === 'frequency'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Frecuencia
          </button>
          <button
            onClick={() => setTopType('value')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              topType === 'value'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Valor Total
          </button>
        </div>

        {/* Gráfico Bar - Top Clientes */}
        <div className="mb-8">
          <ClientesBarChart data={topData.data} type={topType} />
        </div>

        {/* Tabla de Segmentación */}
        <div className="mb-8">
          <ClientesSegmentationTable data={segmentationData.data} />
        </div>

        {/* Recomendaciones */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            📋 Recomendaciones Estratégicas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="font-medium text-blue-900 mb-2">
                💎 Retención VIP
              </div>
              <div className="text-sm text-blue-700">
                Crear programa de lealtad para clientes Platinum y Gold
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="font-medium text-blue-900 mb-2">
                📈 Upgrade de Clientes
              </div>
              <div className="text-sm text-blue-700">
                Incentivar a clientes Frecuentes a convertirse en VIP
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="font-medium text-blue-900 mb-2">
                🔄 Reactivación
              </div>
              <div className="text-sm text-blue-700">
                Campañas de reenganche para clientes Ocasionales
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="font-medium text-blue-900 mb-2">
                ❓ Reducir Anónimos
              </div>
              <div className="text-sm text-blue-700">
                Implementar incentivos para captura de datos de clientes
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="font-medium text-blue-900 mb-2">
                📊 Análisis Predictivo
              </div>
              <div className="text-sm text-blue-700">
                Usar datos de recencia para predecir churn de clientes
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="font-medium text-blue-900 mb-2">
                🎯 Personalización
              </div>
              <div className="text-sm text-blue-700">
                Ofertas personalizadas según segmento de cliente
              </div>
            </div>
          </div>
        </div>

        {/* Footer con timestamp */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Última actualización:{' '}
          {new Date(metricsData.timestamp).toLocaleString('es-MX', {
            dateStyle: 'medium',
            timeStyle: 'short'
          })}
        </div>
      </div>
    </div>
  )
}