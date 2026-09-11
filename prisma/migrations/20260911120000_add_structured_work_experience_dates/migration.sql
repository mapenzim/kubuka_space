ALTER TABLE "WorkExperience"
ADD COLUMN "startDate" TIMESTAMP(3),
ADD COLUMN "endDate" TIMESTAMP(3),
ADD COLUMN "isCurrent" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "WorkExperience_userId_isCurrent_startDate_idx"
ON "WorkExperience"("userId", "isCurrent", "startDate");
