/**
 * Client Service
 * Handles all client account API operations
 */
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';

/**
 * Get all clients
 * @returns {Promise<Array>} List of clients
 */
export const getAllClients = async () => {
  return apiClient.get(API_ENDPOINTS.CLIENTS.BASE);
};

/**
 * Get client by ID
 * @param {number} id
 * @returns {Promise<Object>} Client object
 */
export const getClientById = async (id) => {
  return apiClient.get(API_ENDPOINTS.CLIENTS.BY_ID(id));
};

/**
 * Create new client
 * @param {Object} clientData - { name }
 * @returns {Promise<Object>} Created client
 */
export const createClient = async (clientData) => {
  return apiClient.post(API_ENDPOINTS.CLIENTS.BASE, clientData);
};

/**
 * Delete client (soft delete)
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deleteClient = async (id) => {
  return apiClient.delete(API_ENDPOINTS.CLIENTS.BY_ID(id));
};

export default {
  getAllClients,
  getClientById,
  createClient,
  deleteClient,
};
