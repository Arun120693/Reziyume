CREATE TABLE "resumeforge"."JobApplication" (
  "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "company" TEXT NOT NULL, "role" TEXT NOT NULL,
  "url" TEXT NOT NULL DEFAULT '', "status" TEXT NOT NULL DEFAULT 'Saved', "notes" TEXT NOT NULL DEFAULT '',
  "appliedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "JobApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "resumeforge"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "JobApplication_userId_updatedAt_idx" ON "resumeforge"."JobApplication"("userId", "updatedAt");
CREATE TABLE "resumeforge"."WritingUsage" (
  "userId" TEXT NOT NULL, "day" TEXT NOT NULL, "count" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "WritingUsage_pkey" PRIMARY KEY ("userId", "day"),
  CONSTRAINT "WritingUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "resumeforge"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
