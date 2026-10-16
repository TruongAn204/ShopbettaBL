/**
 * Formatters Utility
 * Helpers for formatting currency, dates, numbers, and text
 */

/**
 * Format a number into Vietnamese Dong (VND)
 * @param {number} amount - Price number
 * @returns {string} Formatted string like "150.000 ₫"
 */
export function formatCurrencyVND(amount) {
  if (typeof amount !== 'number') {
    amount = Number(amount) || 0;
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format ISO date string into readable Vietnamese format
 * @param {string|Date} date - ISO string or Date instance
 * @returns {string} Formatted date like "16/10/2026 21:30"
 */
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Truncate long strings with ellipsis
 * @param {string} text 
 * @param {number} maxLen 
 * @returns {string}
 */
export function truncateText(text, maxLen = 80) {
  if (!text || text.length <= maxLen) return text;
  return text.substring(0, maxLen).trim() + '...';
}

/**
 * Convert string to URL-safe slug
 * @param {string} str 
 * @returns {string}
 */
export function slugify(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
