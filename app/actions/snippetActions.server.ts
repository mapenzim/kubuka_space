"use server";

import { auth } from "@/auth";
import { requireAdmin } from "@/lib/admin/require_admin";
import { chatGateway } from "@/lib/container/runtime";
import { getSnippetDatabase } from "@/lib/database/snippet_database";
import prisma from "@/lib/prisma";
import { ulidId } from "@/lib/server-utils";
import {
  generateSnippetDeliveryWithOllama,
  type OllamaSnippetBrief,
} from "@/lib/snippets/ollama.server";
import {
  createSnippetDeliveryMarker,
  humanizeSnippetValue,
  PYTHON_SNIPPET_CATEGORIES,
  SNIPPET_CATEGORIES,
  SNIPPET_LANGUAGES,
  SNIPPET_REQUEST_STATUSES,
  SnippetCategoryValue,
  SnippetFile,
  SnippetLanguageValue,
  SnippetRequestStatusValue,
  WEB_SNIPPET_CATEGORIES,
} from "@/lib/snippets";
import { revalidatePath } from "next/cache";

function optionalText(value: unknown, maxLength: number) {
  const text = typeof value === "string" ? value.trim() : "";
  if (text.length > maxLength) throw new Error(`Text cannot exceed ${maxLength} characters.`);
  return text || null;
}

function isLanguage(value: unknown): value is SnippetLanguageValue {
  return typeof value === "string" && SNIPPET_LANGUAGES.includes(value as SnippetLanguageValue);
}

function isCategory(value: unknown): value is SnippetCategoryValue {
  return typeof value === "string" && SNIPPET_CATEGORIES.includes(value as SnippetCategoryValue);
}

function isRequestStatus(value: unknown): value is SnippetRequestStatusValue {
  return typeof value === "string" && SNIPPET_REQUEST_STATUSES.includes(value as SnippetRequestStatusValue);
}

function parseUploadedOllamaBrief(input: unknown, expectedRequestId: string): OllamaSnippetBrief {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Choose a valid exported Ollama request JSON.");
  }

  const brief = input as Record<string, unknown>;
  const preferences = brief.preferences;
  if (!preferences || typeof preferences !== "object" || Array.isArray(preferences)) {
    throw new Error("The Ollama request JSON is missing its preferences.");
  }
  const preferenceValues = preferences as Record<string, unknown>;

  if (brief.requestId !== expectedRequestId) {
    throw new Error("The uploaded JSON belongs to a different snippet request.");
  }
  if (typeof brief.product !== "string" || !brief.product.trim() || brief.product.length > 160) {
    throw new Error("The uploaded JSON has an invalid product name.");
  }
  if (!isLanguage(brief.language) || !isCategory(brief.category)) {
    throw new Error("The uploaded JSON has an invalid language or component category.");
  }
  if (typeof preferenceValues.responsive !== "boolean") {
    throw new Error("The uploaded JSON must specify whether the snippet is responsive.");
  }

  return {
    requestId: expectedRequestId,
    product: brief.product.trim(),
    language: brief.language,
    category: brief.category,
    preferences: {
      primaryColor: optionalText(preferenceValues.primaryColor, 40),
      textColor: optionalText(preferenceValues.textColor, 40),
      backgroundColor: optionalText(preferenceValues.backgroundColor, 40),
      fontFamily: optionalText(preferenceValues.fontFamily, 80),
      appearance: optionalText(preferenceValues.appearance, 20),
      responsive: preferenceValues.responsive,
    },
    instructions: optionalText(brief.instructions, 2000),
  };
}

export async function getSnippetEntitlements() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId || session.user.status !== "ACTIVE") return [];

  const items = await prisma.orderItem.findMany({
    where: {
      order: {
        userId,
        status: { in: ["paid", "shipped", "delivered"] },
        paymentStatus: "PAID",
      },
      merchandise: { snippetProduct: { isNot: null } },
    },
    select: {
      id: true,
      orderId: true,
      title: true,
      quantity: true,
      merchandise: {
        select: {
          snippetProduct: {
            select: { id: true, language: true, categories: true },
          },
        },
      },
      _count: {
        select: {
          snippetRequests: {
            where: { userId, status: { not: "REJECTED" } },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return items.flatMap((item) => {
    const product = item.merchandise.snippetProduct;
    const remaining = item.quantity - item._count.snippetRequests;
    if (!product || remaining < 1) return [];
    return [{
      orderItemId: item.id,
      orderId: item.orderId,
      title: item.title,
      language: product.language,
      categories: product.categories,
      remaining,
    }];
  });
}

export async function createSnippetRequest(input: {
  threadId: string;
  orderItemId: string;
  category: SnippetCategoryValue;
  primaryColor?: string;
  textColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  appearance?: string;
  responsive?: boolean;
  instructions?: string;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId || session.user.status !== "ACTIVE") {
    throw new Error("Sign in with an active account to request a snippet.");
  }
  if (!input.threadId || !input.orderItemId || !isCategory(input.category)) {
    throw new Error("Select a purchased snippet and component type.");
  }

  const [user, thread, orderItem] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { email: true, status: true } }),
    prisma.thread.findUnique({ where: { id: input.threadId }, select: { id: true, email: true, archived: true } }),
    prisma.orderItem.findFirst({
      where: {
        id: input.orderItemId,
        order: {
          userId,
          status: { in: ["paid", "shipped", "delivered"] },
          paymentStatus: "PAID",
        },
      },
      select: {
        id: true,
        quantity: true,
        merchandise: {
          select: { snippetProduct: true },
        },
      },
    }),
  ]);

  if (!user || user.status !== "ACTIVE") throw new Error("Your account is not active.");
  if (!thread || thread.archived || thread.email.toLowerCase() !== user.email.toLowerCase()) {
    throw new Error("The selected support conversation is not available.");
  }

  const snippetProduct = orderItem?.merchandise.snippetProduct;
  if (!orderItem || !snippetProduct) throw new Error("This purchase is not a snippet product.");
  if (!snippetProduct.categories.includes(input.category)) {
    throw new Error("That component type is not included with this product.");
  }

  const existingRequests = await prisma.snippetRequest.count({
    where: { orderItemId: orderItem.id, userId, status: { not: "REJECTED" } },
  });
  if (existingRequests >= orderItem.quantity) {
    throw new Error("All snippet requests included with this purchase have been used.");
  }

  const request = await prisma.snippetRequest.create({
    data: {
      id: ulidId(),
      userId,
      threadId: thread.id,
      orderItemId: orderItem.id,
      snippetProductId: snippetProduct.id,
      language: snippetProduct.language,
      category: input.category,
      primaryColor: optionalText(input.primaryColor, 40),
      textColor: optionalText(input.textColor, 40),
      backgroundColor: optionalText(input.backgroundColor, 40),
      fontFamily: optionalText(input.fontFamily, 80),
      appearance: optionalText(input.appearance, 20),
      responsive: input.responsive !== false,
      instructions: optionalText(input.instructions, 2000),
    },
  });

  await chatGateway.sendMessage(
    thread.id,
    "bot",
    `Snippet request ${request.id.slice(-6)} received: ${humanizeSnippetValue(request.language)} ${humanizeSnippetValue(request.category)}. A developer will review and deliver it here.`,
  );

  revalidatePath("/admin/snippets");
  return { success: true as const, requestId: request.id };
}

export async function createSnippetProduct(input: {
  title: string;
  description: string;
  price: number;
  stockQuantity: number;
  language: SnippetLanguageValue;
  categories: SnippetCategoryValue[];
}) {
  await requireAdmin();
  const title = input.title.trim();
  const description = input.description.trim();
  if (!title || !description || !Number.isFinite(input.price) || input.price < 0) {
    throw new Error("Title, description, and a valid price are required.");
  }
  if (!Number.isInteger(input.stockQuantity) || input.stockQuantity < 0) {
    throw new Error("Stock must be a non-negative whole number.");
  }
  if (!isLanguage(input.language)) throw new Error("Select a supported language.");
  const allowed = input.language === "PYTHON" ? PYTHON_SNIPPET_CATEGORIES : WEB_SNIPPET_CATEGORIES;
  const categories = [...new Set(input.categories)].filter((category): category is SnippetCategoryValue =>
    isCategory(category) && allowed.includes(category),
  );
  if (!categories.length) throw new Error("Select at least one supported snippet category.");

  const result = await prisma.$transaction(async (tx) => {
    const category = await tx.productCategory.upsert({
      where: { slug: "code-snippets" },
      update: { name: "Code Snippets", isActive: true },
      create: {
        id: ulidId(),
        name: "Code Snippets",
        slug: "code-snippets",
        description: "Developer-reviewed code generated and delivered on demand.",
      },
    });
    const merchandise = await tx.merchandise.create({
      data: {
        id: ulidId(),
        title,
        body: description,
        price: input.price,
        stockQuantity: input.stockQuantity,
        categoryId: category.id,
      },
    });
    const product = await tx.snippetProduct.create({
      data: {
        id: ulidId(),
        merchandiseId: merchandise.id,
        language: input.language,
        categories,
      },
    });
    return { merchandise, product };
  });

  revalidatePath("/store");
  revalidatePath("/admin/snippets");
  return {
    id: result.product.id,
    merchandiseId: result.merchandise.id,
    title: result.merchandise.title,
    description: result.merchandise.body,
    price: Number(result.merchandise.price),
    stockQuantity: result.merchandise.stockQuantity,
    language: result.product.language,
    categories: result.product.categories,
    deletedAt: null,
  };
}

export async function getAdminSnippetData() {
  const actor = await requireAdmin();
  const snippetDatabase = getSnippetDatabase(actor);
  const snippetPrisma = snippetDatabase.client;
  const [products, requests] = await Promise.all([
    snippetPrisma.snippetProduct.findMany({
      include: { merchandise: true },
      orderBy: { createdAt: "desc" },
    }),
    snippetPrisma.snippetRequest.findMany({
      include: {
        user: { select: { name: true, email: true } },
        snippetProduct: { include: { merchandise: { select: { title: true } } } },
        delivery: { select: { version: true, deliveredAt: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    dataSource: snippetDatabase.dataSource,
    products: products.map(({ merchandise, ...product }) => ({
      id: product.id,
      merchandiseId: merchandise.id,
      title: merchandise.title,
      description: merchandise.body,
      price: Number(merchandise.price),
      stockQuantity: merchandise.stockQuantity,
      deletedAt: merchandise.deletedAt?.toISOString() ?? null,
      language: product.language,
      categories: product.categories,
    })),
    requests: requests.map((request) => ({
      id: request.id,
      customer: request.user.name ?? "Customer",
      email: request.user.email,
      productTitle: request.snippetProduct.merchandise.title,
      language: request.language,
      category: request.category,
      primaryColor: request.primaryColor,
      textColor: request.textColor,
      backgroundColor: request.backgroundColor,
      fontFamily: request.fontFamily,
      appearance: request.appearance,
      responsive: request.responsive,
      instructions: request.instructions,
      status: request.status,
      createdAt: request.createdAt.toISOString(),
      deliveryVersion: request.delivery?.version ?? null,
      deliveredAt: request.delivery?.deliveredAt?.toISOString() ?? null,
    })),
  };
}

export async function updateSnippetRequestStatus(id: string, status: SnippetRequestStatusValue) {
  const actor = await requireAdmin();
  const snippetPrisma = getSnippetDatabase(actor).client;
  if (!isRequestStatus(status) || status === "DELIVERED") {
    throw new Error("Choose a valid non-delivery status.");
  }
  const request = await snippetPrisma.snippetRequest.update({ where: { id }, data: { status } });
  revalidatePath("/admin/snippets");
  return { id: request.id, status: request.status };
}

export async function getAdminActiveSnippetRequestCount() {
  const actor = await requireAdmin();
  const snippetPrisma = getSnippetDatabase(actor).client;
  return snippetPrisma.snippetRequest.count({
    where: { status: { notIn: ["DELIVERED", "REJECTED"] } },
  });
}

export async function generateSnippetWithOllama(requestId: string, uploadedBrief: unknown) {
  const actor = await requireAdmin();
  if (process.env.NODE_ENV !== "development") {
    throw new Error("Local Ollama generation is available only in the development environment.");
  }

  const snippetPrisma = getSnippetDatabase(actor).client;

  const request = await snippetPrisma.snippetRequest.findUnique({
    where: { id: requestId },
    include: {
      snippetProduct: {
        include: { merchandise: { select: { title: true } } },
      },
    },
  });
  if (!request) throw new Error("Snippet request not found.");
  if (request.status === "REJECTED") throw new Error("A rejected request cannot be generated.");

  const brief = parseUploadedOllamaBrief(uploadedBrief, request.id);
  if (
    brief.product !== request.snippetProduct.merchandise.title ||
    brief.language !== request.language ||
    brief.category !== request.category
  ) {
    throw new Error("The uploaded JSON does not match this snippet request.");
  }

  const previousStatus = request.status;
  await snippetPrisma.snippetRequest.update({
    where: { id: request.id },
    data: { status: "GENERATING" },
  });

  try {
    const generated = await generateSnippetDeliveryWithOllama(brief);

    const title = generated.delivery.title.trim();
    const description = generated.delivery.description.trim();
    const usageInstructions = generated.delivery.usageInstructions.trim();
    if (!title || title.length > 120 || !description || description.length > 1000) {
      throw new Error("Ollama generated a title or description that is too long. Try again.");
    }
    if (!usageInstructions || usageInstructions.length > 5000) {
      throw new Error("Ollama generated invalid usage instructions. Try again.");
    }

    const files = validateFiles(generated.delivery.files);
    const dependencies = [...new Set(generated.delivery.dependencies.map((item) => item.trim()).filter(Boolean))];
    if (dependencies.length > 30) throw new Error("Ollama generated too many dependencies.");

    await snippetPrisma.snippetRequest.update({
      where: { id: request.id },
      data: { status: "REVIEW" },
    });
    revalidatePath("/admin/snippets");

    return {
      title,
      description,
      files,
      dependencies,
      usageInstructions,
      model: generated.model,
      status: "REVIEW" as const,
    };
  } catch (error) {
    await snippetPrisma.snippetRequest.update({
      where: { id: request.id },
      data: { status: previousStatus },
    }).catch(() => undefined);
    revalidatePath("/admin/snippets");
    throw error;
  }
}

function validateFiles(files: SnippetFile[]) {
  if (!Array.isArray(files) || files.length < 1 || files.length > 10) {
    throw new Error("Add between one and ten source files.");
  }
  let totalSize = 0;
  return files.map((file) => {
    const path = file.path.trim();
    const content = file.content;
    if (!path || path.length > 160 || path.includes("..") || path.startsWith("/")) {
      throw new Error("Each file needs a safe relative path.");
    }
    if (!content.trim()) throw new Error(`${path} cannot be empty.`);
    totalSize += content.length;
    if (totalSize > 250_000) throw new Error("The delivery cannot exceed 250 KB.");
    return { path, content };
  });
}

export async function deliverSnippetRequest(input: {
  requestId: string;
  title: string;
  description: string;
  files: SnippetFile[];
  dependencies: string[];
  usageInstructions: string;
}) {
  const actor = await requireAdmin();
  const snippetDatabase = getSnippetDatabase(actor);
  const snippetPrisma = snippetDatabase.client;
  const title = input.title.trim();
  const description = input.description.trim();
  const usageInstructions = input.usageInstructions.trim();
  if (!title || title.length > 120 || !description || description.length > 1000) {
    throw new Error("A concise title and description are required.");
  }
  if (!usageInstructions || usageInstructions.length > 5000) {
    throw new Error("Add usage instructions of no more than 5000 characters.");
  }
  const files = validateFiles(input.files);
  const dependencies = [...new Set(input.dependencies.map((item) => item.trim()).filter(Boolean))];
  if (dependencies.length > 30) throw new Error("Too many dependencies were supplied.");

  const request = await snippetPrisma.snippetRequest.findUnique({
    where: { id: input.requestId },
    include: {
      user: { select: { name: true, email: true } },
      thread: { select: { id: true, archived: true } },
      delivery: { select: { version: true } },
    },
  });
  if (!request) throw new Error("Snippet request not found.");

  const deliveredAt = new Date();
  const version = (request.delivery?.version ?? 0) + 1;
  const marker = createSnippetDeliveryMarker(request.id);
  const deliveryCreate = {
    id: ulidId(),
    requestId: request.id,
    title,
    description,
    files,
    dependencies,
    usageInstructions,
    version,
    deliveredAt,
  };
  const deliveryUpdate = {
    title,
    description,
    files,
    dependencies,
    usageInstructions,
    version,
    deliveredAt,
  };

  if (snippetDatabase.isRemoteProduction) {
    if (!request.thread || request.thread.archived) {
      throw new Error(
        "The production request no longer has an active conversation. Reconnect the customer conversation before delivery.",
      );
    }
    const timestamp = new Date();
    await snippetPrisma.$transaction([
      snippetPrisma.snippetDelivery.upsert({
        where: { requestId: request.id },
        update: deliveryUpdate,
        create: deliveryCreate,
      }),
      snippetPrisma.snippetRequest.update({
        where: { id: request.id },
        data: { status: "DELIVERED" },
      }),
      snippetPrisma.message.create({
        data: {
          id: ulidId(),
          threadId: request.thread.id,
          senderRole: "admin",
          content: marker,
          timestamp,
        },
      }),
      snippetPrisma.thread.update({
        where: { id: request.thread.id },
        data: { updatedAt: timestamp },
      }),
    ]);
  } else {
    await snippetPrisma.$transaction([
      snippetPrisma.snippetDelivery.upsert({
        where: { requestId: request.id },
        update: deliveryUpdate,
        create: deliveryCreate,
      }),
      snippetPrisma.snippetRequest.update({
        where: { id: request.id },
        data: { status: "DELIVERED" },
      }),
    ]);
  }

  if (!snippetDatabase.isRemoteProduction && request.thread && !request.thread.archived) {
    await chatGateway.sendMessage(request.thread.id, "admin", marker);
  } else if (!snippetDatabase.isRemoteProduction) {
    const thread = await chatGateway.startConversation(
      request.user.name ?? "Customer",
      request.user.email,
      marker,
      undefined,
      "admin",
    );
    await snippetPrisma.snippetRequest.update({ where: { id: request.id }, data: { threadId: thread.id } });
  }

  revalidatePath("/admin/snippets");
  revalidatePath("/contact_us");
  return { success: true as const, status: "DELIVERED" as const, version, deliveredAt: deliveredAt.toISOString() };
}
