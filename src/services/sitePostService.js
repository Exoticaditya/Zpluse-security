/**
 * Site Post Service
 * Handles all site post (duty station) API operations
 */
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';

/**
 * Get all site posts
 * @returns {Promise<Array>} List of site posts
 */
export const getAllSitePosts = async () => {
    return apiClient.get(API_ENDPOINTS.SITE_POSTS.BASE);
};

/**
 * Get site post by ID
 * @param {number} id
 * @returns {Promise<Object>} Site post object
 */
export const getSitePostById = async (id) => {
    return apiClient.get(API_ENDPOINTS.SITE_POSTS.BY_ID(id));
};

/**
 * Get all posts for a specific site
 * @param {number} siteId
 * @returns {Promise<Array>} List of site posts
 */
export const getPostsBySiteId = async (siteId) => {
    return apiClient.get(API_ENDPOINTS.SITE_POSTS.BY_SITE(siteId));
};

/**
 * Create new site post
 * @param {Object} postData - { siteId, name, description }
 * @returns {Promise<Object>} Created site post
 */
export const createSitePost = async (postData) => {
    return apiClient.post(API_ENDPOINTS.SITE_POSTS.BASE, postData);
};

/**
 * Update site post
 * @param {number} id
 * @param {Object} postData - { name, description }
 * @returns {Promise<Object>} Updated site post
 */
export const updateSitePost = async (id, postData) => {
    return apiClient.put(API_ENDPOINTS.SITE_POSTS.BY_ID(id), postData);
};

/**
 * Delete site post (soft delete)
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deleteSitePost = async (id) => {
    return apiClient.delete(API_ENDPOINTS.SITE_POSTS.BY_ID(id));
};

export default {
    getAllSitePosts,
    getSitePostById,
    getPostsBySiteId,
    createSitePost,
    updateSitePost,
    deleteSitePost,
};
