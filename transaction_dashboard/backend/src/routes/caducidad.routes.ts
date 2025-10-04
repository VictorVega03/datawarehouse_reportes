// backend/src/features/casos/caducidad/caducidad.routes.ts
// Routes para el caso de uso: Control de Caducidad

import { Router } from 'express'
import { caducidadController } from '../controllers/caducidad.controller'

const caducidadRoutes = Router()

// ===================================
// TEST ROUTE
// ===================================

// GET /api/v1/casos/caducidad/test - Endpoint de prueba
caducidadRoutes.get('/test', caducidadController.testEndpoint)

// ===================================
// CADUCIDAD METRICS ROUTES
// ===================================

// GET /api/v1/casos/caducidad/metrics - Métricas principales
caducidadRoutes.get('/metrics', caducidadController.getMetrics)

// GET /api/v1/casos/caducidad/analysis - Análisis completo de caducidad
caducidadRoutes.get('/analysis', caducidadController.getCaducidadAnalysis)

// ===================================
// PRODUCTS ROUTES  
// ===================================

// GET /api/v1/casos/caducidad/products/critical - Productos críticos
// Query params: ?days=7 (threshold en días, default 7)
// Ejemplo: /api/v1/casos/caducidad/products/critical?days=3
caducidadRoutes.get('/products/critical', caducidadController.getCriticalProducts)

// ===================================
// RECOMMENDATIONS ROUTES
// ===================================

// GET /api/v1/casos/caducidad/recommendations - Recomendaciones basadas en análisis
caducidadRoutes.get('/recommendations', caducidadController.getRecommendations)

export { caducidadRoutes }