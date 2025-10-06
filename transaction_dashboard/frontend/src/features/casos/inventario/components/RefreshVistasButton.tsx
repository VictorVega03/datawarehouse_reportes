// frontend/src/features/casos/inventario/components/RefreshVistasButton.tsx

import React, { useState } from 'react';
import { useRefreshVistas } from '../hooks/useInventarioData';

export const RefreshVistasButton: React.FC = () => {
  const refreshMutation = useRefreshVistas();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRefresh = () => {
    setShowConfirm(false);
    refreshMutation.mutate();
  };

  return (
    <div className="relative">
      {/* Botón principal */}
      <button
        onClick={() => setShowConfirm(true)}
        disabled={refreshMutation.isPending}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          refreshMutation.isPending
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
        }`}
      >
        {refreshMutation.isPending ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
                fill="none"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Actualizando datos...</span>
          </>
        ) : (
          <>
            <svg 
              className="h-4 w-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            <span>Actualizar Datos</span>
          </>
        )}
      </button>

      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-bold mb-3">Actualizar Vistas Materializadas</h3>
            <p className="text-gray-600 mb-4">
              Este proceso puede tardar entre 2 y 3 minutos. Durante este tiempo, 
              el servidor procesará todos los registros de inventario para actualizar 
              las estadísticas.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Solo necesitas hacer esto después de agregar nuevos datos manualmente 
              a la base de datos.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Actualizar Ahora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de éxito */}
      {refreshMutation.isSuccess && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <svg 
              className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-green-900">
                Datos actualizados exitosamente
              </h4>
              <p className="text-xs text-green-700 mt-1">
                Las vistas materializadas se han actualizado. 
                Duración: {Math.round(refreshMutation.data?.duration_ms / 1000)}s
              </p>
            </div>
            <button
              onClick={() => refreshMutation.reset()}
              className="text-green-600 hover:text-green-800"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {refreshMutation.isError && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <svg 
              className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900">
                Error al actualizar
              </h4>
              <p className="text-xs text-red-700 mt-1">
                {refreshMutation.error?.message || 'Ocurrió un error inesperado'}
              </p>
            </div>
            <button
              onClick={() => refreshMutation.reset()}
              className="text-red-600 hover:text-red-800"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Progreso durante la actualización */}
      {refreshMutation.isPending && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg">
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-2">Procesando datos...</p>
            <p className="text-xs text-blue-700">
              Esto puede tardar 2-3 minutos. Por favor no cierres esta ventana.
            </p>
            <div className="mt-3 bg-blue-200 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-600 h-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};