// Script para probar conexión directa a la BD
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testDatabase() {
  console.log('🔍 Probando conexión a la base de datos...\n');
  
  try {
    // Test 1: Conexión básica
    console.log('Test 1: SELECT 1');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Conexión exitosa\n');
    
    // Test 2: Contar transacciones
    console.log('Test 2: Contar transacciones');
    const count = await prisma.transaction.count();
    console.log(`✅ Total transacciones: ${count.toLocaleString()}\n`);
    
    // Test 3: Query simple
    console.log('Test 3: Primera transacción');
    const firstTransaction = await prisma.transaction.findFirst();
    console.log('✅ Primera transacción:', {
      id: firstTransaction?.id.toString(),
      fecha: firstTransaction?.fechaHora,
      total: firstTransaction?.total.toString()
    });
    console.log();
    
    // Test 4: Query de agregación (la que está fallando)
    console.log('Test 4: Query de agregación OPTIMIZADA (getDashboardMetrics)');
    console.time('Query execution time');
    
    const [result] = await prisma.$queryRaw`
      SELECT 
        COUNT(*)::BIGINT as total_transactions,
        COUNT(DISTINCT customer_id) FILTER (WHERE customer_id IS NOT NULL)::BIGINT as unique_customers,
        SUM(total)::DECIMAL as total_revenue,
        AVG(total)::DECIMAL as avg_transaction
      FROM transactions
    `;
    
    console.timeEnd('Query execution time');
    
    console.log('✅ Resultado:', {
      totalTransactions: result.total_transactions?.toString(),
      uniqueCustomers: result.unique_customers?.toString(),
      totalRevenue: result.total_revenue?.toString(),
      avgTransaction: result.avg_transaction?.toString()
    });
    
    console.log('\n✅ TODOS LOS TESTS PASARON');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
