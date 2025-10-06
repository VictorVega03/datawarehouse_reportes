// backend/src/config/database.ts

import { PrismaClient } from '@prisma/client';

// Singleton de PrismaClient para evitar múltiples instancias
// y agotar el pool de conexiones

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // En desarrollo, usar una variable global para mantener 
  // la misma instancia entre hot-reloads
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient({
      log: ['error', 'warn'],
    });
  }
  prisma = (global as any).prisma;
}

export { prisma };