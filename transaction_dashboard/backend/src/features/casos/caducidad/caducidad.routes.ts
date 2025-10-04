// backend/src/features/casos/caducidad/caducidad.routes.ts
// Routes para el caso de uso: Control de Caducidad

import { Router } from 'express'
import { caducidadController } from './caducidad.controller'

const caducidadRoutes = Router()

// ===================================
// CADUCIDAD METRICS ROUTES
// ===================================

// GET /api/v1/casos/caducidad/metrics - Métricas principales
caducidadRoutes.get('/metrics', caducidadController.getMetrics)

// GET /api/v1/casos/caducidad/analysis - Análisis de caducidad
caducidadRoutes.get('/analysis', caducidadController.getCaducidadAnalysis)

// ===================================
// PRODUCTS ROUTES  
// ===================================

// GET /api/v1/casos/caducidad/products/critical - Productos críticos
// Query params: ?days=7 (threshold en días)
caducidadRoutes.get('/products/critical', caducidadController.getCriticalProducts)

// ===================================
// RECOMMENDATIONS ROUTES
// ===================================

// GET /api/v1/casos/caducidad/recommendations - Recomendaciones
caducidadRoutes.get('/recommendations', caducidadController.getRecommendations)

// ===================================
// TEST ROUTE
// ===================================

// GET /api/v1/casos/caducidad/test - Endpoint de prueba
caducidadRoutes.get('/test', caducidadController.testEndpoint)

export { caducidadRoutes }
