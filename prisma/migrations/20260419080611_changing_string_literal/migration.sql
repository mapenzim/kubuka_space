/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `SocialLink` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `WorkExperience` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "WorkExperience" ALTER COLUMN "duties" SET NOT NULL,
ALTER COLUMN "duties" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Skill_userId_key" ON "Skill"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SocialLink_userId_key" ON "SocialLink"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkExperience_userId_key" ON "WorkExperience"("userId");
