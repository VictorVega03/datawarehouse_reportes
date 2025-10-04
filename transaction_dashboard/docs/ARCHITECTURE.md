# 🏗️ ARQUITECTURA DEL BACKEND - Diagrama Visual

## 📐 Estructura de Capas

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Frontend)                        │
│                     React + TypeScript + Vite                    │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP REST API
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      🔄 API GATEWAY LAYER                        │
│                    routes/index.ts (Router)                      │
├─────────────────────────────────────────────────────────────────┤
│  /api/v1/casos/horarios/*      ✅ ACTIVO                        │
│  /api/v1/casos/caducidad/*     ⏳ PREPARADO                     │
│  /api/v1/casos/precios/*       ⏸️ FUTURO                        │
│  /api/v1/casos/clientes/*      ⏸️ FUTURO                        │
│  /api/v1/casos/inventario/*    ⏸️ FUTURO                        │
│  /api/v1/casos/pagos/*         ⏸️ FUTURO                        │
│  /api/v1/casos/devoluciones/*  ⏸️ FUTURO                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│               🎯 FEATURES LAYER (Casos de Uso)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  📦 features/shared/  (Código Compartido)                │  │
│  │  ├─ SharedRepository (Base para todos los repos)         │  │
│  │  └─ SharedService (Base para todos los services)         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ✅ features/casos/horarios/ (Patrones Horarios)         │  │
│  │                                                           │  │
│  │  ┌────────────────┐  ┌────────────────┐                 │  │
│  │  │   Controller   │  │    Service     │                 │  │
│  │  │    (HTTP)      │─▶│  (Business)    │                 │  │
│  │  └────────────────┘  └───────┬────────┘                 │  │
│  │         ▲                    │                           │  │
│  │         │                    ▼                           │  │
│  │  ┌────────────────┐  ┌────────────────┐                 │  │
│  │  │     Routes     │  │  Repository    │                 │  │
│  │  │   (Endpoints)  │  │   (Data)       │                 │  │
│  │  └────────────────┘  └────────────────┘                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ⏳ features/casos/caducidad/ (Control Caducidad)        │  │
│  │  ├─ caducidad.controller.ts  (⏳ Preparado)              │  │
│  │  ├─ caducidad.service.ts     (⏳ Preparado)              │  │
│  │  ├─ caducidad.repository.ts  (⏳ Preparado)              │  │
│  │  └─ caducidad.routes.ts      (⏳ Preparado)              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ⏸️ features/casos/[otros]/ (Futuros)                    │  │
│  │  precios, clientes, inventario, pagos, devoluciones      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    💾 DATA ACCESS LAYER                          │
│                        Prisma Client                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      🗄️ DATABASE LAYER                          │
│                      PostgreSQL 14+                              │
│                   (transactions, inventory)                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos (Ejemplo: GET /api/v1/casos/horarios/analysis)

```
1. 📥 CLIENT REQUEST
   ↓
   GET /api/v1/casos/horarios/analysis
   
2. 🚪 ROUTER (routes/index.ts)
   ↓
   router.use('/api/v1/casos/horarios', horariosRoutes)
   
3. 🛣️ ROUTES (horarios.routes.ts)
   ↓
   horariosRoutes.get('/analysis', horariosController.getHourlyAnalysis)
   
4. 🎮 CONTROLLER (horarios.controller.ts)
   ↓
   horariosController.getHourlyAnalysis()
   ├─ Valida request
   ├─ Llama al service
   └─ Formatea response HTTP
   
5. 💼 SERVICE (horarios.service.ts)
   ↓
   horariosService.getHourlyAnalysis()
   ├─ Obtiene datos del repository
   ├─ Aplica lógica de negocio
   ├─ Calcula métricas (pico, valle, ROI)
   └─ Genera insights y recomendaciones
   
6. 🗃️ REPOSITORY (horarios.repository.ts)
   ↓
   horariosRepository.getHourlyDistribution()
   ├─ Query SQL via Prisma
   ├─ Extrae hora de timestamp
   ├─ Agrupa por hora
   └─ Retorna datos formateados
   
7. 💾 PRISMA CLIENT
   ↓
   await prisma.$queryRaw`SELECT ...`
   
8. 🗄️ POSTGRESQL
   ↓
   Ejecuta query y retorna resultados
   
9. 📤 RESPONSE FLOW (Inverso)
   ↓
   Database → Prisma → Repository → Service → Controller → Router → Client
   
10. ✅ CLIENT RECEIVES
    {
      success: true,
      data: {
        peakHour: "14:00",
        peakTransactions: 125000,
        hourlyDistribution: [...],
        insights: [...],
        recommendations: [...]
      }
    }
```

---

## 🏗️ Patrón de Arquitectura por Caso de Uso

Cada caso de uso sigue este patrón estándar:

```
features/casos/{caso}/
│
├─ {caso}.routes.ts          🛣️ CAPA DE RUTAS
│  │  Define endpoints REST
│  │  Asocia rutas con controllers
│  └─ Express Router
│
├─ {caso}.controller.ts      🎮 CAPA DE CONTROL
│  │  Maneja HTTP requests/responses
│  │  Validación de inputs
│  │  Logging de operaciones
│  └─ Llama a services
│
├─ {caso}.service.ts         💼 CAPA DE NEGOCIO
│  │  Lógica de negocio
│  │  Procesamiento de datos
│  │  Cálculos y transformaciones
│  │  Generación de insights
│  └─ Llama a repositories
│
└─ {caso}.repository.ts      🗃️ CAPA DE DATOS
   │  Queries SQL (Prisma)
   │  Acceso a base de datos
   │  Formateo de datos raw
   └─ Retorna datos estructurados
```

---

## 🔗 Herencia y Composición

```
┌────────────────────────────────────────────┐
│       SharedRepository (Base)              │
│  ┌──────────────────────────────────────┐ │
│  │  - prisma: PrismaClient              │ │
│  │  + checkDatabaseHealth()             │ │
│  │  + getDateRange()                    │ │
│  │  + getDashboardMetrics()             │ │
│  └──────────────────────────────────────┘ │
└───────────────┬────────────────────────────┘
                │ extends
                ├──────────────────────┬───────────────┐
                ▼                      ▼               ▼
    ┌────────────────────┐  ┌──────────────────┐  ┌────────────┐
    │HorariosRepository  │  │CaducidadRepo...  │  │[Otros]     │
    │+ getHourlyDist..() │  │+ getExpiring...()│  │            │
    │+ getWeekdayDist...│  │+ getCaducidad...()│  │            │
    └────────────────────┘  └──────────────────┘  └────────────┘
```

```
┌────────────────────────────────────────────┐
│         SharedService (Base)               │
│  ┌──────────────────────────────────────┐ │
│  │  - logger: Logger                    │ │
│  │  # formatNumber()                    │ │
│  │  # calculateDailyAverage()           │ │
│  │  # handleError()                     │ │
│  └──────────────────────────────────────┘ │
└───────────────┬────────────────────────────┘
                │ extends
                ├──────────────────────┬───────────────┐
                ▼                      ▼               ▼
    ┌────────────────────┐  ┌──────────────────┐  ┌────────────┐
    │ HorariosService    │  │ CaducidadService │  │ [Otros]    │
    │ + getMetrics()     │  │ + getMetrics()   │  │            │
    │ + getAnalysis()    │  │ + getAnalysis()  │  │            │
    └────────────────────┘  └──────────────────┘  └────────────┘
```

---

## 📊 Comparación: Antes vs Después

### ❌ ANTES (Monolítico)
```
src/
├── controllers/
│   └── dashboard.controller.ts  (TODO junto aquí)
├── services/
│   └── dashboard.service.ts     (TODO junto aquí)
├── repositories/
│   └── dashboard.repository.ts  (TODO junto aquí)
└── routes/
    └── api/
        └── dashboard.routes.ts  (TODO junto aquí)

❌ Problemas:
- No escalable
- Difícil de mantener
- Código acoplado
- Testing complicado
```

### ✅ DESPUÉS (Modular)
```
src/
├── features/
│   ├── shared/              (Código reutilizable)
│   │   ├── shared.repository.ts
│   │   └── shared.service.ts
│   │
│   └── casos/               (Casos de uso separados)
│       ├── horarios/        ✅ Independiente
│       ├── caducidad/       ✅ Independiente
│       ├── precios/         ✅ Independiente
│       └── [otros]/         ✅ Independiente
│
└── routes/
    └── index.ts             (Router central)

✅ Ventajas:
- Escalable
- Fácil de mantener
- Código desacoplado
- Testing sencillo
- Separación clara de concerns
```

---

## 🎯 Principios SOLID Aplicados

### ✅ Single Responsibility Principle (SRP)
- Cada clase tiene UNA responsabilidad
- Repository → Data Access
- Service → Business Logic
- Controller → HTTP Handling

### ✅ Open/Closed Principle (OCP)
- Clases base (Shared) abiertas para extensión
- Cerradas para modificación
- Nuevos casos extienden sin modificar base

### ✅ Liskov Substitution Principle (LSP)
- Cualquier Repository puede usarse donde se espera SharedRepository
- Misma interface, diferente implementación

### ✅ Interface Segregation Principle (ISP)
- Interfaces pequeñas y específicas
- Cada caso implementa solo lo que necesita

### ✅ Dependency Inversion Principle (DIP)
- Controller depende de Service (abstracción)
- Service depende de Repository (abstracción)
- No dependencias directas a implementaciones concretas

---

## 📈 Escalabilidad

### Añadir nuevo caso de uso (3 pasos):

```bash
1. Copiar template de caso existente
   cp -r features/casos/caducidad features/casos/nuevo_caso

2. Renombrar archivos y clases
   nuevo_caso.repository.ts
   nuevo_caso.service.ts
   nuevo_caso.controller.ts
   nuevo_caso.routes.ts

3. Registrar en routes/index.ts
   import { nuevoCasoRoutes } from '../features/casos/nuevo_caso/...'
   router.use('/api/v1/casos/nuevo_caso', nuevoCasoRoutes)
```

**Tiempo estimado:** 15-30 minutos para estructura base

---

## 🔐 Seguridad y Middleware

```
Request → Middleware Chain → Controller → Service → Repository
          │
          ├─ CORS
          ├─ Body Parser
          ├─ Auth (JWT)
          ├─ Rate Limiting
          ├─ Validation
          └─ Logging
```

---

**Documentación completa:** `backend/REFACTORING.md`  
**Fecha de actualización:** October 3, 2025
