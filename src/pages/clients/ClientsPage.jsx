import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Plus,
  Search,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader,
} from 'lucide-react';
import { Button } from '../../components/UIComponents';
import * as clientService from '../../services/clientService';
import { handleError } from '../../utils/errorHandler';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getAllClients();
      setClients(data || []);
    } catch (error) {
      showNotification(handleError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await clientService.createClient(formData);
      showNotification('Client created successfully', 'success');
      setShowCreateModal(false);
      setFormData({ name: '' });
      loadClients();
    } catch (error) {
      showNotification(handleError(error), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClient = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      setActionLoading(true);
      await clientService.deleteClient(id);
      showNotification('Client deleted successfully', 'success');
      loadClients();
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

  const filteredClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-['Orbitron'] text-white mb-2 flex items-center">
              <Building2 className="mr-3 text-cobalt" size={32} />
              Client Management
            </h1>
            <p className="text-silver-grey">Manage client accounts and organizations</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            className="flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Client</span>
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cobalt/50" size={20} />
          <input
            type="text"
            placeholder="Search clients..."
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
          className={`mb-6 p-4 rounded-lg flex items-start ${notification.type === 'success'
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
              className={`mr-3 flex-shrink-0 ${notification.type === 'error' ? 'text-red-500' : 'text-blue-500'
                }`}
              size={20}
            />
          )}
          <p className={notification.type === 'success' ? 'text-green-400' : notification.type === 'error' ? 'text-red-400' : 'text-blue-400'}>
            {notification.message}
          </p>
        </motion.div>
      )}

      {/* Clients List */}
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
                  <th className="text-left p-4 text-cobalt font-['Orbitron'] text-sm">ID</th>
                  <th className="text-left p-4 text-cobalt font-['Orbitron'] text-sm">Client Name</th>
                  <th className="text-left p-4 text-cobalt font-['Orbitron'] text-sm">Status</th>
                  <th className="text-left p-4 text-cobalt font-['Orbitron'] text-sm">Created</th>
                  <th className="text-right p-4 text-cobalt font-['Orbitron'] text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-silver-grey">
                      No clients found
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr
                      key={client.id}
                      className="border-b border-cobalt/20 hover:bg-cobalt/10 transition-colors"
                    >
                      <td className="p-4 text-silver-grey font-mono">#{client.id}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-radial from-cobalt to-blue-900 rounded-full flex items-center justify-center">
                            <Building2 size={20} className="text-white" />
                          </div>
                          <span className="text-white font-['Orbitron']">
                            {client.name || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${client.status === 'ACTIVE'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                            }`}
                        >
                          {client.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="p-4 text-silver-grey">
                        {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteClient(client.id, client.name)}
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

      {/* Create Client Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 rounded-lg max-w-md w-full glow-border"
          >
            <h2 className="text-2xl font-['Orbitron'] text-white mb-6">Add New Client</h2>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div>
                <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/50 border border-cobalt/30 rounded-lg px-4 py-3 text-white focus:border-cobalt outline-none"
                  placeholder="Acme Corporation"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <Button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ name: '' });
                  }}
                  variant="secondary"
                  className="flex-1"
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1" disabled={actionLoading}>
                  {actionLoading ? 'Creating...' : 'Create Client'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
