// frontend/src/features/casos/devoluciones/pages/DevolucionesPage.tsx

import { useDevolucionesData, useSuspiciousPatterns } from '../hooks/useDevolucionesData';
import { DevolucionesMetrics } from '../components/DevolucionesMetrics';
import { DevolucionesPieChart } from '../components/DevolucionesPieChart';
import { SuspiciousPatternsTable } from '../components/SuspiciousPatternsTable';
import { RefreshVistasButton } from '../components/RefreshVistasButon';


export function DevolucionesPage() {
  const { data, isLoading, error } = useDevolucionesData();
  const { data: suspiciousData } = useSuspiciousPatterns(5);

  // Estados de carga y error
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-semibold mb-2">
              Error al cargar datos
            </h3>
            <p className="text-red-600 text-sm">
              {error instanceof Error ? error.message : 'Error desconocido'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">No hay datos disponibles</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header con botón de refresh */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-700 mb-1">
                <span className="font-bold text-blue-700">Caso 7:</span> <span className="text-gray-900 font-bold">Control de Devoluciones</span>
              </h1>
              <p className="text-xl text-gray-700 font-semibold mb-2">Análisis de devoluciones y detección de patrones sospechosos</p>
              
              {/* Nota informativa */}
              <div className="mt-3 flex items-center gap-2 text-sm text-blue-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Usando vistas materializadas para mayor rendimiento</span>
              </div>
            </div>

            {/* Botón de actualización */}
            <div className="flex items-center gap-4">
              <RefreshVistasButton />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              📊 Análisis en tiempo real
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              ✅ ROI: $1.13B controlado
            </span>
          </div>
        </div>

        {/* Métricas Principales */}
        <DevolucionesMetrics metrics={data.metrics} />

        {/* Grid de Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Distribución por Motivo */}
          <DevolucionesPieChart data={data.distribution} />

          {/* Información Adicional */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resumen del Análisis
            </h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm font-medium text-gray-700">
                  Total de Devoluciones
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {typeof data.metrics.totalDevoluciones === 'string'
                    ? data.metrics.totalDevoluciones
                    : data.metrics.totalDevoluciones.toLocaleString('es-MX')}
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <p className="text-sm font-medium text-gray-700">
                  Monto Total Devuelto
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.metrics.montoTotal}
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <p className="text-sm font-medium text-gray-700">
                  Promedio por Devolución
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.metrics.promedioMonto}
                </p>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>💡 Insight:</strong> El control efectivo de devoluciones
                  permite identificar oportunidades de mejora en calidad y servicio,
                  protegiendo un valor estimado de $1.13B en riesgo potencial.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Patrones Sospechosos */}
        <div className="mb-6">
          <SuspiciousPatternsTable
            patterns={suspiciousData || data.suspiciousPatterns}
          />
        </div>

        {/* Información Adicional */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Devoluciones Recientes */}
          {data.recentReturns && data.recentReturns.length > 0 && (
            <div className="bg-blue-50 rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Últimas Devoluciones
              </h3>
              <div className="space-y-3">
                {data.recentReturns.slice(0, 5).map((ret, index) => (
                  <div
                    key={`return-${ret.id}-${index}`}
                    className="border-b border-blue-200 pb-3 last:border-0 hover:bg-blue-100 rounded transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-blue-700">
                          {ret.producto}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {ret.motivo}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-blue-700">
                          {ret.monto}
                        </p>
                        <p className="text-xs text-gray-500">
                          Cant: {ret.cantidad}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recomendaciones o Estado */}
          {/* Eliminado div duplicado, solo dejar el card mejorado */}
          <div className="bg-green-50 rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Estado del Sistema
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-green-700">Sistema Activo</p>
                  <p className="text-xs text-gray-500 mt-1">Monitoreo de devoluciones en tiempo real</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-700">Detección Automática</p>
                  <p className="text-xs text-gray-500 mt-1">Identificación de patrones sospechosos activada</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-purple-700">Control de Calidad</p>
                  <p className="text-xs text-gray-500 mt-1">Análisis de motivos y tendencias activo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}