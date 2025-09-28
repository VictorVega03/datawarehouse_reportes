// frontend/src/components/DashboardTest.tsx
// COMPONENTE DASHBOARD TEST - MÁS REALISTA

import React, { useEffect } from 'react'
import { 
  useDashboardMetrics, 
  useHourlyPatterns,
  useCasesProgress,
  useDashboardUI,
  useDashboardActions,
  useDashboardError
} from '../stores/dashboardStore'

export const DashboardTest: React.FC = () => {
  // ✅ HOOKS DEL STORE
  const metrics = useDashboardMetrics()
  const hourlyPatterns = useHourlyPatterns()
  const casesProgress = useCasesProgress()
  const ui = useDashboardUI()
  const error = useDashboardError()
  
  const {
    toggleSidebar,
    setCurrentPage,
    setLoading,
    updateFilters,
    setError,
    updateLastFetch
  } = useDashboardActions()

  // ✅ SIMULAR CARGA DE DATOS REAL
  useEffect(() => {
    const simulateDataLoad = async () => {
      setLoading('dashboard', true)
      setError(null)
      
      // Simular delay de API real
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      try {
        updateLastFetch()
        setError(null)
      } catch (err) {
        setError('Error simulado de carga')
      } finally {
        setLoading('dashboard', false)
      }
    }

    simulateDataLoad()
  }, [setLoading, setError, updateLastFetch])

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* HEADER */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '28px' }}>
              📊 Transaction Analytics Dashboard
            </h1>
            <p style={{ margin: 0, color: '#666' }}>
              ✅ Store dashboard funcionando correctamente - Versión realista
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={toggleSidebar}
              style={{
                padding: '8px 16px',
                backgroundColor: ui.sidebarOpen ? '#28a745' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {ui.sidebarOpen ? '👁️ Sidebar ON' : '👁️ Sidebar OFF'}
            </button>
            
            <button 
              onClick={() => setCurrentPage(ui.currentPage === 'dashboard' ? 'analytics' : 'dashboard')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              📄 Página: {ui.currentPage}
            </button>
          </div>
        </div>
      </div>

      {/* STATUS BAR */}
      {(ui.loading.dashboard || error) && (
        <div style={{
          backgroundColor: error ? '#f8d7da' : '#d4edda',
          color: error ? '#721c24' : '#155724',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: `1px solid ${error ? '#f5c6cb' : '#c3e6cb'}`
        }}>
          {ui.loading.dashboard ? '🔄 Cargando datos del dashboard...' : `❌ ${error}`}
        </div>
      )}

      {/* MÉTRICAS PRINCIPALES */}
      {metrics && (
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>
            📈 Métricas Principales
          </h2>
          
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
            
            <div style={{ 
              background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
              color: 'white',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                {metrics.roiRange}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>ROI Range</div>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '15px', 
            fontSize: '12px', 
            color: '#666',
            textAlign: 'right'
          }}>
            🕒 Última actualización: {metrics.lastUpdated}
          </div>
        </div>
      )}

      {/* PATRONES HORARIOS */}
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>
          ⏰ Patrones Horarios (Top 6)
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '10px'
        }}>
          {hourlyPatterns.map((pattern, index) => (
            <div 
              key={pattern.hour}
              style={{
                padding: '15px',
                backgroundColor: pattern.classification === 'peak' ? '#fee' : 
                                pattern.classification === 'high' ? '#fff3cd' : 
                                pattern.classification === 'low' ? '#d1ecf1' : '#f8f9fa',
                borderRadius: '6px',
                border: `2px solid ${
                  pattern.classification === 'peak' ? '#dc3545' :
                  pattern.classification === 'high' ? '#ffc107' :
                  pattern.classification === 'low' ? '#17a2b8' : '#6c757d'
                }`,
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                {pattern.hour}
              </div>
              <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                {pattern.transactions.toLocaleString()} trans
              </div>
              <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                {pattern.percentage}%
              </div>
              <div style={{ 
                fontSize: '10px', 
                marginTop: '5px',
                color: pattern.classification === 'peak' ? '#dc3545' :
                       pattern.classification === 'high' ? '#856404' :
                       pattern.classification === 'low' ? '#0c5460' : '#495057'
              }}>
                {pattern.classification.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CASOS DE USO */}
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>
          📋 Casos de Uso - Estado del Proyecto
        </h2>
        
        <div style={{ display: 'grid', gap: '10px' }}>
          {casesProgress.map((caso, index) => (
            <div 
              key={caso.caseId}
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
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  {index + 1}. {caso.name}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  ROI: {caso.roi}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  backgroundColor: caso.status === 'completed' ? '#d4edda' : '#fff3cd',
                  color: caso.status === 'completed' ? '#155724' : '#856404'
                }}>
                  {caso.status === 'completed' ? '✅ COMPLETADO' : '🔄 EN PROGRESO'}
                </span>
                
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  backgroundColor: caso.priority === 'critical' ? '#f8d7da' :
                                  caso.priority === 'high' ? '#fff3cd' : '#d1ecf1',
                  color: caso.priority === 'critical' ? '#721c24' :
                         caso.priority === 'high' ? '#856404' : '#0c5460'
                }}>
                  {caso.priority.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CONTROLES DE PRUEBA */}
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>
          🎮 Controles de Prueba
        </h2>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => updateFilters({ customerType: 'vip' })}
            style={{
              padding: '10px 15px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🎯 Filtrar VIP
          </button>
          
          <button
            onClick={() => updateFilters({ selectedCase: 'horarios' })}
            style={{
              padding: '10px 15px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ⏰ Caso Horarios
          </button>
          
          <button
            onClick={() => setError('Error de prueba simulado')}
            style={{
              padding: '10px 15px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ❌ Simular Error
          </button>
          
          <button
            onClick={() => setError(null)}
            style={{
              padding: '10px 15px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Limpiar Error
          </button>
        </div>
      </div>
    </div>
  )
}

export default DashboardTest