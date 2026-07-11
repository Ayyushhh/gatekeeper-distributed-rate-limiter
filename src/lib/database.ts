import { PrismaClient, Prisma } from "@prisma/client";

export const prisma = new PrismaClient();

/**
 * Can be either:
 * - PrismaClient (normal queries)
 * - Prisma Transaction Client (inside $transaction)
 */
export type DatabaseClient =
  Prisma.TransactionClient | PrismaClient;