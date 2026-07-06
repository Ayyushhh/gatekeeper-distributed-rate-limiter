export enum RateLimitAlgorithm {
    TOKEN_BUCKET = "TOKEN_BUCKET",
    SLIDING_WINDOW = "SLIDING_WINDOW",
}
  
export interface ClientConfig {
    clientKey: string;
    algorithm: RateLimitAlgorithm;
  
    // Token Bucket
    capacity: number;
    refillRate: number;
  
    // Sliding Window (will be used later)
    windowSize?: number;
    maxRequests?: number;
}