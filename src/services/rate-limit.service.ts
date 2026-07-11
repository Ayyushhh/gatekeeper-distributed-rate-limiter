import {  evaluteTokenBucket } from "../algorithms/token-bucket";
import { bucketRepository } from "../repositories/bucket.repository";
import { configRepository } from "../repositories/config.repository";

export class RateLimitService {
    async check(clientKey: string) {
        const config = await configRepository.findByClientKey(clientKey);

        if (!config) {
            throw new Error("Client configuration not found.");
        }

        let bucket = await bucketRepository.findByClientKey(clientKey);

        if(!bucket){
            bucket = {
                tokens: config.capacity!,
                lastRefillAt: Date.now(),
            };
        }

        const result = evaluteTokenBucket(config,  bucket);

        await bucketRepository.save(clientKey, result.state);

        return result;
    }
}

export const rateLimitService = new RateLimitService();