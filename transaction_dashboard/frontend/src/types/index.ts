// Tipos base para el dashboard

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  timestamp: string;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  timestamp: string;
  details?: any;
}

export interface HourlyAnalysis {
  hour: string;
  value: number;
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'pending';

export interface DashboardMetrics {
  totalTransactions: number;
  totalAmount: string;
  averageTicket: string;
  // Agrega más métricas según tu backend
}

export interface DashboardOverview {
  metrics: DashboardMetrics;
  cases: Array<{
    id: string;
    name: string;
    status: 'completed' | 'in_progress' | 'pending';
    roi: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    description: string;
  }>;
  hourlyData: Array<{
    hour: number;
    transactions: number;
    percentage: number;
  }>;
}

export interface TransactionsSummary {
  totalTransactions: number;
  totalAmount: string;
  averageTicket: string;
  paymentMethods: Array<{
    method: string;
    count: number;
    percentage: number;
    averageAmount: string;
  }>;
  topHours: Array<{
    hour: number;
    transactions: number;
    percentage: number;
  }>;
}

export interface CustomerSegmentation {
  totalCustomers: number;
  identified: {
    count: number;
    percentage: number;
    totalRevenue: string;
  };
  anonymous: {
    count: number;
    percentage: number;
    totalRevenue: string;
  };
  vip: {
    count: number;
    percentage: number;
    totalRevenue: string;
  };
}
