import { Router } from 'express'

const router = Router()

// Basic health check
router.get('/', (req, res) => {
  try {
    console.log('🩺 Basic health check called')
    
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: "v1",
      node_version: process.version
    }

    res.status(200).json({
      success: true,
      data: health,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Health check failed:', error)
    res.status(500).json({
      success: false,
      status: "unhealthy",
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

// Detailed health check
router.get('/detailed', (req, res) => {
  try {
    console.log('🩺 Detailed health check called')
    
    const detailedHealth = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: Math.floor(process.uptime()),
        formatted: `${Math.floor(process.uptime() / 60)} minutes`
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      },
      system: {
        node_version: process.version,
        platform: process.platform,
        arch: process.arch,
        pid: process.pid
      },
      environment: {
        node_env: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 3001
      },
      api: {
        version: "v1",
        endpoints: [
          "/health",
          "/api/v1/dashboard/test",
          "/api/v1/dashboard/metrics"
        ]
      }
    }

    res.status(200).json({
      success: true,
      data: detailedHealth,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Detailed health check failed:', error)
    res.status(500).json({
      success: false,
      status: "unhealthy",
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

// Database health check (placeholder)
router.get('/database', (req, res) => {
  try {
    console.log('🗄️  Database health check called')
    
    // En una implementación real, aquí harías una query simple a la DB
    const dbHealth = {
      status: "connected",
      timestamp: new Date().toISOString(),
      connection: "postgresql",
      response_time: "< 100ms",
      tables: ["transactions", "customers", "products", "inventory_logs"]
    }

    res.status(200).json({
      success: true,
      data: dbHealth,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Database health check failed:', error)
    res.status(500).json({
      success: false,
      status: "disconnected",
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

export default router