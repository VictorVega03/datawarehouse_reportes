import { Router } from 'express'
import dashboardRoutes from './api/dashboard.routes'
import healthRoutes from './health.routes'

const router = Router()

// Health check routes
router.use('/health', healthRoutes)

// API v1 routes
router.use('/api/v1/dashboard', dashboardRoutes)

// API info endpoint
router.get('/api', (_req, res) => {
  try {
    console.log('📋 API info endpoint called')
    
    const apiInfo = {
      name: "Transaction Analytics Dashboard API",
      version: "v1",
      description: "API para dashboard de análisis de transacciones", 
      endpoints: {
        health: "/health",
        dashboard: "/api/v1/dashboard",
        test: "/api/v1/dashboard/test",
        metrics: "/api/v1/dashboard/metrics",
        overview: "/api/v1/dashboard/overview"
      },
      status: "active",
      database: "connected",
      port: process.env.PORT || 3001,
      cors: {
        enabled: true,
        origin: process.env.CORS_ORIGIN || "http://localhost:3000"
      }
    }

    res.status(200).json({
      success: true,
      data: apiInfo,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error in API info endpoint:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get API info',
      timestamp: new Date().toISOString()
    })
  }
})

// Root endpoint
router.get('/', (_req, res) => {
  try {
    console.log('🏠 Root endpoint called')
    
    const rootInfo = {
      message: "🚀 Transaction Analytics Dashboard API",
      version: "v1",
      status: "running",
      endpoints: {
        api_info: "/api",
        health: "/health",
        dashboard: "/api/v1/dashboard"
      },
      timestamp: new Date().toISOString()
    }

    res.status(200).json({
      success: true,
      data: rootInfo,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error in root endpoint:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    })
  }
})

// 404 handler for API routes
router.use('*', (req, res) => {
  console.log(`❌ 404 - Endpoint not found: ${req.method} ${req.originalUrl}`)
  
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    available_endpoints: [
      'GET /health',
      'GET /api',
      'GET /api/v1/dashboard',
      'GET /api/v1/dashboard/test',
      'GET /api/v1/dashboard/metrics',
      'GET /api/v1/dashboard/overview'
    ]
  })
})

export default router