import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogIn,
  LogOut,
  MapPin,
  Clock,
  Shield,
  CheckCircle,
  Home,
  Calendar,
  User,
  AlertTriangle,
  Navigation,
  Camera,
  Loader,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import * as attendanceService from '../../services/attendanceService';
import * as guardService from '../../services/guardService';
import { handleError } from '../../utils/errorHandler';

const GuardDashboardMobile = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [currentTime, setCurrentTime] = useState(new Date());

  // API state
  const [guardId, setGuardId] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Resolve guardId from current user on mount
  useEffect(() => {
    resolveGuardId();
  }, []);

  // Load attendance data once guardId is resolved
  useEffect(() => {
    if (guardId) {
      loadAttendanceData();
    }
  }, [guardId]);

  const resolveGuardId = async () => {
    try {
      setLoading(true);
      const guards = await guardService.getAllGuards();
      const myGuard = guards?.find(
        (g) => g.userId === currentUser?.userId || g.email === currentUser?.email
      );
      if (myGuard) {
        setGuardId(myGuard.id);
      } else {
        showNotification('No guard record linked to your account. Contact admin.', 'error');
        setLoading(false);
      }
    } catch (error) {
      showNotification(handleError(error), 'error');
      setLoading(false);
    }
  };

  const loadAttendanceData = useCallback(async () => {
    if (!guardId) return;
    try {
      const history = await attendanceService.getGuardAttendance(guardId);
      setAttendanceHistory(history || []);

      // Find today's attendance record
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = (history || []).find(
        (record) => record.attendanceDate === today
      );
      setTodayAttendance(todayRecord || null);
    } catch (error) {
      showNotification(handleError(error), 'error');
    } finally {
      setLoading(false);
    }
  }, [guardId]);

  const handleCheckIn = async () => {
    if (!guardId || actionLoading) return;
    try {
      setActionLoading(true);
      const response = await attendanceService.checkIn({ guardId });
      setTodayAttendance(response);
      showNotification('Checked in successfully', 'success');
      await loadAttendanceData();
    } catch (error) {
      const msg = handleError(error);
      if (error?.status === 401) {
        window.location.href = '/portal';
        return;
      }
      if (error?.status === 403) {
        showNotification('Not assigned to any site', 'error');
      } else {
        showNotification(msg, 'error');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!guardId || actionLoading) return;
    try {
      setActionLoading(true);
      const response = await attendanceService.checkOut({ guardId });
      setTodayAttendance(response);
      showNotification('Checked out successfully', 'success');
      await loadAttendanceData();
    } catch (error) {
      const msg = handleError(error);
      if (error?.status === 401) {
        window.location.href = '/portal';
        return;
      }
      if (error?.status === 403) {
        showNotification('Not assigned to any site', 'error');
      } else {
        showNotification(msg, 'error');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Derived state for button control
  const isOnDuty = todayAttendance?.checkInTime && !todayAttendance?.checkOutTime;
  const isShiftComplete = todayAttendance?.checkInTime && todayAttendance?.checkOutTime;
  const canCheckIn = !todayAttendance && guardId && !actionLoading;
  const canCheckOut = isOnDuty && !actionLoading;

  const calculateDuration = () => {
    if (!todayAttendance?.checkInTime) return '0h 0m';
    const start = new Date(todayAttendance.checkInTime);
    const end = todayAttendance.checkOutTime
      ? new Date(todayAttendance.checkOutTime)
      : new Date();
    const diff = end - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '--:--';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    const map = {
      PRESENT: 'text-green-400',
      LATE: 'text-yellow-400',
      EARLY_LEAVE: 'text-orange-400',
      ABSENT: 'text-red-400',
      MISSED_CHECKOUT: 'text-purple-400',
    };
    return map[status] || 'text-gray-400';
  };

  const getStatusIcon = (status) => {
    const map = {
      PRESENT: CheckCircle,
      LATE: AlertCircle,
      EARLY_LEAVE: AlertTriangle,
      ABSENT: XCircle,
      MISSED_CHECKOUT: AlertCircle,
    };
    return map[status] || AlertCircle;
  };

  // ─── Tab Components ───

  const HomeTab = () => (
    <div className="space-y-4 pb-24">
      {/* Notification Toast */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`p-4 rounded-2xl text-sm font-medium ${notification.type === 'success'
              ? 'bg-green-500/20 border border-green-500/40 text-green-400'
              : notification.type === 'error'
                ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                : 'bg-blue-500/20 border border-blue-500/40 text-blue-400'
            }`}
        >
          {notification.message}
        </motion.div>
      )}

      {/* Status Card */}
      <div className="bg-black/50 rounded-2xl p-6 border border-cobalt/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-silver-grey text-sm">Status</p>
            <p
              className={`text-2xl font-['Orbitron'] font-bold ${isOnDuty
                  ? 'text-green-400'
                  : isShiftComplete
                    ? 'text-cobalt'
                    : 'text-silver-grey'
                }`}
            >
              {isOnDuty ? 'ON DUTY' : isShiftComplete ? 'SHIFT DONE' : 'OFF DUTY'}
            </p>
          </div>
          <div
            className={`p-4 rounded-full ${isOnDuty
                ? 'bg-green-500/20'
                : isShiftComplete
                  ? 'bg-cobalt/20'
                  : 'bg-gray-500/20'
              }`}
          >
            <Shield
              className={
                isOnDuty
                  ? 'text-green-400'
                  : isShiftComplete
                    ? 'text-cobalt'
                    : 'text-gray-400'
              }
              size={32}
            />
          </div>
        </div>
        {isOnDuty && todayAttendance?.checkInTime && (
          <div className="pt-4 border-t border-cobalt/20">
            <p className="text-silver-grey text-sm mb-1">Duration</p>
            <p className="text-cobalt text-xl font-['Orbitron'] font-bold">
              {calculateDuration()}
            </p>
          </div>
        )}
        {todayAttendance?.lateMinutes > 0 && (
          <div className="pt-2">
            <p className="text-yellow-400 text-sm">
              Late by {todayAttendance.lateMinutes} minutes
            </p>
          </div>
        )}
        {todayAttendance?.earlyLeaveMinutes > 0 && (
          <div className="pt-2">
            <p className="text-orange-400 text-sm">
              Left {todayAttendance.earlyLeaveMinutes} minutes early
            </p>
          </div>
        )}
      </div>

      {/* Check In/Out Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileTap={canCheckIn ? { scale: 0.95 } : {}}
          onClick={handleCheckIn}
          disabled={!canCheckIn}
          className={`
            h-32 rounded-2xl font-['Orbitron'] font-bold text-lg
            flex flex-col items-center justify-center gap-3
            transition-all duration-300
            ${canCheckIn
              ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {actionLoading && canCheckIn ? (
            <Loader size={36} className="animate-spin" />
          ) : (
            <LogIn size={36} />
          )}
          CHECK IN
        </motion.button>

        <motion.button
          whileTap={canCheckOut ? { scale: 0.95 } : {}}
          onClick={handleCheckOut}
          disabled={!canCheckOut}
          className={`
            h-32 rounded-2xl font-['Orbitron'] font-bold text-lg
            flex flex-col items-center justify-center gap-3
            transition-all duration-300
            ${canCheckOut
              ? 'bg-gradient-to-br from-red-500 to-orange-600 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {actionLoading && canCheckOut ? (
            <Loader size={36} className="animate-spin" />
          ) : (
            <LogOut size={36} />
          )}
          CHECK OUT
        </motion.button>
      </div>

      {/* Duty Information — from today's attendance or placeholder */}
      <div className="bg-black/50 rounded-2xl p-6 border border-cobalt/30 space-y-4">
        <h3 className="text-white font-['Orbitron'] font-bold text-lg mb-4">
          Today's Assignment
        </h3>

        <div className="space-y-3">
          <div className="flex items-start">
            <MapPin className="text-cobalt mr-3 mt-1 flex-shrink-0" size={20} />
            <div>
              <p className="text-silver-grey text-sm">Site</p>
              <p className="text-white font-medium">
                {todayAttendance?.siteName || 'No assignment today'}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Navigation className="text-cobalt mr-3 mt-1 flex-shrink-0" size={20} />
            <div>
              <p className="text-silver-grey text-sm">Post</p>
              <p className="text-white font-medium">
                {todayAttendance?.postName || '—'}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Clock className="text-cobalt mr-3 mt-1 flex-shrink-0" size={20} />
            <div>
              <p className="text-silver-grey text-sm">Shift Time</p>
              <p className="text-white font-medium">
                {todayAttendance?.shiftStart && todayAttendance?.shiftEnd
                  ? `${todayAttendance.shiftName} (${todayAttendance.shiftStart} - ${todayAttendance.shiftEnd})`
                  : '—'}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <User className="text-cobalt mr-3 mt-1 flex-shrink-0" size={20} />
            <div>
              <p className="text-silver-grey text-sm">Client</p>
              <p className="text-white font-medium">
                {todayAttendance?.clientName || '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="h-24 bg-black/50 border border-cobalt/30 rounded-2xl flex flex-col items-center justify-center gap-2 text-cobalt font-['Orbitron']"
        >
          <Camera size={28} />
          <span className="text-sm">Report</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="h-24 bg-black/50 border border-cobalt/30 rounded-2xl flex flex-col items-center justify-center gap-2 text-cobalt font-['Orbitron']"
        >
          <AlertTriangle size={28} />
          <span className="text-sm">SOS</span>
        </motion.button>
      </div>
    </div>
  );

  const AttendanceTab = () => (
    <div className="space-y-4 pb-24">
      <h2 className="text-2xl font-['Orbitron'] font-bold text-white">
        Attendance History
      </h2>

      {attendanceHistory.length === 0 ? (
        <div className="bg-black/50 rounded-2xl p-6 border border-cobalt/30">
          <p className="text-silver-grey text-center py-12">
            No attendance records for this period
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {attendanceHistory.slice(0, 15).map((record) => {
            const StatusIcon = getStatusIcon(record.status);
            return (
              <div
                key={record.attendanceId}
                className="bg-black/50 rounded-2xl p-4 border border-cobalt/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-['Orbitron'] text-sm font-bold">
                    {formatDate(record.attendanceDate)}
                  </span>
                  <span
                    className={`flex items-center gap-1 text-xs font-semibold ${getStatusColor(
                      record.status
                    )}`}
                  >
                    <StatusIcon size={14} />
                    {record.status?.replace('_', ' ')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-silver-grey">In: </span>
                    <span className="text-white">{formatTime(record.checkInTime)}</span>
                  </div>
                  <div>
                    <span className="text-silver-grey">Out: </span>
                    <span className="text-white">{formatTime(record.checkOutTime)}</span>
                  </div>
                </div>
                <p className="text-silver-grey text-xs mt-1">
                  {record.siteName} — {record.postName}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const ProfileTab = () => (
    <div className="space-y-4 pb-24">
      <div className="bg-black/50 rounded-2xl p-6 border border-cobalt/30">
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-cobalt to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="text-white" size={48} />
          </div>
          <h2 className="text-2xl font-['Orbitron'] font-bold text-white mb-1">
            {currentUser?.fullName || 'Guard User'}
          </h2>
          <p className="text-cobalt">ID: {currentUser?.userId || '—'}</p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between py-3 border-b border-cobalt/20">
            <span className="text-silver-grey">Email</span>
            <span className="text-white">{currentUser?.email}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-cobalt/20">
            <span className="text-silver-grey">Phone</span>
            <span className="text-white">{currentUser?.phone || 'Not set'}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-cobalt/20">
            <span className="text-silver-grey">Role</span>
            <span className="text-white">Security Guard</span>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className="w-full mt-6 py-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 font-['Orbitron'] font-bold hover:bg-red-500/30 transition-colors"
        >
          Logout
        </motion.button>
      </div>
    </div>
  );

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, component: HomeTab },
    { id: 'attendance', label: 'Attendance', icon: Calendar, component: AttendanceTab },
    { id: 'profile', label: 'Profile', icon: User, component: ProfileTab },
  ];

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || HomeTab;

  // Full-screen loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-obsidian via-gray-900 to-obsidian flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-cobalt mx-auto mb-4" size={48} />
          <p className="text-silver-grey font-['Orbitron']">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-obsidian via-gray-900 to-obsidian">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md border-b border-cobalt/30 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-['Orbitron'] font-bold text-white">
              SGMS Guard
            </h1>
            <p className="text-cobalt text-sm">
              {currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-['Orbitron'] ${isOnDuty
                ? 'bg-green-500/20 text-green-400'
                : isShiftComplete
                  ? 'bg-cobalt/20 text-cobalt'
                  : 'bg-gray-500/20 text-gray-400'
              }`}
          >
            {isOnDuty ? 'ON DUTY' : isShiftComplete ? 'SHIFT DONE' : 'OFF DUTY'}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-cobalt/30 safe-bottom z-50">
        <div className="grid grid-cols-3 gap-1 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex flex-col items-center justify-center py-3 rounded-xl
                  transition-all duration-200 min-h-[64px]
                  ${isActive
                    ? 'bg-cobalt/20 text-cobalt'
                    : 'text-silver-grey hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon size={24} className="mb-1" />
                <span className="text-xs font-['Orbitron']">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GuardDashboardMobile;
