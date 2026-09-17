ALTER TABLE "resumeforge"."Resume" ADD COLUMN "shareToken" TEXT;
ALTER TABLE "resumeforge"."Resume" ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT false;
CREATE UNIQUE INDEX "Resume_shareToken_key" ON "resumeforge"."Resume"("shareToken");
CREATE TABLE "resumeforge"."ResumeVersion" (
  "id" TEXT NOT NULL,
  "resumeId" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "snapshot" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ResumeVersion_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ResumeVersion_resumeId_createdAt_idx" ON "resumeforge"."ResumeVersion"("resumeId", "createdAt");
ALTER TABLE "resumeforge"."ResumeVersion" ADD CONSTRAINT "ResumeVersion_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumeforge"."Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
