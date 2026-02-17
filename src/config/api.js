/**
 * API Configuration
 * Production backend base URL - SGMS deployed on Railway
 */
export const API_BASE_URL = 'https://sgms-backend-production.up.railway.app/api';

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  
  // Guards
  GUARDS: {
    BASE: '/guards',
    BY_ID: (id) => `/guards/${id}`,
  },
  
  // Clients
  CLIENTS: {
    BASE: '/clients',
    BY_ID: (id) => `/clients/${id}`,
  },
  
  // Sites
  SITES: {
    BASE: '/sites',
    BY_ID: (id) => `/sites/${id}`,
    BY_CLIENT: (clientId) => `/sites?clientId=${clientId}`,
  },
  
  // Health check
  HEALTH: '/health',
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'sgms_auth_token',
  USER_DATA: 'sgms_user_data',
};
