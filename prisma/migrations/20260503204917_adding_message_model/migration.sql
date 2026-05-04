-- CreateEnum
CREATE TYPE "ThreadStatus" AS ENUM ('unread', 'read', 'archived');

-- CreateEnum
CREATE TYPE "MessageDirection" AS ENUM ('incoming', 'outgoing');

-- CreateTable
CREATE TABLE "Thread" (
    "id" CHAR(26) NOT NULL,
    "sender" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "ThreadStatus" NOT NULL DEFAULT 'unread',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "dateArchived" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" CHAR(26) NOT NULL,
    "threadId" TEXT NOT NULL,
    "direction" "MessageDirection" NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
