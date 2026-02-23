/**
 * API Configuration
 * Backend base URL from environment variables  
 * 
 * Production: https://sgms-backend-production.up.railway.app/api
 * Development: http://localhost:8080/api
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sgms-backend-production.up.railway.app/api';

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
    ME: '/guards/me',
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

  // Assignments
  ASSIGNMENTS: {
    BASE: '/assignments',
    BY_ID: (id) => `/assignments/${id}`,
    BY_GUARD: (guardId) => `/assignments/guard/${guardId}`,
    BY_SITE_POST: (sitePostId) => `/assignments/site-post/${sitePostId}`,
    SHIFT_TYPES: '/assignments/shift-types',
  },

  // Site Posts
  SITE_POSTS: {
    BASE: '/site-posts',
    BY_ID: (id) => `/site-posts/${id}`,
    BY_SITE: (siteId) => `/site-posts/site/${siteId}`,
  },

  // Attendance
  ATTENDANCE: {
    CHECK_IN: '/attendance/check-in',
    CHECK_OUT: '/attendance/check-out',
    BY_GUARD: (guardId) => `/attendance/guard/${guardId}`,
    BY_SITE: (siteId) => `/attendance/site/${siteId}`,
    TODAY_SUMMARY: '/attendance/today-summary',
    BY_ID: (id) => `/attendance/${id}`,
  },

  // Auth (additional)
  AUTH_ME: '/auth/me',

  // Health check
  HEALTH: '/health',
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'sgms_token',
  USER_DATA: 'sgms_user_data',
};
