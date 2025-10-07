// frontend/src/features/casos/caducidad/components/CriticalProductsTable.tsx

import { useState } from 'react'
import type { CriticalProduct } from '../types'

interface CriticalProductsTableProps {
  data: CriticalProduct[];
}

export function CriticalProductsTable({ data }: CriticalProductsTableProps) {
  const [filter, setFilter] = useState<'all' | 'vencido' | 'critico' | 'urgente'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Validar que data existe antes de filtrar
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Productos Críticos</h3>
        <div className="text-center py-12 text-gray-500">
          {/* Icono eliminado para profesionalismo */}
          <p className="text-lg font-medium">¡Excelente!</p>
          <p className="text-sm mt-2">No hay productos críticos en este momento</p>
        </div>
      </div>
    )
  }

  // Filtrar datos (ahora data existe y tiene elementos)
  const filteredData = data.filter(product => {
    const matchesFilter = filter === 'all' || product.urgencia.toLowerCase().includes(filter)
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.lote.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Calcular paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  // Resetear a página 1 cuando cambien los filtros
  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter)
    setCurrentPage(1)
  }

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  // Función para obtener color según urgencia
  const getUrgencyColor = (urgencia: string) => {
    switch (urgencia.toLowerCase()) {
      case 'vencido':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'crítico':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'urgente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Función para formatear fecha
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Productos Críticos</h3>
        <div className="text-center py-12 text-gray-500">
          {/* Icono eliminado para profesionalismo */}
          <p className="text-lg font-medium">¡Excelente!</p>
          <p className="text-sm mt-2">No hay productos críticos en este momento</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header con controles */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Productos que Requieren Atención Inmediata
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {filteredData.length} de {data.length} productos
            </p>
          </div>

          {/* Buscador */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar por nombre, categoría o lote..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos ({data.length})
          </button>
          <button
            onClick={() => handleFilterChange('vencido')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'vencido'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Vencidos ({data.filter(p => p.urgencia.toLowerCase() === 'vencido').length})
          </button>
          <button
            onClick={() => handleFilterChange('critico')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'critico'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Críticos ({data.filter(p => p.urgencia.toLowerCase() === 'crítico').length})
          </button>
          <button
            onClick={() => handleFilterChange('urgente')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'urgente'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Urgentes ({data.filter(p => p.urgencia.toLowerCase() === 'urgente').length})
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 rounded-lg border border-blue-100 bg-blue-50">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200">Producto</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200">Lote</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200">Fecha Caducidad</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200">Días</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200">Urgencia</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200">Acción Requerida</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500 bg-white">
                  No se encontraron productos que coincidan con los filtros
                </td>
              </tr>
            ) : (
              paginatedData.map((product, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white hover:bg-blue-50 transition-colors" : "bg-blue-50 hover:bg-blue-100 transition-colors"}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {product.nombre}
                    </div>
                    <div className="text-xs text-gray-500">ID: {product.id}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {product.categoria}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-700">
                    {product.lote}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatDate(product.fechaCaducidad)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-semibold text-gray-900">
                      {product.diasDiferencia}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getUrgencyColor(product.urgencia)}`}>
                      {product.urgencia}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {product.accionRequerida}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer con paginación */}
      {filteredData.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            {/* Info de resultados */}
            <div className="text-sm text-gray-600">
              Mostrando <strong>{startIndex + 1}</strong> a <strong>{Math.min(endIndex, filteredData.length)}</strong> de <strong>{filteredData.length}</strong> productos
              {filteredData.length !== data.length && (
                <span className="text-gray-500"> (filtrados de {data.length} totales)</span>
              )}
            </div>

            {/* Controles de paginación */}
            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                {/* Botón anterior */}
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>

                {/* Números de página */}
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // Mostrar solo páginas relevantes
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="px-2 text-gray-500">...</span>
                    }
                    return null
                  })}
                </div>

                {/* Botón siguiente */}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>

          {/* Timestamp */}
          <div className="mt-3 text-xs text-gray-500 text-center">
            Última actualización: {new Date().toLocaleTimeString('es-MX')}
          </div>
        </div>
      )}
    </div>
  )
}