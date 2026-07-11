export interface RateLimitResult<TState> {
    allowed: boolean;
    limit: number;
    remaining: number;
    resetAt: number;
    state: TState;
}