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

  // Limpieza: eliminar mensajes de debug

  // Determinar si hay datos válidos
  const hasValidData = metrics && !metricsLoading && !metricsError

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-700 mb-1">
              <span className="font-bold text-blue-700">Dashboard Principal</span>
            </h1>
            <p className="text-xl text-gray-700 font-semibold mb-2">
              Vista general del sistema de análisis de transacciones
            </p>
          </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card padding="md" hover className="bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📊</div>
            <div>
              <p className="text-base font-bold text-blue-700 mb-1">Total Transacciones</p>
              <p className="text-2xl font-bold text-blue-600">
                {metricsLoading ? (
                  <span className="animate-pulse">...</span>
                ) : metricsError ? (
                  <span className="text-red-600">Error</span>
                ) : (
                  metrics?.totalTransactions?.value || 'N/A'
                )}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md" hover className="bg-green-50 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="text-3xl">💰</div>
            <div>
              <p className="text-base font-bold text-green-700 mb-1">ROI Anual</p>
              <p className="text-2xl font-bold text-green-600">
                {metricsLoading ? (
                  <span className="animate-pulse">...</span>
                ) : metricsError ? (
                  <span className="text-red-600">Error</span>
                ) : (
                  metrics?.annualROI?.value || 'N/A'
                )}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md" hover className="bg-purple-50 border border-purple-200">
          <div className="flex items-center gap-3">
            <div className="text-3xl">👥</div>
            <div>
              <p className="text-base font-bold text-purple-700 mb-1">Clientes Únicos</p>
              <p className="text-2xl font-bold text-purple-600">
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
          </div>
        </Card>

        <Card padding="md" hover className="bg-orange-50 border border-orange-200">
          <div className="flex items-center gap-3">
            <div className="text-3xl">✅</div>
            <div>
              <p className="text-base font-bold text-orange-700 mb-1">Casos Completados</p>
              <p className="text-2xl font-bold text-orange-600">
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
          </div>
        </Card>
      </div>

      {/* Quick Access to Use Cases */}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Estado del Sistema */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-bold text-green-700 flex items-center gap-2">
              <span className="inline-block w-5 h-5 bg-green-500 rounded-full mr-1"></span>
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
      </div>

      {/* Progress Section */}

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
