// backend/src/features/casos/clientes/clientes.routes.ts
// Routes para el Caso de Uso 4: Identificación de Clientes

import { Router } from 'express'
import { clientesController } from '../controllers/clientes.controller'

const clientesRoutes = Router()

// ===================================
// TEST ROUTE
// ===================================

// GET /api/v1/casos/clientes/test
clientesRoutes.get('/test', clientesController.testEndpoint)

// ===================================
// MÉTRICAS PRINCIPALES
// ===================================

// GET /api/v1/casos/clientes/metrics
clientesRoutes.get('/metrics', clientesController.getMetrics)

// GET /api/v1/casos/clientes/overview
clientesRoutes.get('/overview', clientesController.getOverview)

// ===================================
// ANÁLISIS DE CLIENTES
// ===================================

// GET /api/v1/casos/clientes/distribution
// Distribución: Identificados vs Anónimos
clientesRoutes.get('/distribution', clientesController.getDistribution)

// GET /api/v1/casos/clientes/top?type=frequency&limit=20
// Top clientes por frecuencia o valor
// Query params:
//   - type: 'frequency' | 'value' (default: 'frequency')
//   - limit: number (default: 20)
clientesRoutes.get('/top', clientesController.getTopClientes)

// GET /api/v1/casos/clientes/segmentation
// Segmentación por frecuencia de compra
clientesRoutes.get('/segmentation', clientesController.getSegmentation)

// GET /api/v1/casos/clientes/recency
// Análisis de recencia (última compra)
clientesRoutes.get('/recency', clientesController.getRecencyAnalysis)

// GET /api/v1/casos/clientes/spending-ranges
// Distribución por rango de gasto total
clientesRoutes.get('/spending-ranges', clientesController.getSpendingRanges)

// ===================================
// EXPORT
// ===================================

export { clientesRoutes }