import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Eye, AlertCircle, X, Search } from 'lucide-react';
import * as adminService from '../../../services/adminService';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await adminService.getAllClients();
      setClients(data);
    } catch (err) {
      console.error('Error loading clients:', err);
      setError(err.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Client name is required');
      return;
    }

    setFormLoading(true);

    try {
      await adminService.createClient({
        name: formData.name.trim(),
      });

      // Reset form and close modal
      setFormData({ name: '' });
      setShowCreateModal(false);

      // Reload clients
      await loadClients();
    } catch (err) {
      console.error('Error creating client:', err);
      setFormError(err.message || 'Failed to create client');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClient = async (client) => {
    if (!window.confirm(`Are you sure you want to delete "${client.name}"?`)) {
      return;
    }

    try {
      await adminService.deleteClient(client.id);
      await loadClients();
    } catch (err) {
      console.error('Error deleting client:', err);
      alert(err.message || 'Failed to delete client');
    }
  };

  const handleViewDetails = async (client) => {
    try {
      const details = await adminService.getClientById(client.id);
      setSelectedClient(details);
      setShowDetailsModal(true);
    } catch (err) {
      console.error('Error loading client details:', err);
      alert(err.message || 'Failed to load client details');
    }
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-['Orbitron'] font-bold text-white mb-2">
            Client Management
          </h1>
          <p className="text-silver-grey">Manage client accounts</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cobalt hover:bg-blue-600 text-white rounded-lg transition-colors font-['Rajdhani'] font-medium"
        >
          <Plus size={20} />
          Create Client
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-silver-grey" size={20} />
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-charcoal border border-cobalt/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-silver-grey focus:border-cobalt outline-none transition-colors"
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-red-400 text-sm">{error}</p>
              <button
                onClick={loadClients}
                className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-cobalt/30 border-t-cobalt rounded-full animate-spin"></div>
            <p className="text-silver-grey font-['Rajdhani']">Loading clients...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Clients Table */}
          {filteredClients.length === 0 ? (
            <div className="bg-charcoal border border-cobalt/20 rounded-lg p-12 text-center">
              <Users className="mx-auto text-cobalt/50 mb-4" size={48} />
              <h3 className="text-white font-['Orbitron'] font-bold mb-2">
                {searchTerm ? 'No clients found' : 'No clients yet'}
              </h3>
              <p className="text-silver-grey mb-4">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'Get started by creating your first client'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-cobalt hover:bg-blue-600 text-white rounded-lg transition-colors font-['Rajdhani'] font-medium"
                >
                  Create Client
                </button>
              )}
            </div>
          ) : (
            <div className="bg-charcoal border border-cobalt/20 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-obsidian border-b border-cobalt/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-['Orbitron'] font-bold text-cobalt">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-['Orbitron'] font-bold text-cobalt">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-['Orbitron'] font-bold text-cobalt">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-['Orbitron'] font-bold text-cobalt">
                      Created
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-['Orbitron'] font-bold text-cobalt">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cobalt/10">
                  {filteredClients.map((client) => (
                    <tr
                      key={client.id}
                      className="hover:bg-cobalt/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-silver-grey font-mono">
                        #{client.id}
                      </td>
                      <td className="px-6 py-4 text-white font-['Rajdhani'] font-medium">
                        {client.name}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            client.status === 'ACTIVE'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {client.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-silver-grey">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(client)}
                            className="p-2 text-cobalt hover:bg-cobalt/10 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClient(client)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Results Count */}
          {filteredClients.length > 0 && (
            <p className="text-sm text-silver-grey text-center">
              Showing {filteredClients.length} of {clients.length} clients
            </p>
          )}
        </>
      )}

      {/* Create Client Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-charcoal border border-cobalt/30 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-['Orbitron'] font-bold text-white">
                Create Client
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({ name: '' });
                  setFormError('');
                }}
                className="text-silver-grey hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{formError}</p>
                </div>
              )}

              <div>
                <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter client name"
                  className="w-full bg-obsidian border border-cobalt/30 rounded-lg px-4 py-3 text-white focus:border-cobalt outline-none transition-colors"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ name: '' });
                    setFormError('');
                  }}
                  className="flex-1 px-4 py-2 bg-charcoal border border-cobalt/30 text-silver-grey hover:text-white rounded-lg transition-colors font-['Rajdhani'] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 bg-cobalt hover:bg-blue-600 text-white rounded-lg transition-colors font-['Rajdhani'] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? 'Creating...' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedClient && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-charcoal border border-cobalt/30 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-['Orbitron'] font-bold text-white">
                Client Details
              </h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedClient(null);
                }}
                className="text-silver-grey hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-silver-grey mb-1">Client ID</p>
                <p className="text-white font-['Rajdhani'] font-medium">
                  #{selectedClient.id}
                </p>
              </div>

              <div>
                <p className="text-sm text-silver-grey mb-1">Name</p>
                <p className="text-white font-['Rajdhani'] font-medium">
                  {selectedClient.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-silver-grey mb-1">Status</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedClient.status === 'ACTIVE'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {selectedClient.status}
                </span>
              </div>

              <div>
                <p className="text-sm text-silver-grey mb-1">Created At</p>
                <p className="text-white font-['Rajdhani']">
                  {new Date(selectedClient.createdAt).toLocaleString()}
                </p>
              </div>

              {selectedClient.deletedAt && (
                <div>
                  <p className="text-sm text-silver-grey mb-1">Deleted At</p>
                  <p className="text-red-400 font-['Rajdhani']">
                    {new Date(selectedClient.deletedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setShowDetailsModal(false);
                setSelectedClient(null);
              }}
              className="w-full mt-6 px-4 py-2 bg-cobalt hover:bg-blue-600 text-white rounded-lg transition-colors font-['Rajdhani'] font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
