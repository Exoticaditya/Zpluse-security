/**
 * Guard Service
 * Handles all guard-related API operations
 */
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';

/**
 * Get all guards
 * @returns {Promise<Array>} List of guards
 */
export const getAllGuards = async () => {
  return apiClient.get(API_ENDPOINTS.GUARDS.BASE);
};

/**
 * Get guard by ID
 * @param {number} id
 * @returns {Promise<Object>} Guard object
 */
export const getGuardById = async (id) => {
  return apiClient.get(API_ENDPOINTS.GUARDS.BY_ID(id));
};

/**
 * Create new guard
 * @param {Object} guardData - Guard creation data
 * @returns {Promise<Object>} Created guard
 */
export const createGuard = async (guardData) => {
  return apiClient.post(API_ENDPOINTS.GUARDS.BASE, guardData);
};

/**
 * Delete guard (soft delete)
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deleteGuard = async (id) => {
  return apiClient.delete(API_ENDPOINTS.GUARDS.BY_ID(id));
};

export default {
  getAllGuards,
  getGuardById,
  createGuard,
  deleteGuard,
};
