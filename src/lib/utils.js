import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/* =========================
   API BASE URL  (CRITICAL)
   ========================= */

// For Create React App
export const API = process.env.REACT_APP_API_URL;

// If you ever move to Vite, use this instead:
// export const API = import.meta.env.VITE_API_URL;

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Safely parse JSON from localStorage-like sources.
// Returns null if input is null, 'null', 'undefined', or invalid JSON.
export function safeJSONParse(value) {
  if (value === null || value === undefined) return null;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '' || trimmed === 'undefined' || trimmed === 'null') return null;
    try {
      return JSON.parse(trimmed);
    } catch (e) {
      return null;
    }
  }
  return value;
}
