import { Prisma } from "@prisma/client";
import { DatabaseClient } from "../lib/database";
import { SlidingWindowState } from "../algorithms/sliding-window";

function parseTimestamps(value: Prisma.JsonValue): number[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is number => typeof item === "number");
}

export class SlidingWindowRepository {
  async findByClientKey(
    db: DatabaseClient,
    clientKey: string,
  ): Promise<SlidingWindowState | null> {
    const window = await db.slidingWindowState.findUnique({
      where: {
        clientKey,
      },
    });

    if (!window) {
      return null;
    }

    return {
      timestamps: parseTimestamps(window.timestamps),
    };
  }

  async findByClientKeyForUpdate(
    db: DatabaseClient,
    clientKey: string,
  ): Promise<SlidingWindowState | null> {
    const rows = await db.$queryRaw<
      Array<{ timestamps: Prisma.JsonValue }>
    >`
      SELECT "timestamps"
      FROM "SlidingWindowState"
      WHERE "clientKey" = ${clientKey}
      FOR UPDATE
    `;

    if (rows.length === 0) {
      return null;
    }

    return {
      timestamps: parseTimestamps(rows[0].timestamps),
    };
  }

  async save(
    db: DatabaseClient,
    clientKey: string,
    state: SlidingWindowState,
  ): Promise<void> {
    await db.slidingWindowState.upsert({
      where: {
        clientKey,
      },
      update: {
        timestamps: state.timestamps,
      },
      create: {
        clientKey,
        timestamps: state.timestamps,
      },
    });
  }
}

export const slidingWindowRepository = new SlidingWindowRepository();
