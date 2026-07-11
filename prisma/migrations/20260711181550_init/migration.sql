-- CreateEnum
CREATE TYPE "RateLimitAlgorithm" AS ENUM ('TOKEN_BUCKET', 'SLIDING_WINDOW');

-- CreateTable
CREATE TABLE "ClientConfig" (
    "clientKey" TEXT NOT NULL,
    "algorithm" "RateLimitAlgorithm" NOT NULL,
    "capacity" INTEGER,
    "refillRate" DOUBLE PRECISION,
    "windowSize" INTEGER,
    "maxRequests" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientConfig_pkey" PRIMARY KEY ("clientKey")
);

-- CreateTable
CREATE TABLE "BucketState" (
    "clientKey" TEXT NOT NULL,
    "tokens" DOUBLE PRECISION NOT NULL,
    "lastRefillAt" BIGINT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BucketState_pkey" PRIMARY KEY ("clientKey")
);

-- AddForeignKey
ALTER TABLE "BucketState" ADD CONSTRAINT "BucketState_clientKey_fkey" FOREIGN KEY ("clientKey") REFERENCES "ClientConfig"("clientKey") ON DELETE CASCADE ON UPDATE CASCADE;
