import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import prisma from "@/lib/prisma";
import { isAdminRole } from "@/lib/roles";

type SnippetDatabaseActor = {
  email: string;
  role: unknown;
};

const globalForSnippetDatabase = globalThis as unknown as {
  productionSnippetPrisma?: PrismaClient;
};

export function isProductionSnippetBridgeEnabled() {
  return (
    process.env.NODE_ENV === "development" &&
    Boolean(process.env.DEV_PRODUCTION_DATABASE_URL_KUBUKA?.trim())
  );
}

function requireProductionSnippetAccess(actor: SnippetDatabaseActor) {
  const allowedEmail = process.env.DEV_ADMIN_EMAIL?.trim().toLowerCase();
  if (!allowedEmail) {
    throw new Error(
      "DEV_ADMIN_EMAIL is required before production snippet requests can be loaded locally.",
    );
  }
  if (actor.email.trim().toLowerCase() !== allowedEmail || !isAdminRole(actor.role)) {
    throw new Error("Only the configured developer administrator can access production snippet requests.");
  }
}

function getProductionSnippetClient() {
  const databaseUrl = process.env.DEV_PRODUCTION_DATABASE_URL_KUBUKA?.trim();
  if (!databaseUrl) throw new Error("The production snippet database URL is not configured.");

  if (!globalForSnippetDatabase.productionSnippetPrisma) {
    globalForSnippetDatabase.productionSnippetPrisma = new PrismaClient({
      adapter: new PrismaPg(databaseUrl),
    });
  }
  return globalForSnippetDatabase.productionSnippetPrisma;
}

export function getSnippetDatabase(actor: SnippetDatabaseActor) {
  if (!isProductionSnippetBridgeEnabled()) {
    return {
      client: prisma,
      dataSource: "APPLICATION" as const,
      isRemoteProduction: false,
    };
  }

  requireProductionSnippetAccess(actor);
  return {
    client: getProductionSnippetClient(),
    dataSource: "PRODUCTION" as const,
    isRemoteProduction: true,
  };
}
