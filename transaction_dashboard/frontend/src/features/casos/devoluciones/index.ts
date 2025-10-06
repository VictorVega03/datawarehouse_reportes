// frontend/src/features/casos/devoluciones/index.ts

// Exportar tipos
export * from './types';

// Exportar hooks
export * from './hooks/useDevolucionesData';

// Exportar componentes
export { DevolucionesMetrics } from './components/DevolucionesMetrics';
export { DevolucionesPieChart } from './components/DevolucionesPieChart';
export { SuspiciousPatternsTable } from './components/SuspiciousPatternsTable';

// Exportar páginas
export { DevolucionesPage } from './pages/DevolucionesPage';