import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    addDoc,
    serverTimestamp,
    onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ==================== USER SERVICES ====================

/**
 * Get user data by UID
 * @param {string} uid - User ID
 * @returns {Promise<Object>} User data
 */
export const getUserData = async (uid) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            return { id: userDoc.id, ...userDoc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

/**
 * Update user profile
 * @param {string} uid - User ID
 * @param {Object} data - User data to update
 */
export const updateUserProfile = async (uid, data) => {
    try {
        await updateDoc(doc(db, 'users', uid), {
            ...data,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

/**
 * Get all users (Admin only)
 * @returns {Promise<Array>} Array of users
 */
export const getAllUsers = async () => {
    try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
    }
};

/**
 * Delete user (Admin only)
 * @param {string} uid - User ID
 */
export const deleteUser = async (uid) => {
    try {
        await deleteDoc(doc(db, 'users', uid));
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

// ==================== GUARD SERVICES ====================

/**
 * Get all guards
 * @returns {Promise<Array>} Array of guards
 */
export const getAllGuards = async () => {
    try {
        const q = query(collection(db, 'guards'), orderBy('createdAt', 'desc'));
        const guardsSnapshot = await getDocs(q);
        return guardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching guards:', error);
        throw error;
    }
};

/**
 * Get guards by status
 * @param {string} status - Guard status (on-duty, off-duty, on-break)
 * @returns {Promise<Array>} Array of guards
 */
export const getGuardsByStatus = async (status) => {
    try {
        const q = query(
            collection(db, 'guards'),
            where('status', '==', status),
            orderBy('createdAt', 'desc')
        );
        const guardsSnapshot = await getDocs(q);
        return guardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching guards by status:', error);
        throw error;
    }
};

/**
 * Add new guard
 * @param {Object} guardData - Guard data
 * @returns {Promise<string>} Guard ID
 */
export const addGuard = async (guardData) => {
    try {
        const docRef = await addDoc(collection(db, 'guards'), {
            ...guardData,
            createdAt: serverTimestamp(),
            status: guardData.status || 'off-duty'
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding guard:', error);
        throw error;
    }
};

/**
 * Update guard data
 * @param {string} guardId - Guard ID
 * @param {Object} data - Guard data to update
 */
export const updateGuard = async (guardId, data) => {
    try {
        await updateDoc(doc(db, 'guards', guardId), {
            ...data,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating guard:', error);
        throw error;
    }
};

/**
 * Delete guard
 * @param {string} guardId - Guard ID
 */
export const deleteGuard = async (guardId) => {
    try {
        await deleteDoc(doc(db, 'guards', guardId));
    } catch (error) {
        console.error('Error deleting guard:', error);
        throw error;
    }
};

// ==================== CLIENT SERVICES ====================

/**
 * Get all clients
 * @returns {Promise<Array>} Array of clients
 */
export const getAllClients = async () => {
    try {
        const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'));
        const clientsSnapshot = await getDocs(q);
        return clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching clients:', error);
        throw error;
    }
};

/**
 * Add new client
 * @param {Object} clientData - Client data
 * @returns {Promise<string>} Client ID
 */
export const addClient = async (clientData) => {
    try {
        const docRef = await addDoc(collection(db, 'clients'), {
            ...clientData,
            createdAt: serverTimestamp(),
            contractStatus: clientData.contractStatus || 'pending'
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding client:', error);
        throw error;
    }
};

/**
 * Update client data
 * @param {string} clientId - Client ID
 * @param {Object} data - Client data to update
 */
export const updateClient = async (clientId, data) => {
    try {
        await updateDoc(doc(db, 'clients', clientId), {
            ...data,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating client:', error);
        throw error;
    }
};

// ==================== INCIDENT SERVICES ====================

/**
 * Get all incidents
 * @param {number} limitCount - Number of incidents to fetch
 * @returns {Promise<Array>} Array of incidents
 */
export const getIncidents = async (limitCount = 50) => {
    try {
        const q = query(
            collection(db, 'incidents'),
            orderBy('timestamp', 'desc'),
            limit(limitCount)
        );
        const incidentsSnapshot = await getDocs(q);
        return incidentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching incidents:', error);
        throw error;
    }
};

/**
 * Add new incident
 * @param {Object} incidentData - Incident data
 * @returns {Promise<string>} Incident ID
 */
export const addIncident = async (incidentData) => {
    try {
        const docRef = await addDoc(collection(db, 'incidents'), {
            ...incidentData,
            timestamp: serverTimestamp(),
            status: incidentData.status || 'reported'
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding incident:', error);
        throw error;
    }
};

/**
 * Update incident status
 * @param {string} incidentId - Incident ID
 * @param {string} status - New status
 */
export const updateIncidentStatus = async (incidentId, status) => {
    try {
        await updateDoc(doc(db, 'incidents', incidentId), {
            status,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating incident status:', error);
        throw error;
    }
};

// ==================== SCHEDULE SERVICES ====================

/**
 * Get schedules
 * @returns {Promise<Array>} Array of schedules
 */
export const getSchedules = async () => {
    try {
        const q = query(collection(db, 'schedules'), orderBy('date', 'asc'));
        const schedulesSnapshot = await getDocs(q);
        return schedulesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching schedules:', error);
        throw error;
    }
};

/**
 * Add new schedule
 * @param {Object} scheduleData - Schedule data
 * @returns {Promise<string>} Schedule ID
 */
export const addSchedule = async (scheduleData) => {
    try {
        const docRef = await addDoc(collection(db, 'schedules'), {
            ...scheduleData,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding schedule:', error);
        throw error;
    }
};

/**
 * Update schedule
 * @param {string} scheduleId - Schedule ID
 * @param {Object} data - Schedule data to update
 */
export const updateSchedule = async (scheduleId, data) => {
    try {
        await updateDoc(doc(db, 'schedules', scheduleId), {
            ...data,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating schedule:', error);
        throw error;
    }
};

// ==================== ATTENDANCE SERVICES ====================

/**
 * Clock in
 * @param {string} guardId - Guard ID
 * @param {string} siteId - Site ID
 * @returns {Promise<string>} Attendance record ID
 */
export const clockIn = async (guardId, siteId) => {
    try {
        const docRef = await addDoc(collection(db, 'attendance'), {
            guardId,
            siteId,
            clockIn: serverTimestamp(),
            status: 'active'
        });
        
        // Update guard status
        await updateGuard(guardId, { status: 'on-duty' });
        
        return docRef.id;
    } catch (error) {
        console.error('Error clocking in:', error);
        throw error;
    }
};

/**
 * Clock out
 * @param {string} attendanceId - Attendance record ID
 * @param {string} guardId - Guard ID
 */
export const clockOut = async (attendanceId, guardId) => {
    try {
        await updateDoc(doc(db, 'attendance', attendanceId), {
            clockOut: serverTimestamp(),
            status: 'completed'
        });
        
        // Update guard status
        await updateGuard(guardId, { status: 'off-duty' });
    } catch (error) {
        console.error('Error clocking out:', error);
        throw error;
    }
};

/**
 * Get attendance records for a guard
 * @param {string} guardId - Guard ID
 * @param {number} limitCount - Number of records to fetch
 * @returns {Promise<Array>} Array of attendance records
 */
export const getGuardAttendance = async (guardId, limitCount = 30) => {
    try {
        const q = query(
            collection(db, 'attendance'),
            where('guardId', '==', guardId),
            orderBy('clockIn', 'desc'),
            limit(limitCount)
        );
        const attendanceSnapshot = await getDocs(q);
        return attendanceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching attendance:', error);
        throw error;
    }
};

// ==================== ACTIVITY SERVICES ====================

/**
 * Add activity log
 * @param {Object} activityData - Activity data
 * @returns {Promise<string>} Activity ID
 */
export const addActivity = async (activityData) => {
    try {
        const docRef = await addDoc(collection(db, 'activities'), {
            ...activityData,
            timestamp: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding activity:', error);
        throw error;
    }
};

/**
 * Get recent activities
 * @param {number} limitCount - Number of activities to fetch
 * @returns {Promise<Array>} Array of activities
 */
export const getRecentActivities = async (limitCount = 20) => {
    try {
        const q = query(
            collection(db, 'activities'),
            orderBy('timestamp', 'desc'),
            limit(limitCount)
        );
        const activitiesSnapshot = await getDocs(q);
        return activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching activities:', error);
        throw error;
    }
};

// ==================== REAL-TIME LISTENERS ====================

/**
 * Subscribe to guard status updates
 * @param {Function} callback - Callback function to handle updates
 * @returns {Function} Unsubscribe function
 */
export const subscribeToGuardUpdates = (callback) => {
    const q = query(collection(db, 'guards'));
    return onSnapshot(q, (snapshot) => {
        const guards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(guards);
    });
};

/**
 * Subscribe to incident updates
 * @param {Function} callback - Callback function to handle updates
 * @returns {Function} Unsubscribe function
 */
export const subscribeToIncidentUpdates = (callback) => {
    const q = query(collection(db, 'incidents'), orderBy('timestamp', 'desc'), limit(10));
    return onSnapshot(q, (snapshot) => {
        const incidents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(incidents);
    });
};

/**
 * Subscribe to activity updates
 * @param {Function} callback - Callback function to handle updates
 * @returns {Function} Unsubscribe function
 */
export const subscribeToActivityUpdates = (callback) => {
    const q = query(collection(db, 'activities'), orderBy('timestamp', 'desc'), limit(20));
    return onSnapshot(q, (snapshot) => {
        const activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(activities);
    });
};

export default {
    // User services
    getUserData,
    updateUserProfile,
    getAllUsers,
    deleteUser,
    
    // Guard services
    getAllGuards,
    getGuardsByStatus,
    addGuard,
    updateGuard,
    deleteGuard,
    
    // Client services
    getAllClients,
    addClient,
    updateClient,
    
    // Incident services
    getIncidents,
    addIncident,
    updateIncidentStatus,
    
    // Schedule services
    getSchedules,
    addSchedule,
    updateSchedule,
    
    // Attendance services
    clockIn,
    clockOut,
    getGuardAttendance,
    
    // Activity services
    addActivity,
    getRecentActivities,
    
    // Real-time listeners
    subscribeToGuardUpdates,
    subscribeToIncidentUpdates,
    subscribeToActivityUpdates
};
