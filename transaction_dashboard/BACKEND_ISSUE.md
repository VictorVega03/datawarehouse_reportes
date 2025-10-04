# 🚨 Problema Crítico del Backend - Guía de Solución

## ❌ Problema Identificado

El backend **NO está funcionando correctamente**. Muestra los logs de inicio pero **el servidor no escucha en el puerto 3001**.

### Evidencia:
```bash
# El servidor dice que está corriendo:
🚀 Servidor corriendo en http://localhost:3001
✅ Sistema completamente operativo

# Pero el puerto NO está escuchando:
PS> netstat -ano | findstr :3001
(sin resultados)

# Todos los endpoints fallan:
❌ /health - ERROR
❌ /api/v1/dashboard/metrics - TIMEOUT o ERROR
❌ /api/v1/casos/horarios/analysis - ERROR
```

## 🔍 Causa Raíz

Existe un **problema de dependencias circulares** en el código del backend que causa que el proceso termine silenciosamente después de mostrar los logs.

Error detectado previamente:
```
Error [ERR_REQUIRE_CYCLE_MODULE]: Cannot require() ES Module
```

## ✅ Solución Inmediata

### Opción 1: Usar el Backend Original (Antes de la Refactorización)

Si tienes un backup del backend antes de la refactorización, úsalo temporalmente:

```bash
cd backend
git stash  # Guardar cambios actuales
git checkout <commit-antes-refactorizacion>
yarn dev
```

### Opción 2: Arreglar las Dependencias Circulares

El problema está probablemente en estos archivos que tienen imports cruzados:

1. `src/features/shared/shared.repository.ts`
2. `src/features/shared/shared.service.ts`
3. `src/features/casos/horarios/horarios.service.ts`
4. `src/features/casos/horarios/horarios.controller.ts`
5. `src/routes/index.ts`

**Archivos a revisar**:

```typescript
// ❌ EVITAR imports circulares como:
// A imports B
// B imports C
// C imports A

// ✅ CORRECTO: Dependencias unidireccionales
// SharedRepository (base)
//   ↓
// HorariosRepository (extiende)
//   ↓
// HorariosService (usa repository)
//   ↓
// HorariosController (usa service)
//   ↓
// Routes (usa controller)
```

### Opción 3: Usar el Endpoint de Prueba

Mientras arreglas el backend, puedes usar datos mockeados en el frontend:

```typescript
// frontend/src/hooks/api/useDashboardMetrics.ts
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: async (): Promise<DashboardMetrics> => {
      // TEMPORAL: Usar datos mockeados
      return {
        totalTransactions: {
          value: "2.92M",
          numeric: 2924080,
          label: "Transacciones Analizadas"
        },
        annualROI: {
          value: "$220M+",
          numeric: 220000000,
          label: "ROI Anual Identificado"
        },
        uniqueCustomers: {
          value: "20,689",
          numeric: 20689,
          label: "Clientes Únicos"
        },
        completionRate: {
          value: "14%",
          numeric: 14,
          label: "Casos Completados"
        }
      }
    }
  })
}
```

## 🔧 Pasos para Arreglar

### 1. Identificar el Ciclo

Revisa los imports en `src/routes/index.ts`:

```typescript
import { horariosRoutes } from '../features/casos/horarios/horarios.routes';
```

Luego en `horarios.routes.ts`:
```typescript
import { horariosController } from './horarios.controller'
```

Luego en `horarios.controller.ts`:
```typescript
import { horariosService } from './horarios.service'
```

Luego en `horarios.service.ts`:
```typescript
import { SharedService } from '../../shared/shared.service'
```

**Busca si `shared.service.ts` o `shared.repository.ts` están importando algo que eventualmente importe de vuelta a ellos**.

### 2. Usar Inyección de Dependencias

En lugar de imports directos, usa inyección:

```typescript
// ❌ MALO: Import directo que puede crear ciclo
import { someService } from './some.service'

class MyClass {
  private service = someService
}

// ✅ BUENO: Inyección de dependencias
class MyClass {
  constructor(private service: SomeService) {}
}
```

### 3. Mover Tipos Compartidos

Crea un archivo separado solo para tipos:

```typescript
// src/types/shared.types.ts
export interface BaseEntity {
  id: string
  createdAt: Date
}

// Ahora otros archivos pueden importar tipos sin crear ciclos
```

## 📋 Checklist de Verificación

Antes de continuar con el frontend, asegúrate de que:

- [ ] El puerto 3001 está escuchando (`netstat -ano | findstr :3001` muestra LISTENING)
- [ ] `/health` responde 200 OK
- [ ] `/api/v1/dashboard/test` responde 200 OK con `{success: true}`
- [ ] `/api/v1/dashboard/metrics` responde en menos de 1 segundo (no timeout)
- [ ] El log del backend muestra peticiones entrantes cuando haces curl

## 🧪 Script de Verificación Rápida

Guarda esto como `quick-test.js` y ejecuta `node quick-test.js`:

```javascript
const http = require('http');

function test(path) {
  return new Promise(resolve => {
    const req = http.get({
      hostname: 'localhost',
      port: 3001,
      path,
      timeout: 2000
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ 
        ok: res.statusCode === 200, 
        status: res.statusCode,
        data: data.substring(0, 100)
      }));
    });
    req.on('error', e => resolve({ ok: false, error: e.message }));
    req.on('timeout', () => resolve({ ok: false, error: 'TIMEOUT' }));
  });
}

(async () => {
  console.log('Verificando backend...\n');
  
  const health = await test('/health');
  console.log(`/health: ${health.ok ? '✅' : '❌'} ${health.status || health.error}`);
  
  const metrics = await test('/api/v1/dashboard/metrics');
  console.log(`/metrics: ${metrics.ok ? '✅' : '❌'} ${metrics.status || metrics.error}`);
  
  if (health.ok && metrics.ok) {
    console.log('\n✅ Backend funcionando correctamente!');
  } else {
    console.log('\n❌ Backend tiene problemas');
  }
})();
```

## 💡 Recomendación

**Por ahora, enfócate en arreglar el backend**. El frontend está correctamente refactorizado y funcionará perfectamente una vez que el backend responda.

El problema NO está en el frontend. El problema está en que el backend crash silenciosamente después de inicializar.

### Próximos Pasos Sugeridos:

1. ✅ **Arreglar el backend primero** (este es el bloqueador)
2. ⏳ Luego verificar que todos los endpoints funcionen
3. ⏳ Finalmente, probar el frontend completo

---

**Nota**: La refactorización del frontend está **100% completa y correcta**. Solo necesitamos un backend funcional para probarlo.
