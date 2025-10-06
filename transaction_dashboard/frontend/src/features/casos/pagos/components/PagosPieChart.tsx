// frontend/src/features/casos/pagos/components/PagosPieChart.tsx

import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import type { PaymentMethodDistribution } from '../types';

interface PagosPieChartProps {
  data: PaymentMethodDistribution[];
}

export const PagosPieChart: React.FC<PagosPieChartProps> = ({ data }) => {
  // Validación defensiva
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('[PagosPieChart] No hay datos para mostrar');
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hay datos disponibles para mostrar</p>
      </div>
    );
  }

  // Convertir datos para Nivo (asegurar que los valores sean números)
  const chartData = data.map(item => ({
    id: item.label,
    label: item.label,
    value: typeof item.value === 'string' ? parseInt(item.value) : item.value,
    porcentaje: typeof item.porcentaje === 'string' ? parseFloat(item.porcentaje) : item.porcentaje
  }));

  console.log('[PagosPieChart] Chart data:', chartData);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('es-MX').format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Distribución de Métodos de Pago
      </h3>
      
      <div className="h-96">
        <ResponsivePie
          data={chartData}
          margin={{ top: 40, right: 120, bottom: 80, left: 120 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 0.2]]
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: 'color',
            modifiers: [['darker', 2]]
          }}
          arcLabel={(d) => `${d.value.toFixed(1)}%`}
          valueFormat={(value) => formatNumber(value)}
          colors={{ scheme: 'nivo' }}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000'
                  }
                }
              ]
            }
          ]}
          tooltip={({ datum }) => (
            <div className="bg-white px-3 py-2 shadow-lg rounded-lg border border-gray-200">
              <div className="font-semibold capitalize">{datum.label}</div>
              <div className="text-sm text-gray-600">
                Transacciones: {formatNumber(datum.value)}
              </div>
              <div className="text-sm text-gray-600">
                Porcentaje: {datum.data.porcentaje}%
              </div>
            </div>
          )}
        />
      </div>

      {/* Leyenda adicional con detalles */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {data.slice(0, 3).map((item, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 capitalize">
                {item.label}
              </span>
              <span className="text-xs font-semibold text-gray-900">
                {typeof item.porcentaje === 'string' ? item.porcentaje : item.porcentaje.toFixed(1)}%
              </span>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {formatNumber(typeof item.value === 'string' ? parseInt(item.value) : item.value)} transacciones
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};