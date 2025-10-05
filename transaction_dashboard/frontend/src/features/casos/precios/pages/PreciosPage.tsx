// frontend/src/features/casos/precios/pages/PreciosPage.tsx
import React from 'react'
import { 
  usePreciosAnalisis, 
  useTopProductosDescuento,
  useCategoriasDescuentos 
} from '../hooks/usePreciosData'
import { PreciosMetricsComponent } from '../components/PreciosMetrics'
import { PreciosPieChart } from '../components/PreciosPieChart'
import { PreciosBarChart } from '../components/PreciosBarChart'
import { ProductosDescuentoTable } from '../components/ProductosDescuentoTable'

export const PreciosPage: React.FC = () => {
  const { 
    data: analisisData, 
    isLoading: isLoadingAnalisis, 
    isError: isErrorAnalisis 
  } = usePreciosAnalisis()

  const { 
    data: productosData, 
    isLoading: isLoadingProductos,
    isError: isErrorProductos 
  } = useTopProductosDescuento(20)

  const { 
    data: categoriasData,
    isLoading: isLoadingCategorias,
    isError: isErrorCategorias 
  } = useCategoriasDescuentos(15)

  // Loading state
  if (isLoadingAnalisis || isLoadingProductos || isLoadingCategorias) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">
            Cargando análisis de precios...
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (isErrorAnalisis || isErrorProductos || isErrorCategorias) {
    return (
      <div className="bg-white rounded-lg border-2 border-red-200 p-8 max-w-2xl mx-auto mt-12">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error al cargar datos
          </h2>
          <p className="text-gray-600">
            No se pudieron obtener los datos de precios. Por favor, intenta nuevamente.
          </p>
        </div>
      </div>
    )
  }

  // No data state
  if (!analisisData || !productosData || !categoriasData) {
    return (
      <div className="bg-white rounded-lg border-2 border-gray-200 p-8 max-w-2xl mx-auto mt-12">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No hay datos disponibles
          </h2>
          <p className="text-gray-600">
            No se encontraron datos de precios para mostrar.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              💰 Caso 3: Gestión de Precios y Descuentos
            </h1>
            <p className="text-xl opacity-90">
              Análisis de descuentos, promociones y estrategias de pricing
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-80 mb-1">ROI Estimado</div>
            <div className="text-4xl font-bold">$150M</div>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <PreciosMetricsComponent metrics={analisisData.metrics} />

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PreciosPieChart data={analisisData.distribucion} />
        <PreciosBarChart data={categoriasData} />
      </div>

      {/* Tabla de productos */}
      <ProductosDescuentoTable data={productosData} />

      {/* Info adicional */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          💡 Insights Clave
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="mr-2">📌</span>
            <span>
              <strong>{(Number(analisisData.metrics.porcentajeConDescuento) || 0).toFixed(2)}%</strong> de las transacciones tienen descuento aplicado
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">📌</span>
            <span>
              El descuento promedio es de <strong>{(Number(analisisData.metrics.porcentajeDescuentoPromedio) || 0).toFixed(2)}%</strong>
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">📌</span>
            <span>
              Total de descuentos otorgados: <strong>
                {new Intl.NumberFormat('es-MX', { 
                  style: 'currency', 
                  currency: 'MXN',
                  minimumFractionDigits: 0 
                }).format(Number(analisisData.metrics.totalDescuentos) || 0)}
              </strong>
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">📌</span>
            <span>
              Ingresos netos después de descuentos: <strong>
                {new Intl.NumberFormat('es-MX', { 
                  style: 'currency', 
                  currency: 'MXN',
                  minimumFractionDigits: 0 
                }).format(Number(analisisData.metrics.ingresosNetos) || 0)}
              </strong>
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">📌</span>
            <span>
              Se encontraron <strong>{productosData?.length || 0}</strong> productos con descuentos significativos
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">📌</span>
            <span>
              Se analizaron <strong>{categoriasData?.length || 0}</strong> categorías con descuentos activos
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}