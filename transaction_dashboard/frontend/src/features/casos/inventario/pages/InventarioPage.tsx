// frontend/src/features/casos/inventario/pages/InventarioPage.tsx

import React from 'react';
import { 
  useInventarioMetrics, 
  useMovimientosPorTipo, 
  useProductosMasMovidos,
  useInventarioTendencia,
  useProductosCriticos
} from '../hooks/useInventarioData';
import { InventarioMetrics } from '../components/InventarioMetrics';
import { MovimientosPieChart } from '../components/MovimientosPieChart';
import { ProductosBarChart } from '../components/ProductosBarChart';
import { TendenciaLineChart } from '../components/TendenciaLineChart';
import { MovimientosTable } from '../components/MovimientosTable';
import { RefreshVistasButton } from '../components/RefreshVistasButton';

// Skeleton components para loading
const SkeletonCard = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-80 bg-gray-100 rounded"></div>
  </div>
);

const SkeletonMetric = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-10 bg-gray-200 rounded w-3/4"></div>
  </div>
);

export const InventarioPage: React.FC = () => {
  // Hooks separados - se ejecutan en paralelo pero cada uno tiene su estado
  const metricsQuery = useInventarioMetrics();
  const movimientosQuery = useMovimientosPorTipo();
  const productosQuery = useProductosMasMovidos();
  const tendenciaQuery = useInventarioTendencia();
  const criticosQuery = useProductosCriticos(20, true);

  // Estado general de carga
  const isAnyLoading = 
    metricsQuery.isFetching || 
    movimientosQuery.isFetching || 
    productosQuery.isFetching ||
    tendenciaQuery.isFetching ||
    criticosQuery.isFetching;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📦 Seguimiento de Inventario
              </h1>
              <p className="text-gray-600">
                Caso de Uso 5 - Análisis de 49.4M+ movimientos con Vistas Materializadas
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Indicador de estado */}
              {isAnyLoading ? (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium animate-pulse">
                  ⏳ Cargando datos...
                </span>
              ) : (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  ✅ Datos cargados
                </span>
              )}
              
              {/* Botón de refresh de vistas materializadas */}
              <RefreshVistasButton />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        
        {/* Aviso sobre vistas materializadas */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg 
              className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900">
                Datos Pre-calculados para Máxima Velocidad
              </h4>
              <p className="text-xs text-blue-700 mt-1">
                Este dashboard utiliza vistas materializadas. Si agregaste nuevos datos 
                manualmente a la base de datos, usa el botón "Actualizar Datos" para 
                refrescar las estadísticas.
              </p>
            </div>
          </div>
        </div>
        
        {/* Métricas - Carga instantánea con vistas materializadas */}
        {metricsQuery.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SkeletonMetric />
            <SkeletonMetric />
            <SkeletonMetric />
            <SkeletonMetric />
          </div>
        ) : metricsQuery.error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <p className="text-red-800">Error al cargar métricas: {metricsQuery.error.message}</p>
            <button
              onClick={() => metricsQuery.refetch()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        ) : metricsQuery.data ? (
          <InventarioMetrics metrics={metricsQuery.data} />
        ) : null}

        {/* Gráficos principales - Primera fila */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Pie Chart - Movimientos por tipo */}
          {movimientosQuery.isLoading ? (
            <SkeletonCard />
          ) : movimientosQuery.error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-800">Error: {movimientosQuery.error.message}</p>
              <button
                onClick={() => movimientosQuery.refetch()}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reintentar
              </button>
            </div>
          ) : movimientosQuery.data ? (
            <MovimientosPieChart data={movimientosQuery.data} />
          ) : null}

          {/* Bar Chart - Productos más movidos */}
          {productosQuery.isLoading ? (
            <SkeletonCard />
          ) : productosQuery.error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-800">Error: {productosQuery.error.message}</p>
              <button
                onClick={() => productosQuery.refetch()}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reintentar
              </button>
            </div>
          ) : productosQuery.data ? (
            <ProductosBarChart data={productosQuery.data} />
          ) : null}
        </div>

        {/* Gráfico de Tendencia - Segunda fila */}
        <div className="mb-8">
          {tendenciaQuery.isLoading ? (
            <SkeletonCard />
          ) : tendenciaQuery.error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-800">Error al cargar tendencia: {tendenciaQuery.error.message}</p>
              <button
                onClick={() => tendenciaQuery.refetch()}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reintentar
              </button>
            </div>
          ) : tendenciaQuery.data && tendenciaQuery.data.length > 0 ? (
            <TendenciaLineChart data={tendenciaQuery.data} />
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-yellow-800">
                ⚠️ No hay datos de tendencia disponibles para los últimos 30 días
              </p>
            </div>
          )}
        </div>

        {/* Tabla de Productos Críticos - Tercera fila */}
        <div className="mb-8">
          {criticosQuery.isLoading ? (
            <SkeletonCard />
          ) : criticosQuery.error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-800">Error al cargar datos: {criticosQuery.error.message}</p>
              <button
                onClick={() => criticosQuery.refetch()}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <MovimientosTable 
              movimientos={[]} 
              productosCriticos={criticosQuery.data || []} 
            />
          )}
        </div>

        {/* Información del sistema */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3">
            ✅ Optimización Implementada
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-800">
            <div>
              <strong>Método:</strong> Vistas Materializadas
            </div>
            <div>
              <strong>Velocidad:</strong> Menos de 1 segundo por query
            </div>
            <div>
              <strong>Registros procesados:</strong> 49,471,808
            </div>
          </div>
          <p className="text-xs text-green-600 mt-3">
            Las queries que antes tardaban 27-52 segundos ahora se completan en menos de 1 segundo 
            gracias a las vistas materializadas. Los datos se actualizan bajo demanda con el botón "Actualizar Datos".
          </p>
        </div>

        {/* Timestamp */}
        <div className="mt-4 text-center text-sm text-gray-500">
          Última actualización: {new Date().toLocaleString('es-MX')}
        </div>
      </div>
    </div>
  );
};