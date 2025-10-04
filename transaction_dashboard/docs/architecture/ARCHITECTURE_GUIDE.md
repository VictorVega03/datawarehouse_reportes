# 📁 Arquitectura de Features - Guía de Estructura

## 🎯 Propósito

Este documento define la estructura estándar de carpetas para implementar nuevos casos de uso (features) en el proyecto Transaction Dashboard, garantizando consistencia entre frontend y backend.

---

## 🏗️ Estructura General

### Backend Structure
```
backend/src/
├── controllers/          # Controladores por feature
│   ├── [feature].controller.ts
│   └── ...
├── services/            # Servicios por feature
│   ├── [feature].service.ts
│   └── ...
├── repositories/        # Repositorios por feature
│   ├── [feature].repository.ts
│   └── ...
├── routes/             # Rutas por feature
│   ├── [feature].routes.ts
│   └── index.ts
├── shared/             # Código compartido entre features
│   ├── shared.repository.ts
│   └── shared.service.ts
├── utils/              # Utilidades generales
│   └── logger.ts
├── config/             # Configuraciones
├── middleware/         # Middlewares globales
└── jobs/              # Tareas programadas
```

### Frontend Structure
```
frontend/src/
├── features/           # Features organizados por dominio
│   ├── dashboard/      # Dashboard principal
│   ├── casos/          # Casos de uso de negocio
│   │   ├── [caso-uso]/
│   │   └── ...
│   └── shared/         # Código compartido entre features
├── components/         # Componentes UI globales reutilizables
│   ├── ui/            # Componentes base (Button, Card, etc)
│   ├── layout/        # Componentes de layout
│   ├── charts/        # Componentes de gráficos
│   └── tables/        # Componentes de tablas
├── hooks/             # Hooks globales
├── services/          # Servicios API globales
├── stores/            # State management global
├── utils/             # Utilidades globales
└── styles/            # Estilos globales
```

---

## 📦 Estructura Detallada de un Feature

### 1. Backend Feature Structure

```
backend/src/
├── controllers/
│   └── [feature].controller.ts         # 🎮 Controlador del feature
├── services/
│   └── [feature].service.ts            # 💼 Lógica de negocio
├── repositories/
│   └── [feature].repository.ts         # 🗄️ Acceso a datos
└── routes/
    └── [feature].routes.ts             # 🛣️ Definición de rutas
```

#### Ejemplo: Feature "Dashboard"
```
backend/src/
├── controllers/
│   └── dashboard.controller.ts
├── services/
│   └── dashboard.service.ts
├── repositories/
│   └── dashboard.repository.ts
└── routes/
    └── dashboard.routes.ts
```

#### Ejemplo: Feature "Caducidad" (Caso de Uso)
```
backend/src/
├── controllers/
│   └── caducidad.controller.ts
├── services/
│   └── caducidad.service.ts
├── repositories/
│   └── caducidad.repository.ts
└── routes/
    └── caducidad.routes.ts
```

### 2. Frontend Feature Structure

```
frontend/src/features/[feature]/
├── components/              # 🧩 Componentes específicos del feature
│   ├── [Component1].tsx
│   ├── [Component2].tsx
│   └── index.ts            # Barrel export
├── hooks/                  # 🪝 Custom hooks del feature
│   ├── use[Feature]Data.ts
│   └── index.ts
├── pages/                  # 📄 Páginas del feature
│   └── [Feature]Page.tsx
├── types.ts               # 📝 Tipos TypeScript del feature
└── index.ts               # 📦 Barrel export principal
```

#### Ejemplo Completo: Feature "Dashboard"
```
frontend/src/features/dashboard/
├── components/
│   ├── DashboardStats.tsx
│   ├── QuickActions.tsx
│   └── index.ts
├── hooks/
│   ├── useDashboardMetrics.ts
│   └── index.ts
├── pages/
│   └── DashboardHomePage.tsx
├── types.ts
└── index.ts
```

#### Ejemplo Completo: Caso de Uso "Horarios"
```
frontend/src/features/casos/horarios/
├── components/
│   ├── HorariosChart.tsx
│   ├── HorariosMetrics.tsx
│   ├── HorariosTable.tsx
│   └── index.ts
├── hooks/
│   ├── useHorariosData.ts
│   └── index.ts
├── pages/
│   └── HorariosPage.tsx
├── types.ts
└── index.ts
```

#### Ejemplo Completo: Caso de Uso "Caducidad"
```
frontend/src/features/casos/caducidad/
├── components/
│   ├── CaducidadBarChart.tsx
│   ├── CaducidadMetrics.tsx
│   ├── CriticalProductsTable.tsx
│   └── index.ts
├── hooks/
│   ├── useCaducidadData.ts
│   └── index.ts
├── pages/
│   └── CaducidadPage.tsx
├── types.ts
└── index.ts
```

---

## 🔧 Convenciones de Nomenclatura

### Backend

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| Controller | `[feature].controller.ts` | `dashboard.controller.ts` |
| Service | `[feature].service.ts` | `horarios.service.ts` |
| Repository | `[feature].repository.ts` | `caducidad.repository.ts` |
| Routes | `[feature].routes.ts` | `precios.routes.ts` |

### Frontend

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| Feature Folder | `[feature]/` o `casos/[caso-uso]/` | `dashboard/`, `casos/horarios/` |
| Component | `[Feature][Component].tsx` | `HorariosChart.tsx` |
| Hook | `use[Feature][Action].ts` | `useHorariosData.ts` |
| Page | `[Feature]Page.tsx` | `CaducidadPage.tsx` |
| Types | `types.ts` | `types.ts` |
| Barrel Export | `index.ts` | `index.ts` |

---

## 📝 Contenido de Archivos Clave

### 1. Backend Controller Template

```typescript
// backend/src/controllers/[feature].controller.ts
import { Request, Response } from 'express'
import { logger } from '../utils/logger'
import { [feature]Service } from '../services/[feature].service'

class [Feature]Controller {
  // Test endpoint
  testEndpoint = async (_req: Request, res: Response) => {
    try {
      logger.info('🧪 [Feature] test endpoint called')
      
      res.status(200).json({
        success: true,
        message: '🎉 [Feature] API funcionando correctamente!',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      logger.error('❌ [Feature] test endpoint error:', error)
      res.status(500).json({
        success: false,
        error: 'Error en endpoint de prueba'
      })
    }
  }

  // Implementar métodos específicos del feature aquí
}

export const [feature]Controller = new [Feature]Controller()
```

### 2. Backend Service Template

```typescript
// backend/src/services/[feature].service.ts
import { SharedService } from '../shared/shared.service'
import { [feature]Repository } from '../repositories/[feature].repository'

export class [Feature]Service extends SharedService {
  constructor() {
    super()
    this.logger.info('[Feature]Service initialized')
  }

  // Implementar métodos de lógica de negocio aquí
}

export const [feature]Service = new [Feature]Service()
```

### 3. Backend Repository Template

```typescript
// backend/src/repositories/[feature].repository.ts
import { SharedRepository } from '../shared/shared.repository'

export class [Feature]Repository extends SharedRepository {
  
  // Implementar queries específicas aquí
  
  async testConnection() {
    try {
      const result = await this.prisma.$queryRaw`SELECT NOW() as now`
      return {
        message: '[Feature] repository connection OK',
        timestamp: result[0].now
      }
    } catch (error) {
      console.error('Error in testConnection:', error)
      throw new Error('Database connection failed')
    }
  }
}

export const [feature]Repository = new [Feature]Repository()
```

### 4. Backend Routes Template

```typescript
// backend/src/routes/[feature].routes.ts
import { Router } from 'express'
import { [feature]Controller } from '../controllers/[feature].controller'

const [feature]Routes = Router()

// Test route
[feature]Routes.get('/test', [feature]Controller.testEndpoint)

// Implementar rutas específicas aquí

export { [feature]Routes }
```

### 5. Frontend types.ts Template

```typescript
// frontend/src/features/[feature]/types.ts

export interface [Feature]Data {
  // Definir tipos de datos aquí
}

export interface [Feature]Metrics {
  // Definir tipos de métricas aquí
}

// Otros tipos necesarios...
```

### 6. Frontend Hook Template

```typescript
// frontend/src/features/[feature]/hooks/use[Feature]Data.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import apiClient from '../../../services/api/client'
import type { [Feature]Data } from '../types'

export const use[Feature]Data = (): UseQueryResult<[Feature]Data, Error> => {
  return useQuery({
    queryKey: ['[feature]', 'data'],
    queryFn: async (): Promise<[Feature]Data> => {
      const response = await apiClient.get('/casos/[feature]/data')
      if (!response.data.success) {
        throw new Error('Failed to fetch [feature] data')
      }
      return response.data.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
```

### 7. Frontend index.ts Template

```typescript
// frontend/src/features/[feature]/index.ts

// Pages
export { [Feature]Page } from './pages/[Feature]Page'

// Components
export * from './components'

// Hooks
export * from './hooks/use[Feature]Data'

// Types
export type * from './types'
```

### 8. Frontend Page Template

```typescript
// frontend/src/features/[feature]/pages/[Feature]Page.tsx
import React from 'react'
import { use[Feature]Data } from '../hooks/use[Feature]Data'
import { Card } from '../../../components/ui/Card'
import { Spinner } from '../../../components/ui/Spinner'

export const [Feature]Page: React.FC = () => {
  const { data, isLoading, isError } = use[Feature]Data()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" />
      </div>
    )
  }

  if (isError) {
    return (
      <Card padding="lg">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900">
            Error al cargar datos
          </h2>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">
        [Feature Name]
      </h1>
      
      {/* Implementar contenido aquí */}
    </div>
  )
}
```

---

## 🛣️ Configuración de Rutas

### Backend: routes/index.ts

```typescript
import { Router } from 'express'
import { [feature]Routes } from './[feature].routes'

const router = Router()

const apiPrefix = process.env.API_PREFIX || '/api'
const apiVersion = process.env.API_VERSION || 'v1'

// Feature routes
router.use(`${apiPrefix}/${apiVersion}/[feature]`, [feature]Routes)

// Para casos de uso
router.use(`${apiPrefix}/${apiVersion}/casos/[caso-uso]`, [casoUso]Routes)

export { router }
```

### Frontend: router.tsx

```typescript
import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { [Feature]Page } from './features/[feature]'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Feature routes
      {
        path: '[feature]',
        element: <[Feature]Page />,
      },
      // Casos de uso routes
      {
        path: 'casos/[caso-uso]',
        element: <[CasoUso]Page />,
      },
    ],
  },
])
```

---

## ✅ Checklist para Nuevo Feature

### Backend

- [ ] Crear `[feature].controller.ts` con métodos necesarios
- [ ] Crear `[feature].service.ts` con lógica de negocio
- [ ] Crear `[feature].repository.ts` con queries
- [ ] Crear `[feature].routes.ts` con definición de rutas
- [ ] Registrar rutas en `routes/index.ts`
- [ ] Agregar test endpoint para verificar conectividad
- [ ] Implementar manejo de errores consistente
- [ ] Agregar logging apropiado

### Frontend

- [ ] Crear carpeta `features/[feature]/` o `features/casos/[caso-uso]/`
- [ ] Crear subcarpetas: `components/`, `hooks/`, `pages/`
- [ ] Crear `types.ts` con todas las interfaces necesarias
- [ ] Crear hooks personalizados en `hooks/`
- [ ] Crear componentes específicos en `components/`
- [ ] Crear página principal en `pages/[Feature]Page.tsx`
- [ ] Crear `index.ts` para barrel exports
- [ ] Registrar ruta en `router.tsx`
- [ ] Agregar link de navegación en sidebar si aplica
- [ ] Implementar loading y error states
- [ ] Usar componentes UI consistentes

---

## 🎨 Casos de Uso Implementados

### ✅ Dashboard (Completado)
```
Backend:  src/controllers/dashboard.controller.ts
          src/services/dashboard.service.ts
          src/repositories/dashboard.repository.ts
          src/routes/dashboard.routes.ts

Frontend: src/features/dashboard/
          ├── components/
          ├── hooks/
          ├── pages/DashboardHomePage.tsx
          ├── types.ts
          └── index.ts

Ruta:     /
API:      /api/v1/dashboard/*
```

### ✅ Caso 1: Patrones Horarios (Completado)
```
Backend:  src/controllers/horarios.controller.ts
          src/services/horarios.service.ts
          src/repositories/horarios.repository.ts
          src/routes/horarios.routes.ts

Frontend: src/features/casos/horarios/
          ├── components/
          │   ├── HorariosChart.tsx
          │   ├── HorariosMetrics.tsx
          │   └── HorariosTable.tsx
          ├── hooks/
          │   └── useHorariosData.ts
          ├── pages/
          │   └── HorariosPage.tsx
          ├── types.ts
          └── index.ts

Ruta:     /casos/horarios
API:      /api/v1/casos/horarios/*
ROI:      $6.7M
```

### 🟡 Caso 2: Control de Caducidad (En Progreso)
```
Backend:  src/controllers/caducidad.controller.ts
          src/services/caducidad.service.ts
          src/repositories/caducidad.repository.ts
          src/routes/caducidad.routes.ts

Frontend: src/features/casos/caducidad/
          ├── components/
          │   ├── CaducidadBarChart.tsx
          │   ├── CaducidadMetrics.tsx
          │   └── CriticalProductsTable.tsx
          ├── hooks/
          │   └── useCaducidadData.ts
          ├── pages/
          │   └── CaducidadPage.tsx
          ├── types.ts
          └── index.ts

Ruta:     /casos/caducidad
API:      /api/v1/casos/caducidad/*
ROI:      $2.1M - $3.8M
```

---

## 🚀 Casos de Uso Futuros (Plantilla)

### Caso 3: Gestión de Precios
```
Backend:  src/controllers/precios.controller.ts
          src/services/precios.service.ts
          src/repositories/precios.repository.ts
          src/routes/precios.routes.ts

Frontend: src/features/casos/precios/
          ├── components/
          ├── hooks/
          ├── pages/PreciosPage.tsx
          ├── types.ts
          └── index.ts

Ruta:     /casos/precios
API:      /api/v1/casos/precios/*
ROI:      $150M
```

### Caso 4: Identificación de Clientes
```
Backend:  src/controllers/clientes.controller.ts
Frontend: src/features/casos/clientes/
Ruta:     /casos/clientes
API:      /api/v1/casos/clientes/*
ROI:      $1.35B
```

### Caso 5: Seguimiento de Inventario
```
Backend:  src/controllers/inventario.controller.ts
Frontend: src/features/casos/inventario/
Ruta:     /casos/inventario
API:      /api/v1/casos/inventario/*
ROI:      $56.3M
```

### Caso 6: Métodos de Pago
```
Backend:  src/controllers/pagos.controller.ts
Frontend: src/features/casos/pagos/
Ruta:     /casos/pagos
API:      /api/v1/casos/pagos/*
ROI:      Control de Riesgos
```

### Caso 7: Control de Devoluciones
```
Backend:  src/controllers/devoluciones.controller.ts
Frontend: src/features/casos/devoluciones/
Ruta:     /casos/devoluciones
API:      /api/v1/casos/devoluciones/*
ROI:      $1.13B
```

---

## 💡 Mejores Prácticas

### General
1. ✅ Mantener consistencia entre backend y frontend
2. ✅ Usar nombres descriptivos y en español para features de negocio
3. ✅ Cada feature debe ser autocontenido
4. ✅ Compartir código común en `shared/`
5. ✅ Documentar cambios en archivos MD

### Backend
1. ✅ Heredar de `SharedRepository` y `SharedService`
2. ✅ Usar logger para todas las operaciones importantes
3. ✅ Implementar manejo de errores consistente
4. ✅ Incluir endpoint de test en cada feature
5. ✅ Exportar instancias singleton

### Frontend
1. ✅ Usar TanStack Query para data fetching
2. ✅ Implementar loading y error states
3. ✅ Componentes reutilizables en `/components/`
4. ✅ Componentes específicos en `features/[feature]/components/`
5. ✅ Barrel exports con `index.ts`
6. ✅ Tipos TypeScript centralizados en `types.ts`

---

## 📚 Referencias

- **Arquitectura Backend**: `backend/src/`
- **Arquitectura Frontend**: `frontend/src/features/`
- **Documentación de Refactorización**: `frontend/REFACTORING_DASHBOARD.md`
- **Documentación de Limpieza**: `frontend/CLEANUP_PAGES.md`
- **Análisis Completo**: `frontend/ANALYSIS_COMPLETE.md`

---

**Última actualización:** 4 de octubre, 2025  
**Mantenido por:** Equipo de Desarrollo  
**Versión:** 1.0.0
