import { ClientConfig, RateLimitAlgorithm } from "../models/client-config";
import { configRepository } from "../repositories/config.repository";
import { DatabaseClient, prisma } from "../lib/database";

export class AdminService {
    async createConfigorUpdateConfig(config: ClientConfig): Promise<ClientConfig> {
        if(!config.clientKey.trim()) {
            throw new Error("Client key is required");
        }

        switch(config.algorithm) {
            case RateLimitAlgorithm.TOKEN_BUCKET: 
                if(config.capacity <= 0 || config.refillRate <= 0) {
                    throw new Error("Capacity and refill rate must be greater than 0");
                }
                break;
            case RateLimitAlgorithm.SLIDING_WINDOW:
                if(!config.windowSize || !config.maxRequests || config.windowSize <= 0 || config.maxRequests <= 0) {
                    throw new Error("Window size and max requests must be greater than 0");
                }
                break;
            default:
                throw new Error("Invalid algorithm");
        }

        await configRepository.createOrUpdate(prisma,config);
        return config;
    }

    async getConfig(clientKey: string): Promise<ClientConfig | undefined> {
        return await configRepository.findByClientKey(prisma,clientKey);
    }

    async getAllConfigs(): Promise<ClientConfig[]> {
        return await configRepository.findAll(prisma);
    }

    async deleteConfig(clientKey: string): Promise<void> {
        await configRepository.delete(prisma,clientKey);
    }

    async deleteAllConfigs(): Promise<void> {
        await configRepository.deleteAll(prisma);
    }
}

export const adminService = new AdminService();