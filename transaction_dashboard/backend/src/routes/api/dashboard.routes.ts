import { Router } from 'express';
import { dashboardController } from '../../controllers/dashboard.controller';

const dashboardRoutes = Router();

// ===================================
// DASHBOARD METRICS ROUTES
// ===================================

// GET /api/v1/dashboard/metrics - Métricas principales del dashboard
dashboardRoutes.get('/metrics', dashboardController.getDashboardMetrics);

// GET /api/v1/dashboard/overview - Vista general del dashboard
dashboardRoutes.get('/overview', dashboardController.getDashboardOverview);

// ===================================
// TRANSACTION ANALYSIS ROUTES  
// ===================================

// GET /api/v1/dashboard/transactions/hourly - Análisis por horas
dashboardRoutes.get('/transactions/hourly', dashboardController.getHourlyAnalysis);

// GET /api/v1/dashboard/transactions/summary - Resumen de transacciones
dashboardRoutes.get('/transactions/summary', dashboardController.getTransactionsSummary);

// ===================================
// CUSTOMER ANALYSIS ROUTES
// ===================================

// GET /api/v1/dashboard/customers/segmentation - Segmentación de clientes
dashboardRoutes.get('/customers/segmentation', dashboardController.getCustomerSegmentation);

// ===================================
// TEST ROUTE
// ===================================

// GET /api/v1/dashboard/test - Endpoint de prueba
dashboardRoutes.get('/test', dashboardController.testEndpoint);

export { dashboardRoutes };