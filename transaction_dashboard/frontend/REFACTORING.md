# Frontend Refactorization Documentation

## Overview

This document describes the frontend refactorization from a monolithic dashboard structure to a modular, feature-based architecture organized by use cases.

## Refactorization Goals

1. **Modular Structure**: Organize code by business use cases instead of technical layers
2. **Scalability**: Easy to add new use cases without affecting existing code
3. **Maintainability**: Clear separation of concerns and shared utilities
4. **Reusability**: Shared types, utilities, and components across use cases
5. **Type Safety**: Full TypeScript support with proper type definitions
6. **Modern Routing**: React Router v6 for declarative navigation

## Directory Structure

### Before Refactorization
```
frontend/src/
├── hooks/
│   └── api/
│       ├── useDashboardMetrics.ts
│       └── useHourlyData.ts
├── components/
│   ├── charts/
│   │   ├── HourlyBarChart.tsx
│   │   └── HourlyMetrics.tsx
│   └── dashboard/
└── pages/
    └── PatronesHorariosPage.tsx
```

### After Refactorization
```
frontend/src/
├── features/
│   ├── shared/
│   │   ├── types/
│   │   │   ├── api.types.ts      # Shared API response types
│   │   │   ├── common.types.ts   # Common UI types
│   │   │   └── index.ts
│   │   └── utils/
│   │       ├── formatters.ts     # Number, date, currency formatters
│   │       └── index.ts
│   └── casos/
│       └── horarios/             # Hourly patterns use case
│           ├── types.ts          # Use case specific types
│           ├── hooks/
│           │   └── useHorariosData.ts
│           ├── components/
│           │   ├── HorariosChart.tsx
│           │   ├── HorariosMetrics.tsx
│           │   ├── HorariosTable.tsx
│           │   └── index.ts
│           ├── pages/
│           │   └── HorariosPage.tsx
│           └── index.ts          # Barrel export
├── pages/
│   ├── DashboardHomePage.tsx     # Main dashboard page
│   ├── PatronesHorariosPage.tsx  # Old page (to be deprecated)
│   └── index.ts
├── components/
│   ├── layout/                   # Updated for router
│   │   ├── MainLayout.tsx
│   │   └── Sidebar.tsx
│   └── ui/                       # Shared UI components
├── router.tsx                    # React Router configuration
└── App.tsx                       # Root component with RouterProvider
```

## Key Changes

### 1. React Router v6 Integration

**Before**: Manual state-based navigation in `App.tsx`
```typescript
const [currentPage, setCurrentPage] = useState('dashboard')
const handleNavigate = (page: string) => setCurrentPage(page)
```

**After**: Declarative routing with React Router
```typescript
// router.tsx
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardHomePage /> },
      { path: 'casos/horarios', element: <HorariosPage /> },
      // ... more routes
    ],
  },
])

// App.tsx
function App() {
  return <RouterProvider router={router} />
}
```

### 2. Feature-Based Organization

Each use case now has its own self-contained module:

```
features/casos/{use-case}/
├── types.ts              # TypeScript interfaces
├── hooks/                # React Query hooks for data fetching
├── components/           # UI components specific to this use case
├── pages/                # Page components
└── index.ts              # Barrel export for clean imports
```

### 3. Shared Utilities Module

Common code extracted to `features/shared/`:
- **types/api.types.ts**: Generic API response types
- **types/common.types.ts**: Common UI types and enums
- **utils/formatters.ts**: Reusable formatting functions

### 4. Updated Components

**MainLayout.tsx**:
- Removed manual navigation props (`onNavigate`, `activePage`)
- Added React Router's `Outlet` for nested routes
- Uses `useLocation()` to get current path

**Sidebar.tsx**:
- Replaced callback-based navigation with `useNavigate()` hook
- Added route paths to menu items
- Uses `currentPath` to highlight active route

## Use Case: Horarios (Hourly Patterns)

### Complete Structure

```typescript
// features/casos/horarios/index.ts
export { HorariosPage } from './pages/HorariosPage'
export { HorariosChart, HorariosMetrics, HorariosTable } from './components'
export { useHorariosData, useHorariosMetrics, useHorariosAnalysis } from './hooks/useHorariosData'
export type { HorariosMetrics, HorariosAnalysis, HourlyDataPoint } from './types'
```

### API Integration

**Before**: Endpoints at `/api/v1/dashboard/*`
```typescript
const { data } = useQuery({
  queryKey: ['dashboard', 'metrics'],
  queryFn: () => client.get('/dashboard/metrics')
})
```

**After**: Endpoints at `/api/v1/casos/horarios/*`
```typescript
const { data } = useQuery({
  queryKey: ['horarios', 'analysis'],
  queryFn: () => client.get('/casos/horarios/analysis')
})
```

### Components Breakdown

1. **HorariosChart.tsx**: Nivo bar chart visualization
2. **HorariosMetrics.tsx**: Key metrics cards
3. **HorariosTable.tsx**: Detailed data table
4. **HorariosPage.tsx**: Main page integrating all components

## Routes Configuration

### Primary Routes
- `/` - Dashboard home with metrics overview
- `/casos/horarios` - Hourly patterns analysis page

### Future Routes (Prepared)
- `/casos/caducidad` - Expiration control
- `/casos/precios` - Price management
- `/casos/clientes` - Customer identification
- `/casos/inventario` - Inventory tracking
- `/casos/pagos` - Payment methods analysis
- `/casos/devoluciones` - Returns control

### Backwards Compatibility
- `/patrones` → Redirects to `/casos/horarios`

## Data Fetching Pattern

Using TanStack Query (React Query) v5:

```typescript
// features/casos/horarios/hooks/useHorariosData.ts
export const useHorariosMetrics = () => {
  return useQuery<ApiResponse<HorariosMetrics>>({
    queryKey: ['horarios', 'metrics'],
    queryFn: async () => {
      const { data } = await client.get<ApiResponse<HorariosMetrics>>(
        '/casos/horarios/metrics'
      )
      return data
    },
  })
}
```

## Type System

### Shared Types

```typescript
// features/shared/types/api.types.ts
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  timestamp?: string
}

export interface ApiError {
  message: string
  code?: string
  details?: unknown
}
```

### Use Case Types

```typescript
// features/casos/horarios/types.ts
export interface HorariosMetrics {
  totalTransactions: number
  peakHour: {
    hour: number
    count: number
    percentage: number
  }
  averagePerHour: number
}

export interface HourlyDataPoint {
  hour: number
  hourLabel: string
  transactions: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
}
```

## Migration Checklist

### ✅ Completed

- [x] Create `features/shared/types/` with API types
- [x] Create `features/shared/utils/` with formatters
- [x] Create `features/casos/horarios/` structure
- [x] Implement hooks with TanStack Query
- [x] Create UI components (chart, metrics, table)
- [x] Create `HorariosPage` component
- [x] Configure React Router v6
- [x] Update `MainLayout` to use `Outlet`
- [x] Update `Sidebar` to use `useNavigate`
- [x] Create `DashboardHomePage`
- [x] Update `App.tsx` to use `RouterProvider`
- [x] Create barrel exports with `index.ts` files
- [x] Test routes and navigation

### ⏳ Pending

- [ ] Implement caducidad use case
- [ ] Implement remaining 5 use cases
- [ ] Add loading skeletons for better UX
- [ ] Add error boundaries
- [ ] Implement data export functionality
- [ ] Add global filters system
- [ ] Create frontend unit tests
- [ ] Update existing pages to use new structure
- [ ] Remove deprecated files

## Best Practices

1. **Barrel Exports**: Use `index.ts` files to create clean import paths
2. **Type Safety**: Define interfaces for all data structures
3. **Code Splitting**: React Router automatically splits code by route
4. **Reusability**: Extract common logic to shared utilities
5. **Consistency**: Follow the same structure for all use cases
6. **Documentation**: Add JSDoc comments to exported functions/components

## File Naming Conventions

- **Components**: PascalCase (e.g., `HorariosChart.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useHorariosData.ts`)
- **Types**: camelCase with `.types.ts` suffix (e.g., `api.types.ts`)
- **Utils**: camelCase (e.g., `formatters.ts`)
- **Pages**: PascalCase with `Page` suffix (e.g., `HorariosPage.tsx`)

## Testing Strategy

### Component Testing
```typescript
// features/casos/horarios/components/__tests__/HorariosChart.test.tsx
describe('HorariosChart', () => {
  it('renders chart with data', () => {
    // Test implementation
  })
})
```

### Hook Testing
```typescript
// features/casos/horarios/hooks/__tests__/useHorariosData.test.ts
describe('useHorariosData', () => {
  it('fetches and returns data', async () => {
    // Test implementation with msw
  })
})
```

## Performance Considerations

1. **Route-Based Code Splitting**: Each route is lazy-loaded
2. **React Query Caching**: Automatic data caching and revalidation
3. **Component Memoization**: Use `React.memo` for expensive components
4. **Virtual Scrolling**: For large data tables (using react-window)

## Next Steps

1. **Implement Caducidad Case**: Follow horarios pattern
2. **Add Global State**: Zustand for filters and UI state
3. **Create Documentation**: Storybook for component library
4. **Add Tests**: Vitest for unit and integration tests
5. **Optimize Bundle**: Analyze and optimize bundle size

## Related Documentation

- [Backend Refactoring](../../backend/REFACTORING.md)
- [Architecture Overview](../../backend/ARCHITECTURE.md)
- [Migration Guide](../../backend/MIGRATION_SUMMARY.md)

## Questions & Support

For questions about this refactorization, please refer to:
- Architecture documentation in `/backend/docs/`
- Type definitions in `features/shared/types/`
- Example implementation in `features/casos/horarios/`

---

**Last Updated**: 2024
**Status**: Horarios case complete, 6 cases pending
**Version**: 1.0.0
