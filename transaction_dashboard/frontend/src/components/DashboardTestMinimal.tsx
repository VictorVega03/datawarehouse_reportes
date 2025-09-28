// frontend/src/components/DashboardTestMinimal.tsx
// VERSIÓN ULTRA-MÍNIMA PARA DEBUGGING

import React from 'react'
// ✅ USAR EL STORE BÁSICO QUE YA SABEMOS QUE FUNCIONA
import { useBasicStore } from '../stores/basicStore'

export const DashboardTestMinimal: React.FC = () => {
  // ✅ SOLO USAR EL STORE QUE FUNCIONA
  const { message, count, increment, updateMessage } = useBasicStore()

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        📊 Dashboard Test - Versión Mínima Debug
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2>🧪 Store Básico (Confirmado Funcionando)</h2>
        <p><strong>Mensaje:</strong> {message}</p>
        <p><strong>Contador:</strong> {count}</p>
        
        <div style={{ marginTop: '15px' }}>
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
            onClick={() => updateMessage(`Dashboard actualizado: ${new Date().toLocaleTimeString()}`)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Actualizar
          </button>
        </div>
      </div>

      {/* SIMULACIÓN DE MÉTRICAS CON DATOS HARDCODED */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2>📈 Métricas Simuladas (Sin Store Complejo)</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px'
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>2.92M</div>
            <div style={{ fontSize: '11px' }}>Transacciones</div>
          </div>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #48bb78, #38a169)',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>$220M+</div>
            <div style={{ fontSize: '11px' }}>ROI Anual</div>
          </div>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #9f7aea, #805ad5)',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>70%</div>
            <div style={{ fontSize: '11px' }}>Completados</div>
          </div>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #f093fb, #f5576c)',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>29,991</div>
            <div style={{ fontSize: '11px' }}>Clientes</div>
          </div>
        </div>
      </div>

      {/* CASOS DE USO HARDCODED */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2>📋 Casos de Uso (Datos Hardcoded)</h2>
        
        <div style={{ display: 'grid', gap: '8px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px'
          }}>
            <span>1. Patrones Horarios</span>
            <span style={{ color: '#28a745', fontWeight: 'bold' }}>✅ $6.7M</span>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px'
          }}>
            <span>2. Control Caducidad</span>
            <span style={{ color: '#28a745', fontWeight: 'bold' }}>✅ $3.8M</span>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px'
          }}>
            <span>3. Gestión Precios</span>
            <span style={{ color: '#dc3545', fontWeight: 'bold' }}>🔥 $150M</span>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px'
          }}>
            <span>4. Identificación Clientes</span>
            <span style={{ color: '#dc3545', fontWeight: 'bold' }}>🔥 $1.35B</span>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '15px',
        borderRadius: '6px',
        border: '1px solid #c3e6cb'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>
          ✅ Dashboard Mínimo Funcionando
        </h3>
        <p style={{ margin: 0, fontSize: '14px' }}>
          Si ves esto SIN pantalla en blanco, el problema estaba en el store complejo.
          Ahora podemos agregar complejidad gradualmente.
        </p>
      </div>
    </div>
  )
}

export default DashboardTestMinimal