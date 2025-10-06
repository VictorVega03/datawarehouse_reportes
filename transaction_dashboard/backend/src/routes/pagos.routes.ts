// backend/src/features/casos/pagos/pagos.routes.ts

import pagosController from '@/controllers/pagos.controller';
import { Router } from 'express';

const router = Router();

/**
 * CASO 6: MÉTODOS DE PAGO
 * 
 * Problema Detectado:
 * - No se especifica cómo fue pagada la compra (efectivo, tarjeta, transferencia)
 * - No se puede analizar método de pago más usado
 * - No hay control de conciliaciones bancarias
 * 
 * Impacto:
 * - Imposible identificar preferencias de pago
 * - Riesgos de manejo de efectivo no detectados
 * - Sin datos para negociar comisiones bancarias
 * 
 * Solución:
 * - Análisis de campo metodo_pago existente
 * - Identificación de transacciones de alto riesgo
 * - Recomendaciones para reducir efectivo
 */

// Endpoint de prueba
router.get('/test', (req, res) => pagosController.test(req, res));

// Análisis completo
router.get('/analysis', (req, res) => pagosController.getAnalysis(req, res));

// Distribución de métodos de pago
router.get('/distribution', (req, res) => pagosController.getDistribution(req, res));

// Transacciones de alto riesgo
router.get('/high-risk', (req, res) => pagosController.getHighRisk(req, res));

// Tendencias por día
router.get('/trends', (req, res) => pagosController.getTrends(req, res));

// Distribución por hora
router.get('/by-hour', (req, res) => pagosController.getByHour(req, res));

// Recomendaciones
router.get('/recommendations', (req, res) => pagosController.getRecommendations(req, res));

export default router;