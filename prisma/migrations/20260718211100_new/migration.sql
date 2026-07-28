/*
  Warnings:

  - The primary key for the `Address` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Address` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(26)`.
  - You are about to drop the column `direction` on the `Message` table. All the data in the column will be lost.
  - The primary key for the `OrderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(26)`.
  - Added the required column `senderRole` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SenderRole" AS ENUM ('user', 'admin', 'bot');

-- AlterTable
ALTER TABLE "Address" DROP CONSTRAINT "Address_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(26),
ADD CONSTRAINT "Address_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "direction",
ADD COLUMN     "senderRole" "SenderRole" NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(26),
ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Thread" ALTER COLUMN "dateArchived" DROP DEFAULT;

-- DropEnum
DROP TYPE "MessageDirection";
