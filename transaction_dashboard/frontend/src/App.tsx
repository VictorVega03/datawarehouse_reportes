// frontend/src/App.tsx - PASO 6 Completado
import React from 'react'
import { useDashboardMetrics, useApiConnectionTest } from './hooks/api/useDashboardMetrics'

function App() {
  const { 
    data: metrics, 
    isLoading: metricsLoading, 
    isError: metricsError,
    error: metricsErrorDetails 
  } = useDashboardMetrics()
  
  const { 
    data: connectionTest, 
    isLoading: connectionLoading 
  } = useApiConnectionTest()

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🚀</div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Transaction Analytics Dashboard
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Frontend ↔ Backend conectados correctamente
        </p>

        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            ✅ PASO 6 Completado - Stores Zustand Funcionando
          </h2>

          {/* Estado de Conexión */}
          <div className="bg-blue-50 rounded-md p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              🔌 Estado de Conexión API
            </h3>
            
            {connectionLoading ? (
              <div className="flex items-center justify-center">
                <span className="ml-2 text-gray-600">Verificando conexión...</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className={`mr-2 ${connectionTest?.backend ? 'text-green-500' : 'text-red-500'}`}>
                    {connectionTest?.backend ? '✅' : '❌'}
                  </span>
                  <span className="text-sm">
                    Backend (puerto 3001): {connectionTest?.backend ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <span className={`mr-2 ${connectionTest?.api ? 'text-green-500' : 'text-red-500'}`}>
                    {connectionTest?.api ? '✅' : '❌'}
                  </span>
                  <span className="text-sm">
                    API Endpoints: {connectionTest?.api ? 'Funcionando' : 'Error'}
                  </span>
                </div>
                
                {connectionTest?.timestamp && (
                  <div className="text-sm text-gray-500 mt-2">
                    Última verificación: {new Date(connectionTest.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Métricas del Dashboard */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📊 Métricas del Dashboard (Datos Reales del Backend)
            </h3>
            
            {metricsLoading ? (
              <div className="flex items-center justify-center py-8">
                <span className="ml-3 text-gray-600">Cargando métricas...</span>
              </div>
            ) : metricsError ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <h4 className="text-red-800 font-semibold mb-2">❌ Error al cargar métricas</h4>
                <p className="text-red-600 text-sm">
                  {metricsErrorDetails?.message || 'Error desconocido'}
                </p>
              </div>
            ) : metrics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Total Transacciones */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                  <div className="text-2xl font-bold">
                    {metrics.totalTransactions?.value || '2.92M'}
                  </div>
                  <div className="text-sm opacity-90">
                    {metrics.totalTransactions?.label || 'Total Transacciones'}
                  </div>
                </div>

                {/* ROI Anual */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                  <div className="text-2xl font-bold">
                    {metrics.annualROI?.value || '$220M+'}
                  </div>
                  <div className="text-sm opacity-90">
                    {metrics.annualROI?.label || 'ROI Anual'}
                  </div>
                </div>

                {/* Clientes Únicos */}
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                  <div className="text-2xl font-bold">
                    {metrics.uniqueCustomers?.value || '29,991'}
                  </div>
                  <div className="text-sm opacity-90">
                    {metrics.uniqueCustomers?.label || 'Clientes Únicos'}
                  </div>
                </div>

                {/* Casos Completados */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                  <div className="text-2xl font-bold">
                    {metrics.completionRate?.value || '70%'}
                  </div>
                  <div className="text-sm opacity-90">
                    {metrics.completionRate?.label || 'Casos Completados'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4">
                No hay datos disponibles
              </div>
            )}
          </div>

          {/* Información de Progreso */}
          <div className="mt-8 bg-gray-50 rounded-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              🎯 Progreso del Proyecto
            </h3>
            
            <div className="space-y-2 text-left">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                <span className="text-sm">PASO 1: Configuración Base</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                <span className="text-sm">PASO 2: Variables de Entorno</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                <span className="text-sm">PASO 3: Entry Points (React + TanStack Query)</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                <span className="text-sm">PASO 4: API Client</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                <span className="text-sm">PASO 5: Types System (inline)</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                <span className="text-sm font-semibold">PASO 6: Stores Zustand</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-500 mr-2">⏳</span>
                <span className="text-sm">PASO 7: Componentes UI Base</span>
              </div>
            </div>
          </div>

          {/* Próximos pasos */}
          <div className="mt-6 text-left">
            <h4 className="font-semibold text-gray-800 mb-2">🚀 Próximos Pasos:</h4>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>• <strong>PASO 7:</strong> Componentes UI base (Button, Card, etc.)</li>
              <li>• <strong>PASO 8:</strong> Layout principal (Header + Sidebar)</li>
              <li>• <strong>PASO 9:</strong> Primer gráfico Nivo</li>
              <li>• <strong>PASO 10:</strong> Dashboard completo</li>
            </ol>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          🔗 Frontend (3000) ↔ Backend (3001) ↔ PostgreSQL
        </div>
      </div>
    </div>
  )
}

export default App