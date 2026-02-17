/**
 * Authentication Service
 * Handles JWT-based authentication with backend API
 */
import apiClient from './apiClient';
import { API_ENDPOINTS, STORAGE_KEYS } from '../config/api';

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} User object with token
 */
export const login = async (email, password) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });

    // Backend returns: { token, userId, email, fullName, role }
    if (response.token) {
      // Store token
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      
      // Store user data
      const userData = {
        userId: response.userId,
        email: response.email,
        fullName: response.fullName,
        role: response.role,
      };
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      
      return userData;
    }

    throw new Error('Invalid response from server');
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  
  // Redirect to login
  window.location.href = '/login';
};

/**
 * Get current authenticated user
 * @returns {Object|null} User data or null if not authenticated
 */
export const getCurrentUser = () => {
  const userDataStr = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  if (!userDataStr) {
    return null;
  }

  try {
    return JSON.parse(userDataStr);
  } catch {
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const userData = getCurrentUser();
  
  return !!(token && userData);
};

/**
 * Get user role
 * @returns {string|null} User role (ADMIN, MANAGER, GUARD, CLIENT) or null
 */
export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};

/**
 * Check if user has specific role
 * @param {string} role
 * @returns {boolean}
 */
export const hasRole = (role) => {
  const userRole = getUserRole();
  return userRole === role;
};

/**
 * Check if user has any of the specified roles
 * @param {Array<string>} roles
 * @returns {boolean}
 */
export const hasAnyRole = (roles) => {
  const userRole = getUserRole();
  return roles.includes(userRole);
};

export default {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  getUserRole,
  hasRole,
  hasAnyRole,
};
