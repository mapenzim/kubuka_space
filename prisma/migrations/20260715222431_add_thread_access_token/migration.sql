/*
  Warnings:

  - A unique constraint covering the columns `[conversationKeyHash]` on the table `Thread` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Thread" ADD COLUMN     "conversationKeyHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Thread_conversationKeyHash_key" ON "Thread"("conversationKeyHash");
