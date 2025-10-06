// frontend/src/features/casos/devoluciones/components/DevolucionesPieChart.tsx

import { ResponsivePie } from '@nivo/pie';
import type { DevolucionesDistributionItem } from '../types';

interface Props {
  data: DevolucionesDistributionItem[];
}

export function DevolucionesPieChart({ data }: Props) {
  // Validación defensiva
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Distribución por Motivo
        </h3>
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500">No hay datos de devoluciones disponibles</p>
        </div>
      </div>
    );
  }

  // Formatear datos para Nivo
  const chartData = data.map(item => ({
    id: item.id,
    label: item.label,
    value: typeof item.value === 'string' ? parseInt(item.value) : item.value,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Distribución por Motivo de Devolución
      </h3>
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
            modifiers: [['darker', 0.2]],
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: 'color',
            modifiers: [['darker', 2]],
          }}
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
                    itemTextColor: '#000',
                  },
                },
              ],
            },
          ]}
          tooltip={({ datum }) => (
            <div className="bg-white px-3 py-2 shadow-lg rounded border border-gray-200">
              <strong>{datum.label}</strong>
              <br />
              <span>Devoluciones: {datum.value.toLocaleString('es-MX')}</span>
            </div>
          )}
        />
      </div>
    </div>
  );
}