import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

class HealthController {
  // Health check básico
  basicHealthCheck = async (_req: Request, res: Response) => {
    try {
      res.status(200).json({
        status: 'OK',
        service: 'Transaction Analytics Dashboard API',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.API_VERSION || 'v1'
      });
    } catch (error) {
      logger.error('Health check failed:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Health check failed'
      });
    }
  };

  // Health check detallado
  detailedHealthCheck = async (_req: Request, res: Response) => {
    try {
      const memoryUsage = process.memoryUsage();
      
      res.status(200).json({
        status: 'OK',
        service: 'Transaction Analytics Dashboard API',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.API_VERSION || 'v1',
        environment: process.env.NODE_ENV || 'development',
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
          external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`
        },
        system: {
          platform: process.platform,
          arch: process.arch,
          nodeVersion: process.version
        }
      });
    } catch (error) {
      logger.error('Detailed health check failed:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Detailed health check failed'
      });
    }
  };

  // Health check de base de datos
  databaseHealthCheck = async (_req: Request, res: Response) => {
    try {
      // Probar conexión a la base de datos
      const startTime = Date.now();
      await prisma.$queryRaw`SELECT 1 as connection_test`;
      const queryTime = Date.now() - startTime;
      
      // Obtener información de la base de datos
      const dbInfo = await prisma.$queryRaw`SELECT version() as version` as any[];
      
      res.status(200).json({
        status: 'OK',
        database: {
          connected: true,
          queryTime: `${queryTime}ms`,
          version: dbInfo[0]?.version || 'unknown'
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Database health check failed:', error);
      res.status(500).json({
        status: 'ERROR',
        database: {
          connected: false,
          error: error instanceof Error ? error.message : 'Unknown database error'
        },
        timestamp: new Date().toISOString()
      });
    }
  };
}

export const healthController = new HealthController();