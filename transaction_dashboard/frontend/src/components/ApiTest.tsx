import React from 'react'
import { useDashboardMetrics, useApiTest, useDashboardOverview } from '@/hooks/api/useDashboardMetrics'
import type { ComponentBaseProps, MetricCardData } from '@/types'

// Component props with proper typing
interface ApiTestProps extends ComponentBaseProps {
  showDetailedData?: boolean
}

const ApiTest: React.FC<ApiTestProps> = ({ 
  className = '',
  showDetailedData = true 
}) => {
  const { data: testData, isLoading: testLoading, error: testError } = useApiTest()
  const { data: metricsData, isLoading: metricsLoading, error: metricsError } = useDashboardMetrics()
  const { data: overviewData, isLoading: overviewLoading, error: overviewError } = useDashboardOverview()

  // Transform metrics data for display
  const metricsCards: MetricCardData[] = React.useMemo(() => {
    if (!metricsData) return []
    
    return [
      {
        title: 'Total Transactions',
        value: metricsData.totalTransactions,
        color: 'blue'
      },
      {
        title: 'ROI Annual',
        value: metricsData.roiAnnual,
        color: 'green'
      },
      {
        title: 'Total Revenue',
        value: metricsData.totalRevenue,
        color: 'purple'
      },
      {
        title: 'Unique Customers',
        value: metricsData.uniqueCustomers,
        color: 'orange'
      },
      {
        title: 'Completed Cases',
        value: metricsData.completedCases,
        color: 'indigo'
      },
      {
        title: 'Average Ticket',
        value: metricsData.averageTicket,
        color: 'pink'
      }
    ]
  }, [metricsData])

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto mt-8 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🔗 API Connection Test - PASO 5: Types System
      </h2>
      
      {/* Backend Connection Status */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">📡 Backend Connection</h3>
        <div className="bg-gray-50 rounded-md p-4">
          {testLoading && (
            <div className="flex items-center">
              <div className="loading-spinner w-4 h-4 mr-2"></div>
              <span>Testing connection...</span>
            </div>
          )}
          
          {testError && (
            <div className="text-red-600">
              ❌ Connection Error: {testError.message}
              <div className="text-sm text-gray-500 mt-1">
                Backend might not be running on port 3001
              </div>
            </div>
          )}
          
          {testData && (
            <div className="text-green-600">
              ✅ Backend Connected & TypeScript Types Working!
              <div className="text-sm text-gray-600 mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <strong>Message:</strong><br/>
                  <span className="text-xs">{testData.message}</span>
                </div>
                <div>
                  <strong>Version:</strong><br/>
                  <span className="text-xs">{testData.version}</span>
                </div>
                <div>
                  <strong>Server:</strong><br/>
                  <span className="text-xs">{testData.status?.server}</span>
                </div>
                <div>
                  <strong>Port:</strong><br/>
                  <span className="text-xs">{testData.status?.port}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Real Dashboard Metrics with TypeScript */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          📊 Dashboard Metrics (Con TypeScript Types)
        </h3>
        <div className="bg-gray-50 rounded-md p-4">
          {metricsLoading && (
            <div className="flex items-center">
              <div className="loading-spinner w-4 h-4 mr-2"></div>
              <span>Loading typed metrics from backend...</span>
            </div>
          )}
          
          {metricsError && (
            <div className="text-red-600">
              ❌ Metrics Error: {metricsError.message}
            </div>
          )}
          
          {metricsData && (
            <div>
              <div className="text-green-600 font-semibold mb-4">
                ✅ Datos reales + TypeScript intellisense funcionando!
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {metricsCards.map((card, index) => (
                  <MetricCard key={index} {...card} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Overview with Types */}
      {showDetailedData && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">📈 Project Overview (Typed)</h3>
          <div className="bg-gray-50 rounded-md p-4">
            {overviewLoading && (
              <div className="flex items-center">
                <div className="loading-spinner w-4 h-4 mr-2"></div>
                <span>Loading overview with types...</span>
              </div>
            )}
            
            {overviewError && (
              <div className="text-red-600">
                ❌ Overview Error: {overviewError.message}
              </div>
            )}
            
            {overviewData && (
              <div className="bg-white p-4 rounded border">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {overviewData.progressPercentage}%
                    </div>
                    <div className="text-sm text-gray-500">Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {overviewData.casesCompleted}/{overviewData.totalCases}
                    </div>
                    <div className="text-sm text-gray-500">Cases</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {overviewData.paybackMonths}
                    </div>
                    <div className="text-sm text-gray-500">Payback</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">
                      {overviewData.roiRange}
                    </div>
                    <div className="text-sm text-gray-500">ROI Range</div>
                  </div>
                </div>
                
                {overviewData.keyHighlights && (
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-2">
                      Key Highlights (Array&lt;string&gt;):
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {overviewData.keyHighlights.map((highlight, index) => (
                        <li key={index}>• {highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TypeScript Benefits Showcase */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">🎯 TypeScript Benefits</h3>
        <div className="bg-blue-50 rounded-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">✅ Type Safety</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Interfaces para todas las respuestas API</li>
                <li>• IntelliSense en VS Code</li>
                <li>• Detección de errores en compile time</li>
                <li>• Autocompletado en todo el proyecto</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">🚀 Developer Experience</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Documentación automática</li>
                <li>• Refactoring seguro</li>
                <li>• Barrel exports organizados</li>
                <li>• Types compartidos entre componentes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Status Summary */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">🔄 System Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div className="bg-green-50 p-3 rounded">
            <div className="font-semibold text-green-700">Frontend</div>
            <div className="text-green-600">✅ Port 3000</div>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <div className="font-semibold text-green-700">Backend</div>
            <div className="text-green-600">✅ Port 3001</div>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <div className="font-semibold text-blue-700">API</div>
            <div className="text-blue-600">v1</div>
          </div>
          <div className="bg-purple-50 p-3 rounded">
            <div className="font-semibold text-purple-700">Types</div>
            <div className="text-purple-600">✅ TypeScript</div>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <div className="font-semibold text-orange-700">Data</div>
            <div className="text-orange-600">
              {metricsData ? "✅ Typed Data" : "⏳ Loading"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Metric Card Component with proper typing
const MetricCard: React.FC<MetricCardData> = ({ 
  title, 
  value, 
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    indigo: 'text-indigo-600',
    pink: 'text-pink-600',
    red: 'text-red-600'
  }

  return (
    <div className="bg-white p-4 rounded border shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className={`text-2xl font-bold ${colorClasses[color]}`}>
        {value}
      </div>
    </div>
  )
}

export default ApiTest