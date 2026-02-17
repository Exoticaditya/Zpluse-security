import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Clock, MapPin, CheckCircle, AlertTriangle,
    Camera, FileText, Navigation, Phone,
    Shield, Activity, Bell, LogIn, LogOut,
    ClipboardList, Radio
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, GlowCard } from '../../components/UIComponents';
import DashboardLayout from './components/DashboardLayout';
import StatCard from './components/StatCard';
import ActivityFeed from './components/ActivityFeed';

const WorkerDashboard = () => {
    const { currentUser } = useAuth();
    const [time, setTime] = useState(new Date());
    const [isOnDuty, setIsOnDuty] = useState(false);
    const [showIncidentForm, setShowIncidentForm] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Mock data
    const workerInfo = {
        name: 'Rajesh Kumar',
        id: 'GRD-2024-001',
        assignedSite: 'Main Office Building',
        position: 'Main Gate',
        shift: 'Day Shift (6AM-2PM)',
        checkInTime: '06:00 AM',
        manager: 'Sunil Mehta'
    };

    const stats = {
        hoursWorked: 6.5,
        patrolsCompleted: 4,
        incidentsReported: 1,
        tasksCompleted: 8
    };

    const currentTasks = [
        { id: 1, task: 'Monitor main entrance', status: 'in-progress', priority: 'high' },
        { id: 2, task: 'Patrol parking area every 2 hours', status: 'pending', priority: 'medium' },
        { id: 3, task: 'Check all emergency exits', status: 'completed', priority: 'high' },
        { id: 4, task: 'Update visitor log', status: 'in-progress', priority: 'low' },
    ];

    const upcomingShifts = [
        { date: 'Today', time: '6:00 AM - 2:00 PM', site: 'Main Office Building', status: 'active' },
        { date: 'Tomorrow', time: '6:00 AM - 2:00 PM', site: 'Main Office Building', status: 'scheduled' },
        { date: 'Jan 17', time: '6:00 AM - 2:00 PM', site: 'Warehouse Complex', status: 'scheduled' },
    ];

    const patrolCheckpoints = [
        { id: 1, name: 'Main Entrance', time: '14:30', status: 'completed' },
        { id: 2, name: 'Parking Area', time: '13:45', status: 'completed' },
        { id: 3, name: 'Emergency Exit A', time: '12:30', status: 'completed' },
        { id: 4, name: 'Back Entrance', time: 'Pending', status: 'pending' },
    ];

    const activities = [
        { id: 1, message: 'Checked in at Main Gate', timestamp: '6:00 AM', type: 'success' },
        { id: 2, message: 'Completed patrol round #3', timestamp: '12:30 PM', type: 'success' },
        { id: 3, message: 'Incident report submitted', timestamp: '11:15 AM', type: 'warning' },
        { id: 4, message: 'Task completed: Emergency exit check', timestamp: '10:00 AM', type: 'success' },
    ];

    const handleCheckIn = () => {
        setIsOnDuty(true);
        // Add Firebase logic here
    };

    const handleCheckOut = () => {
        setIsOnDuty(false);
        // Add Firebase logic here
    };

    const getPriorityColor = (priority) => {
        const colors = {
            high: 'text-red-400',
            medium: 'text-yellow-400',
            low: 'text-blue-400'
        };
        return colors[priority] || colors.low;
    };

    const getTaskStatusIcon = (status) => {
        if (status === 'completed') return <CheckCircle size={16} className="text-green-400" />;
        if (status === 'in-progress') return <Activity size={16} className="text-yellow-400" />;
        return <Clock size={16} className="text-silver-grey" />;
    };

    const actions = (
        <>
            <Button
                variant={isOnDuty ? "danger" : "primary"}
                className="flex items-center"
                onClick={isOnDuty ? handleCheckOut : handleCheckIn}
            >
                {isOnDuty ? <LogOut size={18} className="mr-2" /> : <LogIn size={18} className="mr-2" />}
                {isOnDuty ? 'Check Out' : 'Check In'}
            </Button>
            <Button variant="secondary" className="flex items-center" onClick={() => setShowIncidentForm(!showIncidentForm)}>
                <FileText size={18} className="mr-2" />
                Report Incident
            </Button>
        </>
    );

    return (
        <DashboardLayout
            title="Worker Dashboard"
            subtitle={`${workerInfo.name} - ${workerInfo.assignedSite}`}
            actions={actions}
        >
            {/* Worker Info Card */}
            <section>
                <GlowCard>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-silver-grey text-sm mb-1">Employee ID</p>
                            <p className="text-white font-['Orbitron']">{workerInfo.id}</p>
                        </div>
                        <div>
                            <p className="text-silver-grey text-sm mb-1">Current Shift</p>
                            <p className="text-white font-['Orbitron']">{workerInfo.shift}</p>
                        </div>
                        <div>
                            <p className="text-silver-grey text-sm mb-1">Position</p>
                            <p className="text-white font-['Orbitron']">{workerInfo.position}</p>
                        </div>
                        <div>
                            <p className="text-silver-grey text-sm mb-1">Check-in Time</p>
                            <p className="text-cobalt font-['Orbitron']">{workerInfo.checkInTime}</p>
                        </div>
                        <div>
                            <p className="text-silver-grey text-sm mb-1">Manager</p>
                            <p className="text-white font-['Orbitron']">{workerInfo.manager}</p>
                        </div>
                        <div>
                            <p className="text-silver-grey text-sm mb-1">Status</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-['Orbitron'] ${isOnDuty ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                {isOnDuty ? 'ON DUTY' : 'OFF DUTY'}
                            </span>
                        </div>
                    </div>
                </GlowCard>
            </section>

            {/* Statistics */}
            <section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={Clock}
                        label="Hours Worked Today"
                        value={stats.hoursWorked}
                        color="cobalt"
                        delay={0}
                    />
                    <StatCard
                        icon={Navigation}
                        label="Patrols Completed"
                        value={stats.patrolsCompleted}
                        color="cobalt"
                        delay={0.1}
                    />
                    <StatCard
                        icon={AlertTriangle}
                        label="Incidents Reported"
                        value={stats.incidentsReported}
                        color="cobalt"
                        delay={0.2}
                    />
                    <StatCard
                        icon={CheckCircle}
                        label="Tasks Completed"
                        value={stats.tasksCompleted}
                        color="cobalt"
                        delay={0.3}
                    />
                </div>
            </section>

            {/* Current Tasks */}
            <section>
                <h3 className="text-2xl font-['Orbitron'] font-bold text-white mb-6 flex items-center">
                    <ClipboardList className="mr-3 text-cobalt" size={28} />
                    Today's Tasks
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {currentTasks.map((task, index) => (
                        <GlowCard key={task.id} delay={index * 0.1}>
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                    {getTaskStatusIcon(task.status)}
                                    <div className="flex-1">
                                        <p className="text-white mb-1">{task.task}</p>
                                        <div className="flex items-center gap-3 text-xs">
                                            <span className={`${getPriorityColor(task.priority)} font-['Orbitron']`}>
                                                {task.priority.toUpperCase()}
                                            </span>
                                            <span className="text-silver-grey capitalize">{task.status.replace('-', ' ')}</span>
                                        </div>
                                    </div>
                                </div>
                                {task.status !== 'completed' && (
                                    <button className="glass px-3 py-1 rounded text-xs text-cobalt hover:bg-cobalt/20 transition-colors">
                                        Complete
                                    </button>
                                )}
                            </div>
                        </GlowCard>
                    ))}
                </div>
            </section>

            {/* Patrol Checkpoints */}
            <section>
                <h3 className="text-2xl font-['Orbitron'] font-bold text-white mb-6 flex items-center">
                    <Navigation className="mr-3 text-cobalt" size={28} />
                    Patrol Checkpoints
                </h3>
                <GlowCard>
                    <div className="space-y-3">
                        {patrolCheckpoints.map((checkpoint, index) => (
                            <motion.div
                                key={checkpoint.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <MapPin size={18} className="text-cobalt" />
                                    <div>
                                        <p className="text-white font-['Orbitron']">{checkpoint.name}</p>
                                        <p className="text-silver-grey text-sm">Last check: {checkpoint.time}</p>
                                    </div>
                                </div>
                                {checkpoint.status === 'completed' ? (
                                    <CheckCircle size={20} className="text-green-400" />
                                ) : (
                                    <Button variant="secondary" className="text-sm">
                                        Check Now
                                    </Button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </GlowCard>
            </section>

            {/* Upcoming Shifts */}
            <section>
                <h3 className="text-2xl font-['Orbitron'] font-bold text-white mb-6 flex items-center">
                    <Clock className="mr-3 text-cobalt" size={28} />
                    Upcoming Shifts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {upcomingShifts.map((shift, index) => (
                        <GlowCard key={index} delay={index * 0.1}>
                            <div className="text-center">
                                <p className="text-cobalt font-['Orbitron'] text-lg mb-2">{shift.date}</p>
                                <p className="text-white mb-1">{shift.time}</p>
                                <p className="text-silver-grey text-sm mb-3">{shift.site}</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-['Orbitron'] ${shift.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                                    }`}>
                                    {shift.status.toUpperCase()}
                                </span>
                            </div>
                        </GlowCard>
                    ))}
                </div>
            </section>

            {/* Activity Feed */}
            <section>
                <ActivityFeed activities={activities} title="My Activity Log" />
            </section>

            {/* Emergency SOS */}
            <section>
                <GlowCard className="border-red-500/50">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-2xl font-['Orbitron'] font-bold text-white mb-2 flex items-center">
                                <Radio className="mr-3 text-red-500" size={28} />
                                Emergency SOS
                            </h3>
                            <p className="text-silver-grey">
                                Press to immediately alert your manager and security control center
                            </p>
                        </div>
                        <motion.div
                            animate={{
                                boxShadow: [
                                    '0 0 20px rgba(220, 38, 38, 0.5)',
                                    '0 0 40px rgba(220, 38, 38, 0.8)',
                                    '0 0 20px rgba(220, 38, 38, 0.5)',
                                ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Button variant="danger" className="text-lg whitespace-nowrap">
                                <AlertTriangle className="mr-2" size={20} />
                                SEND SOS
                            </Button>
                        </motion.div>
                    </div>
                </GlowCard>
            </section>
        </DashboardLayout>
    );
};

export default WorkerDashboard;
