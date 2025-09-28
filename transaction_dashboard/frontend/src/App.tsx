// frontend/src/App.tsx
// VERSIÓN BÁSICA PARA PASO 3 - Solo para verificar que React funciona

import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🚀</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Transaction Analytics Dashboard
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Frontend React funcionando correctamente
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            ✅ PASO 3 Completado
          </h2>
          <div className="space-y-2 text-left">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>index.html cargado</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>main.tsx ejecutado</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>React funcionando</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>TanStack Query configurado</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Siguiente:</strong> PASO 4 - API Client
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Backend esperado en: http://localhost:3001</p>
          <p>Frontend corriendo en: http://localhost:3000</p>
        </div>
      </div>
    </div>
  )
}

export default App