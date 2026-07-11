export interface SlidingWindowConfig {
    windowSize: number; // milliseconds
    maxRequests: number;
}

export interface SlidingWindowState {
    timestamps: number[];
}

export interface SlidingWindowResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
    state: SlidingWindowState;
}

export function evaluateSlidingWindow(
    config: SlidingWindowConfig,
    state: SlidingWindowState,
    now: number = Date.now(),
  ): SlidingWindowResult {
  
    const windowStart = now - config.windowSize;
  
    const timestamps = state.timestamps.filter(
      (timestamp) => timestamp >= windowStart,
    );
  
    let allowed = false;
  
    if (timestamps.length < config.maxRequests) {
      timestamps.push(now);
      allowed = true;
    }
  
    const remaining =
      Math.max(
        0,
        config.maxRequests - timestamps.length,
      );
  
    const resetAt =
      timestamps.length === 0
        ? now
        : timestamps[0] + config.windowSize;
  
    return {
      allowed,
      remaining,
      resetAt,
      state: {
        timestamps,
      },
    };
  }