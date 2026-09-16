CREATE TYPE "SnippetLanguage" AS ENUM ('HTML', 'REACT', 'PYTHON');
CREATE TYPE "SnippetCategory" AS ENUM ('HEADER', 'FOOTER', 'CARD', 'BUTTON', 'BADGE', 'DROPDOWN', 'UTILITY');
CREATE TYPE "SnippetRequestStatus" AS ENUM ('PENDING', 'GENERATING', 'REVIEW', 'READY', 'DELIVERED', 'REJECTED');

CREATE TABLE "SnippetProduct" (
    "id" CHAR(26) NOT NULL,
    "merchandiseId" CHAR(26) NOT NULL,
    "language" "SnippetLanguage" NOT NULL,
    "categories" "SnippetCategory"[] NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SnippetProduct_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SnippetRequest" (
    "id" CHAR(26) NOT NULL,
    "userId" CHAR(26) NOT NULL,
    "threadId" CHAR(26),
    "orderItemId" CHAR(26) NOT NULL,
    "snippetProductId" CHAR(26) NOT NULL,
    "language" "SnippetLanguage" NOT NULL,
    "category" "SnippetCategory" NOT NULL,
    "primaryColor" TEXT,
    "textColor" TEXT,
    "backgroundColor" TEXT,
    "fontFamily" TEXT,
    "appearance" TEXT,
    "responsive" BOOLEAN NOT NULL DEFAULT true,
    "instructions" TEXT,
    "status" "SnippetRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SnippetRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SnippetDelivery" (
    "id" CHAR(26) NOT NULL,
    "requestId" CHAR(26) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "files" JSONB NOT NULL,
    "dependencies" TEXT[] NOT NULL,
    "usageInstructions" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveredAt" TIMESTAMP(3),

    CONSTRAINT "SnippetDelivery_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SnippetProduct_merchandiseId_key" ON "SnippetProduct"("merchandiseId");
CREATE INDEX "SnippetRequest_userId_createdAt_idx" ON "SnippetRequest"("userId", "createdAt");
CREATE INDEX "SnippetRequest_status_createdAt_idx" ON "SnippetRequest"("status", "createdAt");
CREATE INDEX "SnippetRequest_orderItemId_idx" ON "SnippetRequest"("orderItemId");
CREATE UNIQUE INDEX "SnippetDelivery_requestId_key" ON "SnippetDelivery"("requestId");

ALTER TABLE "SnippetProduct" ADD CONSTRAINT "SnippetProduct_merchandiseId_fkey" FOREIGN KEY ("merchandiseId") REFERENCES "Merchandise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SnippetRequest" ADD CONSTRAINT "SnippetRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SnippetRequest" ADD CONSTRAINT "SnippetRequest_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SnippetRequest" ADD CONSTRAINT "SnippetRequest_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SnippetRequest" ADD CONSTRAINT "SnippetRequest_snippetProductId_fkey" FOREIGN KEY ("snippetProductId") REFERENCES "SnippetProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SnippetDelivery" ADD CONSTRAINT "SnippetDelivery_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "SnippetRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
