# 🔧 SOLUCIÓN: Vistas Materializadas de Devoluciones

## 📋 Problema Identificado

El código estaba consultando **solo `mv_returns_enriched`** pero el método `refreshMaterializedViews()` intentaba actualizar vistas con nombres diferentes que **SÍ EXISTEN** en la base de datos:

- ✅ `mv_devoluciones_metrics` (40 KB)
- ✅ `mv_devoluciones_por_motivo` (40 KB)
- ✅ `mv_devoluciones_productos` (48 KB)
- ✅ `mv_returns_enriched` (88 MB)

## 🔄 Cambios Realizados

### 1. **`getReturnStats()`** 
**ANTES**: Consultaba `mv_returns_enriched`
```sql
SELECT COUNT(*), SUM(monto_devuelto) FROM mv_returns_enriched
```

**AHORA**: Consulta `mv_devoluciones_metrics`
```sql
SELECT total_devoluciones, (total_devoluciones * promedio_unidades_por_devol)::text 
FROM mv_devoluciones_metrics
```

### 2. **`getReturnsByReason()`**
**ANTES**: Consultaba `mv_returns_enriched` con agregaciones
```sql
SELECT motivo, COUNT(*) FROM mv_returns_enriched GROUP BY motivo
```

**AHORA**: Consulta directa a `mv_devoluciones_por_motivo`
```sql
SELECT motivo, cantidad, porcentaje FROM mv_devoluciones_por_motivo
```

### 3. **`getTopReturnedProducts()`**
**ANTES**: Consultaba `mv_returns_enriched` con agregaciones
```sql
SELECT producto_id, COUNT(*) FROM mv_returns_enriched GROUP BY producto_id
```

**AHORA**: Consulta directa a `mv_devoluciones_productos`
```sql
SELECT producto_id, product_name, veces_devuelto FROM mv_devoluciones_productos
```

### 4. **`refreshMaterializedViews()`** ⭐ **CAMBIO MÁS IMPORTANTE**
**ANTES**: Solo intentaba actualizar vistas inexistentes
```typescript
await this.prisma.$executeRaw`REFRESH MATERIALIZED VIEW mv_devoluciones_metrics`
await this.prisma.$executeRaw`REFRESH MATERIALIZED VIEW mv_devoluciones_por_motivo`
await this.prisma.$executeRaw`REFRESH MATERIALIZED VIEW mv_devoluciones_productos`
```

**AHORA**: Actualiza las **4 vistas que realmente existen** en orden:
```typescript
1. REFRESH mv_devoluciones_metrics       (rápido - 40 KB)
2. REFRESH mv_devoluciones_por_motivo    (rápido - 40 KB)
3. REFRESH mv_devoluciones_productos     (rápido - 48 KB)
4. REFRESH mv_returns_enriched          (lento - 88 MB)
```

## ✅ Beneficios

1. **Consultas más rápidas**: Ahora usa vistas especializadas (40-48 KB) en lugar de la vista grande (88 MB)
2. **Refresh completo**: Actualiza todas las 4 vistas cuando presionas el botón
3. **Logs detallados**: Muestra el progreso de cada vista durante el refresh
4. **Datos actualizados**: Ahora sí verás los datos nuevos después del refresh

## 🧪 Cómo Probar

### 1. **Reinicia el servidor backend**
```powershell
# En terminal de backend
npm run dev
```

### 2. **Presiona el botón "Actualizar Vistas" en el frontend**
- Ve al módulo de Devoluciones
- Presiona el botón de actualizar
- Espera 2-3 minutos (especialmente por mv_returns_enriched que es grande)

### 3. **Verifica los logs en la terminal del backend**
Deberías ver algo como:
```
🔄 Iniciando refresh de TODAS las vistas materializadas de devoluciones...
🔄 Refrescando mv_devoluciones_metrics...
✅ mv_devoluciones_metrics actualizada
🔄 Refrescando mv_devoluciones_por_motivo...
✅ mv_devoluciones_por_motivo actualizada
🔄 Refrescando mv_devoluciones_productos...
✅ mv_devoluciones_productos actualizada
🔄 Refrescando mv_returns_enriched (puede tardar más)...
✅ mv_returns_enriched actualizada
✅ TODAS las vistas actualizadas en 45230ms (45.23s)
```

### 4. **Refresca la página del frontend**
- Presiona F5 o recarga la página
- Verifica que los números cambien
- Los datos deben reflejar las devoluciones más recientes

## 📊 Queries de Verificación

Para verificar que las vistas tienen datos actualizados:

```sql
-- Ver última fecha en cada vista
SELECT 'mv_devoluciones_metrics' as vista, total_devoluciones FROM mv_devoluciones_metrics;
SELECT 'mv_devoluciones_por_motivo' as vista, COUNT(*) as registros FROM mv_devoluciones_por_motivo;
SELECT 'mv_devoluciones_productos' as vista, COUNT(*) as registros FROM mv_devoluciones_productos;
SELECT 'mv_returns_enriched' as vista, COUNT(*) as registros, MAX(fecha_hora) as ultima_fecha FROM mv_returns_enriched;

-- Comparar con tabla original
SELECT 'returns (tabla real)' as vista, COUNT(*) as registros, MAX(fecha_hora) as ultima_fecha FROM returns;
```

Si todos los COUNT(*) y fechas coinciden, ¡las vistas están actualizadas! ✅

## 🐛 Troubleshooting

### Si el botón no funciona:
1. Verifica que el endpoint esté disponible: `POST /api/devoluciones/refresh-vistas`
2. Revisa los logs del backend para errores
3. Verifica permisos de PostgreSQL para REFRESH MATERIALIZED VIEW

### Si los datos no cambian:
1. Asegúrate de que el refresh terminó (revisa los logs)
2. Refresca la página del frontend (F5)
3. Limpia caché del navegador (Ctrl+Shift+R)
4. Ejecuta los queries de verificación arriba

### Si tarda mucho (más de 5 minutos):
- Es normal si `mv_returns_enriched` es muy grande (88 MB)
- La vista procesa todos los datos de la tabla `returns`
- Considera ejecutar el refresh en horarios de baja actividad

## 📝 Estructura de las Vistas

### `mv_devoluciones_metrics` (Resumen general)
```
- total_devoluciones
- transacciones_afectadas
- total_transacciones_ref
- tasa_devolucion
- unidades_devueltas
- promedio_unidades_por_devol
```

### `mv_devoluciones_por_motivo` (Por razón)
```
- motivo
- cantidad
- porcentaje
```

### `mv_devoluciones_productos` (Por producto)
```
- producto_id
- product_name
- categories
- veces_devuelto
- total_unidades_devueltas
- porcentaje_del_total
```

### `mv_returns_enriched` (Datos enriquecidos completos - 17 columnas)
```
- id, transaction_id_original, detail_id_original
- cantidad_devuelta, fecha_hora, motivo
- empleado_id, precio_unitario, descuento_monto
- producto_id, product_name, categories
- monto_devuelto, fecha_devolucion
- year, month, day_of_week
```

## ✨ Resultado Final

Ahora el módulo de devoluciones:
- ✅ Consulta las vistas correctas (especializadas y rápidas)
- ✅ El botón refresh actualiza todas las 4 vistas
- ✅ Los datos se actualizan correctamente después del refresh
- ✅ Performance optimizada (usa vistas pequeñas cuando es posible)

---

**Fecha**: 2025-10-06  
**Archivo modificado**: `backend/src/repositories/devoluciones.repository.ts`
