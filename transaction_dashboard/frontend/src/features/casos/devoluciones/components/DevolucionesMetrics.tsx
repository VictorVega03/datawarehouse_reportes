// frontend/src/features/casos/devoluciones/components/DevolucionesMetrics.tsx

import type { DevolucionesMetrics } from '../types';

interface Props {
  metrics: DevolucionesMetrics;
}

export function DevolucionesMetrics({ metrics }: Props) {
  // Validación defensiva
  if (!metrics) return null;

  const formatNumber = (value: number | string): string => {
    const num = typeof value === 'string' ? parseInt(value) : value;
    return new Intl.NumberFormat('es-MX').format(num);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {/* Total Devoluciones */}
      <div className="bg-red-50 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-red-700">Total Devoluciones</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {formatNumber(metrics.totalDevoluciones)}
            </p>
          </div>
          <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Monto Total */}
      <div className="bg-orange-50 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-orange-700">Monto Total Devuelto</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {metrics.montoTotal}
            </p>
          </div>
          <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
            <svg
              className="h-6 w-6 text-orange-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Promedio por Devolución */}
      <div className="bg-blue-50 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-blue-700">Promedio por Devolución</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {metrics.promedioMonto}
            </p>
          </div>
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Tasa de Devolución */}
    </div>
  );
}