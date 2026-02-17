import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Shield, Users, AlertTriangle, CheckCircle,
    MapPin, Phone, Clock, Camera, FileText,
    Bell, MessageSquare, TrendingUp, Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, GlowCard } from '../../components/UIComponents';
import DashboardLayout from './components/DashboardLayout';
import StatCard from './components/StatCard';
import ActivityFeed from './components/ActivityFeed';

const ClientDashboard = () => {
    const { currentUser } = useAuth();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Mock data - Replace with Firebase data
    const stats = {
        activeGuards: 8,
        totalSites: 3,
        openIncidents: 2,
        monthlyReports: 24
    };

    const assignedGuards = [
        {
            id: 1,
            name: 'Rajesh Kumar',
            site: 'Main Office Building',
            position: 'Main Gate',
            status: 'on-duty',
            shift: 'Day Shift (6AM-2PM)',
            phone: '+91 98765 43210',
            lastCheckIn: '14:30'
        },
        {
            id: 2,
            name: 'Amit Singh',
            site: 'Main Office Building',
            position: 'Lobby',
            status: 'on-duty',
            shift: 'Day Shift (6AM-2PM)',
            phone: '+91 98765 43211',
            lastCheckIn: '14:25'
        },
        {
            id: 3,
            name: 'Suresh Patel',
            site: 'Warehouse Complex',
            position: 'Perimeter',
            status: 'on-duty',
            shift: 'Day Shift (6AM-2PM)',
            phone: '+91 98765 43212',
            lastCheckIn: '14:20'
        },
        {
            id: 4,
            name: 'Vijay Sharma',
            site: 'Residential Tower A',
            position: 'Main Entrance',
            status: 'on-break',
            shift: 'Day Shift (6AM-2PM)',
            phone: '+91 98765 43213',
            lastCheckIn: '13:45'
        },
    ];

    const recentIncidents = [
        {
            id: 1,
            title: 'Unauthorized Vehicle Attempt',
            site: 'Main Office Building',
            reportedBy: 'Rajesh Kumar',
            severity: 'medium',
            status: 'resolved',
            timestamp: '2 hours ago',
            description: 'Unknown vehicle attempted entry without proper authorization'
        },
        {
            id: 2,
            title: 'Suspicious Activity - Parking Area',
            site: 'Warehouse Complex',
            reportedBy: 'Suresh Patel',
            severity: 'high',
            status: 'investigating',
            timestamp: '4 hours ago',
            description: 'Unidentified person loitering in restricted parking zone'
        },
        {
            id: 3,
            title: 'Equipment Malfunction',
            site: 'Residential Tower A',
            reportedBy: 'Vijay Sharma',
            severity: 'low',
            status: 'resolved',
            timestamp: '1 day ago',
            description: 'CCTV camera #3 temporarily offline, now restored'
        }
    ];

    const activities = [
        { id: 1, message: 'Rajesh Kumar checked in at Main Gate', timestamp: '2 minutes ago', type: 'success' },
        { id: 2, message: 'New incident report submitted by Suresh Patel', timestamp: '15 minutes ago', type: 'warning' },
        { id: 3, message: 'Shift change completed at Residential Tower A', timestamp: '1 hour ago', type: 'info' },
        { id: 4, message: 'Monthly security report generated', timestamp: '2 hours ago', type: 'success' },
        { id: 5, message: 'Patrol round completed - Warehouse Complex', timestamp: '3 hours ago', type: 'success' },
    ];

    const getSeverityColor = (severity) => {
        const colors = {
            low: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
            medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
            high: 'bg-red-500/20 text-red-400 border-red-500/50',
            critical: 'bg-red-600/30 text-red-300 border-red-600/70'
        };
        return colors[severity] || colors.low;
    };

    const getStatusColor = (status) => {
        const colors = {
            'on-duty': 'bg-green-500/20 text-green-400',
            'on-break': 'bg-yellow-500/20 text-yellow-400',
            'off-duty': 'bg-gray-500/20 text-gray-400'
        };
        return colors[status] || colors['off-duty'];
    };

    const actions = (
        <>
            <Button variant="secondary" className="flex items-center">
                <MessageSquare size={18} className="mr-2" />
                Messages
            </Button>
            <Button variant="primary" className="flex items-center">
                <AlertTriangle size={18} className="mr-2" />
                Emergency Alert
            </Button>
        </>
    );

    return (
        <DashboardLayout
            title="Client Dashboard"
            subtitle={`Welcome back! Monitor your security services in real-time`}
            actions={actions}
        >
            {/* Statistics Overview */}
            <section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={Users}
                        label="Active Guards"
                        value={stats.activeGuards}
                        color="cobalt"
                        delay={0}
                    />
                    <StatCard
                        icon={Shield}
                        label="Protected Sites"
                        value={stats.totalSites}
                        color="cobalt"
                        delay={0.1}
                    />
                    <StatCard
                        icon={AlertTriangle}
                        label="Open Incidents"
                        value={stats.openIncidents}
                        color="cobalt"
                        delay={0.2}
                    />
                    <StatCard
                        icon={FileText}
                        label="Monthly Reports"
                        value={stats.monthlyReports}
                        color="cobalt"
                        delay={0.3}
                    />
                </div>
            </section>

            {/* Assigned Guards */}
            <section>
                <h3 className="text-2xl font-['Orbitron'] font-bold text-white mb-6 flex items-center">
                    <Users className="mr-3 text-cobalt" size={28} />
                    Your Security Personnel
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {assignedGuards.map((guard, index) => (
                        <GlowCard key={guard.id} delay={index * 0.1}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-['Orbitron'] text-xl text-white">{guard.name}</h4>
                                        <span className={`px-3 py-1 rounded-full text-xs font-['Orbitron'] ${getStatusColor(guard.status)}`}>
                                            {guard.status === 'on-duty' ? 'ON DUTY' : 'ON BREAK'}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-silver-grey">
                                            <Shield size={14} className="text-cobalt mr-2" />
                                            <span>{guard.site}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-silver-grey">
                                            <MapPin size={14} className="text-cobalt mr-2" />
                                            <span>{guard.position}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-silver-grey">
                                            <Clock size={14} className="text-cobalt mr-2" />
                                            <span>{guard.shift}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-silver-grey">
                                            <Activity size={14} className="text-cobalt mr-2" />
                                            <span>Last check-in: {guard.lastCheckIn}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 glass px-3 py-2 rounded text-sm text-cobalt hover:bg-cobalt/20 transition-colors flex items-center justify-center">
                                    <Phone size={14} className="mr-1" />
                                    Contact
                                </button>
                                <button className="flex-1 glass px-3 py-2 rounded text-sm text-cobalt hover:bg-cobalt/20 transition-colors flex items-center justify-center">
                                    <MessageSquare size={14} className="mr-1" />
                                    Message
                                </button>
                            </div>
                        </GlowCard>
                    ))}
                </div>
            </section>

            {/* Recent Incidents */}
            <section>
                <h3 className="text-2xl font-['Orbitron'] font-bold text-white mb-6 flex items-center">
                    <AlertTriangle className="mr-3 text-cobalt" size={28} />
                    Recent Incidents
                </h3>
                <div className="space-y-4">
                    {recentIncidents.map((incident, index) => (
                        <GlowCard key={incident.id} delay={index * 0.1}>
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <h4 className="font-['Orbitron'] text-lg text-white">{incident.title}</h4>
                                        <span className={`px-3 py-1 rounded-full text-xs font-['Orbitron'] border ${getSeverityColor(incident.severity)}`}>
                                            {incident.severity.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-silver-grey text-sm mb-3">{incident.description}</p>
                                    <div className="flex flex-wrap gap-4 text-xs text-silver-grey">
                                        <span className="flex items-center">
                                            <Shield size={12} className="mr-1 text-cobalt" />
                                            {incident.site}
                                        </span>
                                        <span className="flex items-center">
                                            <Users size={12} className="mr-1 text-cobalt" />
                                            {incident.reportedBy}
                                        </span>
                                        <span className="flex items-center">
                                            <Clock size={12} className="mr-1 text-cobalt" />
                                            {incident.timestamp}
                                        </span>
                                    </div>
                                </div>
                                <Button variant="secondary" className="text-sm whitespace-nowrap">
                                    View Details
                                </Button>
                            </div>
                        </GlowCard>
                    ))}
                </div>
                <div className="mt-6 text-center">
                    <Button variant="secondary">View All Incidents</Button>
                </div>
            </section>

            {/* Activity Feed */}
            <section>
                <ActivityFeed activities={activities} title="Live Activity Feed" />
            </section>

            {/* Emergency Contact */}
            <section>
                <GlowCard className="border-red-500/50">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-2xl font-['Orbitron'] font-bold text-white mb-2 flex items-center">
                                <AlertTriangle className="mr-3 text-red-500" size={28} />
                                Emergency Response
                            </h3>
                            <p className="text-silver-grey">
                                Activate immediate emergency protocol and alert all security personnel
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
                                Trigger Emergency Alert
                            </Button>
                        </motion.div>
                    </div>
                </GlowCard>
            </section>
        </DashboardLayout>
    );
};

export default ClientDashboard;
