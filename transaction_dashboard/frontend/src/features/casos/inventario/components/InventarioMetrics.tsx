// frontend/src/features/casos/inventario/components/InventarioMetrics.tsx

import React from 'react';
import { Card } from '../../../../components/ui/Card';
import type { InventarioMetrics as InventarioMetricsType } from '../types';

interface Props {
  metrics: InventarioMetricsType;
}

export const InventarioMetrics: React.FC<Props> = ({ metrics }) => {
  const formatNumber = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('es-MX').format(numValue);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Productos Rastreados */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <Card.Body>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">
                Productos Rastreados
              </p>
              <p className="text-3xl font-bold text-blue-900">
                {formatNumber(metrics.total_productos_rastreados)}
              </p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            Con movimientos registrados
          </p>
        </Card.Body>
      </Card>

      {/* Total Movimientos */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <Card.Body>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">
                Total Movimientos
              </p>
              <p className="text-3xl font-bold text-green-900">
                {formatNumber(metrics.total_movimientos)}
              </p>
            </div>
            <div className="text-4xl">🔄</div>
          </div>
          <p className="text-xs text-green-600 mt-2">
            Entradas y salidas de almacén
          </p>
        </Card.Body>
      </Card>

      {/* Stock Bajo */}
      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
        <Card.Body>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600 mb-1">
                Stock Bajo
              </p>
              <p className="text-3xl font-bold text-yellow-900">
                {formatNumber(metrics.productos_con_stock_bajo)}
              </p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
          <p className="text-xs text-yellow-600 mt-2">
            Productos con menos de 50 unidades
          </p>
        </Card.Body>
      </Card>

      {/* Requieren Reabasto */}
      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <Card.Body>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 mb-1">
                Requieren Reabasto
              </p>
              <p className="text-3xl font-bold text-red-900">
                {formatNumber(metrics.productos_requieren_reabasto)}
              </p>
            </div>
            <div className="text-4xl">🚨</div>
          </div>
          <p className="text-xs text-red-600 mt-2">
            Productos con menos de 20 unidades
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};