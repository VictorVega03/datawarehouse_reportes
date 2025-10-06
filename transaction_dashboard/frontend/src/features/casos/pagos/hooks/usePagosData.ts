// frontend/src/features/casos/pagos/hooks/usePagosData.ts

import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../../services/api/client';
import type {
  PaymentAnalysisData,
  PaymentDistributionData,
  HighRiskData,
  RecommendationsData,
  PaymentTrendsData,
  PaymentByHourData
} from '../types';

const BASE_URL = '/casos/pagos';

/**
 * Hook para obtener el análisis completo de métodos de pago
 */
export function usePagosAnalysis() {
  return useQuery({
    queryKey: ['pagos', 'analysis'],
    queryFn: async () => {
      console.log('🔍 [Hook] Fetching pagos analysis...');
      const response = await apiClient.get<{
        success: boolean;
        data: PaymentAnalysisData;
      }>(`${BASE_URL}/analysis`);
      
      console.log('✅ [Hook] Pagos analysis received:', response.data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error('No se recibieron datos del análisis de pagos');
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2
  });
}

/**
 * Hook para obtener la distribución de métodos de pago
 */
export function usePagosDistribution() {
  return useQuery({
    queryKey: ['pagos', 'distribution'],
    queryFn: async () => {
      console.log('📊 [Hook] Fetching pagos distribution...');
      const response = await apiClient.get<{
        success: boolean;
        data: PaymentDistributionData;
      }>(`${BASE_URL}/distribution`);
      
      console.log('✅ [Hook] Pagos distribution received:', response.data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error('No se recibieron datos de distribución de pagos');
    },
    staleTime: 5 * 60 * 1000,
    retry: 2
  });
}

/**
 * Hook para obtener transacciones de alto riesgo
 */
export function usePagosHighRisk(minAmount: number = 10000) {
  return useQuery({
    queryKey: ['pagos', 'high-risk', minAmount],
    queryFn: async () => {
      console.log(`🚨 [Hook] Fetching high risk transactions (>= $${minAmount})...`);
      const response = await apiClient.get<{
        success: boolean;
        data: HighRiskData;
      }>(`${BASE_URL}/high-risk`, {
        params: { minAmount }
      });
      
      console.log('✅ [Hook] High risk data received:', response.data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error('No se recibieron datos de transacciones de alto riesgo');
    },
    staleTime: 3 * 60 * 1000, // 3 minutos (más frecuente por ser crítico)
    retry: 2
  });
}

/**
 * Hook para obtener recomendaciones
 */
export function usePagosRecommendations() {
  return useQuery({
    queryKey: ['pagos', 'recommendations'],
    queryFn: async () => {
      console.log('💡 [Hook] Fetching recommendations...');
      const response = await apiClient.get<{
        success: boolean;
        data: RecommendationsData;
      }>(`${BASE_URL}/recommendations`);
      
      console.log('✅ [Hook] Recommendations received:', response.data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error('No se recibieron recomendaciones');
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    retry: 2
  });
}

/**
 * Hook para obtener tendencias
 */
export function usePagedosTrends(days: number = 30) {
  return useQuery({
    queryKey: ['pagos', 'trends', days],
    queryFn: async () => {
      console.log(`📈 [Hook] Fetching trends (${days} days)...`);
      const response = await apiClient.get<{
        success: boolean;
        data: PaymentTrendsData;
      }>(`${BASE_URL}/trends`, {
        params: { days }
      });
      
      console.log('✅ [Hook] Trends received:', response.data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error('No se recibieron datos de tendencias');
    },
    staleTime: 5 * 60 * 1000,
    retry: 2
  });
}

/**
 * Hook para obtener distribución por hora
 */
export function usePagosByHour() {
  return useQuery({
    queryKey: ['pagos', 'by-hour'],
    queryFn: async () => {
      console.log('⏰ [Hook] Fetching payment distribution by hour...');
      const response = await apiClient.get<{
        success: boolean;
        data: PaymentByHourData;
      }>(`${BASE_URL}/by-hour`);
      
      console.log('✅ [Hook] By hour data received:', response.data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error('No se recibieron datos por hora');
    },
    staleTime: 5 * 60 * 1000,
    retry: 2
  });
}