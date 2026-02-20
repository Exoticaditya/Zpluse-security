import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus, Users, TrendingUp, Building2, MapPin } from 'lucide-react';
import * as guardService from '../../../services/guardService';
import * as clientService from '../../../services/clientService';
import * as siteService from '../../../services/siteService';

const AdminDashboardHome = () => {
  const [stats, setStats] = useState({
    totalGuards: 0,
    totalClients: 0,
    totalSites: 0,
    activeGuards: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [guards, clients, sites] = await Promise.all([
        guardService.getAllGuards(),
        clientService.getAllClients(),
        siteService.getAllSites(),
      ]);

      setStats({
        totalGuards: guards?.length || 0,
        totalClients: clients?.length || 0,
        totalSites: sites?.length || 0,
        activeGuards: guards?.filter(g => g.status === 'ACTIVE' || g.status === 'active')?.length || 0,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Total Guards',
      value: stats.totalGuards,
      icon: Shield,
      gradient: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    {
      label: 'Active Guards',
      value: stats.activeGuards,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      label: 'Total Sites',
      value: stats.totalSites,
      icon: MapPin,
      gradient: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
    },
    {
      label: 'Total Clients',
      value: stats.totalClients,
      icon: Building2,
      gradient: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cobalt"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-['Orbitron'] font-bold text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-silver-grey">
          System overview and management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                ${stat.bgColor} ${stat.borderColor}
                border rounded-2xl p-6
                backdrop-blur-sm
                hover:scale-105 transition-transform duration-200
              `}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <div>
                <p className="text-silver-grey text-sm mb-1">{stat.label}</p>
                <p className="text-3xl md:text-4xl font-['Orbitron'] font-bold text-white">
                  {stat.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-['Orbitron'] font-bold text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.a
            href="/dashboard/admin/guards"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-black/40 backdrop-blur-sm border border-cobalt/30 rounded-xl p-6 hover:border-cobalt transition-colors group"
          >
            <Shield className="text-cobalt mb-3" size={32} />
            <h3 className="text-white font-['Orbitron'] font-bold text-lg mb-2">
              Manage Guards
            </h3>
            <p className="text-silver-grey text-sm">
              Add, edit, or remove security personnel
            </p>
          </motion.a>

          <motion.a
            href="/dashboard/admin/sites"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-black/40 backdrop-blur-sm border border-cobalt/30 rounded-xl p-6 hover:border-cobalt transition-colors group"
          >
            <MapPin className="text-cobalt mb-3" size={32} />
            <h3 className="text-white font-['Orbitron'] font-bold text-lg mb-2">
              Manage Sites
            </h3>
            <p className="text-silver-grey text-sm">
              Configure security sites and locations
            </p>
          </motion.a>

          <motion.a
            href="/dashboard/admin/clients"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-black/40 backdrop-blur-sm border border-cobalt/30 rounded-xl p-6 hover:border-cobalt transition-colors group"
          >
            <Building2 className="text-cobalt mb-3" size={32} />
            <h3 className="text-white font-['Orbitron'] font-bold text-lg mb-2">
              Manage Clients
            </h3>
            <p className="text-silver-grey text-sm">
              Add and manage client accounts
            </p>
          </motion.a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
