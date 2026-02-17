import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Plus,
  Search,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader,
  UserCircle,
} from 'lucide-react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import { Button } from '../../components/UIComponents';
import * as guardService from '../../services/guardService';
import { handleError } from '../../utils/errorHandler';

const GuardsPage = () => {
  const [guards, setGuards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    licenseNumber: '',
  });

  // Load guards on mount
  useEffect(() => {
    loadGuards();
  }, []);

  const loadGuards = async () => {
    try {
      setLoading(true);
      const data = await guardService.getAllGuards();
      setGuards(data || []);
    } catch (error) {
      showNotification(handleError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGuard = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await guardService.createGuard(formData);
      showNotification('Guard created successfully', 'success');
      setShowCreateModal(false);
      setFormData({ fullName: '', email: '', phone: '', licenseNumber: '' });
      loadGuards();
    } catch (error) {
      showNotification(handleError(error), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteGuard = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      setActionLoading(true);
      await guardService.deleteGuard(id);
      showNotification('Guard deleted successfully', 'success');
      loadGuards();
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

  const filteredGuards = guards.filter((guard) =>
    guard.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guard.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guard.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardSidebar>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-['Orbitron'] text-white mb-2 flex items-center">
              <Shield className="mr-3 text-cobalt" size={32} />
              Guard Management
            </h1>
            <p className="text-silver-grey">Manage security guards and personnel</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            className="flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Guard</span>
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cobalt/50" size={20} />
          <input
            type="text"
            placeholder="Search guards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/50 border border-cobalt/30 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cobalt outline-none transition-colors"
          />
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`mb-6 p-4 rounded-lg flex items-start ${
            notification.type === 'success'
              ? 'bg-green-500/20 border border-green-500/50'
              : notification.type === 'error'
              ? 'bg-red-500/20 border border-red-500/50'
              : 'bg-blue-500/20 border border-blue-500/50'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
          ) : (
            <AlertCircle
              className={`mr-3 flex-shrink-0 ${
                notification.type === 'error' ? 'text-red-500' : 'text-blue-500'
              }`}
              size={20}
            />
          )}
          <p className={notification.type === 'success' ? 'text-green-400' : notification.type === 'error' ? 'text-red-400' : 'text-blue-400'}>
            {notification.message}
          </p>
        </motion.div>
      )}

      {/* Guards List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader className="animate-spin text-cobalt" size={40} />
        </div>
      ) : (
        <div className="glass rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cobalt/10 border-b border-cobalt/30">
                <tr>
                  <th className="text-left p-4 text-cobalt font-['Orbitron'] text-sm">Guard</th>
                  <th className="text-left p-4 text-cobalt font-['Orbitron'] text-sm">Email</th>
                  <th className="text-left p-4 text-cobalt font-['Orbitron'] text-sm">Phone</th>
                  <th className="text-left p-4 text-cobalt font-['Orbitron'] text-sm">License #</th>
                  <th className="text-left p-4 text-cobalt font-['Orbitron'] text-sm">Status</th>
                  <th className="text-right p-4 text-cobalt font-['Orbitron'] text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuards.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-silver-grey">
                      No guards found
                    </td>
                  </tr>
                ) : (
                  filteredGuards.map((guard) => (
                    <tr
                      key={guard.id}
                      className="border-b border-cobalt/20 hover:bg-cobalt/10 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-radial from-cobalt to-blue-900 rounded-full flex items-center justify-center">
                            <UserCircle size={20} className="text-white" />
                          </div>
                          <span className="text-white font-['Orbitron']">
                            {guard.fullName || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-silver-grey">{guard.email || 'N/A'}</td>
                      <td className="p-4 text-silver-grey">{guard.phone || 'N/A'}</td>
                      <td className="p-4 text-silver-grey font-mono">{guard.licenseNumber || 'N/A'}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            guard.status === 'ACTIVE'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {guard.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteGuard(guard.id, guard.fullName)}
                          disabled={actionLoading}
                          className="p-2 hover:bg-red-500/20 rounded transition-colors text-red-400 hover:text-red-300 disabled:opacity-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Guard Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 rounded-lg max-w-md w-full glow-border"
          >
            <h2 className="text-2xl font-['Orbitron'] text-white mb-6">Add New Guard</h2>
            <form onSubmit={handleCreateGuard} className="space-y-4">
              <div>
                <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-black/50 border border-cobalt/30 rounded-lg px-4 py-3 text-white focus:border-cobalt outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black/50 border border-cobalt/30 rounded-lg px-4 py-3 text-white focus:border-cobalt outline-none"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-black/50 border border-cobalt/30 rounded-lg px-4 py-3 text-white focus:border-cobalt outline-none"
                  placeholder="+1234567890"
                />
              </div>
              <div>
                <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">
                  License Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  className="w-full bg-black/50 border border-cobalt/30 rounded-lg px-4 py-3 text-white focus:border-cobalt outline-none"
                  placeholder="SG123456"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <Button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ fullName: '', email: '', phone: '', licenseNumber: '' });
                  }}
                  variant="secondary"
                  className="flex-1"
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1" disabled={actionLoading}>
                  {actionLoading ? 'Creating...' : 'Create Guard'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </DashboardSidebar>
  );
};

export default GuardsPage;
