# 🏗️ Backend - Nueva Estructura por Casos de Uso

## 📁 Estructura Refactorizada

```
backend/src/
├── features/                       # 🆕 Organización por casos de uso
│   ├── shared/                     # Código compartido
│   │   ├── shared.repository.ts    # Repository base
│   │   └── shared.service.ts       # Service base
│   │
│   └── casos/                      # Todos los casos de uso
│       │
│       ├── horarios/               # ✅ CASO 1 - Patrones Horarios (MIGRADO)
│       │   ├── horarios.repository.ts
│       │   ├── horarios.service.ts
│       │   ├── horarios.controller.ts
│       │   └── horarios.routes.ts
│       │
│       ├── caducidad/              # ⏳ CASO 2 - Control Caducidad (PREPARADO)
│       │   ├── caducidad.repository.ts
│       │   ├── caducidad.service.ts
│       │   ├── caducidad.controller.ts
│       │   └── caducidad.routes.ts
│       │
│       ├── precios/                # ⏸️ CASO 3 - Futuro
│       ├── clientes/               # ⏸️ CASO 4 - Futuro
│       ├── inventario/             # ⏸️ CASO 5 - Futuro
│       ├── pagos/                  # ⏸️ CASO 6 - Futuro
│       └── devoluciones/           # ⏸️ CASO 7 - Futuro
│
├── routes/
│   ├── index.ts                    # 🔄 Router principal actualizado
│   └── api/
│       └── dashboard.routes.ts     # 🔴 Deprecated (mantener temporalmente)
│
├── middleware/
├── config/
├── utils/
├── app.ts
└── server.ts
```

## 🔄 Cambios Realizados

### ✅ 1. Estructura Base Compartida

**`features/shared/shared.repository.ts`**
- Clase base `SharedRepository` con PrismaClient
- Métodos compartidos: `checkDatabaseHealth()`, `getDateRange()`, `getDashboardMetrics()`

**`features/shared/shared.service.ts`**
- Clase base `SharedService` con logger
- Utilidades compartidas: `formatNumber()`, `calculateDailyAverage()`, `handleError()`

### ✅ 2. Caso de Uso: Horarios (Migrado)

#### Archivos creados:
- `features/casos/horarios/horarios.repository.ts` - Queries de patrones horarios
- `features/casos/horarios/horarios.service.ts` - Lógica de negocio
- `features/casos/horarios/horarios.controller.ts` - Controladores HTTP
- `features/casos/horarios/horarios.routes.ts` - Definición de rutas

#### Endpoints nuevos:
```
✅ GET /api/v1/casos/horarios/test
✅ GET /api/v1/casos/horarios/metrics
✅ GET /api/v1/casos/horarios/overview
✅ GET /api/v1/casos/horarios/analysis
✅ GET /api/v1/casos/horarios/transactions/summary
✅ GET /api/v1/casos/horarios/customers/segmentation
```

### ⏳ 3. Caso de Uso: Caducidad (Preparado)

#### Archivos creados:
- `features/casos/caducidad/caducidad.repository.ts` - Esqueleto con TODOs
- `features/casos/caducidad/caducidad.service.ts` - Estructura base
- `features/casos/caducidad/caducidad.controller.ts` - Controladores preparados
- `features/casos/caducidad/caducidad.routes.ts` - Rutas definidas

#### Endpoints preparados:
```
⏳ GET /api/v1/casos/caducidad/test
⏳ GET /api/v1/casos/caducidad/metrics
⏳ GET /api/v1/casos/caducidad/analysis
⏳ GET /api/v1/casos/caducidad/products/critical?days=7
⏳ GET /api/v1/casos/caducidad/recommendations
```

### 🔄 4. Router Principal Actualizado

**`routes/index.ts`**
- ✅ Mantiene `/api/v1/dashboard/*` para compatibilidad (deprecated)
- ✅ Añade `/api/v1/casos/horarios/*` (nueva estructura)
- ⏳ Prepara `/api/v1/casos/caducidad/*` (comentado hasta implementación)
- ⏸️ Documenta rutas futuras para otros casos

## 🎯 Patrón de Implementación

### Para cada caso de uso nuevo:

1. **Repository** (`*.repository.ts`)
   - Extiende `SharedRepository`
   - Implementa queries específicos del caso
   - Retorna datos formateados

2. **Service** (`*.service.ts`)
   - Extiende `SharedService`
   - Implementa lógica de negocio
   - Procesa datos del repository

3. **Controller** (`*.controller.ts`)
   - Maneja requests HTTP
   - Llama al service correspondiente
   - Retorna respuestas JSON

4. **Routes** (`*.routes.ts`)
   - Define endpoints REST
   - Asocia rutas con controllers

5. **Actualizar `routes/index.ts`**
   - Importar las nuevas rutas
   - Registrar en el router principal

## 📊 Ventajas de la Nueva Estructura

### ✅ Escalabilidad
- Cada caso de uso es independiente
- Fácil añadir nuevos casos sin afectar existentes

### ✅ Mantenibilidad
- Código organizado por dominio
- Fácil ubicar y modificar funcionalidad específica

### ✅ Reutilización
- Clases base compartidas evitan duplicación
- Utilidades comunes centralizadas

### ✅ Testabilidad
- Cada caso puede testearse independientemente
- Mock de dependencias más sencillo

### ✅ Claridad
- Estructura refleja casos de negocio
- Naming consistente y descriptivo

## 🔴 Deprecations

### Archivos deprecated (mantener temporalmente):
```
⚠️ controllers/dashboard.controller.ts
⚠️ services/dashboard.service.ts
⚠️ repositories/dashboard.repository.ts
⚠️ routes/api/dashboard.routes.ts
```

**Acción recomendada:**
- Mantener 1-2 sprints para migración de clientes
- Añadir warning logs indicando deprecación
- Documentar migración en changelog
- Eliminar después de confirmación de migración completa

## 🚀 Próximos Pasos

### Para CASO 2: Caducidad
1. ✅ Estructura creada
2. ⏳ Definir schema de inventario en Prisma
3. ⏳ Implementar queries en repository
4. ⏳ Implementar lógica en service
5. ⏳ Descomentar ruta en `routes/index.ts`
6. ⏳ Testing y validación

### Para CASOS 3-7: Futuros
Seguir mismo patrón que caducidad:
- Copiar estructura de `caducidad/` como template
- Renombrar archivos y clases
- Implementar lógica específica
- Registrar rutas

## 📝 Convenciones de Naming

### Archivos:
- `{caso}.repository.ts` - Data access layer
- `{caso}.service.ts` - Business logic layer
- `{caso}.controller.ts` - HTTP layer
- `{caso}.routes.ts` - Route definitions

### Clases:
- `{Caso}Repository extends SharedRepository`
- `{Caso}Service extends SharedService`
- `{Caso}Controller` (sin extends)

### Exports:
- Named export de la clase
- Default export de instancia singleton

### Rutas:
- `/api/v1/casos/{caso}/*` - Patrón estándar
- Métodos RESTful estándar (GET, POST, PUT, DELETE)

## 🧪 Testing

### Ejecutar tests:
```bash
npm run test
```

### Verificar compilación TypeScript:
```bash
npm run build
```

### Iniciar servidor:
```bash
npm run dev
```

## 📚 Documentación API

Una vez iniciado el servidor, acceder a:
```
GET http://localhost:3000/api
```

Retorna información completa de todos los endpoints disponibles.

---

**Última actualización:** October 3, 2025
**Versión:** 2.0.0 (Refactorización a casos de uso)
