import { evaluateTokenBucket } from "../algorithms/token-bucket";
import { DatabaseClient, prisma } from "../lib/database";
import { bucketRepository } from "../repositories/bucket.repository";
import { configRepository } from "../repositories/config.repository";

export class RateLimitService {
    async check(clientKey: string) {
        return prisma.$transaction(async (tx: DatabaseClient) => {

            const config =
                await configRepository.findByClientKey(
                    tx,
                    clientKey,
                );

            if (!config) {
                throw new Error("Client configuration not found.");
            }
        
            let bucket =
                await bucketRepository.findByClientKeyForUpdate(
                    tx,
                    clientKey,
                );
        
            if (!bucket) {
                bucket = {
                    tokens: config.capacity!,
                    lastRefillAt: Date.now(),
                };
            }
        
            const result =
                evaluateTokenBucket(
                    config,
                    bucket,
                );
        
            await bucketRepository.save(
                tx,
                clientKey,
                result.state,
            );
        
            return result;
        
        });
    }
}

export const rateLimitService = new RateLimitService();