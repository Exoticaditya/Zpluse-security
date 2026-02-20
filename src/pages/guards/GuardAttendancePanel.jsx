import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Building2,
  User,
  Calendar,
  Loader,
  LogIn,
  LogOut,
} from 'lucide-react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import { Button } from '../../components/UIComponents';
import * as attendanceService from '../../services/attendanceService';
import { handleError } from '../../utils/errorHandler';
import { useAuth } from '../../contexts/AuthContext';

const GuardAttendancePanel = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [notification, setNotification] = useState(null);
  const [notes, setNotes] = useState('');

  // Assume guardId comes from authenticated user context
  // For now, using a placeholder - you'll need to get this from your auth context
  const guardId = user?.guardId || 1; // Replace with actual guard ID from auth

  useEffect(() => {
    loadAttendanceData();
    // Refresh every 30 seconds to show updated status
    const interval = setInterval(loadAttendanceData, 30000);
    return () => clearInterval(interval);
  }, [guardId]);

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      const history = await attendanceService.getGuardAttendance(guardId);
      setAttendanceHistory(history);
      
      // Find today's attendance
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = history.find(record => 
        record.attendanceDate === today
      );
      setTodayAttendance(todayRecord || null);
    } catch (error) {
      showNotification(handleError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      const response = await attendanceService.checkIn({
        guardId,
        notes: notes.trim() || undefined,
      });
      setTodayAttendance(response);
      setNotes('');
      showNotification('Check-in successful!', 'success');
      loadAttendanceData();
    } catch (error) {
      showNotification(handleError(error), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      const response = await attendanceService.checkOut({
        guardId,
        notes: notes.trim() || undefined,
      });
      setTodayAttendance(response);
      setNotes('');
      showNotification('Check-out successful!', 'success');
      loadAttendanceData();
    } catch (error) {
      showNotification(handleError(error), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const getStatusBadge = (status) => {
    const badges = {
      PRESENT: { color: 'bg-green-500', icon: CheckCircle, text: 'Present' },
      LATE: { color: 'bg-yellow-500', icon: AlertCircle, text: 'Late' },
      EARLY_LEAVE: { color: 'bg-orange-500', icon: AlertCircle, text: 'Early Leave' },
      ABSENT: { color: 'bg-red-500', icon: XCircle, text: 'Absent' },
      MISSED_CHECKOUT: { color: 'bg-purple-500', icon: AlertCircle, text: 'Missed Checkout' },
    };
    
    const badge = badges[status] || { color: 'bg-gray-500', icon: AlertCircle, text: status };
    const IconComponent = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white ${badge.color}`}>
        <IconComponent size={16} />
        {badge.text}
      </span>
    );
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '--:--';
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const canCheckIn = !todayAttendance;
  const canCheckOut = todayAttendance && todayAttendance.checkInTime && !todayAttendance.checkOutTime;

  if (loading) {
    return (
      <DashboardSidebar>
        <div className="flex items-center justify-center h-96">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </DashboardSidebar>
    );
  }

  return (
    <DashboardSidebar>
      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 p-4 rounded-lg ${
            notification.type === 'success' ? 'bg-green-500/10 text-green-500' :
            notification.type === 'error' ? 'bg-red-500/10 text-red-500' :
            'bg-blue-500/10 text-blue-500'
          }`}
        >
          {notification.message}
        </motion.div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Attendance Panel</h1>
        <p className="text-gray-400">Check in and out of your shifts</p>
      </div>

      {/* Today's Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="text-blue-500" />
            Today - {formatDate(new Date())}
          </h2>
          {todayAttendance && getStatusBadge(todayAttendance.status)}
        </div>

        {todayAttendance ? (
          // Has attendance record
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="text-blue-500" />
                <div>
                  <p className="text-gray-400 text-sm">Site</p>
                  <p className="font-semibold">{todayAttendance.siteName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-500" />
                <div>
                  <p className="text-gray-400 text-sm">Post</p>
                  <p className="font-semibold">{todayAttendance.postName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="text-blue-500" />
                <div>
                  <p className="text-gray-400 text-sm">Shift</p>
                  <p className="font-semibold">
                    {todayAttendance.shiftName} ({todayAttendance.shiftStart} - {todayAttendance.shiftEnd})
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <LogIn className="text-green-500" />
                <div>
                  <p className="text-gray-400 text-sm">Check-In Time</p>
                  <p className="font-semibold text-xl">{formatTime(todayAttendance.checkInTime)}</p>
                  {todayAttendance.lateMinutes > 0 && (
                    <p className="text-yellow-500 text-sm">Late by {todayAttendance.lateMinutes} minutes</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <LogOut className="text-red-500" />
                <div>
                  <p className="text-gray-400 text-sm">Check-Out Time</p>
                  <p className="font-semibold text-xl">{formatTime(todayAttendance.checkOutTime)}</p>
                  {todayAttendance.earlyLeaveMinutes > 0 && (
                    <p className="text-orange-500 text-sm">
                      Left {todayAttendance.earlyLeaveMinutes} minutes early
                    </p>
                  )}
                </div>
              </div>

              {todayAttendance.notes && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Notes</p>
                  <p className="text-sm bg-gray-900/50 p-2 rounded">{todayAttendance.notes}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // No attendance record
          <div className="text-center py-8">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <p className="text-xl mb-2">No attendance recorded today</p>
            <p className="text-gray-400">Please check in to start your shift</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes (optional)"
            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            rows="2"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleCheckIn}
              disabled={!canCheckIn || actionLoading}
              className={`w-full py-4 text-lg font-semibold flex items-center justify-center gap-2 ${
                canCheckIn 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-700 cursor-not-allowed'
              }`}
            >
              {actionLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  CHECK IN
                </>
              )}
            </Button>

            <Button
              onClick={handleCheckOut}
              disabled={!canCheckOut || actionLoading}
              className={`w-full py-4 text-lg font-semibold flex items-center justify-center gap-2 ${
                canCheckOut 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-gray-700 cursor-not-allowed'
              }`}
            >
              {actionLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogOut className="w-5 h-5" />
                  CHECK OUT
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Attendance History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold mb-4">Attendance History</h2>
        
        {attendanceHistory.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No attendance records yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Site</th>
                  <th className="text-left py-3 px-4">Check-In</th>
                  <th className="text-left py-3 px-4">Check-Out</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.slice(0, 10).map((record, index) => (
                  <tr key={record.attendanceId} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-3 px-4">{formatDate(record.attendanceDate)}</td>
                    <td className="py-3 px-4">{record.siteName}</td>
                    <td className="py-3 px-4">{formatTime(record.checkInTime)}</td>
                    <td className="py-3 px-4">{formatTime(record.checkOutTime)}</td>
                    <td className="py-3 px-4">{getStatusBadge(record.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </DashboardSidebar>
  );
};

export default GuardAttendancePanel;
