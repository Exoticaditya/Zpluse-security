/**
 * Common UI State Components
 * Provides consistent loading, error, and empty states
 */
import React from 'react';
import { Loader, AlertCircle, Inbox, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Loading Spinner Component
 * 
 * Usage:
 * <LoadingSpinner size="md" message="Loading data..." />
 */
export const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeMap = {
    sm: 24,
    md: 40,
    lg: 56,
  };

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader className="animate-spin text-cobalt mb-4" size={sizeMap[size]} />
      {message && <p className="text-silver-grey text-sm">{message}</p>}
    </div>
  );
};

/**
 * Empty State Component
 * 
 * Usage:
 * <EmptyState 
 *   icon={Users}
 *   title="No guards found" 
 *   message="Create your first guard to get started" 
 *   action={{ label: "Add Guard", onClick: () => {} }}
 * />
 */
export const EmptyState = ({ icon: Icon = Inbox, title, message, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="w-20 h-20 bg-cobalt/10 rounded-full flex items-center justify-center mb-6">
        <Icon className="text-cobalt" size={40} />
      </div>
      <h3 className="text-xl font-['Orbitron'] text-white mb-2">{title}</h3>
      {message && <p className="text-silver-grey text-center max-w-md mb-6">{message}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-cobalt hover:bg-cobalt-light text-white font-['Orbitron'] rounded-lg transition-colors"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
};

/**
 * Error State Component
 * 
 * Usage:
 * <ErrorState 
 *   title="Failed to load data"
 *   message={error.message}
 *   action={{ label: "Retry", onClick: () => loadData() }}
 * />
 */
export const ErrorState = ({ title = 'Something went wrong', message, action, variant = 'error' }) => {
  const colorMap = {
    error: 'red',
    warning: 'yellow',
    info: 'blue',
  };

  const color = colorMap[variant];
  const iconMap = {
    error: XCircle,
    warning: AlertCircle,
    info: AlertCircle,
  };

  const Icon = iconMap[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-20 px-4`}
    >
      <div className={`w-20 h-20 bg-${color}-500/10 rounded-full flex items-center justify-center mb-6`}>
        <Icon className={`text-${color}-500`} size={40} />
      </div>
      <h3 className={`text-xl font-['Orbitron'] text-${color}-400 mb-2`}>{title}</h3>
      {message && (
        <p className={`text-${color}-400/80 text-center max-w-md mb-6`}>
          {message}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className={`px-6 py-3 bg-${color}-500/20 hover:bg-${color}-500/30 text-${color}-400 border border-${color}-500/50 font-['Orbitron'] rounded-lg transition-colors`}
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
};

/**
 * Permission Denied State
 * Specialized error state for 403 responses
 */
export const PermissionDenied = ({ message = 'You do not have permission to access this resource' }) => {
  return (
    <ErrorState
      title="Access Denied"
      message={message}
      variant="warning"
      action={{
        label: 'Go Back',
        onClick: () => window.history.back(),
      }}
    />
  );
};

/**
 * Server Error State
 * Specialized error state for 500 responses
 */
export const ServerError = ({ message = 'The server encountered an error. Please try again later.', onRetry }) => {
  return (
    <ErrorState
      title="Server Error"
      message={message}
      variant="error"
      action={onRetry ? {
        label: 'Retry',
        onClick: onRetry,
      } : undefined}
    />
  );
};

export default {
  LoadingSpinner,
  EmptyState,
  ErrorState,
  PermissionDenied,
  ServerError,
};
