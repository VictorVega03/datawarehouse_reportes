# 🧪 Guía de Verificación y Pruebas - Frontend Refactorizado

## ✅ Checklist de Verificación

### 1. Backend Running
Antes de probar el frontend, asegúrate de que el backend esté corriendo:

```bash
cd backend
yarn dev
```

**Deberías ver**:
```
🚀 Servidor corriendo en http://localhost:3001
✅ Sistema completamente operativo
```

**Verificar que el puerto esté escuchando**:
```powershell
netstat -ano | findstr :3001
```

Deberías ver una línea con `LISTENING`.

### 2. Verificar Endpoints del Backend

#### Endpoint de Health Check
```bash
curl http://localhost:3001/health
```

**Respuesta Esperada**:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-xx-xx..."
}
```

#### Endpoint de Métricas del Dashboard
```bash
curl http://localhost:3001/api/v1/dashboard/metrics
```

**Respuesta Esperada**:
```json
{
  "success": true,
  "data": {
    "totalTransactions": {
      "value": "2.92M",
      "numeric": 2924080,
      "label": "Transacciones Analizadas"
    },
    "uniqueCustomers": {
      "value": "20,689",
      "numeric": 20689,
      "label": "Clientes Únicos"
    },
    "completionRate": {
      "value": "14%",
      "numeric": 14,
      "label": "Casos Completados (1/7)"
    },
    ...
  }
}
```

#### Endpoint de Horarios (Nuevo)
```bash
curl http://localhost:3001/api/v1/casos/horarios/analysis
```

**Respuesta Esperada**:
```json
{
  "success": true,
  "data": {
    "hourlyDistribution": [
      {
        "hour": "0",
        "hourLabel": "00:00",
        "transactions": 12345,
        "percentage": 4.22
      },
      ...
    ],
    "peakHours": [...],
    "valleyHours": [...],
    "analysis": {...}
  }
}
```

### 3. Iniciar el Frontend

```bash
cd frontend
yarn dev
```

**URL**: http://localhost:3000

### 4. Verificar Dashboard Principal

Navega a: `http://localhost:3000/`

**Elementos a verificar**:

#### Tarjetas de Métricas (4 cards)
- ✅ **Total Transacciones**: Debería mostrar "2.92M" (o el valor real de la BD)
- ✅ **ROI Anual**: Debería mostrar "$220M+"
- ✅ **Clientes Únicos**: Debería mostrar un número (ej: "20,689")
- ✅ **Casos Completados**: Debería mostrar "14%" o "1/7"

#### Estados de Carga
- Mientras carga: Deberías ver puntos suspensivos animados `...`
- Si hay error: Deberías ver "Error" en rojo y un banner de error arriba
- Badge del header: 
  - "Cargando..." en amarillo mientras carga
  - "Sistema Operativo" en verde cuando está listo
  - "Error Conexión" en rojo si falla

#### Consola del Navegador
Abre DevTools (F12) y busca estos logs:
```javascript
📊 Metrics completo: {totalTransactions: {...}, annualROI: {...}, ...}
📊 Total Transactions: {value: "2.92M", numeric: 2924080, ...}
📊 Loading: false
📊 Error: null
```

### 5. Verificar Navegación

#### Sidebar
Click en "Patrones Horarios" en el sidebar:
- ✅ URL cambia a `/casos/horarios`
- ✅ Sidebar marca "Patrones Horarios" como activo (fondo azul)
- ✅ Se carga la página de Patrones Horarios

#### Botones del Dashboard
Click en "Ver Patrones Horarios" (botón azul principal):
- ✅ Navega a `/casos/horarios`
- ✅ Muestra la página completa de horarios

### 6. Verificar Página de Horarios

URL: `http://localhost:3000/casos/horarios`

**Elementos a verificar**:

#### Tarjetas de Métricas Horarias
- Total de Transacciones con número formateado
- Hora Pico con porcentaje
- Promedio por Hora
- Tendencia

#### Gráfico de Barras (Nivo)
- Barras para cada hora del día (0-23)
- Colores diferentes por rango horario:
  - Madrugada (0-5): Azul oscuro
  - Mañana (6-11): Azul claro
  - Tarde (12-17): Verde
  - Noche (18-23): Morado
- Tooltip al pasar el mouse

#### Tabla de Datos
- 24 filas (una por cada hora)
- Columnas: Hora, Transacciones, Porcentaje, Tendencia
- Números formateados con separadores de miles

### 7. Verificar Endpoints en Network Tab

Abre DevTools → Network tab:

#### En Dashboard Principal (`/`)
Deberías ver estas peticiones:
- `GET /api/v1/dashboard/metrics` → Status 200

#### En Página de Horarios (`/casos/horarios`)
Deberías ver estas peticiones:
- `GET /api/v1/casos/horarios/metrics` → Status 200
- `GET /api/v1/casos/horarios/analysis` → Status 200

### 8. Verificar Rutas

#### Rutas Funcionales
- ✅ `/` - Dashboard principal
- ✅ `/casos/horarios` - Patrones horarios

#### Redirecciones
- `/patrones` → Debería redirigir a `/casos/horarios`

#### 404 - Not Found
- `/cualquier-cosa` → Debería redirigir a `/`

## 🐛 Troubleshooting

### Problema: "Cargando..." no desaparece

**Causa**: El frontend no puede conectarse al backend

**Solución**:
1. Verifica que el backend esté corriendo: `netstat -ano | findstr :3001`
2. Si no hay nada, inicia el backend: `cd backend ; yarn dev`
3. Verifica la consola del backend por errores
4. Verifica que el puerto sea 3001 en `.env` del frontend

### Problema: "Error" en las tarjetas

**Causa**: El backend responde con error o formato incorrecto

**Solución**:
1. Abre DevTools → Network → Busca peticiones fallidas
2. Click en la petición fallida → Response tab
3. Lee el mensaje de error
4. Verifica los logs del backend

**Errores Comunes**:
- `ECONNREFUSED`: Backend no está corriendo
- `CORS Error`: Verifica que CORS_ORIGIN esté en `http://localhost:3000`
- `500 Internal Server Error`: Error en el backend, revisa logs

### Problema: Datos hardcodeados se muestran

**Causa**: El backend está retornando datos de fallback o el frontend usa fallbacks

**Solución**:
1. Verifica que la base de datos tenga datos reales
2. En el backend, busca archivos `.backup` que puedan tener datos hardcodeados
3. Verifica que los repositorios estén consultando la BD correctamente

### Problema: Gráfico no se muestra

**Causa**: Datos en formato incorrecto o error de Nivo

**Solución**:
1. Abre consola del navegador, busca errores de Nivo
2. Verifica que `hourlyDistribution` tenga el formato correcto:
   ```typescript
   {
     hour: "0",
     hourLabel: "00:00",
     transactions: 12345,
     percentage: 4.22
   }
   ```

## 📝 Script Automático de Pruebas

Guarda este archivo como `test-frontend.js` y ejecútalo con `node test-frontend.js`:

```javascript
const http = require('http');

const tests = [
  {
    name: 'Health Check',
    endpoint: '/health'
  },
  {
    name: 'Dashboard Metrics',
    endpoint: '/api/v1/dashboard/metrics'
  },
  {
    name: 'Horarios Metrics',
    endpoint: '/api/v1/casos/horarios/metrics'
  },
  {
    name: 'Horarios Analysis',
    endpoint: '/api/v1/casos/horarios/analysis'
  }
];

async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: endpoint,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ success: true, status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ success: false, error: 'Invalid JSON' });
        }
      });
    });

    req.on('error', (e) => {
      resolve({ success: false, error: e.message });
    });

    req.end();
  });
}

async function runTests() {
  console.log('\n🧪 Testing Backend Endpoints...\n');
  
  for (const test of tests) {
    const result = await testEndpoint(test.endpoint);
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${test.name}: ${result.success ? 'OK' : result.error}`);
  }
  
  console.log('\n✅ Tests complete!\n');
}

runTests();
```

## 🎯 Checklist Final

Antes de considerar la refactorización completa:

- [ ] Backend inicia sin errores
- [ ] Puerto 3001 está escuchando (`netstat`)
- [ ] Endpoints del backend responden correctamente (`curl` o `test-endpoints.js`)
- [ ] Frontend inicia en puerto 3000
- [ ] Dashboard principal muestra métricas reales (no "Cargando...")
- [ ] Navegación a `/casos/horarios` funciona
- [ ] Gráfico de horarios se muestra correctamente
- [ ] Tabla de horarios muestra 24 filas
- [ ] Network tab muestra peticiones exitosas (200 OK)
- [ ] No hay errores en la consola del navegador
- [ ] TypeScript compila sin errores (`yarn type-check`)

## 📚 Documentación Relacionada

- [REFACTORING.md](./frontend/REFACTORING.md) - Documentación técnica completa
- [REFACTORING_COMPLETE.md](./frontend/REFACTORING_COMPLETE.md) - Resumen ejecutivo
- [ARCHITECTURE.md](./backend/ARCHITECTURE.md) - Arquitectura del backend

---

**¿Todo funcionando?** 🎉 ¡Felicidades! La refactorización está completa y funcional.

**¿Algo no funciona?** Revisa la sección de Troubleshooting arriba.
