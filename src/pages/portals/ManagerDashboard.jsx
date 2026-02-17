import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Shield, TrendingUp, AlertTriangle,
    Calendar, FileText, DollarSign, Clock,
    UserPlus, MapPin, CheckCircle, XCircle,
    Phone, Mail, Edit, Trash2, Eye
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, GlowCard } from '../../components/UIComponents';
import DashboardLayout from './components/DashboardLayout';
import StatCard from './components/StatCard';
import ActivityFeed from './components/ActivityFeed';

const ManagerDashboard = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [showModal, setShowModal] = useState({ type: null, data: null });

    // This will be replaced with Firebase data
    const managerStats = {
        totalGuards: 45,
        activeGuards: 38,
        totalClients: 12,
        monthlyRevenue: 125000
    };

    const guardsList = [];
    const clientsList = [];
    const pendingApprovals = [];
    const schedules = [];

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center px-6 py-3 font-['Orbitron'] transition-all ${
                activeTab === id
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
                        <h4 className="text-white font-['Orbitron'] text-lg">{guard.name || 'Guard Name'}</h4>
                        <p className="text-silver-grey text-sm">ID: {guard.id || 'N/A'}</p>
                        <div className="mt-2 space-y-1">
                            <div className="flex items-center text-sm text-silver-grey">
                                <MapPin size={14} className="mr-2 text-cobalt" />
                                {guard.assignedSite || 'Not Assigned'}
                            </div>
                            <div className="flex items-center text-sm text-silver-grey">
                                <Clock size={14} className="mr-2 text-cobalt" />
                                {guard.shift || 'N/A'}
                            </div>
                            <div className="flex items-center text-sm text-silver-grey">
                                <Phone size={14} className="mr-2 text-cobalt" />
                                {guard.phone || 'N/A'}
                            </div>
                        </div>
                        <div className="mt-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-['Orbitron'] ${
                                guard.status === 'on-duty' ? 'bg-green-500/20 text-green-400' :
                                guard.status === 'on-break' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-gray-500/20 text-gray-400'
                            }`}>
                                {guard.status || 'Off Duty'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    <button 
                        onClick={() => setShowModal({ type: 'editGuard', data: guard })}
                        className="p-2 hover:bg-cobalt/20 rounded transition-colors"
                    >
                        <Edit size={16} className="text-cobalt" />
                    </button>
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

    const ClientCard = ({ client }) => (
        <GlowCard className="p-4">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h4 className="text-white font-['Orbitron'] text-lg">{client.companyName || 'Client Name'}</h4>
                    <p className="text-silver-grey text-sm">{client.contactPerson || 'N/A'}</p>
                    <div className="mt-2 space-y-1">
                        <div className="flex items-center text-sm text-silver-grey">
                            <MapPin size={14} className="mr-2 text-cobalt" />
                            {client.location || 'N/A'}
                        </div>
                        <div className="flex items-center text-sm text-silver-grey">
                            <Users size={14} className="mr-2 text-cobalt" />
                            {client.guardsAssigned || 0} Guards Assigned
                        </div>
                        <div className="flex items-center text-sm text-silver-grey">
                            <Mail size={14} className="mr-2 text-cobalt" />
                            {client.email || 'N/A'}
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-['Orbitron'] ${
                            client.contractStatus === 'active' ? 'bg-green-500/20 text-green-400' :
                            client.contractStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                        }`}>
                            {client.contractStatus || 'Inactive'}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    <button 
                        onClick={() => setShowModal({ type: 'editClient', data: client })}
                        className="p-2 hover:bg-cobalt/20 rounded transition-colors"
                    >
                        <Edit size={16} className="text-cobalt" />
                    </button>
                    <button 
                        onClick={() => setShowModal({ type: 'viewClient', data: client })}
                        className="p-2 hover:bg-cobalt/20 rounded transition-colors"
                    >
                        <Eye size={16} className="text-blue-400" />
                    </button>
                </div>
            </div>
        </GlowCard>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Guards"
                                value={managerStats.totalGuards}
                                icon={Users}
                                trend="+5%"
                                color="blue"
                            />
                            <StatCard
                                title="Active on Duty"
                                value={managerStats.activeGuards}
                                icon={Shield}
                                trend="+2%"
                                color="green"
                            />
                            <StatCard
                                title="Active Clients"
                                value={managerStats.totalClients}
                                icon={TrendingUp}
                                trend="+3"
                                color="purple"
                            />
                            <StatCard
                                title="Monthly Revenue"
                                value={`₹${managerStats.monthlyRevenue.toLocaleString()}`}
                                icon={DollarSign}
                                trend="+12%"
                                color="yellow"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <GlowCard>
                                <h3 className="text-xl font-['Orbitron'] text-white mb-4 flex items-center">
                                    <AlertTriangle className="text-yellow-400 mr-2" size={24} />
                                    Pending Approvals
                                </h3>
                                {pendingApprovals.length > 0 ? (
                                    <div className="space-y-3">
                                        {pendingApprovals.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-3 bg-black/30 rounded border border-cobalt/20">
                                                <div>
                                                    <p className="text-white font-['Orbitron']">{item.title}</p>
                                                    <p className="text-sm text-silver-grey">{item.type} - {item.submittedBy}</p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded transition-colors">
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors">
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-silver-grey text-center py-8">No pending approvals</p>
                                )}
                            </GlowCard>

                            <ActivityFeed activities={[]} emptyMessage="No recent activity" />
                        </div>
                    </div>
                );

            case 'guards':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-['Orbitron'] text-white">Security Guards</h3>
                            <Button 
                                variant="primary" 
                                className="flex items-center"
                                onClick={() => setShowModal({ type: 'addGuard', data: null })}
                            >
                                <UserPlus size={18} className="mr-2" />
                                Add New Guard
                            </Button>
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
                                            No guards assigned yet. Click "Add New Guard" to get started.
                                        </p>
                                    </GlowCard>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'clients':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-['Orbitron'] text-white">Clients</h3>
                            <Button 
                                variant="primary" 
                                className="flex items-center"
                                onClick={() => setShowModal({ type: 'addClient', data: null })}
                            >
                                <UserPlus size={18} className="mr-2" />
                                Add New Client
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {clientsList.length > 0 ? (
                                clientsList.map((client) => (
                                    <ClientCard key={client.id} client={client} />
                                ))
                            ) : (
                                <div className="col-span-2">
                                    <GlowCard>
                                        <p className="text-silver-grey text-center py-12">
                                            No clients added yet. Click "Add New Client" to get started.
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
                            <h3 className="text-2xl font-['Orbitron'] text-white">Shift Schedules</h3>
                            <Button 
                                variant="primary" 
                                className="flex items-center"
                                onClick={() => setShowModal({ type: 'createSchedule', data: null })}
                            >
                                <Calendar size={18} className="mr-2" />
                                Create Schedule
                            </Button>
                        </div>
                        <GlowCard>
                            {schedules.length > 0 ? (
                                <div className="space-y-3">
                                    {schedules.map((schedule) => (
                                        <div key={schedule.id} className="p-4 bg-black/30 rounded border border-cobalt/20">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="text-white font-['Orbitron']">{schedule.siteName}</h4>
                                                    <p className="text-sm text-silver-grey">{schedule.date} - {schedule.shift}</p>
                                                    <p className="text-sm text-cobalt mt-1">{schedule.guardName}</p>
                                                </div>
                                                <Edit size={16} className="text-cobalt cursor-pointer" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-silver-grey text-center py-12">
                                    No schedules created yet. Click "Create Schedule" to get started.
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
            <Button variant="secondary" className="flex items-center">
                <Calendar size={18} className="mr-2" />
                Schedules
            </Button>
            <Button variant="primary" className="flex items-center">
                <FileText size={18} className="mr-2" />
                Reports
            </Button>
        </>
    );

    return (
        <DashboardLayout
            title="Manager Dashboard"
            subtitle="Manage your security operations, teams, and clients"
            actions={actions}
        >
            {/* Tab Navigation */}
            <div className="mb-8 border-b border-cobalt/30 flex overflow-x-auto">
                <TabButton id="overview" label="Overview" icon={TrendingUp} />
                <TabButton id="guards" label="Guards" icon={Users} />
                <TabButton id="clients" label="Clients" icon={Shield} />
                <TabButton id="schedules" label="Schedules" icon={Calendar} />
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
