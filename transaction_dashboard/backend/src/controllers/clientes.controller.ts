import { Request, Response } from 'express'
import { clientesService } from '../services/clientes.service'

// ===================================
// SINGLETON CONTROLLER
// ===================================

class ClientesController {
  private static instance: ClientesController

  private constructor() {}

  public static getInstance(): ClientesController {
    if (!ClientesController.instance) {
      ClientesController.instance = new ClientesController()
    }
    return ClientesController.instance
  }

  // ===================================
  // 1. TEST ENDPOINT
  // ===================================
  testEndpoint = async (_req: Request, res: Response): Promise<void> => {
    try {
      res.json({
        success: true,
        message: 'Clientes API funcionando correctamente',
        caso: 'Identificación de Clientes (Caso 4)',
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error en test endpoint',
        error: error.message
      })
    }
  }

  // ===================================
  // 2. MÉTRICAS PRINCIPALES
  // ===================================
  getMetrics = async (_req: Request, res: Response): Promise<void> => {
    try {
      const metrics = await clientesService.getMetrics()

      res.json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      console.error('Error en getMetrics:', error)
      res.status(500).json({
        success: false,
        message: 'Error al obtener métricas de clientes',
        error: error.message
      })
    }
  }

  // ===================================
  // 3. VISTA GENERAL COMPLETA
  // ===================================
  getOverview = async (_req: Request, res: Response): Promise<void> => {
    try {
      const overview = await clientesService.getOverview()

      res.json({
        success: true,
        data: overview,
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      console.error('Error en getOverview:', error)
      res.status(500).json({
        success: false,
        message: 'Error al obtener vista general de clientes',
        error: error.message
      })
    }
  }

  // ===================================
  // 4. DISTRIBUCIÓN (Identificados vs Anónimos)
  // ===================================
  getDistribution = async (_req: Request, res: Response): Promise<void> => {
    try {
      const distribution = await clientesService.getDistribution()

      res.json({
        success: true,
        data: distribution,
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      console.error('Error en getDistribution:', error)
      res.status(500).json({
        success: false,
        message: 'Error al obtener distribución de clientes',
        error: error.message
      })
    }
  }

  // ===================================
  // 5. TOP CLIENTES
  // ===================================
  getTopClientes = async (req: Request, res: Response): Promise<void> => {
    try {
      const type = (req.query.type as 'frequency' | 'value') || 'frequency'
      const limit = parseInt(req.query.limit as string) || 20

      const topClientes = await clientesService.getTopClientes(type, limit)

      res.json({
        success: true,
        data: topClientes,
        meta: { type, limit },
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      console.error('Error en getTopClientes:', error)
      res.status(500).json({
        success: false,
        message: 'Error al obtener top clientes',
        error: error.message
      })
    }
  }

  // ===================================
  // 6. SEGMENTACIÓN
  // ===================================
  getSegmentation = async (_req: Request, res: Response): Promise<void> => {
    try {
      const segmentation = await clientesService.getSegmentation()

      res.json({
        success: true,
        data: segmentation,
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      console.error('Error en getSegmentation:', error)
      res.status(500).json({
        success: false,
        message: 'Error al obtener segmentación de clientes',
        error: error.message
      })
    }
  }

  // ===================================
  // 7. ANÁLISIS DE RECENCIA
  // ===================================
  getRecencyAnalysis = async (_req: Request, res: Response): Promise<void> => {
    try {
      const recency = await clientesService.getRecencyAnalysis()

      res.json({
        success: true,
        data: recency,
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      console.error('Error en getRecencyAnalysis:', error)
      res.status(500).json({
        success: false,
        message: 'Error al obtener análisis de recencia',
        error: error.message
      })
    }
  }

  // ===================================
  // 8. DISTRIBUCIÓN POR RANGO DE GASTO
  // ===================================
  getSpendingRanges = async (_req: Request, res: Response): Promise<void> => {
    try {
      const ranges = await clientesService.getSpendingRanges()

      res.json({
        success: true,
        data: ranges,
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      console.error('Error en getSpendingRanges:', error)
      res.status(500).json({
        success: false,
        message: 'Error al obtener rangos de gasto',
        error: error.message
      })
    }
  }
}

// ===================================
// EXPORT SINGLETON
// ===================================
export const clientesController = ClientesController.getInstance()