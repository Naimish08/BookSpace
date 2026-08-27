import { PrismaClient } from '@/lib/generated/prisma'

/**
 * Global singleton pattern for Prisma Client in Next.js development.
 * Prevents instantiating multiple PrismaClient instances during HMR (Hot Module Replacement).
 */
const globalForPrisma = global as { prisma?: PrismaClient }

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    log: ['error', 'warn']
  })
}

/**
 * Shared Prisma database client instance across the application.
 */
export const prisma = globalForPrisma.prisma