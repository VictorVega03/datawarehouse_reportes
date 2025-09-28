// frontend/src/components/BasicStoreTest.tsx
// COMPONENTE ULTRA-BÁSICO PARA DEBUGGING

import React from 'react'
import { useBasicStore } from '../stores/basicStore'

export const BasicStoreTest: React.FC = () => {
  // ✅ USAR EL STORE MÁS BÁSICO
  const { message, count, updateMessage, increment } = useBasicStore()

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px'
    }}>
      <h1 style={{ color: '#333' }}>🧪 Store Ultra-Básico Test</h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        marginBottom: '20px',
        borderRadius: '4px'
      }}>
        <h2>📦 Estado del Store:</h2>
        <p><strong>Mensaje:</strong> {message}</p>
        <p><strong>Contador:</strong> {count}</p>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '4px'
      }}>
        <h3>🎮 Controles:</h3>
        <button 
          onClick={increment}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ➕ Incrementar ({count})
        </button>
        
        <button 
          onClick={() => updateMessage(`Actualizado a las ${new Date().toLocaleTimeString()}`)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Actualizar Mensaje
        </button>
      </div>

      <div style={{ 
        backgroundColor: '#d4edda', 
        padding: '15px', 
        marginTop: '20px',
        borderRadius: '4px',
        border: '1px solid #c3e6cb'
      }}>
        <h4 style={{ color: '#155724', margin: '0 0 10px 0' }}>
          ✅ Si ves esto, el store básico funciona
        </h4>
        <p style={{ color: '#155724', margin: 0, fontSize: '14px' }}>
          Zustand está funcionando correctamente. El problema puede estar en imports complejos.
        </p>
      </div>
    </div>
  )
}

export default BasicStoreTest