import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Locate, Plus, X, Loader, AlertCircle,
    MapPin, Edit, Trash2, Save,
} from 'lucide-react';
import * as sitePostService from '../../services/sitePostService';
import * as siteService from '../../services/siteService';
import { handleError } from '../../utils/errorHandler';

const SitePostsPage = () => {
    const [sitePosts, setSitePosts] = useState([]);
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [creating, setCreating] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ siteId: '', name: '', description: '' });
    const [editData, setEditData] = useState({ name: '', description: '' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [postRes, siteRes] = await Promise.all([
                sitePostService.getAllSitePosts(),
                siteService.getAllSites(),
            ]);
            setSitePosts(postRes || []);
            setSites(siteRes || []);
        } catch (err) {
            setError(handleError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            setCreating(true);
            await sitePostService.createSitePost({
                siteId: Number(formData.siteId),
                name: formData.name,
                description: formData.description || null,
            });
            setShowCreate(false);
            setFormData({ siteId: '', name: '', description: '' });
            await loadData();
        } catch (err) {
            setError(handleError(err));
        } finally {
            setCreating(false);
        }
    };

    const handleUpdate = async (id) => {
        try {
            await sitePostService.updateSitePost(id, {
                name: editData.name,
                description: editData.description || null,
            });
            setEditingId(null);
            await loadData();
        } catch (err) {
            setError(handleError(err));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this site post?')) return;
        try {
            await sitePostService.deleteSitePost(id);
            await loadData();
        } catch (err) {
            setError(handleError(err));
        }
    };

    const startEdit = (post) => {
        setEditingId(post.id);
        setEditData({ name: post.name, description: post.description || '' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader className="animate-spin text-cobalt" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-['Orbitron'] font-bold text-white">
                        Site Posts
                    </h1>
                    <p className="text-silver-grey text-sm mt-1">
                        {sitePosts.length} duty station{sitePosts.length !== 1 ? 's' : ''} across {sites.length} site{sites.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-cobalt to-blue-600 text-white font-['Orbitron'] font-medium rounded-lg hover:shadow-lg hover:shadow-cobalt/30 transition-all"
                >
                    {showCreate ? <X size={18} /> : <Plus size={18} />}
                    {showCreate ? 'Cancel' : 'New Post'}
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-500/20 border border-red-500/40 text-red-400 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto"><X size={16} /></button>
                </div>
            )}

            {/* Create Form */}
            <AnimatePresence>
                {showCreate && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleCreate}
                        className="bg-black/50 border border-cobalt/30 rounded-2xl p-6 space-y-4"
                    >
                        <h3 className="text-white font-['Orbitron'] font-bold text-lg">Create Site Post</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-silver-grey text-sm mb-1">Site</label>
                                <select required value={formData.siteId} onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                                    className="w-full bg-black/60 border border-cobalt/30 rounded-lg px-3 py-2.5 text-white focus:border-cobalt outline-none">
                                    <option value="">Select site...</option>
                                    {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-silver-grey text-sm mb-1">Post Name</label>
                                <input type="text" required value={formData.name} placeholder="e.g. Main Gate"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-black/60 border border-cobalt/30 rounded-lg px-3 py-2.5 text-white focus:border-cobalt outline-none" />
                            </div>
                            <div>
                                <label className="block text-silver-grey text-sm mb-1">Description</label>
                                <input type="text" value={formData.description} placeholder="Optional"
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-black/60 border border-cobalt/30 rounded-lg px-3 py-2.5 text-white focus:border-cobalt outline-none" />
                            </div>
                        </div>
                        <button type="submit" disabled={creating}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-['Orbitron'] font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50">
                            {creating ? <Loader size={18} className="animate-spin inline mr-2" /> : null}
                            {creating ? 'Creating...' : 'Create Post'}
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Posts Grid */}
            {sitePosts.length === 0 ? (
                <div className="bg-black/50 border border-cobalt/30 rounded-2xl p-12 text-center">
                    <Locate className="text-cobalt mx-auto mb-4" size={48} />
                    <p className="text-silver-grey font-['Orbitron']">No site posts yet</p>
                    <p className="text-silver-grey/60 text-sm mt-1">Create duty stations for your sites</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sitePosts.map((post) => (
                        <motion.div
                            key={post.id}
                            layout
                            className="bg-black/50 border border-cobalt/30 rounded-2xl p-5 hover:border-cobalt/60 transition-colors"
                        >
                            {editingId === post.id ? (
                                <div className="space-y-3">
                                    <input type="text" value={editData.name}
                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                        className="w-full bg-black/60 border border-cobalt/30 rounded-lg px-3 py-2 text-white focus:border-cobalt outline-none text-sm" />
                                    <input type="text" value={editData.description} placeholder="Description"
                                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                        className="w-full bg-black/60 border border-cobalt/30 rounded-lg px-3 py-2 text-white focus:border-cobalt outline-none text-sm" />
                                    <div className="flex gap-2">
                                        <button onClick={() => handleUpdate(post.id)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30">
                                            <Save size={14} /> Save
                                        </button>
                                        <button onClick={() => setEditingId(null)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-500/20 text-gray-400 rounded-lg text-sm hover:bg-gray-500/30">
                                            <X size={14} /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-white font-['Orbitron'] font-bold">{post.name}</h3>
                                            <div className="flex items-center gap-1 text-sm text-silver-grey mt-1">
                                                <MapPin size={14} className="text-cobalt" />
                                                {post.siteName || 'Unknown site'}
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => startEdit(post)}
                                                className="p-2 text-cobalt hover:bg-cobalt/20 rounded-lg transition-colors">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(post.id)}
                                                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    {post.description && (
                                        <p className="text-silver-grey/60 text-sm mt-2">{post.description}</p>
                                    )}
                                </>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SitePostsPage;
