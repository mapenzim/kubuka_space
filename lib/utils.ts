// lib/utils.ts ✅ SAFE

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
export const DISCOUNT = 20;

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

/**
 * Recursively extracts raw text from a Lexical node tree.
 */
function extractLexicalText(node: any): string {
  if (!node) return "";

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