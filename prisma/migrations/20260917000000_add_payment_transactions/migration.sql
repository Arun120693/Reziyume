CREATE TABLE "resumeforge"."PaymentTransaction" (
  "id" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "externalId" TEXT NOT NULL,
  "amountMinor" INTEGER NOT NULL,
  "currency" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userId" TEXT NOT NULL,
  CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PaymentTransaction_externalId_key" ON "resumeforge"."PaymentTransaction"("externalId");
CREATE INDEX "PaymentTransaction_createdAt_idx" ON "resumeforge"."PaymentTransaction"("createdAt");
ALTER TABLE "resumeforge"."PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "resumeforge"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
