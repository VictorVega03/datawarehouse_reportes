// test-repo.ts
import { dashboardRepository } from '../src/repositories/dashboard.repository'

async function test() {
  console.log('🧪 Probando repository...')
  
  try {
    const metrics = await dashboardRepository.getDashboardMetrics()
    console.log('✅ Métricas:', metrics)
    
    const hourly = await dashboardRepository.getHourlyDistribution()
    console.log('✅ Distribución horaria (primeras 3 horas):', hourly.slice(0, 3))
  } catch (error) {
    console.error('❌ Error:', error)
  }
  
  process.exit(0)
}

test()