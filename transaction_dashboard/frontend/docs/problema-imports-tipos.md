# Problema recurrente: Imports y Tipos en proyectos React + Vite + TypeScript

## Síntomas
- Errores como `Cannot find module '@/types' or its corresponding type declarations.`
- Conflictos entre imports y definiciones locales de tipos.
- Alias configurados pero no funcionan en tiempo de compilación o ejecución.
- Warnings sobre referencias de proyectos en TypeScript (`may not disable emit`).

## Causas principales
1. **Alias mal configurados o duplicados en `tsconfig.json`.**
2. **Tipos definidos localmente en archivos en vez de centralizarlos.**
3. **Falta de archivos de tipos globales (`src/types/index.ts`).**
4. **Imports de tipos que no existen o están duplicados.**
5. **Configuración de referencias en TypeScript con opciones incompatibles (`noEmit`).**

## Solución paso a paso

### 1. Configura correctamente los alias en `tsconfig.json` y `vite.config.ts`
- En `tsconfig.json`, deja solo una definición para cada alias:
  ```json
  "paths": {
    "@/*": ["./src/*"],
    "@/types": ["./src/types/index.ts"]
    // ...otros alias
  }
  ```
- En `vite.config.ts`, asegúrate que los alias coincidan:
  ```js
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/types': path.resolve(__dirname, './src/types'),
      // ...otros alias
    }
  }
  ```

### 2. Centraliza todos los tipos en `src/types/index.ts`
- Define y exporta todos los tipos usados globalmente:
  ```ts
  export interface ApiResponse<T = any> { ... }
  export interface ApiError { ... }
  export interface DashboardMetrics { ... }
  // ...otros tipos
  ```

### 3. Importa los tipos solo desde el archivo global
- Ejemplo:
  ```ts
  import type { ApiResponse, DashboardMetrics } from '@/types'
  ```
- Elimina definiciones locales duplicadas en los archivos donde se usan.

### 4. Elimina imports no usados
- Si importas un tipo y no lo usas, elimínalo para evitar warnings.

### 5. Corrige la referencia de proyectos en TypeScript
- Si usas `"references"` en `tsconfig.json`, asegúrate que el proyecto referenciado no tenga `"noEmit": true`.
- Elimina la línea `"noEmit": true` en el archivo referenciado (`tsconfig.node.json`).

## Resumen
- Mantén los tipos centralizados y los alias bien configurados.
- Evita duplicar definiciones de tipos.
- Revisa los imports y elimina los que no se usan.
- Ajusta la configuración de TypeScript para evitar warnings de referencia.

---
**Solución aplicada por GitHub Copilot**
