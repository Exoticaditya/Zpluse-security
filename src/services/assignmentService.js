/**
 * Assignment Service
 * Handles all guard assignment API operations
 */
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';

/**
 * Get all active assignments
 * @returns {Promise<Array>} List of active assignments
 */
export const getAllAssignments = async () => {
    return apiClient.get(API_ENDPOINTS.ASSIGNMENTS.BASE);
};

/**
 * Get assignment by ID
 * @param {number} id
 * @returns {Promise<Object>} Assignment object
 */
export const getAssignmentById = async (id) => {
    return apiClient.get(API_ENDPOINTS.ASSIGNMENTS.BY_ID(id));
};

/**
 * Get assignments for a specific guard
 * @param {number} guardId
 * @returns {Promise<Array>} List of assignments
 */
export const getAssignmentsByGuard = async (guardId) => {
    return apiClient.get(API_ENDPOINTS.ASSIGNMENTS.BY_GUARD(guardId));
};

/**
 * Get assignments for a specific site post
 * @param {number} sitePostId
 * @returns {Promise<Array>} List of assignments
 */
export const getAssignmentsBySitePost = async (sitePostId) => {
    return apiClient.get(API_ENDPOINTS.ASSIGNMENTS.BY_SITE_POST(sitePostId));
};

/**
 * Create new assignment
 * @param {Object} assignmentData - { guardId, sitePostId, shiftTypeId, effectiveFrom, effectiveTo, notes }
 * @returns {Promise<Object>} Created assignment
 */
export const createAssignment = async (assignmentData) => {
    return apiClient.post(API_ENDPOINTS.ASSIGNMENTS.BASE, assignmentData);
};

/**
 * Cancel assignment (soft delete)
 * @param {number} id
 * @returns {Promise<void>}
 */
export const cancelAssignment = async (id) => {
    return apiClient.delete(API_ENDPOINTS.ASSIGNMENTS.BY_ID(id));
};

/**
 * Get all shift types
 * @returns {Promise<Array>} List of shift types (DAY, EVENING, NIGHT)
 */
export const getShiftTypes = async () => {
    return apiClient.get(API_ENDPOINTS.ASSIGNMENTS.SHIFT_TYPES);
};

export default {
    getAllAssignments,
    getAssignmentById,
    getAssignmentsByGuard,
    getAssignmentsBySitePost,
    createAssignment,
    cancelAssignment,
    getShiftTypes,
};
