// frontend/src/features/casos/inventario/components/TendenciaLineChart.tsx

import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Card } from '../../../../components/ui/Card';
import type { TendenciaMovimientos } from '../types';

interface Props {
  data: TendenciaMovimientos[];
}

export const TendenciaLineChart: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <Card.Header>
    <h3 className="text-lg font-semibold">Tendencia de Movimientos (Últimos 30 Días)</h3>
        </Card.Header>
        <Card.Body>
          <div className="h-96 flex items-center justify-center text-gray-500">
            No hay datos disponibles
          </div>
        </Card.Body>
      </Card>
    );
  }

  // Ordenar por fecha ascendente
  const sortedData = [...data].sort((a, b) => 
    new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );

  const chartData = [
    {
      id: 'Entradas',
      color: '#10b981',
      data: sortedData.map(item => ({
        x: item.fecha,
        y: typeof item.entradas === 'string' ? parseInt(item.entradas) : item.entradas
      }))
    },
    {
      id: 'Salidas',
      color: '#ef4444',
      data: sortedData.map(item => ({
        x: item.fecha,
        y: typeof item.salidas === 'string' ? parseInt(item.salidas) : item.salidas
      }))
    },
    {
      id: 'Neto',
      color: '#3b82f6',
      data: sortedData.map(item => ({
        x: item.fecha,
        y: typeof item.neto === 'string' ? parseInt(item.neto) : item.neto
      }))
    }
  ];

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('es-MX').format(value);
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
  };

  return (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-semibold">Tendencia de Movimientos</h3>
        <p className="text-sm text-gray-600">Últimos 30 días - Entradas, Salidas y Movimiento Neto</p>
      </Card.Header>
      <Card.Body>
        <div className="h-96">
          <ResponsiveLine
            data={chartData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: false,
              reverse: false
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: 'Fecha',
              legendOffset: 40,
              legendPosition: 'middle',
              format: (value) => formatDate(value)
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Unidades',
              legendOffset: -50,
              legendPosition: 'middle',
              format: (value) => formatNumber(value)
            }}
            pointSize={8}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
            tooltip={({ point }) => (
              <div className="bg-white px-3 py-2 shadow-lg rounded border">
                <div className="font-semibold">{formatDate(point.data.xFormatted as string)}</div>
                <div className="text-sm mt-1" style={{ color: point.serieColor }}>
                  {point.serieId}: {formatNumber(point.data.yFormatted as number)}
                </div>
              </div>
            )}
          />
        </div>

        {/* Estadísticas resumen */}
        <div className="mt-4 border-t pt-4 grid grid-cols-3 gap-4">
          {chartData.map(serie => {
            const total = serie.data.reduce((sum, point) => sum + (point.y as number), 0);
            const average = total / serie.data.length;
            
            return (
              <div key={serie.id} className="text-center">
                <div className="text-xs text-gray-600 mb-1">{serie.id}</div>
                <div className="text-lg font-semibold" style={{ color: serie.color }}>
                  {formatNumber(Math.round(average))}
                </div>
                <div className="text-xs text-gray-500">Promedio diario</div>
              </div>
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
};