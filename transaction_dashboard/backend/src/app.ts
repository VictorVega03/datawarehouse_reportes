const express = require('express');
import type { Request, Response, NextFunction } from 'express';
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
// import { router } from './routes';
import { logger } from './utils/logger';

// Crear aplicación Express
const app = express();

// ===================================
// MIDDLEWARE GLOBALES
// ===================================

// Seguridad básica
app.use(helmet());

// CORS - permitir requests desde frontend
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Compresión de responses
app.use(compression());

// Logging HTTP requests
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// Parseo de JSON y URL encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===================================
// RUTAS
// ===================================

// Ruta simple de prueba
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta de prueba básica
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: '🚀 Transaction Analytics Dashboard API',
    version: process.env.API_VERSION || 'v1',
    status: 'running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ===================================
// MANEJO DE ERRORES
// ===================================

// 404 - Ruta no encontrada
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Manejo global de errores
app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Error no manejado:', error);
  
  res.status(error.status || 500).json({
    error: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

export { app };