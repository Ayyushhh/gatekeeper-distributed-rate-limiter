import { DatabaseClient } from "../lib/database";
import { TokenBucketState } from "../algorithms/token-bucket";

export class TokenBucketRepository {
  async findByClientKey(
    db: DatabaseClient,
    clientKey: string,
  ): Promise<TokenBucketState | null> {
    const bucket = await db.bucketState.findUnique({
      where: {
        clientKey,
      },
    });

    if (!bucket) {
      return null;
    }

    return {
      tokens: bucket.tokens,
      lastRefillAt: Number(bucket.lastRefillAt),
    };
  }

  async findByClientKeyForUpdate(
    db: DatabaseClient,
    clientKey: string,
  ): Promise<TokenBucketState | null> {
    const rows = await db.$queryRaw<
      Array<{ tokens: number; lastRefillAt: bigint }>
    >`
      SELECT "tokens", "lastRefillAt"
      FROM "BucketState"
      WHERE "clientKey" = ${clientKey}
      FOR UPDATE
    `;

    if (rows.length === 0) {
      return null;
    }

    const bucket = rows[0];
    return {
      tokens: bucket.tokens,
      lastRefillAt: Number(bucket.lastRefillAt),
    };
  }

  async save(
    db: DatabaseClient,
    clientKey: string,
    state: TokenBucketState,
  ): Promise<void> {
    await db.bucketState.upsert({
      where: {
        clientKey,
      },
      update: {
        tokens: state.tokens,
        lastRefillAt: BigInt(state.lastRefillAt),
      },
      create: {
        clientKey,
        tokens: state.tokens,
        lastRefillAt: BigInt(state.lastRefillAt),
      },
    });
  }
}

export const tokenBucketRepository = new TokenBucketRepository();
