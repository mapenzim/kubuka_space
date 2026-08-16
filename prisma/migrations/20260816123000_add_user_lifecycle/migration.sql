CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'ARCHIVED');

ALTER TABLE "User"
ADD COLUMN "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN "suspendedAt" TIMESTAMP(3),
ADD COLUMN "archivedAt" TIMESTAMP(3);

CREATE INDEX "User_status_idx" ON "User"("status");

CREATE OR REPLACE FUNCTION enforce_single_superuser()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "Role"
    WHERE "id" = NEW."roleId" AND "name" = 'SUPERUSER'
  ) AND EXISTS (
    SELECT 1
    FROM "User"
    WHERE "roleId" = NEW."roleId" AND "id" <> NEW."id"
  ) THEN
    RAISE EXCEPTION 'Only one SUPERUSER account is allowed';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "User_single_superuser"
BEFORE INSERT OR UPDATE OF "roleId" ON "User"
FOR EACH ROW
EXECUTE FUNCTION enforce_single_superuser();

CREATE OR REPLACE FUNCTION prevent_user_email_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW."email" IS DISTINCT FROM OLD."email" THEN
    RAISE EXCEPTION 'A user email address cannot be changed after creation';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "User_immutable_email"
BEFORE UPDATE OF "email" ON "User"
FOR EACH ROW
EXECUTE FUNCTION prevent_user_email_change();
