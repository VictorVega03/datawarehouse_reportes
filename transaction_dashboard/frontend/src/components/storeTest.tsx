// frontend/src/components/StoreTest.tsx
// COMPONENTE DE PRUEBA PARA VERIFICAR QUE EL STORE FUNCIONA

import React, { useEffect } from 'react'
import { 
  useAppStore, 
  useDashboardMetrics, 
  useAppActions,
  useApiStatus,
  useSidebar 
} from '../stores/mainStore'

export const StoreTest: React.FC = () => {
  // ✅ USANDO SELECTORES ESPECÍFICOS (mejor performance)
  const metrics = useDashboardMetrics()
  const apiStatus = useApiStatus()
  const sidebarOpen = useSidebar()
  
  // ✅ USANDO ACTIONS HOOK
  const { 
    setMetrics, 
    toggleSidebar, 
    setApiLoading, 
    setApiError,
    setFilters 
  } = useAppActions()

  // ✅ SIMULAR CARGA DE DATOS AL MONTAR
  useEffect(() => {
    const loadMockData = async () => {
      setApiLoading(true)
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      try {
        // Simular datos del dashboard (basados en tu análisis)
        const mockMetrics = {
          totalTransactions: '2.92M',
          totalRevenue: '$220M+',
          completedCases: '70%',
          uniqueCustomers: '29,991',
          roiRange: '4,400% - 7,333%'
        }
        
        setMetrics(mockMetrics)
        setApiError(null)
      } catch (error) {
        setApiError('Error cargando datos de prueba')
      } finally {
        setApiLoading(false)
      }
    }

    loadMockData()
  }, [setMetrics, setApiLoading, setApiError])

  const handleTestFilters = () => {
    setFilters({
      selectedCase: 'horarios',
      customerType: 'vip'
    })
  }

  // ✅ RENDER - SI APARECE ESTE COMPONENTE, EL STORE FUNCIONA
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🏪 Store Test - ✅ FUNCIONANDO
        </h1>
        <p className="text-gray-600 mb-6">
          Si ves esta página, el store Zustand all-in-one está funcionando correctamente.
        </p>

        {/* STATUS API */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            📡 Estado de la API
          </h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-blue-600">Loading:</span>
              <span className={`px-2 py-1 rounded text-xs ${
                apiStatus.isLoading 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {apiStatus.isLoading ? 'Cargando...' : 'Completado'}
              </span>
            </div>
            
            {apiStatus.error && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-red-600">Error:</span>
                <span className="text-xs text-red-800">{apiStatus.error}</span>
              </div>
            )}
            
            {apiStatus.lastFetch && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-blue-600">Última actualización:</span>
                <span className="text-xs text-blue-800">
                  {apiStatus.lastFetch.toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* MÉTRICAS DASHBOARD */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📊 Métricas del Dashboard
          </h3>
          
          {apiStatus.isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Cargando métricas...</span>
            </div>
          ) : metrics ? (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {metrics.totalTransactions}
                </div>
                <div className="text-xs text-gray-500">Transacciones</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {metrics.totalRevenue}
                </div>
                <div className="text-xs text-gray-500">ROI Anual</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {metrics.completedCases}
                </div>
                <div className="text-xs text-gray-500">Casos Completados</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {metrics.uniqueCustomers}
                </div>
                <div className="text-xs text-gray-500">Clientes Únicos</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-red-600">
                  {metrics.roiRange}
                </div>
                <div className="text-xs text-gray-500">ROI Range</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">No hay métricas disponibles</div>
          )}
        </div>

        {/* CONTROLES DE PRUEBA */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🧪 Controles de Prueba
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sidebar:</span>
              <button
                onClick={toggleSidebar}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  sidebarOpen 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {sidebarOpen ? '✅ Abierto' : '❌ Cerrado'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Test Filters:</span>
              <button
                onClick={handleTestFilters}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                🔧 Cambiar Filtros
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Store Items:</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm font-medium">
                {Object.keys(useAppStore.getState()).length} propiedades
              </span>
            </div>
          </div>
        </div>

        {/* SUCCESS MESSAGE */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="text-green-600">✅</div>
            <div>
              <h4 className="text-sm font-semibold text-green-800">
                Store funcionando correctamente
              </h4>
              <p className="text-xs text-green-600 mt-1">
                El store Zustand all-in-one está operacional sin crashes. 
                Puedes continuar con el desarrollo del dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoreTest