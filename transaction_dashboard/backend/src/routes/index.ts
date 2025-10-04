import { Router } from 'express';
import { healthRoutes } from './health.routes';
import { dashboardRoutes } from './api/dashboard.routes';

// ===================================
// 🆕 IMPORTS DE CASOS DE USO
// ===================================
import { horariosRoutes } from '../features/casos/horarios/horarios.routes';

const router = Router();

// ===================================
// HEALTH CHECK ROUTES
// ===================================
router.use('/health', healthRoutes);

// ===================================
// API ROUTES v1
// ===================================
const apiPrefix = process.env.API_PREFIX || '/api';
const apiVersion = process.env.API_VERSION || 'v1';

// 🔴 DEPRECATED: Mantener temporalmente por compatibilidad
router.use(`${apiPrefix}/${apiVersion}/dashboard`, dashboardRoutes);

// ===================================
// 🆕 CASOS DE USO - NUEVA ESTRUCTURA
// ===================================

// CASO 1: Patrones Horarios ✅
router.use(`${apiPrefix}/${apiVersion}/casos/horarios`, horariosRoutes);

// CASO 2: Control Caducidad ⏳ (próximamente)
// router.use(`${apiPrefix}/${apiVersion}/casos/caducidad`, caducidadRoutes);

// CASO 3: Gestión Precios ⏸️ (futuro)
// router.use(`${apiPrefix}/${apiVersion}/casos/precios`, preciosRoutes);

// CASO 4: Identificación Clientes ⏸️ (futuro)
// router.use(`${apiPrefix}/${apiVersion}/casos/clientes`, clientesRoutes);

// CASO 5: Seguimiento Inventario ⏸️ (futuro)
// router.use(`${apiPrefix}/${apiVersion}/casos/inventario`, inventarioRoutes);

// CASO 6: Métodos de Pago ⏸️ (futuro)
// router.use(`${apiPrefix}/${apiVersion}/casos/pagos`, pagosRoutes);

// CASO 7: Control Devoluciones ⏸️ (futuro)
// router.use(`${apiPrefix}/${apiVersion}/casos/devoluciones`, devolucionesRoutes);

// ===================================
// API INFO ROUTE
// ===================================
router.get(`${apiPrefix}`, (_req, res) => {
  res.json({
    name: 'Transaction Analytics Dashboard API',
    version: apiVersion,
    endpoints: {
      health: '/health',
      dashboard: `${apiPrefix}/${apiVersion}/dashboard`, // 🔴 Deprecated
      casos: {
        horarios: `${apiPrefix}/${apiVersion}/casos/horarios`, // ✅ Activo
        caducidad: `${apiPrefix}/${apiVersion}/casos/caducidad`, // ⏳ Próximo
        precios: `${apiPrefix}/${apiVersion}/casos/precios`, // ⏸️ Futuro
        clientes: `${apiPrefix}/${apiVersion}/casos/clientes`, // ⏸️ Futuro
        inventario: `${apiPrefix}/${apiVersion}/casos/inventario`, // ⏸️ Futuro
        pagos: `${apiPrefix}/${apiVersion}/casos/pagos`, // ⏸️ Futuro
        devoluciones: `${apiPrefix}/${apiVersion}/casos/devoluciones` // ⏸️ Futuro
      }
    },
    documentation: `${apiPrefix}/docs`,
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

export { router };