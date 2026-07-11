import { prisma } from "../lib/prisma";
import { ClientConfig } from "../models/client-config";

export class ConfigRepository {
  async createOrUpdate(config: ClientConfig) {
    return prisma.clientConfig.upsert({
      where: {
        clientKey: config.clientKey,
      },
      update: {
        algorithm: config.algorithm,
        capacity: config.capacity,
        refillRate: config.refillRate,
        windowSize: config.windowSize,
        maxRequests: config.maxRequests,
      },
      create: {
        clientKey: config.clientKey,
        algorithm: config.algorithm,
        capacity: config.capacity,
        refillRate: config.refillRate,
        windowSize: config.windowSize,
        maxRequests: config.maxRequests,
      },
    });
  }

  async findByClientKey(clientKey: string) {
    return prisma.clientConfig.findUnique({
      where: {
        clientKey,
      },
    });
  }

  async findAll() {
    return prisma.clientConfig.findMany({
      orderBy: {
        clientKey: "asc",
      },
    });
  }

  async delete(clientKey: string) {
    return prisma.clientConfig.delete({
      where: {
        clientKey,
      },
    });
  }

  async deleteAll() {
    return prisma.clientConfig.deleteMany();
  }
}

export const configRepository = new ConfigRepository();