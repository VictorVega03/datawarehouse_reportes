// frontend/src/features/dashboard/pages/DashboardHomePage.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDashboardMetrics } from '../hooks/useDashboardMetrics'
import { 
  Button, 
  Card, 
  Badge, 
  Modal 
} from '../../../components/ui'

/**
 * DashboardHomePage Component
 * 
 * Main dashboard page showing:
 * - Key metrics overview (transactions, ROI, customers)
 * - Quick access buttons to all use cases
 * - System status
 * - Quick actions
 * - Project progress tracker
 */
export const DashboardHomePage: React.FC = () => {
  const navigate = useNavigate()
  const { 
    data: metrics, 
    isLoading: metricsLoading,
    error: metricsError
  } = useDashboardMetrics()

  const [isModalOpen, setIsModalOpen] = useState(false)

  // 🔍 DEBUG - Ver qué datos llegan
  console.log('📊 Metrics completo:', metrics)
  console.log('📊 Total Transactions:', metrics?.totalTransactions)
  console.log('📊 Unique Customers:', metrics?.uniqueCustomers)
  console.log('📊 Completion Rate:', metrics?.completionRate)
  console.log('📊 Loading:', metricsLoading)
  console.log('📊 Error:', metricsError)

  // Determinar si hay datos válidos
  const hasValidData = metrics && !metricsLoading && !metricsError

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Principal</h1>
            <p className="text-gray-600 mt-1">
              Vista general del sistema de análisis de transacciones
            </p>
          </div>
          <Badge variant={metricsLoading ? 'warning' : metricsError ? 'danger' : 'success'} size="lg">
            {metricsLoading ? 'Cargando...' : metricsError ? 'Error Conexión' : 'Sistema Operativo'}
          </Badge>
        </div>
      </div>

      {/* Error Alert */}
      {metricsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-900">Error de Conexión</h3>
              <p className="text-sm text-red-700">
                No se pudo conectar con el backend. Verifica que el servidor esté corriendo en http://localhost:3001
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card padding="md" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Transacciones</p>
              <p className="text-3xl font-bold text-blue-600">
                {metricsLoading ? (
                  <span className="animate-pulse">...</span>
                ) : metricsError ? (
                  <span className="text-red-600">Error</span>
                ) : (
                  metrics?.totalTransactions?.value || 'N/A'
                )}
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </Card>

        <Card padding="md" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">ROI Anual</p>
              <p className="text-3xl font-bold text-green-600">
                {metricsLoading ? (
                  <span className="animate-pulse">...</span>
                ) : metricsError ? (
                  <span className="text-red-600">Error</span>
                ) : (
                  metrics?.annualROI?.value || 'N/A'
                )}
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </Card>

        <Card padding="md" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Clientes Únicos</p>
              <p className="text-3xl font-bold text-purple-600">
                {metricsLoading ? (
                  <span className="animate-pulse">...</span>
                ) : metricsError ? (
                  <span className="text-red-600">Error</span>
                ) : hasValidData && metrics?.uniqueCustomers?.value ? (
                  metrics.uniqueCustomers.value
                ) : (
                  <span className="text-gray-400">No disponible</span>
                )}
              </p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </Card>

        <Card padding="md" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Casos Completados</p>
              <p className="text-3xl font-bold text-orange-600">
                {metricsLoading ? (
                  <span className="animate-pulse">...</span>
                ) : metricsError ? (
                  <span className="text-red-600">Error</span>
                ) : hasValidData && metrics?.completionRate?.value ? (
                  metrics.completionRate.value
                ) : (
                  <span className="text-gray-400">1/7</span>
                )}
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </Card>
      </div>

      {/* Quick Access to Use Cases */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-800">
            Casos de Uso - Acceso Rápido
          </h2>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate('/casos/horarios')}
              leftIcon={<span>🕐</span>}
            >
              Patrones Horarios
            </Button>
            <Button
              variant="outline"
              fullWidth
              disabled
              leftIcon={<span>📅</span>}
            >
              Control Caducidad (Próximamente)
            </Button>
            <Button
              variant="outline"
              fullWidth
              disabled
              leftIcon={<span>💰</span>}
            >
              Gestión Precios (Próximamente)
            </Button>
            <Button
              variant="outline"
              fullWidth
              disabled
              leftIcon={<span>👥</span>}
            >
              Identificación Clientes (Próximamente)
            </Button>
            <Button
              variant="outline"
              fullWidth
              disabled
              leftIcon={<span>📦</span>}
            >
              Seguimiento Inventario (Próximamente)
            </Button>
            <Button
              variant="outline"
              fullWidth
              disabled
              leftIcon={<span>💳</span>}
            >
              Métodos de Pago (Próximamente)
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Estado del Sistema */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-800">
              Estado del Sistema
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-gray-900">Backend API</span>
                </div>
                <Badge variant="success">Conectado</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-gray-900">Base de Datos</span>
                </div>
                <Badge variant="primary">Operativa</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-gray-900">Gráficos Nivo</span>
                </div>
                <Badge variant="primary">Funcionando</Badge>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Quick Actions */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-800">
              Acciones Rápidas
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              <Button 
                variant="primary" 
                fullWidth
                leftIcon={<span>📊</span>}
                onClick={() => navigate('/casos/horarios')}
              >
                Ver Patrones Horarios
              </Button>
              <Button 
                variant="success" 
                fullWidth
                leftIcon={<span>📈</span>}
              >
                Generar Reporte
              </Button>
              <Button 
                variant="outline" 
                fullWidth
                leftIcon={<span>⚙️</span>}
              >
                Configurar Alertas
              </Button>
              <Button 
                variant="secondary" 
                fullWidth
                onClick={() => setIsModalOpen(true)}
                leftIcon={<span>ℹ️</span>}
              >
                Ver Información del Sistema
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Progress Section */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-800">
            Progreso de Refactorización
          </h2>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="success">✓</Badge>
                <span className="text-sm">Backend Refactorizado</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">✓</Badge>
                <span className="text-sm">Caso Horarios Backend</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">✓</Badge>
                <span className="text-sm">Frontend Shared Utilities</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">✓</Badge>
                <span className="text-sm">Caso Horarios Frontend</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">✓</Badge>
                <span className="text-sm">React Router Configurado</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="success">✓</Badge>
                <span className="text-sm">API Endpoints Nuevos</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">✓</Badge>
                <span className="text-sm">Hooks TanStack Query</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="warning">⏳</Badge>
                <span className="text-sm">Caso Caducidad</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">○</Badge>
                <span className="text-sm">Casos Restantes (5)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">○</Badge>
                <span className="text-sm">Documentación Frontend</span>
              </div>
            </div>
          </div>
        </Card.Body>
        <Card.Footer>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Completado: Caso Horarios (14%)
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                Ver Detalles
              </Button>
              <Button 
                size="sm" 
                variant="primary"
                onClick={() => navigate('/casos/horarios')}
              >
                Ver Caso Horarios
              </Button>
            </div>
          </div>
        </Card.Footer>
      </Card>

      {/* Modal de Información */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Información del Sistema"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Estado Actual:</h4>
            <p className="text-gray-600 text-sm">
              Sistema refactorizado con arquitectura modular por casos de uso. El caso de Patrones Horarios está completamente funcional.
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Refactorización Completada:</h4>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>Backend con estructura features/casos/*</li>
              <li>Frontend con estructura features/casos/*</li>
              <li>React Router v6 configurado</li>
              <li>Caso Horarios completamente funcional</li>
              <li>API endpoints nuevos: /api/v1/casos/horarios/*</li>
              <li>Compatibilidad con endpoints antiguos mantenida</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Próximos Pasos:</h4>
            <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
              <li>Implementar caso de Control de Caducidad</li>
              <li>Implementar los 5 casos restantes</li>
              <li>Agregar sistema de filtros global</li>
              <li>Implementar exportación de datos</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={() => {
              setIsModalOpen(false)
              navigate('/casos/horarios')
            }}>
              Ver Caso Horarios
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
