/**
 * Admin Service
 * Centralized API service for admin operations
 * All endpoints require ADMIN role
 */
import apiClient from './apiClient';

// ==================== CLIENT MANAGEMENT ====================

/**
 * Get all clients
 * @returns {Promise<Array>} List of clients
 */
export const getAllClients = async () => {
  return await apiClient.get('/clients');
};

/**
 * Get client by ID
 * @param {number} id - Client ID
 * @returns {Promise<Object>} Client details
 */
export const getClientById = async (id) => {
  return await apiClient.get(`/clients/${id}`);
};

/**
 * Create new client
 * @param {Object} clientData - { name }
 * @returns {Promise<Object>} Created client
 */
export const createClient = async (clientData) => {
  return await apiClient.post('/clients', clientData);
};

/**
 * Delete client (soft delete)
 * @param {number} id - Client ID
 * @returns {Promise<void>}
 */
export const deleteClient = async (id) => {
  return await apiClient.delete(`/clients/${id}`);
};

// ==================== SITE MANAGEMENT ====================

/**
 * Get all sites
 * @param {number} [clientId] - Optional: Filter by client ID
 * @returns {Promise<Array>} List of sites
 */
export const getAllSites = async (clientId = null) => {
  const url = clientId ? `/sites?clientId=${clientId}` : '/sites';
  return await apiClient.get(url);
};

/**
 * Get site by ID
 * @param {number} id - Site ID
 * @returns {Promise<Object>} Site details
 */
export const getSiteById = async (id) => {
  return await apiClient.get(`/sites/${id}`);
};

/**
 * Create new site
 * @param {Object} siteData - { clientAccountId, name, address, latitude, longitude }
 * @returns {Promise<Object>} Created site
 */
export const createSite = async (siteData) => {
  return await apiClient.post('/sites', siteData);
};

/**
 * Delete site (soft delete)
 * @param {number} id - Site ID
 * @returns {Promise<void>}
 */
export const deleteSite = async (id) => {
  return await apiClient.delete(`/sites/${id}`);
};

// ==================== GUARD MANAGEMENT ====================

/**
 * Get all guards
 * @returns {Promise<Array>} List of guards
 */
export const getAllGuards = async () => {
  return await apiClient.get('/guards');
};

/**
 * Get guard by ID
 * @param {number} id - Guard ID
 * @returns {Promise<Object>} Guard details
 */
export const getGuardById = async (id) => {
  return await apiClient.get(`/guards/${id}`);
};

/**
 * Create new guard
 * @param {Object} guardData - Guard creation data
 * @returns {Promise<Object>} Created guard
 */
export const createGuard = async (guardData) => {
  return await apiClient.post('/guards', guardData);
};

/**
 * Update guard
 * @param {number} id - Guard ID
 * @param {Object} guardData - Guard update data
 * @returns {Promise<Object>} Updated guard
 */
export const updateGuard = async (id, guardData) => {
  return await apiClient.put(`/guards/${id}`, guardData);
};

/**
 * Delete guard (soft delete)
 * @param {number} id - Guard ID
 * @returns {Promise<void>}
 */
export const deleteGuard = async (id) => {
  return await apiClient.delete(`/guards/${id}`);
};

// ==================== SITE POSTS MANAGEMENT ====================

/**
 * Get all site posts
 * @param {number} [siteId] - Optional: Filter by site ID
 * @returns {Promise<Array>} List of site posts
 */
export const getAllSitePosts = async (siteId = null) => {
  const url = siteId ? `/site-posts/site/${siteId}` : '/site-posts';
  return await apiClient.get(url);
};

/**
 * Get site post by ID
 * @param {number} id - Site post ID
 * @returns {Promise<Object>} Site post details
 */
export const getSitePostById = async (id) => {
  return await apiClient.get(`/site-posts/${id}`);
};

/**
 * Create new site post
 * @param {Object} sitePostData - { siteId, name, description, latitude, longitude }
 * @returns {Promise<Object>} Created site post
 */
export const createSitePost = async (sitePostData) => {
  return await apiClient.post('/site-posts', sitePostData);
};

/**
 * Update site post
 * @param {number} id - Site post ID
 * @param {Object} sitePostData - Updated data
 * @returns {Promise<Object>} Updated site post
 */
export const updateSitePost = async (id, sitePostData) => {
  return await apiClient.put(`/site-posts/${id}`, sitePostData);
};

/**
 * Delete site post (soft delete)
 * @param {number} id - Site post ID
 * @returns {Promise<void>}
 */
export const deleteSitePost = async (id) => {
  return await apiClient.delete(`/site-posts/${id}`);
};

export default {
  // Clients
  getAllClients,
  getClientById,
  createClient,
  deleteClient,
  
  // Sites
  getAllSites,
  getSiteById,
  createSite,
  deleteSite,
  
  // Guards
  getAllGuards,
  getGuardById,
  createGuard,
  updateGuard,
  deleteGuard,
  
  // Site Posts
  getAllSitePosts,
  getSitePostById,
  createSitePost,
  updateSitePost,
  deleteSitePost,
};
