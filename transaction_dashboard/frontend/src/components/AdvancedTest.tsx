// frontend/src/components/AdvancedTest.tsx
// TEST DE CARACTERÍSTICAS AVANZADAS QUE PUEDEN CAUSAR EL PROBLEMA

import React, { useState } from 'react'
import { create } from 'zustand'

// ✅ TEST 1: SELECTORES EXPORTADOS (SOSPECHOSO PRINCIPAL)
interface StoreWithSelectors {
  message: string
  count: number
  data: {
    metrics: {
      transactions: string
      revenue: string
    }
    ui: {
      sidebarOpen: boolean
      theme: string
    }
  }
  updateMessage: (msg: string) => void
  increment: () => void
  updateMetrics: (metrics: { transactions: string; revenue: string }) => void
}

const useStoreWithSelectors = create<StoreWithSelectors>((set) => ({
  message: "Store con selectores",
  count: 0,
  data: {
    metrics: {
      transactions: '2.92M',
      revenue: '$220M+'
    },
    ui: {
      sidebarOpen: true,
      theme: 'light'
    }
  },
  updateMessage: (msg) => set({ message: msg }),
  increment: () => set((state) => ({ count: state.count + 1 })),
  updateMetrics: (metrics) => set((state) => ({
    data: {
      ...state.data,
      metrics
    }
  }))
}))

// 🔍 SELECTORES EXPORTADOS (PROBLEMA POTENCIAL)
export const useSelectorsMessage = () => useStoreWithSelectors((state) => state.message)
export const useSelectorsMetrics = () => useStoreWithSelectors((state) => state.data.metrics)
export const useSelectorsUI = () => useStoreWithSelectors((state) => state.data.ui)
export const useSelectorsActions = () => useStoreWithSelectors((state) => ({
  updateMessage: state.updateMessage,
  increment: state.increment,
  updateMetrics: state.updateMetrics
}))

// ===================================

// ✅ TEST 2: CONST EXTERNOS + DATOS COMPLEJOS
const externalMetrics = {
  totalTransactions: '2.92M',
  totalRevenue: '$220M+',
  completedCases: '70%',
  uniqueCustomers: '29,991',
  roiRange: '4,400% - 7,333%'
}

const externalUI = {
  sidebarOpen: true,
  currentPage: 'dashboard',
  theme: 'light',
  loading: {
    dashboard: false,
    metrics: false,
    charts: false
  }
}

interface StoreWithExternals {
  message: string
  count: number
  metrics: typeof externalMetrics
  ui: typeof externalUI
  lastUpdated: string
  updateMessage: (msg: string) => void
  increment: () => void
  setMetrics: (metrics: typeof externalMetrics) => void
  updateTimestamp: () => void
}

const useStoreWithExternals = create<StoreWithExternals>((set) => ({
  message: "Store con externos",
  count: 0,
  metrics: externalMetrics,  // 🔍 CONST EXTERNO
  ui: externalUI,           // 🔍 CONST EXTERNO COMPLEJO
  lastUpdated: new Date().toLocaleTimeString(),
  updateMessage: (msg) => set({ message: msg }),
  increment: () => set((state) => ({ count: state.count + 1 })),
  setMetrics: (metrics) => set({ metrics }),
  updateTimestamp: () => set({ lastUpdated: new Date().toLocaleTimeString() })
}))

// ===================================

// ✅ TEST 3: ARRAYS + OBJETOS COMPLEJOS
const initialCases = [
  { id: '1', name: 'Patrones Horarios', status: 'completed', roi: '$6.7M' },
  { id: '2', name: 'Control Caducidad', status: 'completed', roi: '$3.8M' },
  { id: '3', name: 'Gestión Precios', status: 'completed', roi: '$150M' }
]

interface StoreWithArrays {
  message: string
  count: number
  cases: typeof initialCases
  filters: {
    dateRange: { start: string; end: string }
    selectedCase: string
    customerType: 'all' | 'vip' | 'regular'
  }
  updateMessage: (msg: string) => void
  increment: () => void
  addCase: (newCase: typeof initialCases[0]) => void
  updateFilters: (filters: Partial<StoreWithArrays['filters']>) => void
}

const useStoreWithArrays = create<StoreWithArrays>((set) => ({
  message: "Store con arrays",
  count: 0,
  cases: initialCases,  // 🔍 ARRAY COMPLEJO
  filters: {            // 🔍 OBJETO ANIDADO COMPLEJO
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    selectedCase: 'all',
    customerType: 'all'
  },
  updateMessage: (msg) => set({ message: msg }),
  increment: () => set((state) => ({ count: state.count + 1 })),
  addCase: (newCase) => set((state) => ({
    cases: [...state.cases, newCase]  // 🔍 SPREAD EN ARRAY
  })),
  updateFilters: (newFilters) => set((state) => ({
    filters: {
      ...state.filters,     // 🔍 SPREAD ANIDADO
      ...newFilters
    }
  }))
}))

// ===================================

// COMPONENTE PRINCIPAL
export const AdvancedTest: React.FC = () => {
  console.log('🚀 AdvancedTest componente iniciando...')
  const [activeTest, setActiveTest] = useState<'selectors' | 'externals' | 'arrays' | null>(null)

  // STORES PARA PROBAR
  const selectorsStore = useStoreWithSelectors()
  const externalsStore = useStoreWithExternals()
  const arraysStore = useStoreWithArrays()

  // SELECTORES PARA PROBAR
  const selectorsMessage = useSelectorsMessage()
  const selectorsMetrics = useSelectorsMetrics()
  const selectorsActions = useSelectorsActions()

  const renderTest = () => {
    if (activeTest === 'selectors') {
      return (
        <div style={{ padding: '20px', backgroundColor: '#fee', borderRadius: '8px' }}>
          <h3>🔍 TEST SELECTORES - Store con selectores exportados</h3>
          <p><strong>Mensaje (store directo):</strong> {selectorsStore.message}</p>
          <p><strong>Mensaje (selector):</strong> {selectorsMessage}</p>
          <p><strong>Contador:</strong> {selectorsStore.count}</p>
          <p><strong>Transacciones (selector):</strong> {selectorsMetrics.transactions}</p>
          <p><strong>Revenue (selector):</strong> {selectorsMetrics.revenue}</p>
          <button 
            onClick={selectorsActions.increment}
            style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            ➕ Incrementar (Selector Action)
          </button>
          <button 
            onClick={() => selectorsActions.updateMetrics({ transactions: '3.5M', revenue: '$300M+' })}
            style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            📊 Update via Selector
          </button>
        </div>
      )
    }

    if (activeTest === 'externals') {
      return (
        <div style={{ padding: '20px', backgroundColor: '#ddd6fe', borderRadius: '8px' }}>
          <h3>🔍 TEST EXTERNALS - Store con const externos complejos</h3>
          <p><strong>Mensaje:</strong> {externalsStore.message}</p>
          <p><strong>Contador:</strong> {externalsStore.count}</p>
          <p><strong>Transacciones:</strong> {externalsStore.metrics.totalTransactions}</p>
          <p><strong>ROI Range:</strong> {externalsStore.metrics.roiRange}</p>
          <p><strong>Sidebar:</strong> {externalsStore.ui.sidebarOpen ? 'Abierto' : 'Cerrado'}</p>
          <p><strong>Loading Dashboard:</strong> {externalsStore.ui.loading.dashboard ? 'Sí' : 'No'}</p>
          <p><strong>Timestamp:</strong> {externalsStore.lastUpdated}</p>
          <button 
            onClick={externalsStore.increment}
            style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            ➕ Incrementar
          </button>
          <button 
            onClick={externalsStore.updateTimestamp}
            style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            🕒 Update Timestamp
          </button>
        </div>
      )
    }

    if (activeTest === 'arrays') {
      return (
        <div style={{ padding: '20px', backgroundColor: '#d1ecf1', borderRadius: '8px' }}>
          <h3>🔍 TEST ARRAYS - Store con arrays y objetos complejos</h3>
          <p><strong>Mensaje:</strong> {arraysStore.message}</p>
          <p><strong>Contador:</strong> {arraysStore.count}</p>
          <p><strong>Total Casos:</strong> {arraysStore.cases.length}</p>
          <p><strong>Filtro Actual:</strong> {arraysStore.filters.selectedCase}</p>
          <p><strong>Fecha Inicio:</strong> {arraysStore.filters.dateRange.start}</p>
          
          <div style={{ margin: '10px 0' }}>
            <strong>Casos:</strong>
            {arraysStore.cases.map((caso, index) => (
              <div key={caso.id} style={{ fontSize: '12px', marginLeft: '10px' }}>
                {index + 1}. {caso.name} - {caso.roi}
              </div>
            ))}
          </div>

          <button 
            onClick={arraysStore.increment}
            style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            ➕ Incrementar
          </button>
          <button 
            onClick={() => arraysStore.addCase({ 
              id: Date.now().toString(), 
              name: 'Nuevo Caso', 
              status: 'pending', 
              roi: '$100M' 
            })}
            style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            📝 Agregar Caso
          </button>
          <button 
            onClick={() => arraysStore.updateFilters({ selectedCase: 'horarios', customerType: 'vip' })}
            style={{ padding: '8px 16px', backgroundColor: '#ffc107', color: '#212529', border: 'none', borderRadius: '4px' }}
          >
            🔧 Update Filtros
          </button>
        </div>
      )
    }

    return null
  }

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        🧪 Test Avanzado - Características Complejas
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '15px' }}>Probar Características Avanzadas:</h2>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
          Los tests básicos funcionaron. Ahora probemos características más complejas.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <button
            onClick={() => setActiveTest('selectors')}
            style={{
              padding: '15px',
              backgroundColor: activeTest === 'selectors' ? '#dc3545' : '#e9ecef',
              color: activeTest === 'selectors' ? 'white' : '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔍 SELECTORES
            <br />
            <small style={{ opacity: 0.8 }}>Exports + selectores</small>
          </button>
          
          <button
            onClick={() => setActiveTest('externals')}
            style={{
              padding: '15px',
              backgroundColor: activeTest === 'externals' ? '#6f42c1' : '#e9ecef',
              color: activeTest === 'externals' ? 'white' : '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔍 EXTERNOS
            <br />
            <small style={{ opacity: 0.8 }}>Const externos complejos</small>
          </button>
          
          <button
            onClick={() => setActiveTest('arrays')}
            style={{
              padding: '15px',
              backgroundColor: activeTest === 'arrays' ? '#17a2b8' : '#e9ecef',
              color: activeTest === 'arrays' ? 'white' : '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔍 ARRAYS
            <br />
            <small style={{ opacity: 0.8 }}>Arrays + objetos complejos</small>
          </button>
        </div>
      </div>

      {activeTest && (
        <div style={{ marginBottom: '20px' }}>
          {renderTest()}
        </div>
      )}

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ marginBottom: '10px' }}>📋 Tests Básicos Completados ✅</h3>
        <p style={{ fontSize: '14px', marginBottom: '15px' }}>
          ✅ BÁSICO, OBJETO, NULL, SPREAD, DATE - Todos funcionaron
        </p>
        
        <h3 style={{ marginBottom: '10px' }}>🎯 Ahora Probar Características Avanzadas:</h3>
        <ol style={{ fontSize: '14px', lineHeight: '1.5' }}>
          <li><strong>SELECTORES</strong> - ¿funciona o pantalla en blanco?</li>
          <li><strong>EXTERNOS</strong> - ¿funciona o pantalla en blanco?</li>
          <li><strong>ARRAYS</strong> - ¿funciona o pantalla en blanco?</li>
        </ol>
        
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '4px',
          border: '1px solid #ffeaa7'
        }}>
          <strong>🎯 IDENTIFICAR PROBLEMA AVANZADO:</strong><br />
          • Si SELECTORES ❌ → problema: exports de selectores<br />
          • Si EXTERNOS ❌ → problema: const externos complejos<br />
          • Si ARRAYS ❌ → problema: arrays/objetos complejos<br />
          • Si todos ✅ → problema está en otra característica aún más específica
        </div>
      </div>
    </div>
  )
}

export default AdvancedTest