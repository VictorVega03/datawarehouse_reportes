// frontend/src/features/casos/inventario/components/ProductosBarChart.tsx

import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { Card } from '../../../../components/ui/Card';
import type { ProductoMasMovido } from '../types';

interface Props {
  data: ProductoMasMovido[];
}

export const ProductosBarChart: React.FC<Props> = ({ data }) => {
  // Validación inicial
  if (!data || data.length === 0) {
    return (
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Top 10 Productos Más Movidos</h3>
        </Card.Header>
        <Card.Body>
          <div className="h-96 flex items-center justify-center text-gray-500">
            No hay datos disponibles
          </div>
        </Card.Body>
      </Card>
    );
  }

  // ...existing code...

  const chartData = data.slice(0, 10).map(item => {
    // Convertir valores a números seguros
    const entradas = typeof item.total_entradas === 'string' 
      ? parseFloat(item.total_entradas) || 0
      : Number(item.total_entradas) || 0;
    
    const salidas = typeof item.total_salidas === 'string' 
      ? parseFloat(item.total_salidas) || 0
      : Number(item.total_salidas) || 0;
    
    const stock = typeof item.stock_calculado === 'string' 
      ? parseFloat(item.stock_calculado) || 0
      : Number(item.stock_calculado) || 0;

    return {
      product_name: item.product_name.length > 30 
        ? item.product_name.substring(0, 30) + '...' 
        : item.product_name,
      fullName: item.product_name,
      Entradas: entradas,
      Salidas: salidas,
      stock: stock
    };
  });

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('es-MX').format(value);
  };

  // Validar que chartData tenga al menos un elemento válido
  if (chartData.length === 0) {
    return (
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Top 10 Productos Más Movidos</h3>
        </Card.Header>
        <Card.Body>
          <div className="h-96 flex items-center justify-center text-gray-500">
            No se pudieron procesar los datos
          </div>
        </Card.Body>
      </Card>
    );
  }

  // ...existing code...

  return (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-semibold">Top 10 Productos Más Movidos</h3>
        <p className="text-sm text-gray-600">Comparación de Entradas vs Salidas</p>
      </Card.Header>
      <Card.Body>
        <div className="h-96">
          <ResponsiveBar
            data={chartData}
            keys={['Entradas', 'Salidas']}
            indexBy="product_name"
            margin={{ top: 50, right: 130, bottom: 100, left: 60 }}
            padding={0.3}
            groupMode="grouped"
            valueScale={{ type: 'linear', min: 0 }}
            indexScale={{ type: 'band', round: true }}
            colors={['#10b981', '#ef4444']}
            enableLabel={true}
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
              legend: 'Producto',
              legendPosition: 'middle',
              legendOffset: 80
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Cantidad de Unidades',
              legendPosition: 'middle',
              legendOffset: -50,
              format: (value) => formatNumber(value)
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
              from: 'color',
              modifiers: [['darker', 1.6]]
            }}
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
            tooltip={({ id, value, indexValue, data }) => (
              <div className="bg-white px-3 py-2 shadow-lg rounded border">
                <div className="font-semibold text-sm">{data?.fullName || indexValue}</div>
                <div className="text-sm mt-1">
                  <span className={id === 'Entradas' ? 'text-green-600' : 'text-red-600'}>
                    {id}:
                  </span> {formatNumber(Number(value) || 0)}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Stock actual: {formatNumber(Number(data?.stock) || 0)}
                </div>
              </div>
            )}
            role="application"
            ariaLabel="Top productos más movidos"
          />
        </div>

        {/* Tabla resumen */}
        <div className="mt-4 border-t pt-4">
          <h4 className="font-semibold mb-2">Top 5 Productos</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Producto</th>
                  <th className="text-right py-2">Entradas</th>
                  <th className="text-right py-2">Salidas</th>
                  <th className="text-right py-2">Stock</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 5).map((item, index) => {
                  const stock = typeof item.stock_calculado === 'string' 
                    ? parseFloat(item.stock_calculado) || 0
                    : Number(item.stock_calculado) || 0;
                  
                  const entradas = typeof item.total_entradas === 'string' 
                    ? parseFloat(item.total_entradas) || 0
                    : Number(item.total_entradas) || 0;
                  
                  const salidas = typeof item.total_salidas === 'string' 
                    ? parseFloat(item.total_salidas) || 0
                    : Number(item.total_salidas) || 0;
                  
                  return (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.product_name}</td>
                      <td className="text-right py-2 text-green-600">
                        {formatNumber(entradas)}
                      </td>
                      <td className="text-right py-2 text-red-600">
                        {formatNumber(salidas)}
                      </td>
                      <td className="text-right py-2 font-semibold">
                        <span className={stock < 20 ? 'text-red-600' : stock < 50 ? 'text-yellow-600' : 'text-green-600'}>
                          {formatNumber(stock)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};