import { Router } from 'express';
import { healthController } from '../controllers/health.controller';

const healthRoutes = Router();

// GET /health - Basic health check
healthRoutes.get('/', healthController.basicHealthCheck);

// GET /health/detailed - Detailed health check
healthRoutes.get('/detailed', healthController.detailedHealthCheck);

// GET /health/database - Database connection check
healthRoutes.get('/database', healthController.databaseHealthCheck);

export { healthRoutes };