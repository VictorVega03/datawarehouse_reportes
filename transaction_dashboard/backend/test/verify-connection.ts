// backend/verify-connection.ts
// Script para verificar que todo está conectado correctamente

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyConnection() {
  console.log('\n🔍 VERIFICANDO CONEXIÓN A BASE DE DATOS...\n')
  console.log('=' .repeat(60))
  
  try {
    // 1. Verificar conexión básica
    console.log('\n1️⃣  Verificando conexión básica...')
    await prisma.$connect()
    console.log('   ✅ Conexión establecida correctamente')
    
    // 2. Verificar que puede ejecutar queries
    console.log('\n2️⃣  Verificando queries básicas...')
    await prisma.$queryRaw`SELECT 1`
    console.log('   ✅ Queries funcionando correctamente')
    
    // 3. Verificar tabla transactions
    console.log('\n3️⃣  Verificando tabla "transactions"...')
    const tableExists = await prisma.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'transactions'
      )
    `
    
    if (!tableExists[0].exists) {
      throw new Error('❌ Tabla "transactions" no encontrada')
    }
    console.log('   ✅ Tabla "transactions" encontrada')
    
    // 4. Verificar columnas
    console.log('\n4️⃣  Verificando estructura de columnas...')
    const columns = await prisma.$queryRaw<Array<{ column_name: string, data_type: string }>>`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'transactions'
      ORDER BY ordinal_position
    `
    
    const requiredColumns = ['id', 'fecha_hora', 'customer_id', 'metodo_pago', 'total']
    const foundColumns = columns.map(c => c.column_name)
    
    console.log('   📋 Columnas encontradas:')
    columns.forEach(col => {
      const required = requiredColumns.includes(col.column_name)
      const icon = required ? '✅' : '  '
      console.log(`      ${icon} ${col.column_name} (${col.data_type})`)
    })
    
    const missingColumns = requiredColumns.filter(col => !foundColumns.includes(col))
    if (missingColumns.length > 0) {
      console.log(`\n   ⚠️  Columnas requeridas faltantes: ${missingColumns.join(', ')}`)
    } else {
      console.log('\n   ✅ Todas las columnas requeridas presentes')
    }
    
    // 5. Contar registros
    console.log('\n5️⃣  Contando registros...')
    const count = await prisma.transaction.count()
    console.log(`   ✅ Total de transacciones: ${count.toLocaleString()}`)
    
    if (count === 0) {
      console.log('   ⚠️  ADVERTENCIA: No hay transacciones en la tabla')
    } else if (count < 1000) {
      console.log('   ⚠️  ADVERTENCIA: Muy pocas transacciones (esperado: ~2.9M)')
    }
    
    // 6. Verificar datos de ejemplo
    console.log('\n6️⃣  Obteniendo datos de ejemplo...')
    const sampleData = await prisma.transaction.findMany({
      take: 3,
      select: {
        id: true,
        fechaHora: true,
        customerId: true,
        metodoPago: true,
        total: true
      }
    })
    
    if (sampleData.length > 0) {
      console.log('   ✅ Datos de ejemplo:')
      sampleData.forEach((row, i) => {
        console.log(`\n      Registro ${i + 1}:`)
        console.log(`         ID: ${row.id}`)
        console.log(`         Fecha: ${row.fechaHora.toISOString()}`)
        console.log(`         Cliente: ${row.customerId || 'N/A'}`)
        console.log(`         Método Pago: ${row.metodoPago}`)
        console.log(`         Total: $${Number(row.total).toFixed(2)}`)
      })
    }
    
    // 7. Verificar distribución horaria (query del Caso 1)
    console.log('\n7️⃣  Probando query de distribución horaria (Caso 1)...')
    const hourlyData = await prisma.$queryRaw<Array<{
      hour: number
      count: bigint
    }>>`
      SELECT 
        EXTRACT(HOUR FROM fecha_hora)::INTEGER as hour,
        COUNT(*)::BIGINT as count
      FROM transactions
      GROUP BY EXTRACT(HOUR FROM fecha_hora)
      ORDER BY hour ASC
      LIMIT 5
    `
    
    if (hourlyData.length > 0) {
      console.log('   ✅ Query horaria funcionando:')
      hourlyData.forEach(row => {
        console.log(`      Hora ${row.hour}:00 → ${Number(row.count).toLocaleString()} transacciones`)
      })
    }
    
    // 8. Estadísticas generales
    console.log('\n8️⃣  Calculando estadísticas generales...')
    const stats = await prisma.$queryRaw<Array<{
      total_transactions: bigint
      unique_customers: bigint
      total_revenue: number
      avg_transaction: number
      min_date: Date
      max_date: Date
    }>>`
      SELECT 
        COUNT(*)::BIGINT as total_transactions,
        COUNT(DISTINCT customer_id)::BIGINT as unique_customers,
        SUM(total)::DECIMAL as total_revenue,
        AVG(total)::DECIMAL as avg_transaction,
        MIN(fecha_hora) as min_date,
        MAX(fecha_hora) as max_date
      FROM transactions
      WHERE customer_id IS NOT NULL
    `
    
    if (stats.length > 0) {
      const s = stats[0]
      console.log(`   ✅ Estadísticas:`)
      console.log(`      Total Transacciones: ${Number(s.total_transactions).toLocaleString()}`)
      console.log(`      Clientes Únicos: ${Number(s.unique_customers).toLocaleString()}`)
      console.log(`      Ingresos Totales: $${Number(s.total_revenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}`)
      console.log(`      Promedio por Transacción: $${Number(s.avg_transaction).toFixed(2)}`)
      console.log(`      Rango de Fechas: ${s.min_date.toISOString().split('T')[0]} a ${s.max_date.toISOString().split('T')[0]}`)
    }
    
    // Resumen final
    console.log('\n' + '=' .repeat(60))
    console.log('\n✅ VERIFICACIÓN COMPLETADA EXITOSAMENTE')
    console.log('\n🎉 Tu base de datos está lista para usarse con el dashboard!')
    console.log('\nPróximos pasos:')
    console.log('  1. Ejecutar: yarn dev')
    console.log('  2. Probar: curl http://localhost:3001/api/v1/dashboard/metrics')
    console.log('  3. Abrir frontend: http://localhost:3000')
    console.log('\n')
    
  } catch (error) {
    console.log('\n' + '=' .repeat(60))
    console.log('\n❌ ERROR EN LA VERIFICACIÓN')
    console.error('\nDetalles del error:')
    console.error(error)
    
    console.log('\n💡 Posibles soluciones:')
    console.log('  1. Verificar que PostgreSQL está corriendo')
    console.log('  2. Verificar DATABASE_URL en .env')
    console.log('  3. Verificar que la DB se llama "transacciones"')
    console.log('  4. Ejecutar: yarn prisma generate')
    console.log('  5. Verificar permisos de usuario PostgreSQL')
    console.log('\n')
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar verificación
verifyConnection()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error fatal:', error)
    process.exit(1)
  })