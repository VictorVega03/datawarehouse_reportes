// frontend/src/features/casos/inventario/components/MovimientosTable.tsx

import React, { useState } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import type { MovimientoReciente, ProductoMasMovido } from '../types';

interface Props {
  movimientos: MovimientoReciente[];
  productosCriticos: ProductoMasMovido[];
}

export const MovimientosTable: React.FC<Props> = ({ movimientos, productosCriticos }) => {
  const [activeTab, setActiveTab] = useState<'recientes' | 'criticos'>('recientes');
  const [criticosPage, setCriticosPage] = useState(1);
  const criticosPerPage = 10;
  const totalCriticosPages = Math.ceil(productosCriticos.length / criticosPerPage);
  const paginatedCriticos = productosCriticos.slice(
    (criticosPage - 1) * criticosPerPage,
    criticosPage * criticosPerPage
  );

  const formatNumber = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('es-MX').format(numValue);
  };

  const formatDate = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Detalles de Inventario</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('recientes')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'recientes'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Movimientos Recientes ({movimientos.length})
            </button>
            <button
              onClick={() => setActiveTab('criticos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'criticos'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Productos Críticos ({productosCriticos.length})
            </button>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        {activeTab === 'recientes' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4">Fecha</th>
                  <th className="text-left py-3 px-4">Producto</th>
                  <th className="text-center py-3 px-4">Tipo</th>
                  <th className="text-right py-3 px-4">Cantidad</th>
                  <th className="text-left py-3 px-4">Referencia</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.slice(0, 20).map((mov, _index) => (
                  <tr key={mov.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-xs text-gray-600">
                      {formatDate(mov.fecha_hora)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{mov.product_name}</div>
                      <div className="text-xs text-gray-500">ID: {mov.product_id}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={mov.tipo === 'IN' ? 'success' : 'danger'}>
                        {mov.tipo === 'IN' ? '↑ Entrada' : '↓ Salida'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">
                      {formatNumber(mov.cantidad)}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600">
                      <div>{mov.ref_type}</div>
                      {mov.ref_id && <div>Ref: {mov.ref_id}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {movimientos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay movimientos recientes
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-red-50">
                  <th className="text-left py-3 px-4">Producto</th>
                  <th className="text-left py-3 px-4">Categoría</th>
                  <th className="text-right py-3 px-4">Entradas</th>
                  <th className="text-right py-3 px-4">Salidas</th>
                  <th className="text-right py-3 px-4">Stock Actual</th>
                  <th className="text-center py-3 px-4">Estado</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCriticos.map((producto, _index) => {
                  const stock = typeof producto.stock_calculado === 'string' 
                    ? parseInt(producto.stock_calculado) 
                    : producto.stock_calculado;
                  return (
                    <tr key={producto.product_id} className="border-b hover:bg-red-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{producto.product_name}</div>
                        <div className="text-xs text-gray-500">ID: {producto.product_id}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {producto.categories || 'Sin categoría'}
                      </td>
                      <td className="py-3 px-4 text-right text-green-600">
                        {formatNumber(producto.total_entradas)}
                      </td>
                      <td className="py-3 px-4 text-right text-red-600">
                        {formatNumber(producto.total_salidas)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-bold ${
                          stock === 0 ? 'text-red-700' : 
                          stock < 10 ? 'text-red-600' : 
                          'text-yellow-600'
                        }`}>
                          {formatNumber(stock)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={stock === 0 ? 'danger' : stock < 10 ? 'warning' : 'default'}>
                          {stock === 0 ? '🚨 AGOTADO' : stock < 10 ? '⚠️ CRÍTICO' : '📉 BAJO'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Paginación */}
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                onClick={() => setCriticosPage((p) => Math.max(1, p - 1))}
                disabled={criticosPage === 1}
              >
                Anterior
              </button>
              <span className="text-sm font-medium">
                Página {criticosPage} de {totalCriticosPages}
              </span>
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                onClick={() => setCriticosPage((p) => Math.min(totalCriticosPages, p + 1))}
                disabled={criticosPage === totalCriticosPages}
              >
                Siguiente
              </button>
            </div>
            {productosCriticos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                ✅ No hay productos con stock crítico
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};