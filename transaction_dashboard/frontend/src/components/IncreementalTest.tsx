// frontend/src/components/IncrementalTest.tsx
// VERSIÓN AUTO-CONTENIDA - TODOS LOS STORES INCLUIDOS

import React, { useState } from 'react'
import { create } from 'zustand'
import { useBasicStore } from '../stores/basicStore'

// ✅ STORE 1: OBJETO ANIDADO
interface TestMetrics {
  transactions: string
  revenue: string
}

interface StoreWithObject {
  message: string
  count: number
  metrics: TestMetrics  // 🔍 DIFERENCIA: objeto anidado
  updateMessage: (msg: string) => void
  increment: () => void
  updateMetrics: (metrics: TestMetrics) => void
}

const useStoreWithObject = create<StoreWithObject>((set) => ({
  message: "Store con objeto",
  count: 0,
  metrics: {
    transactions: '2.92M',
    revenue: '$220M+'
  },
  updateMessage: (msg) => set({ message: msg }),
  increment: () => set((state) => ({ count: state.count + 1 })),
  updateMetrics: (metrics) => set({ metrics })
}))

// ✅ STORE 2: TIPOS NULL
interface StoreWithNull {
  message: string
  count: number
  nullData: string | null  // 🔍 DIFERENCIA: tipo nullable
  updateMessage: (msg: string) => void
  increment: () => void
  setNull: (data: string | null) => void
}

const useStoreWithNull = create<StoreWithNull>((set) => ({
  message: "Store con null",
  count: 0,
  nullData: null,  // 🔍 DIFERENCIA: valor null inicial
  updateMessage: (msg) => set({ message: msg }),
  increment: () => set((state) => ({ count: state.count + 1 })),
  setNull: (data) => set({ nullData: data })
}))

// ✅ STORE 3: SPREAD OPERATOR
interface UIState {
  sidebarOpen: boolean
  theme: string
}

interface StoreWithSpread {
  message: string
  count: number
  ui: UIState
  updateMessage: (msg: string) => void
  increment: () => void
  toggleSidebar: () => void
}

const useStoreWithSpread = create<StoreWithSpread>((set) => ({
  message: "Store con spread",
  count: 0,
  ui: {
    sidebarOpen: true,
    theme: 'light'
  },
  updateMessage: (msg) => set({ message: msg }),
  increment: () => set((state) => ({ count: state.count + 1 })),
  toggleSidebar: () => set((state) => ({  // 🔍 DIFERENCIA: spread operator
    ui: {
      ...state.ui,
      sidebarOpen: !state.ui.sidebarOpen
    }
  }))
}))

// ✅ STORE 4: NEW DATE()
interface StoreWithDate {
  message: string
  count: number
  lastUpdated: string
  updateMessage: (msg: string) => void
  increment: () => void
  updateTime: () => void
}

const useStoreWithDate = create<StoreWithDate>((set) => ({
  message: "Store con date",
  count: 0,
  lastUpdated: new Date().toLocaleTimeString(),  // 🔍 DIFERENCIA: new Date()
  updateMessage: (msg) => set({ message: msg }),
  increment: () => set((state) => ({ count: state.count + 1 })),
  updateTime: () => set({
    lastUpdated: new Date().toLocaleTimeString()  // 🔍 DIFERENCIA: new Date() en action
  })
}))

// ✅ COMPONENTE PRINCIPAL
export const IncrementalTest: React.FC = () => {
  const [activeTest, setActiveTest] = useState<'basic' | 'object' | 'null' | 'spread' | 'date' | null>(null)

  // ✅ STORES
  const basicStore = useBasicStore()
  const objectStore = useStoreWithObject()
  const nullStore = useStoreWithNull()
  const spreadStore = useStoreWithSpread()
  const dateStore = useStoreWithDate()

  const renderTest = () => {
    if (activeTest === 'basic') {
      return (
        <div style={{ padding: '20px', backgroundColor: '#d4edda', borderRadius: '8px' }}>
          <h3>✅ TEST BÁSICO (Control - Sabemos que funciona)</h3>
          <p><strong>Mensaje:</strong> {basicStore.message}</p>
          <p><strong>Contador:</strong> {basicStore.count}</p>
          <button 
            onClick={basicStore.increment}
            style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            ➕ Incrementar
          </button>
          <button 
            onClick={() => basicStore.updateMessage(`Básico: ${new Date().toLocaleTimeString()}`)}
            style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            🔄 Actualizar
          </button>
        </div>
      )
    }

    if (activeTest === 'object') {
      return (
        <div style={{ padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
          <h3>🔍 TEST OBJETO - Store con objeto anidado</h3>
          <p><strong>Mensaje:</strong> {objectStore.message}</p>
          <p><strong>Contador:</strong> {objectStore.count}</p>
          <p><strong>Transacciones:</strong> {objectStore.metrics.transactions}</p>
          <p><strong>Revenue:</strong> {objectStore.metrics.revenue}</p>
          <button 
            onClick={objectStore.increment}
            style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            ➕ Incrementar
          </button>
          <button 
            onClick={() => objectStore.updateMetrics({ transactions: '3.5M', revenue: '$250M+' })}
            style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            📊 Actualizar Objeto
          </button>
        </div>
      )
    }

    if (activeTest === 'null') {
      return (
        <div style={{ padding: '20px', backgroundColor: '#f8d7da', borderRadius: '8px' }}>
          <h3>🔍 TEST NULL - Store con tipos nullable</h3>
          <p><strong>Mensaje:</strong> {nullStore.message}</p>
          <p><strong>Contador:</strong> {nullStore.count}</p>
          <p><strong>Null Data:</strong> {nullStore.nullData || '(null)'}</p>
          <button 
            onClick={nullStore.increment}
            style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            ➕ Incrementar
          </button>
          <button 
            onClick={() => nullStore.setNull('Datos cargados')}
            style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            📝 Set Data
          </button>
          <button 
            onClick={() => nullStore.setNull(null)}
            style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            ❌ Set Null
          </button>
        </div>
      )
    }

    if (activeTest === 'spread') {
      return (
        <div style={{ padding: '20px', backgroundColor: '#d1ecf1', borderRadius: '8px' }}>
          <h3>🔍 TEST SPREAD - Store con spread operator</h3>
          <p><strong>Mensaje:</strong> {spreadStore.message}</p>
          <p><strong>Contador:</strong> {spreadStore.count}</p>
          <p><strong>Sidebar:</strong> {spreadStore.ui.sidebarOpen ? 'Abierto' : 'Cerrado'}</p>
          <p><strong>Tema:</strong> {spreadStore.ui.theme}</p>
          <button 
            onClick={spreadStore.increment}
            style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            ➕ Incrementar
          </button>
          <button 
            onClick={spreadStore.toggleSidebar}
            style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            👁️ Toggle Sidebar (Spread)
          </button>
        </div>
      )
    }

    if (activeTest === 'date') {
      return (
        <div style={{ padding: '20px', backgroundColor: '#ffeaa7', borderRadius: '8px' }}>
          <h3>🔍 TEST DATE - Store con new Date()</h3>
          <p><strong>Mensaje:</strong> {dateStore.message}</p>
          <p><strong>Contador:</strong> {dateStore.count}</p>
          <p><strong>Última actualización:</strong> {dateStore.lastUpdated}</p>
          <button 
            onClick={dateStore.increment}
            style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            ➕ Incrementar
          </button>
          <button 
            onClick={dateStore.updateTime}
            style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            🕒 Actualizar Timestamp
          </button>
        </div>
      )
    }

    return null
  }

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        🔬 Test Incremental - Identificar Problema Exacto
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '15px' }}>Probar Cada Característica Individualmente:</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
          <button
            onClick={() => setActiveTest('basic')}
            style={{
              padding: '12px',
              backgroundColor: activeTest === 'basic' ? '#28a745' : '#e9ecef',
              color: activeTest === 'basic' ? 'white' : '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '12px'
            }}
          >
            ✅ BÁSICO
            <br />
            <small style={{ opacity: 0.8 }}>Control</small>
          </button>
          
          <button
            onClick={() => setActiveTest('object')}
            style={{
              padding: '12px',
              backgroundColor: activeTest === 'object' ? '#ffc107' : '#e9ecef',
              color: activeTest === 'object' ? '#212529' : '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '12px'
            }}
          >
            🔍 OBJETO
            <br />
            <small style={{ opacity: 0.8 }}>+ objeto</small>
          </button>
          
          <button
            onClick={() => setActiveTest('null')}
            style={{
              padding: '12px',
              backgroundColor: activeTest === 'null' ? '#dc3545' : '#e9ecef',
              color: activeTest === 'null' ? 'white' : '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '12px'
            }}
          >
            🔍 NULL
            <br />
            <small style={{ opacity: 0.8 }}>+ nullable</small>
          </button>

          <button
            onClick={() => setActiveTest('spread')}
            style={{
              padding: '12px',
              backgroundColor: activeTest === 'spread' ? '#17a2b8' : '#e9ecef',
              color: activeTest === 'spread' ? 'white' : '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '12px'
            }}
          >
            🔍 SPREAD
            <br />
            <small style={{ opacity: 0.8 }}>+ spread</small>
          </button>

          <button
            onClick={() => setActiveTest('date')}
            style={{
              padding: '12px',
              backgroundColor: activeTest === 'date' ? '#fd7e14' : '#e9ecef',
              color: activeTest === 'date' ? 'white' : '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '12px'
            }}
          >
            🔍 DATE
            <br />
            <small style={{ opacity: 0.8 }}>+ new Date()</small>
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
        <h3 style={{ marginBottom: '10px' }}>📋 Instrucciones de Prueba:</h3>
        <ol style={{ fontSize: '14px', lineHeight: '1.5' }}>
          <li><strong>BÁSICO primero</strong> - debe funcionar siempre</li>
          <li><strong>OBJETO</strong> - ¿funciona o pantalla en blanco?</li>
          <li><strong>NULL</strong> - ¿funciona o pantalla en blanco?</li>
          <li><strong>SPREAD</strong> - ¿funciona o pantalla en blanco?</li>
          <li><strong>DATE</strong> - ¿funciona o pantalla en blanco?</li>
          <li><strong>Reportar</strong> cuál es el primero que falla</li>
        </ol>
        
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '4px',
          border: '1px solid #ffeaa7'
        }}>
          <strong>🎯 IDENTIFICAR PROBLEMA:</strong><br />
          • Si BÁSICO ✅ pero OBJETO ❌ → problema: objetos anidados<br />
          • Si OBJETO ✅ pero NULL ❌ → problema: tipos nullable<br />
          • Si NULL ✅ pero SPREAD ❌ → problema: spread operator<br />
          • Si SPREAD ✅ pero DATE ❌ → problema: new Date()<br />
          • Si todos ✅ → problema está en otra característica
        </div>
      </div>
    </div>
  )
}

export default IncrementalTest