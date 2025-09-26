import { Router } from 'express';
import { healthRoutes } from './health.routes';
import { dashboardRoutes } from './api/dashboard.routes';

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

router.use(`${apiPrefix}/${apiVersion}/dashboard`, dashboardRoutes);

// ===================================
// API INFO ROUTE
// ===================================
router.get(`${apiPrefix}`, (_req, res) => {
  res.json({
    name: 'Transaction Analytics Dashboard API',
    version: apiVersion,
    endpoints: {
      health: '/health',
      dashboard: `${apiPrefix}/${apiVersion}/dashboard`
    },
    documentation: `${apiPrefix}/docs`,
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

export { router };