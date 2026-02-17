import { useState, useEffect } from 'react';
import {
    getAllGuards,
    getGuardsByStatus,
    getAllClients,
    getIncidents,
    getSchedules,
    getRecentActivities,
    getUserData,
    subscribeToGuardUpdates,
    subscribeToIncidentUpdates,
    subscribeToActivityUpdates
} from '../services/firestoreService';

/**
 * Hook to fetch user data
 * @param {string} uid - User ID
 * @returns {Object} { userData, loading, error, refetch }
 */
export const useUserData = (uid) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        if (!uid) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await getUserData(uid);
            setUserData(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching user data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [uid]);

    return { userData, loading, error, refetch: fetchData };
};

/**
 * Hook to fetch all guards with real-time updates
 * @param {boolean} realTime - Enable real-time updates
 * @returns {Object} { guards, loading, error, refetch }
 */
export const useGuards = (realTime = false) => {
    const [guards, setGuards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getAllGuards();
            setGuards(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching guards:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (realTime) {
            const unsubscribe = subscribeToGuardUpdates((data) => {
                setGuards(data);
                setLoading(false);
            });
            return () => unsubscribe();
        } else {
            fetchData();
        }
    }, [realTime]);

    return { guards, loading, error, refetch: fetchData };
};

/**
 * Hook to fetch guards by status
 * @param {string} status - Guard status (on-duty, off-duty, on-break)
 * @returns {Object} { guards, loading, error, refetch }
 */
export const useGuardsByStatus = (status) => {
    const [guards, setGuards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        if (!status) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await getGuardsByStatus(status);
            setGuards(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching guards by status:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [status]);

    return { guards, loading, error, refetch: fetchData };
};

/**
 * Hook to fetch all clients
 * @returns {Object} { clients, loading, error, refetch }
 */
export const useClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getAllClients();
            setClients(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching clients:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { clients, loading, error, refetch: fetchData };
};

/**
 * Hook to fetch incidents with real-time updates
 * @param {number} limitCount - Number of incidents to fetch
 * @param {boolean} realTime - Enable real-time updates
 * @returns {Object} { incidents, loading, error, refetch }
 */
export const useIncidents = (limitCount = 50, realTime = false) => {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getIncidents(limitCount);
            setIncidents(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching incidents:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (realTime) {
            const unsubscribe = subscribeToIncidentUpdates((data) => {
                setIncidents(data);
                setLoading(false);
            });
            return () => unsubscribe();
        } else {
            fetchData();
        }
    }, [limitCount, realTime]);

    return { incidents, loading, error, refetch: fetchData };
};

/**
 * Hook to fetch schedules
 * @returns {Object} { schedules, loading, error, refetch }
 */
export const useSchedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getSchedules();
            setSchedules(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching schedules:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { schedules, loading, error, refetch: fetchData };
};

/**
 * Hook to fetch recent activities with real-time updates
 * @param {number} limitCount - Number of activities to fetch
 * @param {boolean} realTime - Enable real-time updates
 * @returns {Object} { activities, loading, error, refetch }
 */
export const useActivities = (limitCount = 20, realTime = false) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getRecentActivities(limitCount);
            setActivities(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching activities:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (realTime) {
            const unsubscribe = subscribeToActivityUpdates((data) => {
                setActivities(data);
                setLoading(false);
            });
            return () => unsubscribe();
        } else {
            fetchData();
        }
    }, [limitCount, realTime]);

    return { activities, loading, error, refetch: fetchData };
};

/**
 * Hook to get dashboard statistics
 * @param {string} role - User role (client, worker, manager, admin)
 * @returns {Object} { stats, loading, error }
 */
export const useDashboardStats = (role) => {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                
                // Fetch data based on role
                const guardsData = await getAllGuards();
                const clientsData = await getAllClients();
                const incidentsData = await getIncidents(10);
                
                const activeGuards = guardsData.filter(g => g.status === 'on-duty').length;
                const openIncidents = incidentsData.filter(i => i.status !== 'resolved').length;
                
                const statsData = {
                    totalGuards: guardsData.length,
                    activeGuards,
                    totalClients: clientsData.length,
                    openIncidents,
                    monthlyReports: 0, // Will be calculated from reports collection
                    monthlyRevenue: 0, // Will be calculated from billing collection
                };
                
                setStats(statsData);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching dashboard stats:', err);
            } finally {
                setLoading(false);
            }
        };

        if (role) {
            fetchStats();
        }
    }, [role]);

    return { stats, loading, error };
};

export default {
    useUserData,
    useGuards,
    useGuardsByStatus,
    useClients,
    useIncidents,
    useSchedules,
    useActivities,
    useDashboardStats
};
