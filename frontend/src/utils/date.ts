import { format, parseISO, isValid, formatDistanceToNow } from 'date-fns';

/**
 * Safely format a date string with fallback
 */
export function formatDate(
  dateString: string | undefined | null,
  formatStr: string = 'MMM yyyy'
): string {
  if (!dateString) return 'Present';
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Invalid Date';
    return format(date, formatStr);
  } catch {
    return 'Invalid Date';
  }
}

/**
 * Format date range for experience/projects
 */
export function formatDateRange(
  startDate: string | undefined | null,
  endDate?: string | undefined | null
): string {
  const start = formatDate(startDate, 'MMM yyyy');
  const end = endDate ? formatDate(endDate, 'MMM yyyy') : 'Present';
  return `${start} - ${end}`;
}

/**
 * Get relative time (e.g., "2 months ago")
 */
export function getRelativeTime(dateString: string | undefined | null): string {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '';
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return '';
  }
}

/**
 * Calculate duration between two dates
 */
export function calculateDuration(
  startDate: string | undefined | null,
  endDate?: string | undefined | null
): string {
  if (!startDate) return '';
  
  try {
    const start = parseISO(startDate);
    const end = endDate ? parseISO(endDate) : new Date();
    
    if (!isValid(start) || !isValid(end)) return '';
    
    const diffInMonths = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''}`;
    }
    
    const years = Math.floor(diffInMonths / 12);
    const months = diffInMonths % 12;
    
    if (months === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
  } catch {
    return '';
  }
}
