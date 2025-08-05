import { PrismaClient } from '@/lib/generated/prisma'

const globalForPrisma = global as { prisma?: PrismaClient }

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    log: ['error', 'warn']
  })
}

export const prisma = globalForPrisma.prisma