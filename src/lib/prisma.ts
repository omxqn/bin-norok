// ===========================================
// Prisma Client Singleton
// ===========================================
// Prevents multiple Prisma Client instances in development
// due to hot module reloading.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Query logging slows every request noticeably — keep errors only
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
