// frontend/src/App.tsx
// VERSIÓN CORREGIDA - IMPORTS DIRECTOS SIMPLES

import { useState } from 'react'

// ✅ IMPORTS DIRECTOS NORMALES
import BasicStoreTest from './components/BasicStoreTest'
import DashboardTestMinimal from './components/DashboardTestMinimal'
import IncrementalTest from './components/increementalTest'
import AdvancedTest from './components/AdvancedTest'

type TestMode = 'none' | 'basic' | 'minimal' | 'incremental' | 'advanced'

function App() {
  const [testMode, setTestMode] = useState<TestMode>('none')

  // 🔍 DEBUG: Verificar estado actual
  console.log('🔍 App.tsx - Estado actual testMode:', testMode)

  // Si se seleccionó modo básico
  if (testMode === 'basic') {
    return <BasicStoreTest />
  }

  // Si se seleccionó modo mínimo
  if (testMode === 'minimal') {
    return <DashboardTestMinimal />
  }

  // Si se seleccionó modo incremental
  if (testMode === 'incremental') {
    return <IncrementalTest />
  }

  // Si se seleccionó modo avanzado
  if (testMode === 'advanced') {
    console.log('✅ Renderizando AdvancedTest...')
    try {
      return <AdvancedTest />
    } catch (error) {
      console.error('❌ Error renderizando AdvancedTest:', error)
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
          ❌ Error cargando AdvancedTest
          <br />
          <button onClick={() => setTestMode('none')}>🔙 Volver</button>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🔬</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Transaction Analytics Dashboard
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          🔧 DEBUG MODE - Imports Directos (Simplificado)
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            🎯 TEST IDENTIFICAR PROBLEMA
          </h2>
          
          <div className="space-y-2 text-left text-sm text-gray-600 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span>React funcionando</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span>BasicStoreTest (import directo)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span>DashboardTestMinimal (import directo)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span>IncrementalTest (import directo)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-purple-500">🧪</span>
              <span>AdvancedTest (características complejas)</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                console.log("🧪 Cargando BasicStoreTest...")
                setTestMode('basic')
              }}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium text-sm"
            >
              🧪 Store Básico ✅ (Control)
            </button>

            <button
              onClick={() => {
                console.log("🔍 Cargando DashboardTestMinimal...")
                setTestMode('minimal')
              }}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium text-sm"
            >
              🔍 Dashboard Mínimo ✅ (Ya funciona)
            </button>

            <button
              onClick={() => {
                console.log("🔬 Cargando IncrementalTest...")
                setTestMode('incremental')
              }}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              🔬 TEST INCREMENTAL - IDENTIFICAR PROBLEMA
            </button>

            <button
              onClick={() => {
                console.log("🧪 Botón clicked - Cambiando a testMode: 'advanced'")
                setTestMode('advanced')
                console.log("🧪 setTestMode('advanced') ejecutado")
              }}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition-colors font-medium"
            >
              🧪 TEST AVANZADO - CARACTERÍSTICAS COMPLEJAS
            </button>
            
            <button
              onClick={() => setTestMode('none')}
              className="w-full bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500 transition-colors font-medium text-sm"
            >
              🔙 Volver al Debug
            </button>
          </div>

          <div className="mt-6 p-4 bg-red-50 rounded-md border border-red-200">
            <h3 className="text-sm font-semibold text-red-800 mb-2">
              🔬 IDENTIFICAR PROBLEMA EXACTO:
            </h3>
            <div className="text-xs text-red-600 space-y-1 text-left">
              <div>✅ Imports directos (sin lazy loading)</div>
              <div>✅ Sin require() problemático</div>
              <div>🎯 Probar botón rojo para identificar problema</div>
              <div>🎯 Probar cada característica secuencialmente</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-xs text-blue-700">
              <strong>🎯 Objetivo:</strong> Identificar exactamente qué característica del store Zustand causa el crash.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App