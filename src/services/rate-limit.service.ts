import { BucketConfig, evaluteTokenBucket } from "../algorithms/token-bucket";
import { bucketStore } from "../storage/bucket-store";

const config: BucketConfig = {
 capacity: 5,
 refillRate: 1,
};

export class RateLimitService {
    check(clientKey: string) {
        let bucket = bucketStore.get(clientKey);

        if(!bucket){
            bucket = {
                tokens: config.capacity,
                lastRefillAt: Date.now(),
            };
        }

        const result = evaluteTokenBucket(config,  bucket);

        bucketStore.set(clientKey, result.state);

        return result;
    }
}

export const rateLimitService = new RateLimitService();