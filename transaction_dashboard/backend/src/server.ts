// backend/src/server.ts - CORREGIDO
import * as dotenv from 'dotenv'
import app from './app'  // ✅ IMPORT DEFAULT (no destructured)
import { logger } from './utils/logger'
import { PrismaClient } from '@prisma/client'

// Cargar variables de entorno
dotenv.config()

const PORT = process.env.PORT || 3001
const HOST = process.env.HOST || 'localhost'
const NODE_ENV = process.env.NODE_ENV || 'development'

// Cliente Prisma para verificar conexión
const prisma = new PrismaClient()

// ===================================
// FUNCIÓN DE VERIFICACIÓN DE BASE DE DATOS
// ===================================
async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$connect()
    await prisma.$queryRaw`SELECT 1`
    logger.info('🗄️  Base de datos: Conectada')
    return true
  } catch (error) {
    logger.error('❌ Error conectando a la base de datos:', error)
    logger.warn('⚠️  Servidor iniciando sin conexión a base de datos')
    return false
  }
}

// ===================================
// FUNCIÓN DE INICIALIZACIÓN DEL SERVIDOR
// ===================================
async function startServer() {
  try {
    // Verificar conexión a base de datos
    const dbConnected = await checkDatabaseConnection()

    // Iniciar servidor HTTP
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Servidor corriendo en http://${HOST}:${PORT}`)
      logger.info(`📊 Dashboard API v${process.env.API_VERSION || 'v1'}`)
      logger.info(`🌍 Entorno: ${NODE_ENV}`)
      logger.info(`📱 CORS habilitado para: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`)
      
      if (dbConnected) {
        logger.info('✅ Sistema completamente operativo')
      } else {
        logger.warn('⚠️  Sistema funcionando con datos de ejemplo')
      }
      
      // Log de rutas disponibles
      logger.info('📋 Rutas disponibles:')
      logger.info('   GET /health')
      logger.info('   GET /health/detailed')
      logger.info('   GET /health/database')
      logger.info('   GET /api')
      logger.info('   GET /api/v1/dashboard/test')
      logger.info('   GET /api/v1/dashboard/metrics')
      logger.info('   GET /api/v1/dashboard/overview')
      logger.info('   GET /api/v1/dashboard/transactions/hourly')
      logger.info('   GET /api/v1/dashboard/transactions/summary')
      logger.info('   GET /api/v1/dashboard/customers/segmentation')
    })

    // ===================================
    // MANEJO GRACEFUL DE CIERRE
    // ===================================
    const gracefulShutdown = async (signal: string) => {
      logger.info(`📴 Recibida señal ${signal}. Cerrando servidor...`)
      
      server.close(async () => {
        logger.info('🔌 Servidor HTTP cerrado')
        
        try {
          await prisma.$disconnect()
          logger.info('🗄️  Conexión a base de datos cerrada')
        } catch (error) {
          logger.error('❌ Error cerrando conexión a base de datos:', error)
        }
        
        logger.info('✅ Servidor cerrado correctamente')
        process.exit(0)
      })
      
      // Forzar cierre después de 10 segundos
      setTimeout(() => {
        logger.error('⏰ Forzando cierre del servidor')
        process.exit(1)
      }, 10000)
    }

    // Escuchar señales de cierre
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))

    // Manejo de errores no capturados
    process.on('uncaughtException', (error) => {
      logger.error('❌ Excepción no capturada:', error)
      gracefulShutdown('uncaughtException')
    })

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('❌ Promise rejection no manejada:', reason)
      logger.error('Promise:', promise)
      gracefulShutdown('unhandledRejection')
    })

  } catch (error) {
    logger.error('❌ Error iniciando servidor:', error)
    process.exit(1)
  }
}

// ===================================
// INICIALIZAR SERVIDOR
// ===================================
startServer()