import { ClientConfig, RateLimitAlgorithm } from "../models/client-config";
import { configStore } from "../storage/config-store";

export class AdminService {
    createConfigorUpdateConfig(config: ClientConfig): ClientConfig {
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

        configStore.set(config);
        return config;
    }

    getConfig(clientKey: string): ClientConfig | undefined {
        return configStore.get(clientKey);
    }

    getAllConfigs(): ClientConfig[] {
        return configStore.getAll();
    }

    deleteConfig(clientKey: string): void {
        configStore.delete(clientKey);
    }

    deleteAllConfigs(): void {
        configStore.deleteAll();
    }
}

export const adminService = new AdminService();