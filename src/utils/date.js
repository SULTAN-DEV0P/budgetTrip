/**
 * Date utility functions for trip planning
 */

/**
 * Calculate the number of days between two date strings (inclusive)
 * @param {string} startDateStr - YYYY-MM-DD
 * @param {string} endDateStr - YYYY-MM-DD
 * @returns {number}
 */
export function calculateDaysBetween(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) return 1;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1); // Inclusive of both start and end day
}

/**
 * Format date string into human-readable format e.g. "Thu, Aug 28"
 * @param {string} dateStr 
 * @returns {string}
 */
export function formatDateReadable(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get date string for N days after a given start date
 * @param {string} startDateStr 
 * @param {number} daysToAdd 
 * @returns {string} YYYY-MM-DD
 */
export function addDaysToDate(startDateStr, daysToAdd) {
  const date = new Date(startDateStr);
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0];
}

/**
 * Get formatted today and default 3-day trip end date
 */
export function getDefaultDateRange() {
  const today = new Date();
  const future = new Date();
  future.setDate(today.getDate() + 3);

  return {
    startDate: today.toISOString().split('T')[0],
    endDate: future.toISOString().split('T')[0],
  };
}
