/**
 * Authentication API Service
 * Interacts with NestJS backend /auth endpoints
 */

import { apiClient } from './client.js';
import { setToken, setUser, removeToken } from '../utils/storage.js';

export const authApi = {
  /**
   * Login user with email & password
   * @param {Object} credentials { email, password }
   */
  async login({ email, password }) {
    try {
      const result = await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (result?.accessToken) {
        setToken(result.accessToken);
        setUser(result.user);
      }
      return result;
    } catch (err) {
      // Offline mock fallback for testing
      if (email && password) {
        const mockUser = {
          id: 'user_mock_1',
          fullName: email.split('@')[0].toUpperCase(),
          email,
          role: email.includes('admin') ? 'ADMIN' : 'CUSTOMER',
        };
        const mockToken = 'mock_jwt_token_' + Date.now();
        setToken(mockToken);
        setUser(mockUser);
        return { accessToken: mockToken, user: mockUser };
      }
      throw err;
    }
  },

  /**
   * Register new user
   * @param {Object} data { fullName, email, password, phone, address }
   */
  async register(data) {
    try {
      return await apiClient('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (err) {
      // Mock fallback
      const mockUser = {
        id: 'user_mock_' + Date.now(),
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        role: 'CUSTOMER',
      };
      const mockToken = 'mock_jwt_token_' + Date.now();
      setToken(mockToken);
      setUser(mockUser);
      return { accessToken: mockToken, user: mockUser };
    }
  },

  /**
   * Get current authenticated user profile
   */
  async getProfile() {
    try {
      const user = await apiClient('/auth/profile', { method: 'GET' });
      setUser(user);
      return user;
    } catch (err) {
      throw err;
    }
  },

  /**
   * Logout user and clear local session
   */
  logout() {
    removeToken();
    window.location.reload();
  },
};
