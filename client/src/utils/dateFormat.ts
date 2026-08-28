/**
 * Date formatting utilities for displaying dates in user's local timezone
 */

/**
 * Parse a timestamp coming from the database.
 *
 * The DB stores timestamps in UTC using the "YYYY-MM-DD HH:MM:SS" format (no
 * timezone marker). JavaScript's Date parses that space-separated form as
 * *local* time, which would shift the value by the user's UTC offset. We
 * normalize such strings to explicit UTC so they can then be displayed in the
 * user's local timezone.
 */
export function parseDbDate(date: string | Date): Date {
  if (date instanceof Date) return date;

  const hasTimezone = /([zZ])|([+-]\d{2}:?\d{2})$/.test(date.trim());
  let normalized = date.trim().replace(' ', 'T');
  if (!hasTimezone) normalized += 'Z';

  const parsed = new Date(normalized);
  // Fall back to the raw value if normalization produced an invalid date.
  return isNaN(parsed.getTime()) ? new Date(date) : parsed;
}

/**
 * Format a date to show date and time in user's local timezone
 * Example: "Jun 13, 2026, 11:30 AM"
 */
export function formatDateTime(date: string | Date): string {
  return parseDbDate(date).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format a date to show full date and time with seconds
 * Example: "Jun 13, 2026, 11:30:45 AM"
 */
export function formatDateTimeFull(date: string | Date): string {
  return parseDbDate(date).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * Format a date to show only the date (no time)
 * Example: "Jun 13, 2026"
 */
export function formatDate(date: string | Date): string {
  return parseDbDate(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format a date to show relative time (e.g., "2 hours ago", "just now")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = parseDbDate(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

  // For older dates, show the full date
  return formatDate(date);
}

/**
 * Get the user's timezone name
 * Example: "America/New_York" or "Asia/Tokyo"
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Format a date with timezone abbreviation
 * Example: "Jun 13, 2026, 11:30 AM PDT"
 */
export function formatDateTimeWithTZ(date: string | Date): string {
  return parseDbDate(date).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
}
