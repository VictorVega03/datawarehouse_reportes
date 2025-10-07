// frontend/src/features/casos/pagos/components/PagosMetrics.tsx

import React from 'react';
import type { PaymentAnalysisResumen } from '../types';

interface PagosMetricsProps {
  resumen: PaymentAnalysisResumen;
}

export const PagosMetrics: React.FC<PagosMetricsProps> = ({ resumen }) => {
  // Validación defensiva
  if (!resumen) {
    console.warn('[PagosMetrics] No se recibió resumen');
    return null;
  }

  const formatNumber = (value: number | string): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('es-MX').format(num);
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

  const formatPercentage = (value: number | string): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return `${num.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {/* Total Transacciones */}
      <div className="bg-blue-50 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-blue-700">Total Transacciones</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatNumber(resumen.total_transacciones)}
            </p>
          </div>
          <div className="bg-blue-100 rounded-full p-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Total Ingresos */}
      <div className="bg-green-50 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-green-700">Ingresos Totales</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {formatCurrency(resumen.total_ingresos)}
            </p>
          </div>
          <div className="bg-green-100 rounded-full p-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Métodos Únicos */}
      <div className="bg-purple-50 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-purple-700">Métodos de Pago</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatNumber(resumen.metodos_unicos)}
            </p>
          </div>
          <div className="bg-purple-100 rounded-full p-3">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Método Dominante */}
      <div className="bg-indigo-50 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-bold text-indigo-700">Método Dominante</p>
            <p className="text-lg font-bold text-gray-900 mt-1 capitalize">
              {resumen.metodo_dominante}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {formatPercentage(resumen.porcentaje_dominante)} del total
            </p>
          </div>
          <div className="bg-indigo-100 rounded-full p-3">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Transacciones Alto Riesgo */}
      <div className="bg-red-50 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-red-700">Alto Riesgo</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {formatNumber(resumen.transacciones_alto_riesgo)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Efectivo ≥ $10,000
            </p>
          </div>
          <div className="bg-red-100 rounded-full p-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      </div>

    </div>
  );
};