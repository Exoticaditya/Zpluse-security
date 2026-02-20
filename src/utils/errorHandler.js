/**
 * Error Handler Utility
 * Centralized error handling and user-friendly messages
 */
import { ApiError } from '../services/apiClient';

/**
 * Format error message for user display
 * @param {Error} error
 * @returns {string} User-friendly error message
 */
export const formatErrorMessage = (error) => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

/**
 * Handle error and show notification
 * @param {Error} error
 * @param {Function} showNotification - Notification function (toast, alert, etc.)
 */
export const handleError = (error, showNotification = null) => {
  const message = formatErrorMessage(error);
  
  if (showNotification) {
    showNotification(message, 'error');
  }

  return message;
};

/**
 * Common error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};

export default {
  formatErrorMessage,
  handleError,
  ERROR_MESSAGES,
};
