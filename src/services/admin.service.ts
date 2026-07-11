import { ClientConfig, RateLimitAlgorithm } from "../models/client-config";
import { configRepository } from "../repositories/config.repository";
import { configStore } from "../storage/config-store";

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

        await configRepository.createOrUpdate(config);
        return config;
    }

    async getConfig(clientKey: string): Promise<ClientConfig | undefined> {
        return await configRepository.findByClientKey(clientKey);
    }

    async getAllConfigs(): Promise<ClientConfig[]> {
        return await configRepository.findAll();
    }

    async deleteConfig(clientKey: string): Promise<void> {
        await configRepository.delete(clientKey);
    }

    async deleteAllConfigs(): Promise<void> {
        await configRepository.deleteAll();
    }
}

export const adminService = new AdminService();