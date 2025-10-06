// backend/src/routes/devoluciones.routes.ts

import { Router } from 'express';
import { devolucionesController } from '../controllers/devoluciones.controller';

const router = Router();

/**
 * CASO 7: CONTROL DE DEVOLUCIONES
 * 
 * Rutas para gestión y análisis de devoluciones
 */

// Test endpoint
router.get('/test', devolucionesController.testEndpoint);

// Métricas principales
router.get('/metrics', devolucionesController.getMetrics);

// Análisis completo
router.get('/analysis', devolucionesController.getAnalysis);

// Patrones sospechosos
// Query params: ?maxMinutes=5
router.get('/suspicious-patterns', devolucionesController.getSuspiciousPatterns);

// Productos más devueltos
// Query params: ?limit=10
router.get('/top-returned-products', devolucionesController.getTopReturnedProducts);

// Recomendaciones
router.get('/recommendations', devolucionesController.getRecommendations);

// Al final, antes del export
router.post('/refresh-vistas', devolucionesController.refreshVistas)

export { router as devolucionesRoutes };