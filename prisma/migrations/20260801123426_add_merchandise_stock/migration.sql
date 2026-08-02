-- Add inventory tracking independently from the existing soft-delete column.
ALTER TABLE "Merchandise"
ADD COLUMN "stockQuantity" INTEGER NOT NULL DEFAULT 0;
