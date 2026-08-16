/**
 * VousTech Shield — Input Sanitization & Anti-Injection Helper
 */

/**
 * Escapes unsafe HTML characters to neutralize XSS payloads.
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== "string") {
    return "";
  }

  return input
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/\0/g, ""); // Remove null bytes
}

/**
 * Deep sanitization for plain text inputs (removes all HTML tags).
 */
export function stripHtmlTags(input: string): string {
  return input
    .replace(/<[^>]*>?/gm, "")
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")
    .replace(/\0/g, "")
    .trim();
}

/**
 * Recursively sanitizes all string properties of an object.
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      result[key] = stripHtmlTags(value);
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = sanitizeObject(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === "string"
          ? stripHtmlTags(item)
          : item && typeof item === "object"
          ? sanitizeObject(item as Record<string, unknown>)
          : item
      );
    } else {
      result[key] = value;
    }
  }

  return result as T;
}
