// frontend/src/features/casos/precios/components/ProductosDescuentoTable.tsx
import React, { useState } from 'react'
import type { ProductoDescuento } from '../types'

interface Props {
  data: ProductoDescuento[]
}

export const ProductosDescuentoTable: React.FC<Props> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  if (!data || data.length === 0) return null

  const formatCurrency = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) return '$0.00'
    
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(numValue)
  }

  const formatNumber = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseInt(value) : value
    if (isNaN(numValue)) return '0'
    return new Intl.NumberFormat('es-MX').format(numValue)
  }

  const getBadgeColor = (porcentaje: number | string): string => {
    const numValue = typeof porcentaje === 'string' ? parseFloat(porcentaje) : porcentaje
    if (numValue >= 50) return 'bg-red-100 text-red-800'
    if (numValue >= 30) return 'bg-orange-100 text-orange-800'
    if (numValue >= 20) return 'bg-yellow-100 text-yellow-800'
    if (numValue >= 10) return 'bg-green-100 text-green-800'
    return 'bg-blue-100 text-blue-800'
  }

  // Calcular paginación
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data.slice(startIndex, endIndex)

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">
          🏆 Top Productos con Mayor Descuento Promedio
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Productos con al menos 10 ventas ordenados por % de descuento
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Veces Vendido
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad Total
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio Prom.
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descuento Total
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                % Descuento
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((producto, index) => {
              const globalIndex = startIndex + index
              return (
                <tr 
                  key={producto.productoId}
                  className={`hover:bg-gray-50 transition-colors ${
                    globalIndex < 3 ? 'bg-yellow-50' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {globalIndex < 3 && (
                        <span className="mr-2 text-lg">
                          {globalIndex === 0 ? '🥇' : globalIndex === 1 ? '🥈' : '🥉'}
                        </span>
                      )}
                      <div className="text-sm font-medium text-gray-900">
                        {producto.productName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {producto.categoria || 'Sin categoría'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                    {formatNumber(producto.vecesVendido)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">
                    {formatNumber(producto.cantidadTotal)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">
                    {formatCurrency(producto.precioPromedio)}
                  </td>
                  <td className="px-6 py-4 text-sm text-red-600 text-right font-semibold">
                    {formatCurrency(producto.descuentoTotal)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(producto.porcentajeDescuentoPromedio)}`}>
                      {typeof producto.porcentajeDescuentoPromedio === 'string' 
                        ? parseFloat(producto.porcentajeDescuentoPromedio).toFixed(2)
                        : producto.porcentajeDescuentoPromedio.toFixed(2)
                      }%
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
            <span className="font-medium">{Math.min(endIndex, data.length)}</span> de{' '}
            <span className="font-medium">{data.length}</span> productos
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Botón Anterior */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              ← Anterior
            </button>

            {/* Números de página */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Botón Siguiente */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Siguiente →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}