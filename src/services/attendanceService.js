/**
 * Attendance Service
 * Handles all attendance-related API operations:
 * - Guard check-in/check-out
 * - Attendance history
 * - Attendance reports
 */
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';

/**
 * Guard check-in
 * @param {Object} checkInData - { guardId, notes (optional) }
 * @returns {Promise<Object>} Attendance record with status
 */
export const checkIn = async (checkInData) => {
  return apiClient.post(API_ENDPOINTS.ATTENDANCE.CHECK_IN, checkInData);
};

/**
 * Guard check-out
 * @param {Object} checkOutData - { guardId, notes (optional) }
 * @returns {Promise<Object>} Updated attendance record
 */
export const checkOut = async (checkOutData) => {
  return apiClient.post(API_ENDPOINTS.ATTENDANCE.CHECK_OUT, checkOutData);
};

/**
 * Get attendance history for a guard
 * @param {number} guardId
 * @returns {Promise<Array>} List of attendance records
 */
export const getGuardAttendance = async (guardId) => {
  return apiClient.get(API_ENDPOINTS.ATTENDANCE.BY_GUARD(guardId));
};

/**
 * Get attendance for a site on specific date
 * @param {number} siteId
 * @param {string} date - YYYY-MM-DD format (optional, defaults to today)
 * @returns {Promise<Array>} List of attendance records
 */
export const getSiteAttendance = async (siteId, date = null) => {
  const endpoint = date 
    ? `${API_ENDPOINTS.ATTENDANCE.BY_SITE(siteId)}?date=${date}`
    : API_ENDPOINTS.ATTENDANCE.BY_SITE(siteId);
  return apiClient.get(endpoint);
};

/**
 * Get today's attendance summary across all sites
 * @returns {Promise<Array>} List of all attendance records for today
 */
export const getTodaySummary = async () => {
  return apiClient.get(API_ENDPOINTS.ATTENDANCE.TODAY_SUMMARY);
};

/**
 * Get attendance record by ID
 * @param {number} id
 * @returns {Promise<Object>} Attendance record
 */
export const getAttendanceById = async (id) => {
  return apiClient.get(API_ENDPOINTS.ATTENDANCE.BY_ID(id));
};

export default {
  checkIn,
  checkOut,
  getGuardAttendance,
  getSiteAttendance,
  getTodaySummary,
  getAttendanceById,
};
