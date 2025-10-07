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
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight drop-shadow-sm">
                <span className="block text-blue-700">Caso 3:</span>
                <span className="block text-gray-900">Gestión de Precios y Descuentos</span>
              </h1>
              <p className="text-xl text-gray-600">
                Análisis de descuentos, promociones y estrategias de pricing
              </p>
            </div>
            <div className="text-left md:text-right">
              <div className="text-sm text-gray-500 mb-1">ROI Estimado</div>
              <div className="text-4xl font-bold text-blue-700">$150M</div>
            </div>
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
      <div className="bg-gradient-to-br from-blue-50 to-white border-l-4 border-blue-400 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-blue-700 mb-3 tracking-tight">
          Insights Clave
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li className="bg-blue-100 rounded px-2 py-1">
            <strong>{(Number(analisisData.metrics.porcentajeConDescuento) || 0).toFixed(2)}%</strong> de las transacciones tienen descuento aplicado
          </li>
          <li className="bg-blue-100 rounded px-2 py-1">
            El descuento promedio es de <strong>{(Number(analisisData.metrics.porcentajeDescuentoPromedio) || 0).toFixed(2)}%</strong>
          </li>
          <li className="bg-blue-100 rounded px-2 py-1">
            Total de descuentos otorgados: <strong>
              {new Intl.NumberFormat('es-MX', { 
                style: 'currency', 
                currency: 'MXN',
                minimumFractionDigits: 0 
              }).format(Number(analisisData.metrics.totalDescuentos) || 0)}
            </strong>
          </li>
          <li className="bg-blue-100 rounded px-2 py-1">
            Ingresos netos después de descuentos: <strong>
              {new Intl.NumberFormat('es-MX', { 
                style: 'currency', 
                currency: 'MXN',
                minimumFractionDigits: 0 
              }).format(Number(analisisData.metrics.ingresosNetos) || 0)}
            </strong>
          </li>
          <li className="bg-blue-100 rounded px-2 py-1">
            Se encontraron <strong>{productosData?.length || 0}</strong> productos con descuentos significativos
          </li>
          <li className="bg-blue-100 rounded px-2 py-1">
            Se analizaron <strong>{categoriasData?.length || 0}</strong> categorías con descuentos activos
          </li>
        </ul>
      </div>
    </div>
  )
}