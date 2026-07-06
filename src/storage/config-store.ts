import { ClientConfig } from "../models/client-config";

class ConfigStore {

    private readonly configs =
        new Map<string, ClientConfig>();

    get(clientKey: string) { 
        return this.configs.get(clientKey);
    }

    set(config: ClientConfig) { 
        this.configs.set(config.clientKey, config);
    }

    getAll(){
        return Array.from(this.configs.values());
    }

    delete(clientKey: string) {
        this.configs.delete(clientKey);
    }

    deleteAll() {
        this.configs.clear();
    }
}

export const configStore = new ConfigStore();