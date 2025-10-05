// backend/src/routes/precios.routes.ts
import { Router } from 'express'
import { preciosController } from '../controllers/precios.controller'

const preciosRoutes = Router()

// Test route
preciosRoutes.get('/test', preciosController.testEndpoint)

// Métricas generales
preciosRoutes.get('/metrics', preciosController.getMetrics)

// Análisis completo
preciosRoutes.get('/analisis', preciosController.getAnalisisCompleto)

// Top productos con descuentos
preciosRoutes.get('/productos/top-descuentos', preciosController.getTopProductosDescuento)

// Categorías con descuentos
preciosRoutes.get('/categorias/descuentos', preciosController.getCategoriasDescuentos)

export { preciosRoutes }