import React, { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, Eye, AlertCircle, X, Search, Filter } from 'lucide-react';
import * as adminService from '../../../services/adminService';

const SitesPage = () => {
  const [sites, setSites] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClientId, setFilterClientId] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    clientAccountId: '',
    name: '',
    address: '',
    latitude: '',
    longitude: '',
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [sitesData, clientsData] = await Promise.all([
        adminService.getAllSites(),
        adminService.getAllClients(),
      ]);
      setSites(sitesData);
      setClients(clientsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load sites and clients');
    } finally {
      setLoading(false);
    }
  };

  const loadSites = async () => {
    try {
      const data = filterClientId
        ? await adminService.getAllSites(parseInt(filterClientId))
        : await adminService.getAllSites();
      setSites(data);
    } catch (err) {
      console.error('Error loading sites:', err);
      setError(err.message || 'Failed to load sites');
    }
  };

  useEffect(() => {
    if (!loading) {
      loadSites();
    }
  }, [filterClientId]);

  const handleCreateSite = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.clientAccountId) {
      setFormError('Please select a client');
      return;
    }

    if (!formData.name.trim()) {
      setFormError('Site name is required');
      return;
    }

    setFormLoading(true);

    try {
      const siteData = {
        clientAccountId: parseInt(formData.clientAccountId),
        name: formData.name.trim(),
        address: formData.address.trim() || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      };

      await adminService.createSite(siteData);

      // Reset form and close modal
      setFormData({
        clientAccountId: '',
        name: '',
        address: '',
        latitude: '',
        longitude: '',
      });
      setShowCreateModal(false);

      // Reload sites
      await loadSites();
    } catch (err) {
      console.error('Error creating site:', err);
      setFormError(err.message || 'Failed to create site');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteSite = async (site) => {
    if (!window.confirm(`Are you sure you want to delete "${site.name}"?`)) {
      return;
    }

    try {
      await adminService.deleteSite(site.id);
      await loadSites();
    } catch (err) {
      console.error('Error deleting site:', err);
      alert(err.message || 'Failed to delete site');
    }
  };

  const handleViewDetails = async (site) => {
    try {
      const details = await adminService.getSiteById(site.id);
      setSelectedSite(details);
      setShowDetailsModal(true);
    } catch (err) {
      console.error('Error loading site details:', err);
      alert(err.message || 'Failed to load site details');
    }
  };

  const filteredSites = sites.filter((site) =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.clientAccountName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-['Orbitron'] font-bold text-white mb-2">
            Site Management
          </h1>
          <p className="text-silver-grey">Manage security sites</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cobalt hover:bg-blue-600 text-white rounded-lg transition-colors font-['Rajdhani'] font-medium"
        >
          <Plus size={20} />
          Create Site
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-silver-grey" size={20} />
          <input
            type="text"
            placeholder="Search sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-charcoal border border-cobalt/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-silver-grey focus:border-cobalt outline-none transition-colors"
          />
        </div>

        {/* Client Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-silver-grey" size={20} />
          <select
            value={filterClientId}
            onChange={(e) => setFilterClientId(e.target.value)}
            className="w-full bg-charcoal border border-cobalt/20 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cobalt outline-none transition-colors appearance-none"
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

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-red-400 text-sm">{error}</p>
              <button
                onClick={loadInitialData}
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
            <p className="text-silver-grey font-['Rajdhani']">Loading sites...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Sites Table */}
          {filteredSites.length === 0 ? (
            <div className="bg-charcoal border border-cobalt/20 rounded-lg p-12 text-center">
              <Building2 className="mx-auto text-cobalt/50 mb-4" size={48} />
              <h3 className="text-white font-['Orbitron'] font-bold mb-2">
                {searchTerm || filterClientId ? 'No sites found' : 'No sites yet'}
              </h3>
              <p className="text-silver-grey mb-4">
                {searchTerm || filterClientId
                  ? 'Try adjusting your filters'
                  : 'Get started by creating your first site'}
              </p>
              {!searchTerm && !filterClientId && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-cobalt hover:bg-blue-600 text-white rounded-lg transition-colors font-['Rajdhani'] font-medium"
                >
                  Create Site
                </button>
              )}
            </div>
          ) : (
            <div className="bg-charcoal border border-cobalt/20 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-obsidian border-b border-cobalt/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-['Orbitron'] font-bold text-cobalt">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-['Orbitron'] font-bold text-cobalt">
                        Site Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-['Orbitron'] font-bold text-cobalt">
                        Client
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-['Orbitron'] font-bold text-cobalt">
                        Address
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-['Orbitron'] font-bold text-cobalt">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-['Orbitron'] font-bold text-cobalt">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cobalt/10">
                    {filteredSites.map((site) => (
                      <tr
                        key={site.id}
                        className="hover:bg-cobalt/5 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-silver-grey font-mono">
                          #{site.id}
                        </td>
                        <td className="px-6 py-4 text-white font-['Rajdhani'] font-medium">
                          {site.name}
                        </td>
                        <td className="px-6 py-4 text-silver-grey">
                          {site.clientAccountName}
                        </td>
                        <td className="px-6 py-4 text-sm text-silver-grey max-w-xs truncate">
                          {site.address || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              site.status === 'ACTIVE'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {site.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewDetails(site)}
                              className="p-2 text-cobalt hover:bg-cobalt/10 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteSite(site)}
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
            </div>
          )}

          {/* Results Count */}
          {filteredSites.length > 0 && (
            <p className="text-sm text-silver-grey text-center">
              Showing {filteredSites.length} of {sites.length} sites
            </p>
          )}
        </>
      )}

      {/* Create Site Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-charcoal border border-cobalt/30 rounded-lg max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-['Orbitron'] font-bold text-white">
                Create Site
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({
                    clientAccountId: '',
                    name: '',
                    address: '',
                    latitude: '',
                    longitude: '',
                  });
                  setFormError('');
                }}
                className="text-silver-grey hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateSite} className="space-y-4">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{formError}</p>
                </div>
              )}

              <div>
                <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">
                  Client *
                </label>
                <select
                  value={formData.clientAccountId}
                  onChange={(e) =>
                    setFormData({ ...formData, clientAccountId: e.target.value })
                  }
                  className="w-full bg-obsidian border border-cobalt/30 rounded-lg px-4 py-3 text-white focus:border-cobalt outline-none transition-colors"
                  required
                >
                  <option value="">Select a client</option>
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
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter site name"
                  className="w-full bg-obsidian border border-cobalt/30 rounded-lg px-4 py-3 text-white focus:border-cobalt outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-cobalt text-sm font-['Orbitron'] mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Enter site address (optional)"
                  rows={3}
                  className="w-full bg-obsidian border border-cobalt/30 rounded-lg px-4 py-3 text-white focus:border-cobalt outline-none transition-colors resize-none"
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
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: e.target.value })
                    }
                    placeholder="e.g., 37.7749"
                    className="w-full bg-obsidian border border-cobalt/30 rounded-lg px-4 py-3 text-white focus:border-cobalt outline-none transition-colors"
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
                    onChange={(e) =>
                      setFormData({ ...formData, longitude: e.target.value })
                    }
                    placeholder="e.g., -122.4194"
                    className="w-full bg-obsidian border border-cobalt/30 rounded-lg px-4 py-3 text-white focus:border-cobalt outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
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
                  {formLoading ? 'Creating...' : 'Create Site'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedSite && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-charcoal border border-cobalt/30 rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-['Orbitron'] font-bold text-white">
                Site Details
              </h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedSite(null);
                }}
                className="text-silver-grey hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-silver-grey mb-1">Site ID</p>
                <p className="text-white font-['Rajdhani'] font-medium">
                  #{selectedSite.id}
                </p>
              </div>

              <div>
                <p className="text-sm text-silver-grey mb-1">Status</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedSite.status === 'ACTIVE'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {selectedSite.status}
                </span>
              </div>

              <div className="col-span-2">
                <p className="text-sm text-silver-grey mb-1">Site Name</p>
                <p className="text-white font-['Rajdhani'] font-medium">
                  {selectedSite.name}
                </p>
              </div>

              <div className="col-span-2">
                <p className="text-sm text-silver-grey mb-1">Client</p>
                <p className="text-white font-['Rajdhani'] font-medium">
                  {selectedSite.clientAccountName}
                </p>
              </div>

              <div className="col-span-2">
                <p className="text-sm text-silver-grey mb-1">Address</p>
                <p className="text-white font-['Rajdhani']">
                  {selectedSite.address || 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-sm text-silver-grey mb-1">Latitude</p>
                <p className="text-white font-['Rajdhani'] font-mono text-sm">
                  {selectedSite.latitude || 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-sm text-silver-grey mb-1">Longitude</p>
                <p className="text-white font-['Rajdhani'] font-mono text-sm">
                  {selectedSite.longitude || 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-sm text-silver-grey mb-1">Created At</p>
                <p className="text-white font-['Rajdhani'] text-sm">
                  {new Date(selectedSite.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-silver-grey mb-1">Updated At</p>
                <p className="text-white font-['Rajdhani'] text-sm">
                  {new Date(selectedSite.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowDetailsModal(false);
                setSelectedSite(null);
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

export default SitesPage;
