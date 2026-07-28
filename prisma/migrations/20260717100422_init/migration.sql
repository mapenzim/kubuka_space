/*
  Warnings:

  - Made the column `conversationKeyHash` on table `Thread` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Thread" ALTER COLUMN "conversationKeyHash" SET NOT NULL;
