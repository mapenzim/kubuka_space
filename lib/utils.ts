import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

export function formatName(fullName: string | undefined): string {
  if (!fullName) return "Anonymous User";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
}

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

export function containsProfanity(text: string): boolean {
  return matcher.hasMatch(text);
}

export const VAT = 0.15;

/**
 * Formats a database date string or Date object into "MMM DD, YYYY"
 * Example: "2026-04-18T14:30:00Z" -> "Apr 18, 2026"
 */
export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);

  // Fallback in case of invalid dates from the DB
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",   // "Apr"
    day: "numeric",   // "18"
    year: "numeric",  // "2026"
  }).format(date);
}

export const formatTime = (
  date: Date | string,
  currentTime: Date | number = new Date(),
) => {
  const input = new Date(date);
  const now = new Date(currentTime);

  if (Number.isNaN(input.getTime()) || Number.isNaN(now.getTime())) {
    return "Just now";
  }

  if (input.getTime() > now.getTime()) {
    return "0 seconds ago";
  }

  const isSameDay =
    input.getFullYear() === now.getFullYear() &&
    input.getMonth() === now.getMonth() &&
    input.getDate() === now.getDate();

  const diffMs = Math.max(0, now.getTime() - input.getTime());

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));

  if (isSameDay) {
    if (minutes < 1) {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    }

    if (hours < 1) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }

    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  const isSameMonth =
    input.getFullYear() === now.getFullYear() &&
    input.getMonth() === now.getMonth();

  if (isSameMonth) {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(input);
  }

  const isSameYear = input.getFullYear() === now.getFullYear();

  if (isSameYear) {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
    }).format(input);
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(input);
};

export function formatLastSeen(date: Date | string): string {
  const elapsedSeconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(date).getTime()) / 1000),
  );

  if (elapsedSeconds < 60) return "Now";

  const minutes = Math.floor(elapsedSeconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

/**
 * Recursively extracts raw text from a Lexical node tree.
 */
type LexicalNode = {
  type?: string;
  text?: unknown;
  children?: LexicalNode[];
};

function extractLexicalText(value: unknown): string {
  if (!value || typeof value !== "object") return "";
  const node = value as LexicalNode;

  // If we hit a text node, return its text content
  if (node.type === "text" && typeof node.text === "string") {
    return node.text;
  }

  // If the node has children (like paragraphs, lists, etc.), recursively extract their text
  if (Array.isArray(node.children)) {
    // Join with a space so words don't mash together across blocks
    return node.children.map(extractLexicalText).join(" "); 
  }

  return "";
}

/**
 * Parses a Lexical state JSON string and returns a plain text excerpt.
 */
export function generateLexicalExcerpt(lexicalStateString: string, maxLength: number = 100): string {
  if (!lexicalStateString) return "";

  try {
    const state = JSON.parse(lexicalStateString);
    const rootNode = state?.root;

    if (!rootNode) return "";

    // Extract all text
    const fullText = extractLexicalText(rootNode);

    // Clean up extra whitespace that might result from joining nodes
    const cleanText = fullText.replace(/\s+/g, " ").trim();

    // Truncate and add ellipsis if necessary
    if (cleanText.length > maxLength) {
      // Substring to maxLength, but try not to cut a word in half by finding the last space
      const truncated = cleanText.substring(0, maxLength);
      const lastSpaceIndex = truncated.lastIndexOf(" ");
      
      return `${truncated.substring(0, lastSpaceIndex > 0 ? lastSpaceIndex : maxLength)}...`;
    }

    return cleanText;
  } catch (error) {
    console.error("Failed to parse Lexical JSON for excerpt:", error);
    return "Content unavailable";
  }
}

// role (UI) → direction (DB)
export function roleToDirection(role: "user" | "admin" | "bot"): "incoming" | "outgoing" {
  if (role === "user") return "incoming";
  if (role === "admin") return "outgoing";
  return "outgoing"; // bot messages are system-originated, treat as outgoing
}

// direction (DB) → role (UI)
export function directionToRole(direction: "incoming" | "outgoing"): "user" | "admin" | "bot" {
  if (direction === "incoming") return "user";
  return "admin"; // default; you can special-case bot if needed
}
