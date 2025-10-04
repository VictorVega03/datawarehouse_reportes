// backend/src/features/casos/horarios/horarios.routes.ts
// Routes para el caso de uso: Patrones Horarios

import { Router } from 'express'
import { horariosController } from './horarios.controller'

const horariosRoutes = Router()

// ===================================
// HORARIOS METRICS ROUTES
// ===================================

// GET /api/v1/casos/horarios/metrics - Métricas principales
horariosRoutes.get('/metrics', horariosController.getMetrics)

// GET /api/v1/casos/horarios/overview - Vista general
horariosRoutes.get('/overview', horariosController.getOverview)

// ===================================
// HOURLY ANALYSIS ROUTES  
// ===================================

// GET /api/v1/casos/horarios/analysis - Análisis por horas
horariosRoutes.get('/analysis', horariosController.getHourlyAnalysis)

// GET /api/v1/casos/horarios/transactions/summary - Resumen de transacciones
horariosRoutes.get('/transactions/summary', horariosController.getTransactionsSummary)

// ===================================
// CUSTOMER ANALYSIS ROUTES
// ===================================

// GET /api/v1/casos/horarios/customers/segmentation - Segmentación de clientes
horariosRoutes.get('/customers/segmentation', horariosController.getCustomerSegmentation)

// ===================================
// TEST ROUTE
// ===================================

// GET /api/v1/casos/horarios/test - Endpoint de prueba
horariosRoutes.get('/test', horariosController.testEndpoint)

export { horariosRoutes }
