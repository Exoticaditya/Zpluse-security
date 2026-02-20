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

    // Backend returns: { accessToken, tokenType, expiresInSeconds, user: { id, email, fullName, phone, roles: [] } }
    if (response.accessToken && response.user) {
      // Store token
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.accessToken);
      
      // Extract primary role (use first role from array)
      const primaryRole = response.user.roles && response.user.roles.length > 0 
        ? response.user.roles[0] 
        : 'CLIENT';
      
      // Store user data
      const userData = {
        userId: response.user.id,
        email: response.user.email,
        fullName: response.user.fullName,
        phone: response.user.phone,
        role: primaryRole,
        roles: response.user.roles, // Store all roles for future use
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

/**
 * Register new user
 * @param {string} email
 * @param {string} password
 * @param {Object} userData - Additional user data (fullName, phoneNumber, role)
 * @returns {Promise<Object>} Registration response
 */
export const register = async (email, password, userData = {}) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
      email,
      password,
      fullName: userData.name || userData.fullName,
      phone: userData.phone || userData.phoneNumber,
      role: (userData.role || 'CLIENT').toUpperCase(),
    });

    // Backend returns UserResponse: { id, email, fullName, phone, roles: [] }
    return response;
  } catch (error) {
    throw error;
  }
};

export default {
  login,
  logout,
  register,
  getCurrentUser,
  isAuthenticated,
  getUserRole,
  hasRole,
  hasAnyRole,
};
