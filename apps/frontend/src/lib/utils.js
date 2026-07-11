import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";

/**
 * Merge Tailwind classes with clsx and tailwind-merge
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Extract "user/repo" from a GitHub URL.
 * e.g. "https://github.com/vercel/next.js" → "vercel/next.js"
 */
export function extractRepoName(url) {
  if (!url) return "Unknown";
  try {
    const cleaned = url.replace(/\.git$/, "").replace(/\/$/, "");
    const parts = cleaned.split("/");
    if (parts.length >= 2) {
      return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
    }
    return url;
  } catch {
    return url;
  }
}

/**
 * Extract just the repo name (without owner) from a GitHub URL.
 * e.g. "https://github.com/vercel/next.js" → "next.js"
 */
export function extractRepoShortName(url) {
  if (!url) return "Unknown";
  try {
    const cleaned = url.replace(/\.git$/, "").replace(/\/$/, "");
    const parts = cleaned.split("/");
    return parts[parts.length - 1] || url;
  } catch {
    return url;
  }
}

/**
 * Format a date string to relative time.
 * e.g. "2024-01-01T00:00:00Z" → "3 months ago"
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return "Unknown";
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return "Unknown";
  }
}

/**
 * Get status badge color classes.
 */
export function getStatusColor(status) {
  const s = (status || "").toLowerCase();
  switch (s) {
    case "deployed":
    case "ready":
      return {
        dot: "bg-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        text: "text-emerald-500",
      };
    case "building":
    case "queued":
      return {
        dot: "bg-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        text: "text-amber-500",
      };
    case "failed":
    case "error":
      return {
        dot: "bg-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        text: "text-red-500",
      };
    default:
      return {
        dot: "bg-zinc-500",
        bg: "bg-zinc-500/10",
        border: "border-zinc-500/20",
        text: "text-zinc-500",
      };
  }
}

/**
 * Get human-readable status text.
 */
export function getStatusText(status) {
  const s = (status || "").toLowerCase();
  switch (s) {
    case "deployed":
      return "Ready";
    case "building":
      return "Building";
    case "queued":
      return "Queued";
    case "failed":
      return "Failed";
    default:
      return status || "Unknown";
  }
}
