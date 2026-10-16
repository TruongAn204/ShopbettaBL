/**
 * API Client Base Configuration
 * Handles requests to NestJS backend with automatic JWT bearer auth injection
 * and mock fallbacks when backend is offline for instantaneous preview.
 */

import { getToken, removeToken } from '../utils/storage.js';

export const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000/api';

/**
 * Standard HTTP Request Wrapper
 * @param {string} endpoint - Path e.g. '/products' or '/auth/login'
 * @param {RequestInit} options - fetch options
 * @returns {Promise<any>}
 */
export async function apiClient(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If unauthorized, clear invalid token
    if (response.status === 401) {
      removeToken();
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || data?.error || `Lỗi yêu cầu: ${response.statusText}`;
      throw new Error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
    }

    // NestJS TransformInterceptor wraps in { success: true, data: ... }
    return data?.data !== undefined ? data.data : data;
  } catch (error) {
    // If connection refused (backend server is not running yet), throw or fallback
    console.warn(`[API Notice] Yêu cầu tới ${endpoint} không thành công: ${error.message}`);
    throw error;
  }
}
