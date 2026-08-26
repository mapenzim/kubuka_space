ALTER TABLE "Post"
ADD COLUMN "publishedAt" TIMESTAMP(3);

UPDATE "Post"
SET "publishedAt" = "createdAt"
WHERE "published" = true AND "publishedAt" IS NULL;

CREATE INDEX "Post_publishedAt_idx" ON "Post"("publishedAt");
