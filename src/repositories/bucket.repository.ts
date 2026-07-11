import { prisma } from "../lib/prisma";
import { BucketState } from "../algorithms/token-bucket";

export class BucketRepository {
  async findByClientKey(clientKey: string): Promise<BucketState | null> {
    const bucket = await prisma.bucketState.findUnique({
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

  async save(clientKey: string, state: BucketState): Promise<void> {
    await prisma.bucketState.upsert({
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

export const bucketRepository = new BucketRepository();