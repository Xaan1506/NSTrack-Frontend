import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Safely parse JSON from localStorage-like sources.
// Returns null if input is null, 'null', 'undefined', or invalid JSON.
export function safeJSONParse(value) {
  if (value === null || value === undefined) return null;
  // guard against literal strings
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '' || trimmed === 'undefined' || trimmed === 'null') return null;
    try {
      return JSON.parse(trimmed);
    } catch (e) {
      return null;
    }
  }
  // if already an object, return as-is
  return value;
}
