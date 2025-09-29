// frontend/src/App.tsx - VERSIÓN COMPLETA CON NAVEGACIÓN DESDE SIDEBAR
import React, { useState } from 'react'
import { useDashboardMetrics } from './hooks/api/useDashboardMetrics'
import { MainLayout } from './components/layout/MainLayout'
import { PatronesHorariosPage } from './pages/PatronesHorariosPage'
import { 
  Button, 
  Card, 
  Badge, 
  Modal 
} from './components/ui'

function App() {
  const { 
    data: metrics, 
    isLoading: metricsLoading 
  } = useDashboardMetrics()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState<string>('dashboard')

  // Función para manejar navegación
  const handleNavigate = (page: string) => {
    setCurrentPage(page)
  }

  // Si estamos en la página de patrones horarios
  if (currentPage === 'patrones') {
    return (
      <MainLayout onNavigate={handleNavigate} activePage={currentPage}>
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={() => handleNavigate('dashboard')}
            leftIcon={<span>←</span>}
          >
            Volver al Dashboard
          </Button>
        </div>
        <PatronesHorariosPage />
      </MainLayout>
    )
  }

  // Dashboard principal
  return (
    <MainLayout onNavigate={handleNavigate} activePage={currentPage}>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Principal</h1>
            <p className="text-gray-600 mt-1">
              Vista general del sistema de análisis de transacciones
            </p>
          </div>
          <Badge variant="success" size="lg">
            Paso 9 Completado
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card padding="md" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Transacciones</p>
              <p className="text-3xl font-bold text-blue-600">
                {metrics?.totalTransactions?.value || '2.92M'}
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
                {metrics?.annualROI?.value || '$220M+'}
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </Card>

        <Card padding="md" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Clientes Únicos</p>
              <p className="text-3xl font-bold text-purple-600">29,991</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </Card>

        <Card padding="md" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Casos Completados</p>
              <p className="text-3xl font-bold text-orange-600">70%</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </Card>
      </div>

      {/* Quick Access to Charts */}
      <Card className="mb-8">
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
              onClick={() => handleNavigate('patrones')}
              leftIcon={<span>🕐</span>}
            >
              Ver Patrones Horarios
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
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
                onClick={() => handleNavigate('patrones')}
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
            Progreso del Proyecto
          </h2>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="success">✓</Badge>
                <span className="text-sm">Configuración Base</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">✓</Badge>
                <span className="text-sm">Variables de Entorno</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">✓</Badge>
                <span className="text-sm">API Client</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">✓</Badge>
                <span className="text-sm">Stores Zustand</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">✓</Badge>
                <span className="text-sm">Componentes UI Base</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="success">✓</Badge>
                <span className="text-sm">Layout Principal</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">✓</Badge>
                <span className="text-sm">Primer Gráfico Nivo</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="warning">⏳</Badge>
                <span className="text-sm">Más Gráficos y Casos</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">○</Badge>
                <span className="text-sm">Sistema de Filtros</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">○</Badge>
                <span className="text-sm">Dashboard Completo</span>
              </div>
            </div>
          </div>
        </Card.Body>
        <Card.Footer>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Completado: 9/12 pasos (75%)
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                Ver Detalles
              </Button>
              <Button 
                size="sm" 
                variant="primary"
                onClick={() => handleNavigate('patrones')}
              >
                Ver Gráficos
              </Button>
            </div>
          </div>
        </Card.Footer>
      </Card>

      {/* Modal de ejemplo */}
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
              El sistema está completamente operativo con el primer gráfico Nivo funcionando.
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Logros del Paso 9:</h4>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>Gráfico de barras con Nivo implementado</li>
              <li>Datos del backend conectados correctamente</li>
              <li>Tooltips interactivos funcionando</li>
              <li>Página completa de Patrones Horarios</li>
              <li>Tabla de datos detallada</li>
              <li>Navegación desde sidebar funcional</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Próximos Pasos:</h4>
            <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
              <li>Implementar más gráficos para otros casos</li>
              <li>Agregar sistema de filtros</li>
              <li>Implementar exportación de datos</li>
              <li>Agregar más visualizaciones interactivas</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={() => {
              setIsModalOpen(false)
              handleNavigate('patrones')
            }}>
              Ver Gráficos
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  )
}

export default App