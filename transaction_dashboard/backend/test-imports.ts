// Test simple de imports para debug
console.log('✅ Test 1: Imports básicos')

import app from './src/app'
console.log('✅ Test 2: app importado correctamente', typeof app)

import { logger } from './src/utils/logger'
console.log('✅ Test 3: logger importado correctamente', typeof logger)

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
console.log('✅ Test 4: PrismaClient instanciado correctamente')

// Test de listen
const PORT = 3001
const server = app.listen(PORT, () => {
  console.log(`✅ Test 5: Servidor escuchando en puerto ${PORT}`)
  console.log('🎉 TODOS LOS TESTS PASARON - EL BACKEND DEBERÍA FUNCIONAR')
  console.log('Presiona Ctrl+C para cerrar')
})

server.on('error', (error: any) => {
  console.error('❌ Error del servidor:', error)
  process.exit(1)
})
