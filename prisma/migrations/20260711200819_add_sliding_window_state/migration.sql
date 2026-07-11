-- CreateTable
CREATE TABLE "SlidingWindowState" (
    "clientKey" TEXT NOT NULL,
    "timestamps" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SlidingWindowState_pkey" PRIMARY KEY ("clientKey")
);

-- AddForeignKey
ALTER TABLE "SlidingWindowState" ADD CONSTRAINT "SlidingWindowState_clientKey_fkey" FOREIGN KEY ("clientKey") REFERENCES "ClientConfig"("clientKey") ON DELETE CASCADE ON UPDATE CASCADE;
