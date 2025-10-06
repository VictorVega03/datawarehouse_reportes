// frontend/src/features/casos/inventario/components/MovimientosPieChart.tsx

import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Card } from '../../../../components/ui/Card';
import type { MovimientosPorTipo } from '../types';

interface Props {
  data: MovimientosPorTipo[];
}

export const MovimientosPieChart: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Distribución de Movimientos</h3>
        </Card.Header>
        <Card.Body>
          <div className="h-80 flex items-center justify-center text-gray-500">
            No hay datos disponibles
          </div>
        </Card.Body>
      </Card>
    );
  }

  const chartData = data.map((item, _index) => {
    const valor = typeof item.total_unidades === 'string' 
      ? parseInt(item.total_unidades) 
      : item.total_unidades;
    
    return {
      id: item.tipo,
      label: item.tipo === 'IN' ? 'Entradas' : 'Salidas',
      value: valor,
      color: item.tipo === 'IN' ? '#10b981' : '#ef4444'
    };
  });

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('es-MX').format(value);
  };

  return (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-semibold">Distribución de Movimientos</h3>
        <p className="text-sm text-gray-600">Entradas vs Salidas de Inventario</p>
      </Card.Header>
      <Card.Body>
        <div className="h-80">
          <ResponsivePie
            data={chartData}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
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
            colors={chartData.map(d => d.color)}
            tooltip={({ datum }) => (
              <div className="bg-white px-3 py-2 shadow-lg rounded border">
                <strong>{datum.label}</strong>
                <div className="text-sm">
                  {formatNumber(datum.value)} unidades
                </div>
                <div className="text-xs text-gray-600">
                  {((datum.value / chartData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%
                </div>
              </div>
            )}
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
          />
        </div>

        {/* Tabla resumen */}
        <div className="mt-4 border-t pt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Tipo</th>
                <th className="text-right py-2">Movimientos</th>
                <th className="text-right py-2">Total Unidades</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.tipo === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.tipo === 'IN' ? 'Entradas' : 'Salidas'}
                    </span>
                  </td>
                  <td className="text-right py-2">
                    {formatNumber(
                      typeof item.cantidad_movimientos === 'string' 
                        ? parseInt(item.cantidad_movimientos) 
                        : item.cantidad_movimientos
                    )}
                  </td>
                  <td className="text-right py-2 font-semibold">
                    {formatNumber(
                      typeof item.total_unidades === 'string' 
                        ? parseInt(item.total_unidades) 
                        : item.total_unidades
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card.Body>
    </Card>
  );
};