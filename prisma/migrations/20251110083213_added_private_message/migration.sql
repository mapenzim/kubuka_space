-- CreateTable
CREATE TABLE "Privatemessage" (
    "id" SERIAL NOT NULL,
    "names" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Privatemessage_pkey" PRIMARY KEY ("id")
);
