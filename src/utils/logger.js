/**
 * Centralized Logger Utility
 * 
 * Environment-aware logging for frontend application
 * - Development: Logs to console
 * - Production: Optionally sends to monitoring service
 * 
 * Usage:
 *   import logger from './logger';
 *   logger.info('User logged in');
 *   logger.error('API call failed', error);
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
};

class Logger {
  constructor() {
    this.level = this.getLogLevel();
    this.isDevelopment = import.meta.env.MODE === 'development';
    this.debugMode = import.meta.env.VITE_DEBUG_MODE === 'true';
  }

  /**
   * Get log level from environment
   */
  getLogLevel() {
    const envLevel = import.meta.env.VITE_LOG_LEVEL || 'error';
    return LOG_LEVELS[envLevel.toUpperCase()] || LOG_LEVELS.ERROR;
  }

  /**
   * Format log message with timestamp and context
   */
  format(level, message, context) {
    const timestamp = new Date().toISOString();
    const formatted = {
      timestamp,
      level,
      message,
      ...(context && { context })
    };
    return formatted;
  }

  /**
   * Send logs to monitoring service (e.g., Sentry, LogRocket)
   * Override this method to integrate with your monitoring service
   */
  sendToMonitoring(level, message, context) {
    // TODO: Integrate with monitoring service
    // Example: Sentry.captureMessage(message, { level, extra: context });
  }

  /**
   * Debug level logging
   */
  debug(message, context) {
    if (this.level <= LOG_LEVELS.DEBUG && (this.isDevelopment || this.debugMode)) {
      console.debug('[DEBUG]', message, context || '');
    }
  }

  /**
   * Info level logging
   */
  info(message, context) {
    if (this.level <= LOG_LEVELS.INFO && this.isDevelopment) {
      console.info('[\u2139\ufe0f INFO]', message, context || '');
    }
  }

  /**
   * Warning level logging
   */
  warn(message, context) {
    if (this.level <= LOG_LEVELS.WARN) {
      if (this.isDevelopment) {
        console.warn('[\u26a0\ufe0f  WARN]', message, context || '');
      }
      // In production, could send to monitoring
      if (!this.isDevelopment) {
        this.sendToMonitoring('warning', message, context);
      }
    }
  }

  /**
   * Error level logging
   */
  error(message, error, context) {
    if (this.level <= LOG_LEVELS.ERROR) {
      const errorContext = {
        ...context,
        error: error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : null
      };

      if (this.isDevelopment) {
        console.error('[\u274c ERROR]', message, errorContext);
      }

      // In production, send to monitoring
      if (!this.isDevelopment) {
        this.sendToMonitoring('error', message, errorContext);
      }
    }
  }

  /**
   * Log API request
   */
  apiRequest(method, url, data) {
    if (this.isDevelopment) {
      this.debug(`API ${method} ${url}`, data);
    }
  }

  /**
   * Log API response
   */
  apiResponse(method, url, status, data) {
    if (this.isDevelopment) {
      const level = status >= 400 ? 'error' : 'debug';
      this[level](`API ${status} ${method} ${url}`, data);
    }
  }

  /**
   * Log API error
   */
  apiError(method, url, error) {
    this.error(`API Failed ${method} ${url}`, error, {
      endpoint: url,
      method
    });
  }

  /**
   * Log authentication events
   */
  auth(event, context) {
    this.info(`Auth: ${event}`, context);
  }

  /**
   * Log navigation events
   */
  navigation(from, to) {
    this.debug(`Navigation: ${from} → ${to}`);
  }
}

// Export singleton instance
const logger = new Logger();
export default logger;

// Also export LOG_LEVELS for configuration
export { LOG_LEVELS };
