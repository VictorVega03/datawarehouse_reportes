// frontend/src/features/casos/pagos/pages/PagosPage.tsx

import React from 'react';
import { 
  usePagosAnalysis, 
  usePagosDistribution, 
  usePagosHighRisk,
  usePagosRecommendations 
} from '../hooks/usePagosData';
import { PagosMetrics } from '../components/PagosMetrics';
import { PagosPieChart } from '../components/PagosPieChart';
import { PagosBarChart } from '../components/PagosBarChart';
import { HighRiskTable } from '../components/HighRiskTable';
import { RecommendationsCard } from '../components/RecommendationsCard';

export const PagosPage: React.FC = () => {
  console.log('🎯 [PagosPage] Rendering...');

  // Obtener datos con hooks
  const {
    data: analysisData,
    isLoading: analysisLoading,
    error: analysisError
  } = usePagosAnalysis();

  const {
    data: distributionData,
    isLoading: distributionLoading,
    error: distributionError
  } = usePagosDistribution();

  const {
    data: highRiskData,
    isLoading: highRiskLoading,
    error: highRiskError
  } = usePagosHighRisk(10000);

  const {
    data: recommendationsData,
    isLoading: recommendationsLoading,
    error: recommendationsError
  } = usePagosRecommendations();

  // Estados de carga
  const isLoading = analysisLoading || distributionLoading || highRiskLoading || recommendationsLoading;
  const hasError = analysisError || distributionError || highRiskError || recommendationsError;

  console.log('[PagosPage] Analysis:', analysisData);
  console.log('[PagosPage] Distribution:', distributionData);
  console.log('[PagosPage] High Risk:', highRiskData);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Cargando datos de métodos de pago...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-red-900">Error al cargar datos</h3>
              <p className="text-sm text-red-700 mt-1">
                {(analysisError || distributionError || highRiskError)?.message || 'Error desconocido'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!analysisData || !distributionData || !highRiskData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-yellow-900">No hay datos disponibles</h3>
              <p className="text-sm text-yellow-700 mt-1">
                No se encontraron datos de métodos de pago para mostrar.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Caso 6: Registro del Método de Pago
        </h1>
        <p className="text-gray-600">
          Análisis de métodos de pago, identificación de riesgos y recomendaciones para optimizar transacciones
        </p>
      </div>

      {/* Métricas principales */}
      {analysisData && analysisData.resumen && (
        <PagosMetrics resumen={analysisData.resumen} />
      )}

      {/* Gráficos y análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de distribución (Pie) */}
        {distributionData && distributionData.data && (
          <PagosPieChart data={distributionData.data} />
        )}

        {/* Análisis de riesgo por método */}
        {analysisData && analysisData.analisis_riesgo && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Análisis de Riesgo por Método
            </h3>
            <div className="space-y-3">
              {analysisData.analisis_riesgo.map((risk, index) => {
                const porcentaje = typeof risk.porcentaje_alto_valor === 'string' 
                  ? parseFloat(risk.porcentaje_alto_valor) 
                  : risk.porcentaje_alto_valor;
                
                return (
                  <div key={index} className="border-b border-gray-200 pb-3 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 capitalize">
                        {risk.metodo_pago}
                      </span>
                      <span className={`text-sm font-semibold ${
                        porcentaje > 10 ? 'text-red-600' : 
                        porcentaje > 5 ? 'text-orange-600' : 
                        'text-green-600'
                      }`}>
                        {porcentaje.toFixed(1)}% alto valor
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>
                        {typeof risk.transacciones_alto_valor === 'string' 
                          ? risk.transacciones_alto_valor 
                          : risk.transacciones_alto_valor.toLocaleString('es-MX')} transacciones
                      </span>
                      <span>
                        ${typeof risk.monto_alto_valor === 'string'
                          ? parseFloat(risk.monto_alto_valor).toLocaleString('es-MX')
                          : risk.monto_alto_valor.toLocaleString('es-MX')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Gráfico de barras - Ingresos por método */}
      {distributionData && distributionData.data && (
        <div className="mb-6">
          <PagosBarChart data={distributionData.data} />
        </div>
      )}

      {/* Recomendaciones automáticas */}
      {recommendationsData && recommendationsData.recomendaciones && (
        <div className="mb-6">
          <RecommendationsCard recommendations={recommendationsData.recomendaciones} />
        </div>
      )}

      {/* Tabla de transacciones de alto riesgo */}
      {highRiskData && highRiskData.summary && highRiskData.transactions && (
        <div className="mb-6">
          <HighRiskTable 
            summary={highRiskData.summary} 
            transactions={highRiskData.transactions} 
          />
        </div>
      )}

      {/* Footer con timestamp */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Última actualización: {new Date(
            analysisData.timestamp || 
            distributionData.timestamp || 
            highRiskData.timestamp
          ).toLocaleString('es-MX')}
        </p>
      </div>
    </div>
  );
};