import { evaluateSlidingWindow } from "../algorithms/sliding-window";
import { evaluateTokenBucket } from "../algorithms/token-bucket";
import { DatabaseClient, prisma } from "../lib/database";
import { RateLimitAlgorithm } from "../models/client-config";
import { configRepository } from "../repositories/config.repository";
import { slidingWindowRepository } from "../repositories/sliding-window.repository";
import { tokenBucketRepository } from "../repositories/token-bucket.repository";

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

            switch (config.algorithm) {
                case RateLimitAlgorithm.TOKEN_BUCKET: {
                    let state =
                        await tokenBucketRepository.findByClientKeyForUpdate(
                            tx,
                            clientKey,
                        );

                    if (!state) {
                        state = {
                            tokens: config.capacity!,
                            lastRefillAt: Date.now(),
                        };
                    }

                    const result = evaluateTokenBucket(
                        {
                            capacity: config.capacity!,
                            refillRate: config.refillRate!,
                        },
                        state,
                    );

                    await tokenBucketRepository.save(
                        tx,
                        clientKey,
                        result.state,
                    );

                    return result;
                }

                case RateLimitAlgorithm.SLIDING_WINDOW: {
                    let state =
                        await slidingWindowRepository.findByClientKeyForUpdate(
                            tx,
                            clientKey,
                        );

                    if (!state) {
                        state = {
                            timestamps: [],
                        };
                    }

                    const result = evaluateSlidingWindow(
                        {
                            windowSize: config.windowSize!,
                            maxRequests: config.maxRequests!,
                        },
                        state,
                    );

                    await slidingWindowRepository.save(
                        tx,
                        clientKey,
                        result.state,
                    );

                    return result;
                }

                default:
                    throw new Error("Unsupported rate limiting algorithm.");
            }
        });
    }
}

export const rateLimitService = new RateLimitService();
