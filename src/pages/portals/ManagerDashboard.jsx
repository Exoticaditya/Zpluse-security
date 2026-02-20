import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Shield, TrendingUp, AlertTriangle,
    Calendar, FileText, DollarSign, Clock,
    UserPlus, MapPin, CheckCircle, XCircle,
    Phone, Mail, Edit, Trash2, Eye, Loader
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, GlowCard } from '../../components/UIComponents';
import DashboardLayout from './components/DashboardLayout';
import StatCard from './components/StatCard';
import ActivityFeed from './components/ActivityFeed';
import * as guardService from '../../services/guardService';
import * as attendanceService from '../../services/attendanceService';
import * as assignmentService from '../../services/assignmentService';
import { handleError } from '../../utils/errorHandler';

const ManagerDashboard = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [showModal, setShowModal] = useState({ type: null, data: null });

    // Real API state
    const [guardsList, setGuardsList] = useState([]);
    const [todaySummary, setTodaySummary] = useState([]);
    const [assignmentsList, setAssignmentsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [guards, summary, assignments] = await Promise.all([
                guardService.getAllGuards().catch(() => []),
                attendanceService.getTodaySummary().catch(() => []),
                assignmentService.getAllAssignments().catch(() => []),
            ]);
            setGuardsList(guards || []);
            setTodaySummary(summary || []);
            setAssignmentsList(assignments || []);
        } catch (err) {
            setError(handleError(err));
        } finally {
            setLoading(false);
        }
    };

    // Computed stats from real data
    const managerStats = {
        totalGuards: guardsList.length,
        activeGuards: todaySummary.filter(a => a.checkInTime && !a.checkOutTime).length,
        totalAssignments: assignmentsList.length,
        checkedInToday: todaySummary.length,
    };

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center px-6 py-3 font-['Orbitron'] transition-all ${activeTab === id
                    ? 'bg-cobalt text-white border-b-2 border-cobalt'
                    : 'text-silver-grey hover:text-white hover:bg-cobalt/20'
                }`}
        >
            <Icon size={18} className="mr-2" />
            {label}
        </button>
    );

    const GuardCard = ({ guard }) => (
        <GlowCard className="p-4">
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-radial from-cobalt to-blue-900 rounded-full flex items-center justify-center">
                        <Shield size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-white font-['Orbitron'] text-lg">{guard.fullName || guard.name || 'Guard'}</h4>
                        <p className="text-silver-grey text-sm">ID: {guard.id || 'N/A'}</p>
                        <div className="mt-2 space-y-1">
                            <div className="flex items-center text-sm text-silver-grey">
                                <Phone size={14} className="mr-2 text-cobalt" />
                                {guard.phone || 'N/A'}
                            </div>
                            <div className="flex items-center text-sm text-silver-grey">
                                <Mail size={14} className="mr-2 text-cobalt" />
                                {guard.email || 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    <button
                        onClick={() => setShowModal({ type: 'viewGuard', data: guard })}
                        className="p-2 hover:bg-cobalt/20 rounded transition-colors"
                    >
                        <Eye size={16} className="text-blue-400" />
                    </button>
                </div>
            </div>
        </GlowCard>
    );

    const renderTabContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-24">
                    <Loader className="animate-spin text-cobalt" size={40} />
                </div>
            );
        }

        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/40 text-red-400 p-4 rounded-xl">
                                {error}
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Guards"
                                value={managerStats.totalGuards}
                                icon={Users}
                                color="blue"
                            />
                            <StatCard
                                title="On Duty Now"
                                value={managerStats.activeGuards}
                                icon={Shield}
                                color="green"
                            />
                            <StatCard
                                title="Active Assignments"
                                value={managerStats.totalAssignments}
                                icon={TrendingUp}
                                color="purple"
                            />
                            <StatCard
                                title="Checked In Today"
                                value={managerStats.checkedInToday}
                                icon={Clock}
                                color="yellow"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <GlowCard>
                                <h3 className="text-xl font-['Orbitron'] text-white mb-4 flex items-center">
                                    <Clock className="text-cobalt mr-2" size={24} />
                                    Today's Attendance
                                </h3>
                                {todaySummary.length > 0 ? (
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {todaySummary.map((record) => (
                                            <div key={record.attendanceId} className="flex items-center justify-between p-3 bg-black/30 rounded border border-cobalt/20">
                                                <div>
                                                    <p className="text-white font-['Orbitron'] text-sm">{record.guardName}</p>
                                                    <p className="text-sm text-silver-grey">{record.siteName} — {record.postName}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-['Orbitron'] ${record.status === 'PRESENT' ? 'bg-green-500/20 text-green-400' :
                                                        record.status === 'LATE' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-gray-500/20 text-gray-400'
                                                    }`}>
                                                    {record.status || (record.checkInTime ? 'CHECKED IN' : 'PENDING')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-silver-grey text-center py-8">No attendance records for today</p>
                                )}
                            </GlowCard>

                            <GlowCard>
                                <h3 className="text-xl font-['Orbitron'] text-white mb-4 flex items-center">
                                    <AlertTriangle className="text-yellow-400 mr-2" size={24} />
                                    Pending Approvals
                                </h3>
                                <p className="text-silver-grey text-center py-8">No pending approvals</p>
                            </GlowCard>
                        </div>
                    </div>
                );

            case 'guards':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-['Orbitron'] text-white">Security Guards</h3>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {guardsList.length > 0 ? (
                                guardsList.map((guard) => (
                                    <GuardCard key={guard.id} guard={guard} />
                                ))
                            ) : (
                                <div className="col-span-2">
                                    <GlowCard>
                                        <p className="text-silver-grey text-center py-12">
                                            No guards found.
                                        </p>
                                    </GlowCard>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'schedules':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-['Orbitron'] text-white">Active Assignments</h3>
                        </div>
                        <GlowCard>
                            {assignmentsList.length > 0 ? (
                                <div className="space-y-3">
                                    {assignmentsList.map((assignment) => (
                                        <div key={assignment.id} className="p-4 bg-black/30 rounded border border-cobalt/20">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="text-white font-['Orbitron']">{assignment.guardName || 'Unassigned'}</h4>
                                                    <p className="text-sm text-silver-grey">{assignment.siteName} — {assignment.postName}</p>
                                                    <p className="text-sm text-cobalt mt-1">{assignment.shiftName} ({assignment.shiftStart} - {assignment.shiftEnd})</p>
                                                </div>
                                                <span className="text-xs text-silver-grey">
                                                    {assignment.effectiveFrom} → {assignment.effectiveTo || 'Ongoing'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-silver-grey text-center py-12">
                                    No active assignments. Create assignments from the Admin panel.
                                </p>
                            )}
                        </GlowCard>
                    </div>
                );

            case 'reports':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-['Orbitron'] text-white">Reports & Analytics</h3>
                            <Button variant="primary" className="flex items-center">
                                <FileText size={18} className="mr-2" />
                                Generate Report
                            </Button>
                        </div>
                        <GlowCard>
                            <p className="text-silver-grey text-center py-12">
                                Report generation functionality will be available soon.
                            </p>
                        </GlowCard>
                    </div>
                );

            default:
                return null;
        }
    };

    const actions = (
        <>
            <Button variant="secondary" className="flex items-center" onClick={() => loadDashboardData()}>
                <Clock size={18} className="mr-2" />
                Refresh
            </Button>
        </>
    );

    return (
        <DashboardLayout
            title="Manager Dashboard"
            subtitle="Manage your security operations, teams, and assignments"
            actions={actions}
        >
            {/* Tab Navigation */}
            <div className="mb-8 border-b border-cobalt/30 flex overflow-x-auto">
                <TabButton id="overview" label="Overview" icon={TrendingUp} />
                <TabButton id="guards" label="Guards" icon={Users} />
                <TabButton id="schedules" label="Assignments" icon={Calendar} />
                <TabButton id="reports" label="Reports" icon={FileText} />
            </div>

            {/* Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {renderTabContent()}
            </motion.div>
        </DashboardLayout>
    );
};

export default ManagerDashboard;
