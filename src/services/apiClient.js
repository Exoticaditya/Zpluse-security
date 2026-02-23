/**
 * Centralized API Client for SGMS
 * Handles all HTTP requests with JWT authentication
 * Automatically manages Authorization headers and ApiResponse unwrapping
 */
import { API_BASE_URL, STORAGE_KEYS } from '../config/api';

/**
 * API Error class for structured error handling
 */
class ApiError extends Error {
  constructor(message, status, error) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.error = error;
  }
}

/**
 * Get JWT token from localStorage
 */
const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Handle automatic logout on 401 Unauthorized
 */
const handleUnauthorized = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  
  // Redirect to login page
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

/**
 * Parse ApiResponse<T> wrapper from backend
 * Backend returns: { success: boolean, data: T, message: string, timestamp: string }
 */
const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  let responseData;

  if (contentType && contentType.includes('application/json')) {
    responseData = await response.json();
  } else {
    const text = await response.text();
    throw new ApiError(
      text || 'Unexpected response format',
      response.status,
      'PARSE_ERROR'
    );
  }

  // Handle HTTP errors
  if (!response.ok) {
    // Check if it's an error response from backend
    if (responseData.error || responseData.message) {
      throw new ApiError(
        responseData.message || responseData.error || 'Request failed',
        responseData.status || response.status,
        responseData.error || 'REQUEST_FAILED'
      );
    }
    
    throw new ApiError(
      `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      'HTTP_ERROR'
    );
  }

  // Handle ApiResponse wrapper
  if (responseData.success === false) {
    throw new ApiError(
      responseData.message || 'Request failed',
      responseData.status || response.status,
      responseData.error || 'API_ERROR'
    );
  }

  // Return unwrapped data
  return responseData.data !== undefined ? responseData.data : responseData;
};

/**
 * Build request headers with authentication
 */
const buildHeaders = (customHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Generic request handler
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: buildHeaders(options.headers),
  };

  try {
    const response = await fetch(url, config);
    
    // Handle 401 Unauthorized - Auto logout
    if (response.status === 401) {
      handleUnauthorized();
      throw new ApiError('Session expired. Please login again.', 401, 'UNAUTHORIZED');
    }

    // Handle 403 Forbidden - Permission denied
    if (response.status === 403) {
      throw new ApiError('You do not have permission to perform this action.', 403, 'FORBIDDEN');
    }

    // Handle 500 Internal Server Error
    if (response.status >= 500) {
      throw new ApiError('Server error occurred. Please try again later.', response.status, 'SERVER_ERROR');
    }

    return await parseResponse(response);
  } catch (error) {
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or other errors
    throw new ApiError(
      error.message || 'Network error occurred',
      0,
      'NETWORK_ERROR'
    );
  }
};

/**
 * API Client methods
 */
const apiClient = {
  /**
   * GET request
   */
  get: async (endpoint, options = {}) => {
    return request(endpoint, {
      ...options,
      method: 'GET',
    });
  },

  /**
   * POST request
   */
  post: async (endpoint, data, options = {}) => {
    return request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * PUT request
   */
  put: async (endpoint, data, options = {}) => {
    return request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * PATCH request
   */
  patch: async (endpoint, data, options = {}) => {
    return request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE request
   */
  delete: async (endpoint, options = {}) => {
    return request(endpoint, {
      ...options,
      method: 'DELETE',
    });
  },
};

export default apiClient;
export { ApiError };
