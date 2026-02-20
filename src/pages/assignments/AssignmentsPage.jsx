import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardList, Plus, X, Loader, AlertCircle,
    User, MapPin, Clock, Calendar, Trash2, ChevronDown,
} from 'lucide-react';
import * as assignmentService from '../../services/assignmentService';
import * as guardService from '../../services/guardService';
import * as sitePostService from '../../services/sitePostService';
import { handleError } from '../../utils/errorHandler';

const AssignmentsPage = () => {
    const [assignments, setAssignments] = useState([]);
    const [guards, setGuards] = useState([]);
    const [sitePosts, setSitePosts] = useState([]);
    const [shiftTypes, setShiftTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        guardId: '', sitePostId: '', shiftTypeId: '',
        effectiveFrom: '', effectiveTo: '', notes: '',
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [assignRes, guardRes, postRes, shiftRes] = await Promise.all([
                assignmentService.getAllAssignments(),
                guardService.getAllGuards(),
                sitePostService.getAllSitePosts(),
                assignmentService.getShiftTypes(),
            ]);
            setAssignments(assignRes || []);
            setGuards(guardRes || []);
            setSitePosts(postRes || []);
            setShiftTypes(shiftRes || []);
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
            await assignmentService.createAssignment({
                guardId: Number(formData.guardId),
                sitePostId: Number(formData.sitePostId),
                shiftTypeId: Number(formData.shiftTypeId),
                effectiveFrom: formData.effectiveFrom,
                effectiveTo: formData.effectiveTo || null,
                notes: formData.notes || null,
            });
            setShowCreate(false);
            setFormData({ guardId: '', sitePostId: '', shiftTypeId: '', effectiveFrom: '', effectiveTo: '', notes: '' });
            await loadData();
        } catch (err) {
            setError(handleError(err));
        } finally {
            setCreating(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this assignment?')) return;
        try {
            await assignmentService.cancelAssignment(id);
            await loadData();
        } catch (err) {
            setError(handleError(err));
        }
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
                        Guard Assignments
                    </h1>
                    <p className="text-silver-grey text-sm mt-1">
                        {assignments.length} active assignment{assignments.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-cobalt to-blue-600 text-white font-['Orbitron'] font-medium rounded-lg hover:shadow-lg hover:shadow-cobalt/30 transition-all"
                >
                    {showCreate ? <X size={18} /> : <Plus size={18} />}
                    {showCreate ? 'Cancel' : 'New Assignment'}
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
                        <h3 className="text-white font-['Orbitron'] font-bold text-lg">Create Assignment</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-silver-grey text-sm mb-1">Guard</label>
                                <select required value={formData.guardId} onChange={(e) => setFormData({ ...formData, guardId: e.target.value })}
                                    className="w-full bg-black/60 border border-cobalt/30 rounded-lg px-3 py-2.5 text-white focus:border-cobalt outline-none">
                                    <option value="">Select guard...</option>
                                    {guards.map(g => <option key={g.id} value={g.id}>{g.fullName || g.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-silver-grey text-sm mb-1">Site Post</label>
                                <select required value={formData.sitePostId} onChange={(e) => setFormData({ ...formData, sitePostId: e.target.value })}
                                    className="w-full bg-black/60 border border-cobalt/30 rounded-lg px-3 py-2.5 text-white focus:border-cobalt outline-none">
                                    <option value="">Select post...</option>
                                    {sitePosts.map(p => <option key={p.id} value={p.id}>{p.name} ({p.siteName})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-silver-grey text-sm mb-1">Shift Type</label>
                                <select required value={formData.shiftTypeId} onChange={(e) => setFormData({ ...formData, shiftTypeId: e.target.value })}
                                    className="w-full bg-black/60 border border-cobalt/30 rounded-lg px-3 py-2.5 text-white focus:border-cobalt outline-none">
                                    <option value="">Select shift...</option>
                                    {shiftTypes.map(s => <option key={s.id} value={s.id}>{s.name} ({s.startTime} - {s.endTime})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-silver-grey text-sm mb-1">Effective From</label>
                                <input type="date" required value={formData.effectiveFrom}
                                    onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
                                    className="w-full bg-black/60 border border-cobalt/30 rounded-lg px-3 py-2.5 text-white focus:border-cobalt outline-none" />
                            </div>
                            <div>
                                <label className="block text-silver-grey text-sm mb-1">Effective To (optional)</label>
                                <input type="date" value={formData.effectiveTo}
                                    onChange={(e) => setFormData({ ...formData, effectiveTo: e.target.value })}
                                    className="w-full bg-black/60 border border-cobalt/30 rounded-lg px-3 py-2.5 text-white focus:border-cobalt outline-none" />
                            </div>
                            <div>
                                <label className="block text-silver-grey text-sm mb-1">Notes</label>
                                <input type="text" value={formData.notes} placeholder="Optional notes..."
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full bg-black/60 border border-cobalt/30 rounded-lg px-3 py-2.5 text-white focus:border-cobalt outline-none" />
                            </div>
                        </div>
                        <button type="submit" disabled={creating}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-['Orbitron'] font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50">
                            {creating ? <Loader size={18} className="animate-spin inline mr-2" /> : null}
                            {creating ? 'Creating...' : 'Create Assignment'}
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Assignments Table */}
            {assignments.length === 0 ? (
                <div className="bg-black/50 border border-cobalt/30 rounded-2xl p-12 text-center">
                    <ClipboardList className="text-cobalt mx-auto mb-4" size={48} />
                    <p className="text-silver-grey font-['Orbitron']">No active assignments</p>
                    <p className="text-silver-grey/60 text-sm mt-1">Create one to get started</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {assignments.map((a) => (
                        <motion.div
                            key={a.id}
                            layout
                            className="bg-black/50 border border-cobalt/30 rounded-2xl p-5 hover:border-cobalt/60 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                        <User className="text-cobalt" size={16} />
                                        <span className="text-white font-['Orbitron'] font-medium">{a.guardName || 'Unassigned'}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <span className="flex items-center gap-1 text-silver-grey">
                                            <MapPin size={14} className="text-cobalt" />
                                            {a.siteName || '—'} / {a.postName || '—'}
                                        </span>
                                        <span className="flex items-center gap-1 text-silver-grey">
                                            <Clock size={14} className="text-cobalt" />
                                            {a.shiftName || '—'} ({a.shiftStart} - {a.shiftEnd})
                                        </span>
                                        <span className="flex items-center gap-1 text-silver-grey">
                                            <Calendar size={14} className="text-cobalt" />
                                            {a.effectiveFrom} → {a.effectiveTo || 'Ongoing'}
                                        </span>
                                    </div>
                                    {a.notes && <p className="text-silver-grey/60 text-xs">{a.notes}</p>}
                                </div>
                                <button onClick={() => handleCancel(a.id)}
                                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors self-start"
                                    title="Cancel assignment">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AssignmentsPage;
