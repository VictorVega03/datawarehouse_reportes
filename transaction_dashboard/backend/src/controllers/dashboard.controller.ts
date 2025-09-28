import { Request, Response } from 'express'
import { DashboardService } from '../services/dashboard.service'

export class DashboardController {
  private dashboardService: DashboardService

  constructor() {
    this.dashboardService = new DashboardService()
  }

  // Test endpoint
  async test(_req: Request, res: Response) {
    try {
      const testData = {
        success: true,
        message: "Backend API funcionando correctamente",
        timestamp: new Date().toISOString(),
        version: "v1",
        endpoints: [
          "/api/v1/dashboard/test",
          "/api/v1/dashboard/metrics", 
          "/api/v1/dashboard/overview",
          "/api/v1/dashboard/transactions/hourly",
          "/api/v1/dashboard/transactions/summary",
          "/api/v1/dashboard/customers/segmentation"
        ],
        status: {
          database: "connected",
          server: "running",
          port: process.env.PORT || 3001
        }
      }

      console.log('📡 Test endpoint called - returning test data')
      
      res.status(200).json({
        success: true,
        data: testData,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('❌ Error in test endpoint:', error)
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    }
  }

  // Dashboard metrics
  async getMetrics(_req: Request, res: Response) {
    try {
      const metrics = await this.dashboardService.getDashboardMetrics()
      
      console.log('📊 Metrics endpoint called - returning dashboard metrics')
      
      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('❌ Error getting dashboard metrics:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to get dashboard metrics',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    }
  }

  // Dashboard overview
  async getOverview(_req: Request, res: Response) {
    try {
      const overview = await this.dashboardService.getDashboardOverview()
      
      console.log('📈 Overview endpoint called - returning dashboard overview')
      
      res.status(200).json({
        success: true,
        data: overview,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('❌ Error getting dashboard overview:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to get dashboard overview',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    }
  }

  // Hourly transactions
  async getHourlyTransactions(_req: Request, res: Response) {
    try {
      const hourlyData = await this.dashboardService.getHourlyTransactions()
      
      console.log('⏰ Hourly transactions endpoint called')
      
      res.status(200).json({
        success: true,
        data: hourlyData,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('❌ Error getting hourly transactions:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to get hourly transactions',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    }
  }

  // Transactions summary  
  async getTransactionsSummary(_req: Request, res: Response) {
    try {
      const summary = await this.dashboardService.getTransactionsSummary()
      
      console.log('📋 Transactions summary endpoint called')
      
      res.status(200).json({
        success: true,
        data: summary,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('❌ Error getting transactions summary:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to get transactions summary',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    }
  }

  // Customer segmentation
  async getCustomerSegmentation(_req: Request, res: Response) {
    try {
      const segmentation = await this.dashboardService.getCustomerSegmentation()
      
      console.log('👥 Customer segmentation endpoint called')
      
      res.status(200).json({
        success: true,
        data: segmentation,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('❌ Error getting customer segmentation:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to get customer segmentation',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    }
  }
}