# 🔄 GUÍA DE MIGRACIÓN PARA FRONTEND

## 🎯 Objetivo
Actualizar las llamadas API del frontend para usar la nueva estructura de rutas por casos de uso.

---

## 📋 CAMBIOS NECESARIOS EN FRONTEND

### 1️⃣ Actualizar URLs de API

#### ❌ ANTES (Deprecated)
```typescript
// services/api/client.ts
const BASE_URL = '/api/v1/dashboard'

// Llamadas antiguas
GET /api/v1/dashboard/metrics
GET /api/v1/dashboard/overview
GET /api/v1/dashboard/transactions/hourly
GET /api/v1/dashboard/transactions/summary
GET /api/v1/dashboard/customers/segmentation
```

#### ✅ DESPUÉS (Nueva estructura)
```typescript
// services/api/client.ts
const BASE_URL = '/api/v1/casos'

// Nuevas llamadas por caso de uso
GET /api/v1/casos/horarios/metrics
GET /api/v1/casos/horarios/overview
GET /api/v1/casos/horarios/analysis
GET /api/v1/casos/horarios/transactions/summary
GET /api/v1/casos/horarios/customers/segmentation
```

---

## 🔧 REFACTORIZACIÓN DEL FRONTEND

### Paso 1: Actualizar servicio API

**Archivo:** `frontend/src/services/api/client.ts`

```typescript
// ❌ ANTES
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const DASHBOARD_URL = `${API_BASE}/api/v1/dashboard`

export const getDashboardMetrics = async () => {
  const response = await fetch(`${DASHBOARD_URL}/metrics`)
  return response.json()
}

// ✅ DESPUÉS
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const CASOS_URL = `${API_BASE}/api/v1/casos`

export const getHorariosMetrics = async () => {
  const response = await fetch(`${CASOS_URL}/horarios/metrics`)
  return response.json()
}

export const getCaducidadMetrics = async () => {
  const response = await fetch(`${CASOS_URL}/caducidad/metrics`)
  return response.json()
}
```

---

### Paso 2: Actualizar hooks personalizados

**Archivo:** `frontend/src/hooks/api/useDashboardMetrics.ts`

#### ❌ ANTES
```typescript
// hooks/api/useDashboardMetrics.ts
import { useQuery } from '@tanstack/react-query'

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: async () => {
      const response = await fetch('/api/v1/dashboard/metrics')
      return response.json()
    }
  })
}
```

#### ✅ DESPUÉS - Renombrar y reorganizar
```typescript
// hooks/api/useHorariosData.ts (RENOMBRADO)
import { useQuery } from '@tanstack/react-query'

export const useHorariosMetrics = () => {
  return useQuery({
    queryKey: ['horarios', 'metrics'],
    queryFn: async () => {
      const response = await fetch('/api/v1/casos/horarios/metrics')
      return response.json()
    }
  })
}

export const useHorariosAnalysis = () => {
  return useQuery({
    queryKey: ['horarios', 'analysis'],
    queryFn: async () => {
      const response = await fetch('/api/v1/casos/horarios/analysis')
      return response.json()
    }
  })
}
```

---

### Paso 3: Refactorizar componentes

**Archivo:** `frontend/src/pages/PatronesHorariosPage.tsx`

#### ❌ ANTES
```typescript
import { useDashboardMetrics } from '../hooks/api/useDashboardMetrics'
import { useHourlyData } from '../hooks/api/useHourlyData'

export const PatronesHorariosPage = () => {
  const { data: metrics } = useDashboardMetrics()
  const { data: hourly } = useHourlyData()
  
  return (...)
}
```

#### ✅ DESPUÉS
```typescript
import { useHorariosMetrics, useHorariosAnalysis } from '@/features/casos/horarios/hooks/useHorariosData'

export const HorariosPage = () => {
  const { data: metrics } = useHorariosMetrics()
  const { data: analysis } = useHorariosAnalysis()
  
  return (...)
}
```

---

## 🗂️ NUEVA ESTRUCTURA DE FRONTEND (Recomendada)

```
frontend/src/
├── features/
│   └── casos/
│       │
│       ├── horarios/                    # CASO 1: Patrones Horarios
│       │   ├── hooks/
│       │   │   └── useHorariosData.ts   # ✅ Hook API específico
│       │   ├── components/
│       │   │   ├── HorariosChart.tsx    # Gráfico Nivo Bar
│       │   │   ├── HorariosTable.tsx    # Tabla de datos
│       │   │   └── HorariosMetrics.tsx  # Métricas cards
│       │   ├── pages/
│       │   │   └── HorariosPage.tsx     # Página principal
│       │   └── types.ts                 # Tipos específicos
│       │
│       ├── caducidad/                   # CASO 2: Control Caducidad
│       │   ├── hooks/
│       │   │   └── useCaducidadData.ts
│       │   ├── components/
│       │   │   ├── CaducidadPieChart.tsx
│       │   │   ├── CaducidadBarChart.tsx
│       │   │   ├── CriticalProductsTable.tsx
│       │   │   └── CaducidadMetrics.tsx
│       │   ├── pages/
│       │   │   └── CaducidadPage.tsx
│       │   └── types.ts
│       │
│       └── [otros casos]/
│
├── components/                          # Componentes compartidos
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── MainLayout.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── ...
│   └── shared/
│       └── MetricCard.tsx
│
├── services/
│   └── api/
│       └── client.ts                    # Cliente HTTP base
│
├── stores/                              # Zustand stores
│   ├── dashboardStore.ts
│   ├── filterStore.ts
│   └── uiStore.ts
│
└── App.tsx                              # Routing principal
```

---

## 📝 CHECKLIST DE MIGRACIÓN

### Backend (✅ COMPLETADO)
- [x] Crear estructura `features/casos/`
- [x] Migrar código a `horarios/`
- [x] Crear estructura para `caducidad/`
- [x] Actualizar routes/index.ts
- [x] Validar compilación TypeScript

### Frontend (⏳ PENDIENTE)
- [ ] Actualizar `services/api/client.ts`
- [ ] Renombrar `useDashboardMetrics.ts` → `useHorariosData.ts`
- [ ] Mover hook a `features/casos/horarios/hooks/`
- [ ] Actualizar imports en componentes
- [ ] Actualizar `PatronesHorariosPage.tsx`
- [ ] Mover componentes a `features/casos/horarios/components/`
- [ ] Actualizar stores si es necesario
- [ ] Testing de endpoints
- [ ] Validar funcionamiento completo

---

## 🔄 PLAN DE MIGRACIÓN GRADUAL

### Opción 1: Big Bang (Recomendado para proyectos pequeños)
```
1. Actualizar todos los endpoints de una vez
2. Probar exhaustivamente
3. Deploy
4. Eliminar código deprecated del backend
```

**Ventajas:** Rápido, limpio  
**Desventajas:** Mayor riesgo si falla

### Opción 2: Incremental (Recomendado para producción)
```
1. Mantener ambos endpoints (deprecated + nuevo)
2. Actualizar frontend por páginas/componentes
3. Monitorear uso de endpoints deprecated
4. Eliminar cuando uso llegue a 0%
5. Limpiar código deprecated
```

**Ventajas:** Menor riesgo, rollback fácil  
**Desventajas:** Más tiempo, código duplicado temporal

---

## 🧪 TESTING

### Backend
```bash
# Test endpoints nuevos
curl http://localhost:3000/api/v1/casos/horarios/test
curl http://localhost:3000/api/v1/casos/horarios/metrics
curl http://localhost:3000/api/v1/casos/horarios/analysis

# Verificar deprecated aún funciona
curl http://localhost:3000/api/v1/dashboard/metrics
```

### Frontend
```typescript
// Crear tests para nuevos hooks
describe('useHorariosData', () => {
  it('should fetch horarios metrics', async () => {
    const { result } = renderHook(() => useHorariosMetrics())
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
  })
})
```

---

## 📊 MAPEO DE ENDPOINTS

| Deprecated (❌)                                    | Nueva Ruta (✅)                                  | Status |
|---------------------------------------------------|--------------------------------------------------|--------|
| `/api/v1/dashboard/metrics`                       | `/api/v1/casos/horarios/metrics`                 | ✅     |
| `/api/v1/dashboard/overview`                      | `/api/v1/casos/horarios/overview`                | ✅     |
| `/api/v1/dashboard/transactions/hourly`           | `/api/v1/casos/horarios/analysis`                | ✅     |
| `/api/v1/dashboard/transactions/summary`          | `/api/v1/casos/horarios/transactions/summary`    | ✅     |
| `/api/v1/dashboard/customers/segmentation`        | `/api/v1/casos/horarios/customers/segmentation`  | ✅     |

---

## 🎯 EJEMPLO COMPLETO DE MIGRACIÓN

### Antes (Monolítico)
```typescript
// ❌ frontend/src/hooks/api/useDashboardMetrics.ts
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: async () => {
      const response = await fetch('/api/v1/dashboard/metrics')
      if (!response.ok) throw new Error('Failed')
      return response.json()
    }
  })
}

// ❌ frontend/src/pages/PatronesHorariosPage.tsx
import { useDashboardMetrics } from '../hooks/api/useDashboardMetrics'

export const PatronesHorariosPage = () => {
  const { data, isLoading } = useDashboardMetrics()
  
  if (isLoading) return <Spinner />
  
  return (
    <div>
      <h1>Patrones Horarios</h1>
      <MetricCard data={data} />
    </div>
  )
}
```

### Después (Modular por Casos)
```typescript
// ✅ frontend/src/features/casos/horarios/hooks/useHorariosData.ts
export const useHorariosMetrics = () => {
  return useQuery({
    queryKey: ['casos', 'horarios', 'metrics'],
    queryFn: async () => {
      const response = await fetch('/api/v1/casos/horarios/metrics')
      if (!response.ok) throw new Error('Failed to fetch horarios metrics')
      return response.json()
    }
  })
}

export const useHorariosAnalysis = () => {
  return useQuery({
    queryKey: ['casos', 'horarios', 'analysis'],
    queryFn: async () => {
      const response = await fetch('/api/v1/casos/horarios/analysis')
      if (!response.ok) throw new Error('Failed to fetch horarios analysis')
      return response.json()
    }
  })
}

// ✅ frontend/src/features/casos/horarios/pages/HorariosPage.tsx
import { useHorariosMetrics, useHorariosAnalysis } from '../hooks/useHorariosData'
import { HorariosChart } from '../components/HorariosChart'
import { HorariosMetrics } from '../components/HorariosMetrics'

export const HorariosPage = () => {
  const { data: metrics, isLoading: metricsLoading } = useHorariosMetrics()
  const { data: analysis, isLoading: analysisLoading } = useHorariosAnalysis()
  
  if (metricsLoading || analysisLoading) return <Spinner />
  
  return (
    <div className="horarios-page">
      <h1>Patrones Horarios</h1>
      <HorariosMetrics data={metrics} />
      <HorariosChart data={analysis} />
    </div>
  )
}
```

---

## 🚀 PRÓXIMOS PASOS

1. **Refactorizar Frontend**
   - Aplicar estructura de `features/casos/`
   - Migrar hooks y componentes
   - Actualizar rutas API

2. **Testing Completo**
   - Unit tests
   - Integration tests
   - E2E tests

3. **Documentación**
   - Actualizar README
   - Documentar nuevos endpoints
   - Crear guía para desarrolladores

4. **Deploy**
   - Backend primero (mantener compatibilidad)
   - Frontend después
   - Monitorear errores

5. **Limpieza**
   - Eliminar código deprecated
   - Remover endpoints antiguos
   - Actualizar dependencias

---

## 💡 CONSEJOS

### ✅ Mejores Prácticas
- Usar TypeScript strict mode
- Validar respuestas API con Zod o similar
- Implementar error boundaries
- Usar React Query para cache
- Implementar retry logic

### ⚠️ Evitar
- Mezclar llamadas deprecated y nuevas
- No validar tipos de respuesta
- No manejar errores
- Cache inconsistente

---

## 📞 SOPORTE

Si tienes dudas durante la migración:
1. Revisar `backend/REFACTORING.md`
2. Revisar `backend/ARCHITECTURE.md`
3. Verificar ejemplos en código
4. Consultar con el equipo

---

**Fecha:** October 3, 2025  
**Versión:** 2.0.0  
**Status:** 📝 Guía Lista - Implementación Pendiente
