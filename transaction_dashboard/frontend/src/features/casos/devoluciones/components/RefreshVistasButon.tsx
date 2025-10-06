import { useState } from 'react'
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'
import { useRefreshVistas } from '../hooks/useDevolucionesData'

export function RefreshVistasButton() {
  const [showModal, setShowModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const refreshMutation = useRefreshVistas()

  const handleRefresh = async () => {
    try {
      await refreshMutation.mutateAsync()
      setShowModal(false)
      setShowSuccess(true)
      
      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
    } catch (error) {
      console.error('Error refreshing vistas:', error)
    }
  }

  return (
    <>
      {/* Botón Principal */}
      <button
        onClick={() => setShowModal(true)}
        disabled={refreshMutation.isPending}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <RefreshCw 
          size={18} 
          className={refreshMutation.isPending ? 'animate-spin' : ''} 
        />
        <span>{refreshMutation.isPending ? 'Actualizando...' : 'Actualizar Datos'}</span>
      </button>

      {/* Mensaje de Éxito */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg shadow-lg animate-slide-in">
          <CheckCircle size={20} />
          <span>¡Datos actualizados correctamente!</span>
        </div>
      )}

      {/* Modal de Confirmación */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <AlertCircle className="text-blue-600" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Actualizar Vistas Materializadas
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Esta acción puede tardar algunos segundos
                </p>
              </div>
            </div>

            {/* Contenido */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                ¿Qué hace este proceso?
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Recalcula las métricas de devoluciones</li>
                <li>• Actualiza la distribución por motivo</li>
                <li>• Refresca los datos de productos devueltos</li>
              </ul>
              
              <p className="text-sm text-blue-700 mt-3">
                <strong>Tiempo estimado:</strong> 5-30 segundos
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={refreshMutation.isPending}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleRefresh}
                disabled={refreshMutation.isPending}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {refreshMutation.isPending ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Actualizando...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    <span>Actualizar Ahora</span>
                  </>
                )}
              </button>
            </div>

            {/* Error */}
            {refreshMutation.isError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  Error al actualizar las vistas. Por favor, intenta nuevamente.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}