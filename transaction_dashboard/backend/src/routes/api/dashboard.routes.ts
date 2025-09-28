import { Router } from 'express'
import { DashboardController } from '../../controllers/dashboard.controller'

const router = Router()
const dashboardController = new DashboardController()

// Test endpoint - Para verificar conexión
router.get('/test', async (req, res) => {
  await dashboardController.test(req, res)
})

// Main dashboard metrics - Métricas principales
router.get('/metrics', async (req, res) => {
  await dashboardController.getMetrics(req, res)
})

// Dashboard overview - Vista general
router.get('/overview', async (req, res) => {
  await dashboardController.getOverview(req, res)
})

// Transactions endpoints
router.get('/transactions/hourly', async (req, res) => {
  await dashboardController.getHourlyTransactions(req, res)
})

router.get('/transactions/summary', async (req, res) => {
  await dashboardController.getTransactionsSummary(req, res)
})

// Customer endpoints
router.get('/customers/segmentation', async (req, res) => {
  await dashboardController.getCustomerSegmentation(req, res)
})

// Debug endpoint - Lista todos los endpoints disponibles
router.get('/', async (_req, res) => {
  try {
    console.log('📋 Dashboard endpoints list requested')
    
    const endpoints = {
      available_endpoints: [
        {
          path: '/api/v1/dashboard/test',
          method: 'GET',
          description: 'Test API connection'
        },
        {
          path: '/api/v1/dashboard/metrics', 
          method: 'GET',
          description: 'Main dashboard metrics'
        },
        {
          path: '/api/v1/dashboard/overview',
          method: 'GET', 
          description: 'Dashboard overview data'
        },
        {
          path: '/api/v1/dashboard/transactions/hourly',
          method: 'GET',
          description: 'Hourly transaction analysis'
        },
        {
          path: '/api/v1/dashboard/transactions/summary',
          method: 'GET',
          description: 'Transaction summary data'
        },
        {
          path: '/api/v1/dashboard/customers/segmentation',
          method: 'GET',
          description: 'Customer segmentation data'
        }
      ],
      total_endpoints: 6,
      api_version: 'v1',
      status: 'active'
    }

    res.status(200).json({
      success: true,
      data: endpoints,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error listing dashboard endpoints:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to list endpoints',
      timestamp: new Date().toISOString()
    })
  }
})

export default router