import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Plus,
  Search,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader,
  Building2,
  Filter,
} from 'lucide-react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import { Button } from '../../components/UIComponents';
import * as siteService from '../../services/siteService';
import * as clientService from '../../services/clientService';
import { handleError } from '../../utils/errorHandler';

const SitesPage = () => {
  const [sites, setSites] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    clientAccountId: '',
    name: '',
    address: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      loadSites(selectedClient);
    } else {
      loadSites();
    }
  }, [selectedClient]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sitesData, clientsData] = await Promise.all([
        siteService.getAllSites(),
        clientService.getAllClients(),
      ]);
      setSites(sitesData || []);
      setClients(clientsData || []);
    } catch (error) {
      showNotification(handleError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadSites = async (clientId = null) => {
    try {
      setLoading(true);
      const data = await siteService.getAllSites(clientId);
      setSites(data || []);
    } catch (error) {
      showNotification(handleError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSite = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const payload = {
        ...formData,
        clientAccountId: parseInt(formData.clientAccountId),
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
      };
      await siteService.createSite(payload);
      showNotification('Site created successfully', 'success');
      setShowCreateModal(false);
      setFormData({
        clientAccountId: '',
        name: '',
        address: '',
        latitude: '',
        longitude: '',
      });
      loadSites(selectedClient);
    } catch (error) {
      showNotification(handleError(error), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSite = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      setActionLoading(true);
      await siteService.deleteSite(id);
      showNotification('Site deleted successfully', 'success');
      loadSites(selectedClient);
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

  const filteredSites = sites.filter((site) =>
    site.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.clientAccountName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardSidebar>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-['Orbitron'] text-white mb-2 flex items-center">
              <MapPin className="mr-3 text-cobalt" size={32} />
              Site Management
            </h1>
            <p className="text-silver-grey">Manage security sites and locations</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            className="flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Site</span>
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cobalt/50" size={20} />
            <input
              type="text"
              placeholder="Search sites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-cobalt/30 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cobalt outline-none transition-colors"
            />
          </div>
          <div className="relative sm:w-64">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cobalt/50" size={20} />
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full bg-black/50 border border-cobalt/30 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cobalt outline-none transition-colors appearance-none"
            >
              <option value="">All Clients</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
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

      {/* Sites List */}
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
                  <th className="text-left p-4 text-cobalt font-['Orbitron'] text-sm">Site Name</th>
                  <th className="text-left p-4 text-cobalt font-['Orbitron'] text-sm">Client</th>
                  <th className="text-left p-4 text-cobalt font-['Orbitron'] text-sm">Address</th>
                  <th className="text-left p-4 text-cobalt font-['Orbitron'] text-sm">Coordinates</th>
                  <th className="text-left p-4 text-cobalt font-['Orbitron'] text-sm">Status</th>
                  <th className="text-right p-4 text-cobalt font-['Orbitron'] text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSites.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-silver-grey">
                      No sites found
                    </td>
                  </tr>
                ) : (
                  filteredSites.map((site) => (
                    <tr
                      key={site.id}
                      className="border-b border-cobalt/20 hover:bg-cobalt/10 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-radial from-cobalt to-blue-900 rounded-full flex items-center justify-center">
                            <MapPin size={20} className="text-white" />
                          </div>
                          <span className="text-white font-['Orbitron']">
                            {site.name || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Building2 size={16} className="text-cobalt" />
                          <span className="text-silver-grey">{site.clientAccountName || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-silver-grey">{site.address || 'N/A'}</td>
                      <td className="p-4 text-silver-grey font-mono text-xs">
                        {site.latitude && site.longitude
                          ? `${parseFloat(site.latitude).toFixed(4)}, ${parseFloat(site.longitude).toFixed(4)}`
                          : 'N/A'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            site.status === 'ACTIVE'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {site.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteSite(site.id, site.name)}
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

      {/* Create Site Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 rounded-lg max-w-md w-full glow-border max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-['Orbitron'] text-white mb-6">Add New Site</h2>
            <form onSubmit={handleCreateSite} className="space-y-4">
              <div>
                <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">
                  Client *
                </label>
                <select
                  required
                  value={formData.clientAccountId}
                  onChange={(e) => setFormData({ ...formData, clientAccountId: e.target.value })}
                  className="w-full bg-black/50 border border-cobalt/30 rounded-lg px-4 py-3 text-white focus:border-cobalt outline-none appearance-none"
                >
                  <option value="">Select Client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">
                  Site Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/50 border border-cobalt/30 rounded-lg px-4 py-3 text-white focus:border-cobalt outline-none"
                  placeholder="Downtown Office"
                />
              </div>
              <div>
                <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-black/50 border border-cobalt/30 rounded-lg px-4 py-3 text-white focus:border-cobalt outline-none"
                  placeholder="123 Main St, New York, NY"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="w-full bg-black/50 border border-cobalt/30 rounded-lg px-4 py-3 text-white focus:border-cobalt outline-none"
                    placeholder="40.7128"
                  />
                </div>
                <div>
                  <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="w-full bg-black/50 border border-cobalt/30 rounded-lg px-4 py-3 text-white focus:border-cobalt outline-none"
                    placeholder="-74.0060"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <Button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({
                      clientAccountId: '',
                      name: '',
                      address: '',
                      latitude: '',
                      longitude: '',
                    });
                  }}
                  variant="secondary"
                  className="flex-1"
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1" disabled={actionLoading}>
                  {actionLoading ? 'Creating...' : 'Create Site'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </DashboardSidebar>
  );
};

export default SitesPage;
