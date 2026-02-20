import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, Shield, TrendingUp, AlertCircle } from 'lucide-react';
import * as adminService from '../../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalSites: 0,
    totalGuards: 0,
    activeGuards: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [clients, sites, guards] = await Promise.all([
        adminService.getAllClients(),
        adminService.getAllSites(),
        adminService.getAllGuards(),
      ]);

      const activeGuardsCount = guards.filter(
        (guard) => guard.status === 'ACTIVE'
      ).length;

      setStats({
        totalClients: clients.length,
        totalSites: sites.length,
        totalGuards: guards.length,
        activeGuards: activeGuardsCount,
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Clients',
      value: stats.totalClients,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      link: '/admin/clients',
    },
    {
      title: 'Total Sites',
      value: stats.totalSites,
      icon: Building2,
      color: 'from-purple-500 to-purple-600',
      link: '/admin/sites',
    },
    {
      title: 'Total Guards',
      value: stats.totalGuards,
      icon: Shield,
      color: 'from-green-500 to-green-600',
      link: '/admin/guards',
    },
    {
      title: 'Active Guards',
      value: stats.activeGuards,
      icon: TrendingUp,
      color: 'from-cobalt to-blue-600',
      link: '/admin/guards',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-cobalt/30 border-t-cobalt rounded-full animate-spin"></div>
          <p className="text-silver-grey font-['Rajdhani']">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
            <div>
              <h3 className="text-red-400 font-['Orbitron'] font-bold mb-2">
                Error Loading Dashboard
              </h3>
              <p className="text-red-300 text-sm">{error}</p>
              <button
                onClick={loadDashboardData}
                className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-['Orbitron'] font-bold text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-silver-grey">System overview and statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="group"
            >
              <div className="bg-charcoal border border-cobalt/20 rounded-lg p-6 hover:border-cobalt/50 transition-all hover:shadow-lg hover:shadow-cobalt/10">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br ${card.color} bg-opacity-20`}
                  >
                    <Icon className="text-white" size={24} />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-['Orbitron'] font-bold text-white">
                      {card.value}
                    </p>
                  </div>
                </div>
                <h3 className="text-silver-grey font-['Rajdhani'] text-sm">
                  {card.title}
                </h3>
                <div className="mt-2 text-xs text-cobalt opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details →
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Link
          to="/admin/clients"
          className="bg-charcoal border border-cobalt/20 rounded-lg p-6 hover:border-cobalt/50 transition-all hover:shadow-lg hover:shadow-cobalt/10"
        >
          <Users className="text-cobalt mb-3" size={32} />
          <h3 className="text-white font-['Orbitron'] font-bold mb-2">
            Manage Clients
          </h3>
          <p className="text-silver-grey text-sm">
            Create, view, and manage client accounts
          </p>
        </Link>

        <Link
          to="/admin/sites"
          className="bg-charcoal border border-cobalt/20 rounded-lg p-6 hover:border-cobalt/50 transition-all hover:shadow-lg hover:shadow-cobalt/10"
        >
          <Building2 className="text-cobalt mb-3" size={32} />
          <h3 className="text-white font-['Orbitron'] font-bold mb-2">
            Manage Sites
          </h3>
          <p className="text-silver-grey text-sm">
            Create sites and assign to clients
          </p>
        </Link>

        <Link
          to="/admin/guards"
          className="bg-charcoal border border-cobalt/20 rounded-lg p-6 hover:border-cobalt/50 transition-all hover:shadow-lg hover:shadow-cobalt/10"
        >
          <Shield className="text-cobalt mb-3" size={32} />
          <h3 className="text-white font-['Orbitron'] font-bold mb-2">
            Manage Guards
          </h3>
          <p className="text-silver-grey text-sm">
            View and manage security personnel
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
