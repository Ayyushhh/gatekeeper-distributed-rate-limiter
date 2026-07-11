export interface RateLimiter<
    TConfig,
    TState,
    TResult
> {
    evaluate(
        config: TConfig,
        state: TState,
    ): TResult;
}