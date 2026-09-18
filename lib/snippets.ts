export const SNIPPET_LANGUAGES = ["HTML", "REACT", "PYTHON"] as const;
export type SnippetLanguageValue = (typeof SNIPPET_LANGUAGES)[number];

export const SNIPPET_CATEGORIES = [
  "HEADER",
  "FOOTER",
  "CARD",
  "BUTTON",
  "BADGE",
  "DROPDOWN",
  "UTILITY",
] as const;
export type SnippetCategoryValue = (typeof SNIPPET_CATEGORIES)[number];

export const WEB_SNIPPET_CATEGORIES: SnippetCategoryValue[] = [
  "HEADER",
  "FOOTER",
  "CARD",
  "BUTTON",
  "BADGE",
  "DROPDOWN",
];

export const PYTHON_SNIPPET_CATEGORIES: SnippetCategoryValue[] = ["UTILITY"];

export const SNIPPET_REQUEST_STATUSES = [
  "PENDING",
  "GENERATING",
  "REVIEW",
  "READY",
  "DELIVERED",
  "REJECTED",
] as const;
export type SnippetRequestStatusValue = (typeof SNIPPET_REQUEST_STATUSES)[number];

export const ADMIN_SNIPPET_COUNT_EVENT = "kubuka-admin-snippet-count";

export function isActiveSnippetRequestStatus(status: string) {
  return status !== "DELIVERED" && status !== "REJECTED";
}

export interface SnippetFile {
  path: string;
  content: string;
}

const DELIVERY_MARKER = "[[kubuka-snippet:";

export function createSnippetDeliveryMarker(requestId: string) {
  return `${DELIVERY_MARKER}${requestId}]]`;
}

export function parseSnippetDeliveryMarker(content: string) {
  if (!content.startsWith(DELIVERY_MARKER) || !content.endsWith("]]")) {
    return null;
  }

  const requestId = content.slice(DELIVERY_MARKER.length, -2).trim();
  return /^[0-9A-HJKMNP-TV-Z]{26}$/.test(requestId) ? requestId : null;
}

export function humanizeSnippetValue(value: string) {
  if (value === "REACT") return "React";
  if (value === "HTML") return "HTML";
  return value.charAt(0) + value.slice(1).toLowerCase().replaceAll("_", " ");
}
