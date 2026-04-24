/*
  Warnings:

  - A unique constraint covering the columns `[userId,jobTitle,companyName]` on the table `WorkExperience` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "WorkExperience_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "WorkExperience_userId_jobTitle_companyName_key" ON "WorkExperience"("userId", "jobTitle", "companyName");
