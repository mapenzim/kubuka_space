export function safeParse<T>(value: string | null): T | null {
  if (!value || value === "undefined" || value === "null") return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    console.error("Invalid JSON:", value);
    return null;
  }
}
