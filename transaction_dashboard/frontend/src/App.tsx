// frontend/src/App.tsx - VERSIÓN DE PRUEBA CON COMPONENTES UI
import React, { useState } from 'react'
import { useDashboardMetrics, useApiConnectionTest } from './hooks/api/useDashboardMetrics'
import { 
  Button, 
  Card, 
  Badge, 
  Spinner, 
  Input, 
  Modal 
} from './components/ui'

function App() {
  const { 
    data: metrics, 
    isLoading: metricsLoading, 
    isError: metricsError 
  } = useDashboardMetrics()
  
  const { 
    data: connectionTest, 
    isLoading: connectionLoading 
  } = useApiConnectionTest()

  // Estados para el modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Transaction Analytics Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Frontend ↔ Backend conectados correctamente
          </p>
          <Badge variant="success" size="lg">
            ✅ PASO 7 Completado - Componentes UI Base
          </Badge>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Card 1: Estado de Conexión */}
          <Card hover>
            <Card.Header>
              <h2 className="text-2xl font-semibold text-gray-800">
                🔌 Estado de Conexión API
              </h2>
            </Card.Header>
            <Card.Body>
              {connectionLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Spinner size="lg" />
                  <span className="ml-3 text-gray-600">Verificando conexión...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Backend (puerto 3001)</span>
                    <Badge variant="success">
                      {connectionTest?.backend ? 'Conectado' : 'Desconectado'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700">API Endpoints</span>
                    <Badge variant="primary">
                      {connectionTest?.api ? 'Funcionando' : 'Error'}
                    </Badge>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Card 2: Métricas del Dashboard */}
          <Card hover>
            <Card.Header>
              <h2 className="text-2xl font-semibold text-gray-800">
                📊 Métricas del Dashboard
              </h2>
            </Card.Header>
            <Card.Body>
              {metricsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Spinner size="lg" />
                </div>
              ) : metricsError ? (
                <div className="text-red-600 text-center py-4">
                  Error al cargar métricas
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">
                      {metrics?.totalTransactions?.value || '2.92M'}
                    </div>
                    <div className="text-sm text-gray-600">Transacciones Analizadas</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {metrics?.annualROI?.value || '$220M+'}
                    </div>
                    <div className="text-sm text-gray-600">ROI Anual Identificado</div>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* Card 3: Prueba de Botones */}
        <Card className="mb-8">
          <Card.Header>
            <h2 className="text-2xl font-semibold text-gray-800">
              🔘 Componente: Botones
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {/* Tamaños */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Tamaños:</h3>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" variant="primary">Small</Button>
                  <Button size="md" variant="primary">Medium</Button>
                  <Button size="lg" variant="primary">Large</Button>
                </div>
              </div>

              {/* Variantes */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Variantes:</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="outline">Outline</Button>
                </div>
              </div>

              {/* Con iconos y loading */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Con iconos y loading:</h3>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant="primary" 
                    leftIcon={<span>📊</span>}
                  >
                    Ver Dashboard
                  </Button>
                  <Button 
                    variant="success" 
                    rightIcon={<span>→</span>}
                  >
                    Continuar
                  </Button>
                  <Button variant="primary" isLoading>
                    Cargando...
                  </Button>
                  <Button variant="primary" disabled>
                    Deshabilitado
                  </Button>
                </div>
              </div>

              {/* Botón que abre modal */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Interactivo:</h3>
                <Button 
                  variant="primary" 
                  onClick={() => setIsModalOpen(true)}
                >
                  Abrir Modal de Ejemplo
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Card 4: Prueba de Badges */}
        <Card className="mb-8">
          <Card.Header>
            <h2 className="text-2xl font-semibold text-gray-800">
              🏷️ Componente: Badges
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {/* Variantes */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Variantes:</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                  <Badge variant="info">Info</Badge>
                </div>
              </div>

              {/* Tamaños */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Tamaños:</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge size="sm" variant="primary">Small</Badge>
                  <Badge size="md" variant="primary">Medium</Badge>
                  <Badge size="lg" variant="primary">Large</Badge>
                </div>
              </div>

              {/* Redondeados */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Redondeados:</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="primary" rounded>Badge 1</Badge>
                  <Badge variant="success" rounded>Badge 2</Badge>
                  <Badge variant="danger" rounded>Badge 3</Badge>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Card 5: Prueba de Inputs */}
        <Card className="mb-8">
          <Card.Header>
            <h2 className="text-2xl font-semibold text-gray-800">
              📝 Componente: Inputs
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4 max-w-md">
              <Input
                label="Nombre de usuario"
                placeholder="Ingresa tu nombre"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              
              <Input
                label="Email"
                type="email"
                placeholder="tu@email.com"
                helperText="Nunca compartiremos tu email"
                leftIcon={
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                }
              />
              
              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                error="La contraseña debe tener al menos 8 caracteres"
              />
              
              <Input
                label="Búsqueda"
                placeholder="Buscar transacciones..."
                rightIcon={
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
          </Card.Body>
        </Card>

        {/* Card 6: Prueba de Spinners */}
        <Card className="mb-8">
          <Card.Header>
            <h2 className="text-2xl font-semibold text-gray-800">
              ⌛ Componente: Spinners
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Tamaños:</h3>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="text-center">
                    <Spinner size="sm" />
                    <p className="text-xs text-gray-600 mt-2">Small</p>
                  </div>
                  <div className="text-center">
                    <Spinner size="md" />
                    <p className="text-xs text-gray-600 mt-2">Medium</p>
                  </div>
                  <div className="text-center">
                    <Spinner size="lg" />
                    <p className="text-xs text-gray-600 mt-2">Large</p>
                  </div>
                  <div className="text-center">
                    <Spinner size="xl" />
                    <p className="text-xs text-gray-600 mt-2">XLarge</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Colores:</h3>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="text-center">
                    <Spinner size="md" color="primary" />
                    <p className="text-xs text-gray-600 mt-2">Primary</p>
                  </div>
                  <div className="text-center">
                    <Spinner size="md" color="secondary" />
                    <p className="text-xs text-gray-600 mt-2">Secondary</p>
                  </div>
                  <div className="text-center bg-gray-800 p-4 rounded">
                    <Spinner size="md" color="white" />
                    <p className="text-xs text-white mt-2">White</p>
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Progress del Proyecto */}
        <Card>
          <Card.Header>
            <h2 className="text-2xl font-semibold text-gray-800">
              🎯 Progreso del Proyecto
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-2">
              <div className="flex items-center">
                <Badge variant="success" className="mr-2">✓</Badge>
                <span>PASO 1-6: Configuración Base Completa</span>
              </div>
              <div className="flex items-center">
                <Badge variant="success" className="mr-2">✓</Badge>
                <span>PASO 7: Componentes UI Base</span>
              </div>
              <div className="flex items-center">
                <Badge variant="warning" className="mr-2">⏳</Badge>
                <span>PASO 8: Layout Principal (Header + Sidebar)</span>
              </div>
              <div className="flex items-center">
                <Badge variant="default" className="mr-2">○</Badge>
                <span>PASO 9: Primer Gráfico Nivo</span>
              </div>
              <div className="flex items-center">
                <Badge variant="default" className="mr-2">○</Badge>
                <span>PASO 10: Dashboard Completo</span>
              </div>
            </div>
          </Card.Body>
          <Card.Footer>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Completado: 7/10 pasos (70%)
              </span>
              <Button 
                variant="primary"
                onClick={() => alert('¡Continuemos con el Paso 8!')}
              >
                Continuar con Paso 8 →
              </Button>
            </div>
          </Card.Footer>
        </Card>
      </div>

      {/* Modal de ejemplo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ejemplo de Modal"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Este es un ejemplo de modal funcionando correctamente con todos los componentes UI.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Características:</h4>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>Cierra con ESC</li>
              <li>Cierra al hacer click fuera</li>
              <li>Previene scroll del body</li>
              <li>Totalmente accesible</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Aceptar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default App