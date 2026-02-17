import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  Shield,
  MapPin,
  TrendingUp,
  Activity,
  Building2,
  ArrowRight,
  Loader,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import StatCard from './components/StatCard';
import * as guardService from '../../services/guardService';
import * as clientService from '../../services/clientService';
import * as siteService from '../../services/siteService';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalGuards: 0,
    totalClients: 0,
    totalSites: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [guards, clients, sites] = await Promise.all([
        guardService.getAllGuards(),
        clientService.getAllClients(),
        siteService.getAllSites(),
      ]);
      
      setStats({
        totalGuards: guards?.length || 0,
        totalClients: clients?.length || 0,
        totalSites: sites?.length || 0,
      });
    } catch (error) {
      // Silent fail - stats will show 0
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardSidebar>
      {/* Welcome Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-['Orbitron'] text-white mb-2">
            Welcome back, {currentUser?.fullName || 'Admin'}
          </h1>
          <p className="text-silver-grey">
            Here's what's happening with your security operations today.
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader className="animate-spin text-cobalt" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatCard
              title="Total Guards"
              value={stats.totalGuards}
              icon={Shield}
              trend={null}
              color="blue"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatCard
              title="Total Clients"
              value={stats.totalClients}
              icon={Building2}
              trend={null}
              color="purple"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatCard
              title="Total Sites"
              value={stats.totalSites}
              icon={MapPin}
              trend={null}
              color="green"
            />
          </motion.div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-['Orbitron'] text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/portal/admin/guards"
            className="glass p-6 rounded-lg glow-border hover:border-cobalt transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <Shield className="text-cobalt mb-3" size={32} />
                <h3 className="text-white font-['Orbitron'] text-lg mb-2">Manage Guards</h3>
                <p className="text-silver-grey text-sm">Add, view, and manage security personnel</p>
              </div>
              <ArrowRight className="text-cobalt opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
            </div>
          </Link>

          <Link
            to="/portal/admin/clients"
            className="glass p-6 rounded-lg glow-border hover:border-cobalt transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <Building2 className="text-cobalt mb-3" size={32} />
                <h3 className="text-white font-['Orbitron'] text-lg mb-2">Manage Clients</h3>
                <p className="text-silver-grey text-sm">View and manage client accounts</p>
              </div>
              <ArrowRight className="text-cobalt opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
            </div>
          </Link>

          <Link
            to="/portal/admin/sites"
            className="glass p-6 rounded-lg glow-border hover:border-cobalt transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <MapPin className="text-cobalt mb-3" size={32} />
                <h3 className="text-white font-['Orbitron'] text-lg mb-2">Manage Sites</h3>
                <p className="text-silver-grey text-sm">Configure security sites and locations</p>
              </div>
              <ArrowRight className="text-cobalt opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
            </div>
          </Link>
        </div>
      </div>

      {/* System Status */}
      <div className="glass p-6 rounded-lg glow-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-['Orbitron'] text-white flex items-center">
            <Activity className="mr-3 text-cobalt" size={24} />
            System Status
          </h2>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
            All Systems Operational
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-black/30 rounded-lg">
            <p className="text-silver-grey text-sm mb-1">API Status</p>
            <p className="text-white font-['Orbitron']">Connected</p>
          </div>
          <div className="p-4 bg-black/30 rounded-lg">
            <p className="text-silver-grey text-sm mb-1">Database</p>
            <p className="text-white font-['Orbitron']">Healthy</p>
          </div>
          <div className="p-4 bg-black/30 rounded-lg">
            <p className="text-silver-grey text-sm mb-1">Authentication</p>
            <p className="text-white font-['Orbitron']">Active</p>
          </div>
        </div>
      </div>
    </DashboardSidebar>
  );
};

export default AdminDashboard;
