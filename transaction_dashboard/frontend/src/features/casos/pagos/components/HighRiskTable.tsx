// frontend/src/features/casos/pagos/components/HighRiskTable.tsx

import React, { useState } from 'react';
import type { HighRiskTransaction, RiskSummary } from '../types';

interface HighRiskTableProps {
  summary: RiskSummary;
  transactions: HighRiskTransaction[];
}

export const HighRiskTable: React.FC<HighRiskTableProps> = ({ summary, transactions }) => {
  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Validación defensiva
  if (!summary || !transactions) {
    console.warn('[HighRiskTable] Faltan datos');
    return null;
  }

  // Calcular paginación
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  // Funciones de navegación
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const formatCurrency = (value: number | string): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatDate = (date: string | Date): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  };

  const getRiskColor = (nivel: string): string => {
    if (nivel.includes('Crítico')) return 'bg-red-100 text-red-800';
    if (nivel.includes('Alto')) return 'bg-orange-100 text-orange-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header con resumen */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Transacciones de Alto Riesgo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Total Transacciones</p>
            <p className="text-xl font-bold text-gray-900">
              {typeof summary.total_transacciones === 'string' 
                ? summary.total_transacciones 
                : summary.total_transacciones.toLocaleString('es-MX')}
            </p>
          </div>
          
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-xs text-red-600">Nivel Crítico</p>
            <p className="text-xl font-bold text-red-900">
              {typeof summary.por_nivel.critico === 'string'
                ? summary.por_nivel.critico
                : summary.por_nivel.critico}
            </p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-xs text-orange-600">Nivel Alto</p>
            <p className="text-xl font-bold text-orange-900">
              {typeof summary.por_nivel.alto === 'string'
                ? summary.por_nivel.alto
                : summary.por_nivel.alto}
            </p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-xs text-yellow-600">Nivel Moderado</p>
            <p className="text-xl font-bold text-yellow-900">
              {typeof summary.por_nivel.moderado === 'string'
                ? summary.por_nivel.moderado
                : summary.por_nivel.moderado}
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Monto Total en Riesgo:</span>{' '}
            {formatCurrency(summary.monto_total)}
          </p>
        </div>
      </div>

      {/* Tabla de transacciones */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nivel de Riesgo
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{transaction.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(transaction.fecha_hora)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.customer_id ? `Cliente #${transaction.customer_id}` : 'Anónimo'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {formatCurrency(transaction.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskColor(transaction.nivel_riesgo)}`}>
                    {transaction.nivel_riesgo}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer con paginación */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          {/* Información de página */}
          <div className="text-sm text-gray-600">
            Mostrando <span className="font-semibold">{startIndex + 1}</span> a{' '}
            <span className="font-semibold">{Math.min(endIndex, transactions.length)}</span> de{' '}
            <span className="font-semibold">{transactions.length}</span> transacciones
          </div>

          {/* Controles de paginación */}
          <div className="flex items-center space-x-2">
            {/* Primera página */}
            <button
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded text-sm font-medium ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              ««
            </button>

            {/* Página anterior */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded text-sm font-medium ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              «
            </button>

            {/* Números de página */}
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Página siguiente */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded text-sm font-medium ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              »
            </button>

            {/* Última página */}
            <button
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded text-sm font-medium ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              »»
            </button>
          </div>
        </div>

        {/* Indicador de página actual */}
        <div className="mt-2 text-center text-xs text-gray-500">
          Página {currentPage} de {totalPages}
        </div>
      </div>
    </div>
  );
};