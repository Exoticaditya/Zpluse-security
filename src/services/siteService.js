/**
 * Site Service
 * Handles all site-related API operations
 */
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';

/**
 * Get all sites
 * @param {number} clientId - Optional client ID filter
 * @returns {Promise<Array>} List of sites
 */
export const getAllSites = async (clientId = null) => {
  if (clientId) {
    return apiClient.get(API_ENDPOINTS.SITES.BY_CLIENT(clientId));
  }
  return apiClient.get(API_ENDPOINTS.SITES.BASE);
};

/**
 * Get site by ID
 * @param {number} id
 * @returns {Promise<Object>} Site object
 */
export const getSiteById = async (id) => {
  return apiClient.get(API_ENDPOINTS.SITES.BY_ID(id));
};

/**
 * Create new site
 * @param {Object} siteData - { clientAccountId, name, address, latitude, longitude }
 * @returns {Promise<Object>} Created site
 */
export const createSite = async (siteData) => {
  return apiClient.post(API_ENDPOINTS.SITES.BASE, siteData);
};

/**
 * Delete site (soft delete)
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deleteSite = async (id) => {
  return apiClient.delete(API_ENDPOINTS.SITES.BY_ID(id));
};

export default {
  getAllSites,
  getSiteById,
  createSite,
  deleteSite,
};
