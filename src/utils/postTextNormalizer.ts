/**
 * Utility functions for normalizing post and comment text
 */

/**
 * Normalize post/comment message: remove extra line breaks (keep max 2 consecutive) and trim end
 * This prevents excessive empty lines in posts while allowing paragraph breaks
 */
export function normalizePostMessage(message: string): string {
  if (!message || typeof message !== 'string') return message;
  
  return message
    .replace(/\n{3,}/g, "\n\n") // Replace 3+ line breaks with 2
    .replace(/\n+$/, "") // Remove trailing line breaks
    .trimEnd(); // Remove trailing whitespace
}

