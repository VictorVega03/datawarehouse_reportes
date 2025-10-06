// frontend/src/features/casos/pagos/components/PagosBarChart.tsx

import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import type { PaymentMethodDistribution } from '../types';

interface PagosBarChartProps {
  data: PaymentMethodDistribution[];
  title?: string;
}

export const PagosBarChart: React.FC<PagosBarChartProps> = ({ 
  data, 
  title = "Ingresos por Método de Pago" 
}) => {
  // Validación defensiva
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('[PagosBarChart] No hay datos para mostrar');
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hay datos disponibles para mostrar</p>
      </div>
    );
  }

  // Convertir datos para Nivo
  const chartData = data.map(item => ({
    metodo: item.label,
    ingresos: typeof item.ingresos === 'string' ? parseFloat(item.ingresos) : item.ingresos,
    transacciones: typeof item.value === 'string' ? parseInt(item.value) : item.value
  }));

  console.log('[PagosBarChart] Chart data:', chartData);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short'
    }).format(value);
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('es-MX', {
      notation: 'compact',
      compactDisplay: 'short'
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {title}
      </h3>
      
      <div className="h-96">
        <ResponsiveBar
          data={chartData}
          keys={['ingresos']}
          indexBy="metodo"
          margin={{ top: 50, right: 130, bottom: 50, left: 80 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={{ scheme: 'nivo' }}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 1.6]]
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: 'Método de Pago',
            legendPosition: 'middle',
            legendOffset: 45
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Ingresos',
            legendPosition: 'middle',
            legendOffset: -70,
            format: (value) => formatCurrency(value)
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 1.6]]
          }}
          valueFormat={(value) => formatCurrency(value)}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          tooltip={({ indexValue, value, data }) => (
            <div className="bg-white px-4 py-3 shadow-lg rounded-lg border border-gray-200">
              <div className="font-semibold text-gray-900 mb-2 capitalize">
                {indexValue}
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex justify-between items-center mb-1">
                  <span>Ingresos:</span>
                  <span className="font-semibold ml-2">{formatCurrency(value)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Transacciones:</span>
                  <span className="font-semibold ml-2">
                    {formatNumber((data as any).transacciones)}
                  </span>
                </div>
              </div>
            </div>
          )}
          animate={true}
          motionConfig="gentle"
        />
      </div>

      {/* Resumen debajo del gráfico */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-600">Mayor Ingreso</p>
            <p className="text-sm font-bold text-gray-900 capitalize">
              {chartData[0]?.metodo}
            </p>
            <p className="text-xs text-green-600">
              {formatCurrency(chartData[0]?.ingresos)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Total Métodos</p>
            <p className="text-sm font-bold text-gray-900">
              {chartData.length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Ingreso Total</p>
            <p className="text-sm font-bold text-gray-900">
              {formatCurrency(chartData.reduce((sum, item) => sum + item.ingresos, 0))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};