export interface TokenBucketState {
    tokens: number;
    lastRefillAt: number;
}

export interface BucketConfig {
    capacity: number;
    refillRate: number;
}

export interface BucketResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
    state: TokenBucketState;
}

export function evaluateTokenBucket(
    config: BucketConfig,
    state: TokenBucketState,
    now: number = Date.now(),
): BucketResult {
    const elapsed = (now - state.lastRefillAt) / 1000;

    const generated = elapsed * config.refillRate;

    let tokens = Math.min(config.capacity, state.tokens + generated);

    const lastRefillAt = now;

    let allowed = false;

    if(tokens >= 1) {
        tokens -= 1;
        allowed = true;
    }

    const remaining = Math.floor(tokens);
    const missing = Math.max(0, 1 - tokens);
    const resetAt = missing === 0 ? now: now + (missing / config.refillRate) * 1000;

    return {
        allowed,
        remaining,
        resetAt,
        state: { 
            tokens, 
            lastRefillAt 
        },
    };
}
