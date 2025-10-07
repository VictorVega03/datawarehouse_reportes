// frontend/src/features/casos/devoluciones/components/SuspiciousPatternsTable.tsx

import type { PatronSospechoso } from '../types';

interface Props {
  patterns: PatronSospechoso[];
}

export function SuspiciousPatternsTable({ patterns }: Props) {
  // Validación defensiva
  if (!patterns || patterns.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-blue-700 mb-4">
          Patrones Sospechosos Detectados
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No se detectaron patrones sospechosos</p>
          <p className="text-sm text-gray-400 mt-2">
            Esto es una buena señal - no hay transacciones con comportamiento inusual
          </p>
        </div>
      </div>
    );
  }

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'Alto':
        return 'bg-red-100 text-red-800';
      case 'Medio':
        return 'bg-yellow-100 text-yellow-800';
      case 'Bajo':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-blue-700">
          Patrones Sospechosos Detectados
        </h3>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-200 text-red-800">
          {patterns.length} detectados
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                Fecha/Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                Método Pago
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                Tiempo
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                Riesgo
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patterns.map((pattern, index) => (
              <tr
                key={`${pattern.transactionId}-${index}`}
                className="hover:bg-blue-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {pattern.transactionId.substring(0, 12)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(pattern.fecha)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                  {pattern.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {pattern.metodoPago}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {pattern.tiempoTranscurrido}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow ${getRiskBadgeColor(
                      pattern.nivelRiesgo
                    )}`}
                  >
                    {pattern.nivelRiesgo}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>
          <strong>Nota:</strong> Patrones sospechosos son transacciones realizadas
          muy cerca temporalmente que podrían indicar devoluciones no registradas o
          errores operacionales.
        </p>
      </div>
    </div>
  );
}