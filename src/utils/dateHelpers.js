import { isPast, isWithinInterval, addHours, format, parseISO } from 'date-fns';

/**
 * Returns true if dueDate (ISO string) is before now.
 * Returns false for null/undefined input.
 */
export function isOverdue(dueDate) {
  if (!dueDate) return false;
  try {
    return isPast(parseISO(dueDate));
  } catch {
    return false;
  }
}

/**
 * Returns true if dueDate is within the next 48 hours (and not already past).
 * Returns false for null/undefined input.
 */
export function isWithin48Hours(dueDate) {
  if (!dueDate) return false;
  try {
    const date = parseISO(dueDate);
    const now = new Date();
    return isWithinInterval(date, { start: now, end: addHours(now, 48) });
  } catch {
    return false;
  }
}

/**
 * Returns a human-readable date string, e.g. "Jan 15, 2025".
 * Returns '' for null/undefined input.
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy');
  } catch {
    return '';
  }
}

/**
 * Returns a formatted range string, e.g. "Jan 1 – Mar 31, 2025".
 * Returns '' if either argument is null/undefined.
 */
export function formatDateRange(start, end) {
  if (!start || !end) return '';
  try {
    const startDate = parseISO(start);
    const endDate = parseISO(end);
    const startStr = format(startDate, 'MMM d');
    const endStr = format(endDate, 'MMM d, yyyy');
    return `${startStr} \u2013 ${endStr}`;
  } catch {
    return '';
  }
}
