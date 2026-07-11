import { TokenBucketState } from "../algorithms/token-bucket";

export class BucketStore {
    private readonly buckets = new Map<string, TokenBucketState>();

    get(clientKey: string): TokenBucketState | undefined {
        return this.buckets.get(clientKey);
    }

    set(clientKey: string, bucket: TokenBucketState): void {
        this.buckets.set(clientKey, bucket);
    }
}

export const bucketStore = new BucketStore();