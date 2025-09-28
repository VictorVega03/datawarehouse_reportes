// frontend/src/components/DashboardTestGradual.tsx
// DASHBOARD CON STORE GRADUAL - MÁS COMPLEJO QUE MÍNIMO

import React, { useEffect } from 'react'
import { 
  useMetrics, 
  useUI, 
  useLastUpdated,
  useDashboardActionsGradual 
} from '../stores/dashboardStoreGradual'

export const DashboardTestGradual: React.FC = () => {
  // ✅ USAR STORE GRADUAL (más complejo que básico, menos que completo)
  const metrics = useMetrics()
  const ui = useUI()
  const lastUpdated = useLastUpdated()
  
  const { 
    setMetrics, 
    toggleSidebar, 
    setCurrentPage, 
    updateTimestamp 
  } = useDashboardActionsGradual()

  // ✅ EFECTO PARA SIMULAR UPDATES
  useEffect(() => {
    const interval = setInterval(() => {
      updateTimestamp()
    }, 5000) // Actualizar cada 5 segundos

    return () => clearInterval(interval)
  }, [updateTimestamp])

  // ✅ FUNCIÓN PARA ACTUALIZAR MÉTRICAS
  const handleUpdateMetrics = () => {
    const newMetrics = {
      totalTransactions: '2.92M',
      totalRevenue: `$${Math.floor(220 + Math.random() * 50)}M+`,
      completedCases: `${Math.floor(70 + Math.random() * 10)}%`,
      uniqueCustomers: `${Math.floor(29000 + Math.random() * 2000).toLocaleString()}`
    }
    setMetrics(newMetrics)
  }

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* HEADER CON STORE STATE */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>
              📊 Dashboard Test - Store Gradual
            </h1>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              ✅ Usando store intermedio | Página actual: <strong>{ui.currentPage}</strong> | 
              Sidebar: <strong>{ui.sidebarOpen ? 'Abierto' : 'Cerrado'}</strong>
            </p>
          </div>
          
          <div style={{ fontSize: '12px', color: '#999' }}>
            🕒 Última actualización: {lastUpdated}
          </div>
        </div>
      </div>

      {/* MÉTRICAS DESDE STORE */}
      {metrics && (
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, color: '#333' }}>
              📈 Métricas desde Store Gradual
            </h2>
            <button
              onClick={handleUpdateMetrics}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🔄 Actualizar Métricas
            </button>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
                {metrics.totalTransactions}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Transacciones</div>
            </div>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #48bb78, #38a169)',
              color: 'white',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
                {metrics.totalRevenue}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>ROI Anual</div>
            </div>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #9f7aea, #805ad5)',
              color: 'white',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
                {metrics.completedCases}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Casos Completados</div>
            </div>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #f093fb, #f5576c)',
              color: 'white',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
                {metrics.uniqueCustomers}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Clientes Únicos</div>
            </div>
          </div>
        </div>
      )}

      {/* CONTROLES DEL STORE */}
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>
          🎮 Controles del Store Gradual
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <button
            onClick={toggleSidebar}
            style={{
              padding: '15px',
              backgroundColor: ui.sidebarOpen ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            👁️ Toggle Sidebar
            <br />
            <small style={{ opacity: 0.8 }}>
              Estado: {ui.sidebarOpen ? 'Abierto' : 'Cerrado'}
            </small>
          </button>
          
          <button
            onClick={() => setCurrentPage(ui.currentPage === 'dashboard' ? 'analytics' : 'dashboard')}
            style={{
              padding: '15px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            📄 Cambiar Página
            <br />
            <small style={{ opacity: 0.8 }}>
              Actual: {ui.currentPage}
            </small>
          </button>
          
          <button
            onClick={updateTimestamp}
            style={{
              padding: '15px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🕒 Update Timestamp
            <br />
            <small style={{ opacity: 0.8 }}>
              Manual
            </small>
          </button>
          
          <button
            onClick={handleUpdateMetrics}
            style={{
              padding: '15px',
              backgroundColor: '#ffc107',
              color: '#212529',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            📊 Random Metrics
            <br />
            <small style={{ opacity: 0.8 }}>
              Generar nuevos
            </small>
          </button>
        </div>
      </div>

      {/* CASOS DE USO HARDCODED (para mantener simple) */}
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>
          📋 Casos de Uso (Hardcoded - Sin Store Complejo)
        </h2>
        
        <div style={{ display: 'grid', gap: '10px' }}>
          {[
            { name: 'Patrones Horarios', roi: '$6.7M', status: 'completed' },
            { name: 'Control Caducidad', roi: '$3.8M', status: 'completed' },
            { name: 'Gestión Precios', roi: '$150M', status: 'completed' },
            { name: 'Identificación Clientes', roi: '$1.35B', status: 'completed' },
            { name: 'Seguimiento Inventario', roi: '$56.3M', status: 'completed' }
          ].map((caso, index) => (
            <div 
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                border: '1px solid #dee2e6'
              }}
            >
              <span style={{ fontWeight: 'bold' }}>
                {index + 1}. {caso.name}
              </span>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                  {caso.roi}
                </span>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  backgroundColor: '#d4edda',
                  color: '#155724'
                }}>
                  ✅ COMPLETADO
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STATUS */}
      <div style={{
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #c3e6cb'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>
          ✅ Dashboard con Store Gradual Funcionando
        </h3>
        <p style={{ margin: 0, fontSize: '14px' }}>
          Si ves esto SIN pantalla en blanco, el store gradual funciona correctamente.
          Esto nos dice que el problema estaba en el store complejo original.
        </p>
        <div style={{ marginTop: '10px', fontSize: '12px', opacity: 0.8 }}>
          Store state: metrics={metrics ? 'loaded' : 'null'} | 
          sidebar={ui.sidebarOpen ? 'open' : 'closed'} | 
          page={ui.currentPage} | 
          updated={lastUpdated}
        </div>
      </div>
    </div>
  )
}

export default DashboardTestGradual