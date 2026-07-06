import { BucketState } from "../algorithms/token-bucket";

export class BucketStore {
    private readonly buckets = new Map<string, BucketState>();

    get(clientKey: string): BucketState | undefined {
        return this.buckets.get(clientKey);
    }

    set(clientKey: string, bucket: BucketState): void {
        this.buckets.set(clientKey, bucket);
    }
}

export const bucketStore = new BucketStore();