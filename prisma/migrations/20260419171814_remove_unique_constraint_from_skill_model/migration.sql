/*
  Warnings:

  - A unique constraint covering the columns `[text,userId]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Skill_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Skill_text_userId_key" ON "Skill"("text", "userId");
