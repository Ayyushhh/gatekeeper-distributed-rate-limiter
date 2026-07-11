import { DatabaseClient } from "../lib/database";
import { ClientConfig } from "../models/client-config";

export class ConfigRepository {
  async createOrUpdate(db: DatabaseClient, config: ClientConfig) {
    return db.clientConfig.upsert({
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

  async findByClientKey(db: DatabaseClient, clientKey: string) {
    return db.clientConfig.findUnique({
      where: {
        clientKey,
      },
    });
  }

  async findAll(db: DatabaseClient) {
    return db.clientConfig.findMany({
      orderBy: {
        clientKey: "asc",
      },
    });
  }

  async delete(db: DatabaseClient, clientKey: string) {
    return db.clientConfig.delete({
      where: {
        clientKey,
      },
    });
  }

  async deleteAll(db: DatabaseClient) {
    return db.clientConfig.deleteMany();
  }
}

export const configRepository = new ConfigRepository();