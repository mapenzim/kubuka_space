-- The deletedAt column was introduced by the initial schema migration.
-- Remove only its default so new products are active unless explicitly removed.
ALTER TABLE "Merchandise"
ALTER COLUMN "deletedAt" DROP DEFAULT;
