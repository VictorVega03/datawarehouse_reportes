// backend/src/routes/inventario.routes.ts

import { Router } from 'express';
import { inventarioController } from '../controllers/inventario.controller';

const inventarioRoutes = Router();

// ===================================
// ENDPOINTS SEPARADOS - CARGA PROGRESIVA
// ===================================

// GET /api/v1/casos/inventario/test - Endpoint de prueba
inventarioRoutes.get('/test', inventarioController.testEndpoint);

// GET /api/v1/casos/inventario/metrics - Solo métricas (~5 segundos)
inventarioRoutes.get('/metrics', inventarioController.getMetrics);

// GET /api/v1/casos/inventario/movimientos-tipo - Solo movimientos por tipo (~5 segundos)
inventarioRoutes.get('/movimientos-tipo', inventarioController.getMovimientosPorTipo);

// GET /api/v1/casos/inventario/productos-movidos - Solo productos más movidos (~35 segundos)
inventarioRoutes.get('/productos-movidos', inventarioController.getProductosMasMovidos);

// GET /api/v1/casos/inventario/tendencia - Tendencia de movimientos (~10 segundos)
inventarioRoutes.get('/tendencia', inventarioController.getTendencia);

// GET /api/v1/casos/inventario/movimientos-recientes - Últimos movimientos
// Query params: ?limit=50 (número de movimientos)
inventarioRoutes.get('/movimientos-recientes', inventarioController.getMovimientosRecientes);

// GET /api/v1/casos/inventario/productos/criticos - Productos con stock crítico
// Query params: ?umbral=20 (stock mínimo)
inventarioRoutes.get('/productos/criticos', inventarioController.getProductosCriticos);

// ===================================
// NUEVO: ENDPOINT DE REFRESH DE VISTAS
// ===================================

// POST /api/v1/casos/inventario/refresh-vistas - Actualizar vistas materializadas
// ⚠️ Este endpoint tarda 2-3 minutos en ejecutarse
inventarioRoutes.post('/refresh-vistas', inventarioController.refreshVistas);

// ===================================
// ENDPOINT LEGACY - TODO JUNTO
// ===================================

// GET /api/v1/casos/inventario/analysis - Análisis completo (lento)
inventarioRoutes.get('/analysis', inventarioController.getAnalisisCompleto);

export { inventarioRoutes };