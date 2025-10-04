// frontend/src/features/casos/caducidad/pages/CaducidadPage.tsx

import { useCaducidadData } from '../hooks/useCaducidadData'
import { CaducidadMetrics } from '../components/CaducidadMetrics'
import { CaducidadPieChart } from '../components/CaducidadPieChart'
import { CaducidadBarChart } from '../components/CaducidadBarChart'
import { CriticalProductsTable } from '../components/CriticalProductsTable'

export function CaducidadPage() {
  const { data, isLoading, error } = useCaducidadData()

  // Estado de carga
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando datos de caducidad...</p>
          <p className="text-gray-500 text-sm mt-2">Analizando inventario</p>
        </div>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg max-w-2xl">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-4xl">⚠️</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Error al Cargar Datos de Caducidad
              </h3>
              <p className="text-red-700 mb-4">
                {error instanceof Error ? error.message : 'Error desconocido al cargar los datos'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Estado sin datos
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <span className="text-8xl mb-4 block">📦</span>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Sin Datos Disponibles
          </h3>
          <p className="text-gray-600 max-w-md">
            No se encontraron datos de caducidad en el sistema. Verifica que las tablas 
            <code className="bg-gray-200 px-2 py-1 rounded mx-1">products</code> y 
            <code className="bg-gray-200 px-2 py-1 rounded mx-1">product_lots</code> 
            contengan información.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Control de Caducidad
            </h1>
            <p className="text-gray-600 mt-1">
              Monitoreo y gestión de productos próximos a vencer
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></span>
              Datos en Tiempo Real
            </span>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <CaducidadMetrics metrics={data.metrics} />

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CaducidadPieChart data={data.distribution} />
        <CaducidadBarChart data={data.categories} />
      </div>

      {/* Tabla de productos críticos */}
      <CriticalProductsTable data={data.criticalProducts} />

      {/* Información adicional */}
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-2xl">💡</span>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              Recomendaciones de Acción
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Vencidos:</strong> Retirar inmediatamente del inventario</li>
              <li>• <strong>Críticos (1-3 días):</strong> Aplicar descuentos del 50%+ para liquidación urgente</li>
              <li>• <strong>Urgentes (4-7 días):</strong> Promociones especiales y notificación a clientes frecuentes</li>
              <li>• <strong>Preventivo:</strong> Implementar sistema FIFO para rotación adecuada</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer con timestamp */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          Última actualización: {new Date().toLocaleString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </p>
      </div>
    </div>
  )
}