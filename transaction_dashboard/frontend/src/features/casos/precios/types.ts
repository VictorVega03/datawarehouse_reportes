// frontend/src/features/casos/precios/types.ts

export interface PreciosMetrics {
  totalTransaccionesDetalle: number | string
  transaccionesConDescuento: number | string
  porcentajeConDescuento: number | string
  ingresosSinDescuento: number | string
  totalDescuentos: number | string
  ingresosNetos: number | string
  porcentajeDescuentoPromedio: number | string
}

export interface DistribucionDescuento {
  rangoDescuento: string
  numTransacciones: number | string
  valorSubtotal: number | string
  montoDescuentos: number | string
  promedioPorcentaje: number | string
}

export interface ProductoDescuento {
  productoId: number
  productName: string
  categoria: string | null
  vecesVendido: number | string
  cantidadTotal: number | string
  precioPromedio: number | string
  descuentoTotal: number | string
  porcentajeDescuentoPromedio: number | string
}

export interface CategoriaDescuento {
  categoria: string | null
  transacciones: number | string
  productosVendidos: number | string
  descuentosTotales: number | string
  ingresosNetos: number | string
  porcentajeDescuentoPromedio: number | string
}

export interface PreciosAnalisisData {
  metrics: PreciosMetrics
  distribucion: DistribucionDescuento[]
}