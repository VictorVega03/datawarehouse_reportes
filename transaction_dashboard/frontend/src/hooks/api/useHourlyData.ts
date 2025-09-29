// frontend/src/hooks/api/useHourlyData.ts
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Tipos inline para los datos
interface HourlyDataPoint {
  hour: string
  transactions: number
  percentage: number
}

interface HourlyAnalysis {
  peakHour: string
  peakPercentage: number
  concentration: {
    hours: number
    percentage: number
  }
  peakValleDifference: number
  potentialROI: string
  hourlyDistribution: HourlyDataPoint[]
}

interface ApiResponse {
  success: boolean
  data: HourlyAnalysis
  timestamp: string
}

// Hook para obtener análisis horario
export const useHourlyAnalysis = () => {
  return useQuery<HourlyAnalysis>({
    queryKey: ['hourlyAnalysis'],
    queryFn: async () => {
      const response = await axios.get<ApiResponse>(
        `${API_URL}/api/v1/dashboard/transactions/hourly`
      )
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  })
}

// Exportar tipos para usar en componentes
export type { HourlyDataPoint, HourlyAnalysis }