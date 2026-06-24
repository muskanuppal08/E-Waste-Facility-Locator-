import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Pickups({ pickups }) {
    const { flash } = usePage().props;
    const [statusFilter, setStatusFilter] = useState('all');
    const [notesInputs, setNotesInputs] = useState({});

    const handleStatusUpdate = (id, status) => {
        const note = notesInputs[id] || '';
        const confirmMsg = `Are you sure you want to change status to ${status}?`;
        if (confirm(confirmMsg)) {
            router.post(route('admin.pickups.status', id), {
                status: status,
                notes: note
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    // Clear note input for this request
                    setNotesInputs(prev => {
                        const next = { ...prev };
                        delete next[id];
                        return next;
                    });
                }
            });
        }
    };

    const handleNoteChange = (id, val) => {
        setNotesInputs(prev => ({
            ...prev,
            [id]: val
        }));
    };

    const filteredPickups = pickups.filter(p => {
        if (statusFilter === 'all') return true;
        return p.status.toLowerCase() === statusFilter.toLowerCase();
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            case 'Scheduled':
                return 'bg-sky-500/10 text-sky-600 border-sky-500/20';
            case 'Completed':
                return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'Cancelled':
                return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
            default:
                return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
        }
    };

    const stats = {
        total: pickups.length,
        pending: pickups.filter(p => p.status === 'Pending').length,
        scheduled: pickups.filter(p => p.status === 'Scheduled').length,
        completed: pickups.filter(p => p.status === 'Completed').length,
        cancelled: pickups.filter(p => p.status === 'Cancelled').length,
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Home Pickups Management
                </h2>
            }
        >
            <Head title="Manage Pickups" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Status Flash Message */}
                    {flash?.status && (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl text-sm font-semibold flex items-center space-x-2 shadow-sm animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{flash.status}</span>
                        </div>
                    )}

                    {/* Stats Dashboard Row */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                            <p className="text-xs text-slate-400 font-bold">TOTAL REQUESTS</p>
                            <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{stats.total}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-amber-500/20 dark:border-amber-500/10 shadow-sm">
                            <p className="text-xs text-amber-500 font-bold">PENDING</p>
                            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{stats.pending}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-sky-500/20 dark:border-sky-500/10 shadow-sm">
                            <p className="text-xs text-sky-500 font-bold">SCHEDULED</p>
                            <p className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">{stats.scheduled}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-emerald-500/20 dark:border-emerald-500/10 shadow-sm">
                            <p className="text-xs text-emerald-500 font-bold">COMPLETED</p>
                            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{stats.completed}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-rose-500/20 dark:border-rose-500/10 shadow-sm col-span-2 md:col-span-1">
                            <p className="text-xs text-rose-500 font-bold">CANCELLED</p>
                            <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{stats.cancelled}</p>
                        </div>
                    </div>

                    {/* Filter and Tab Controllers */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Home Collection List</h3>
                            <p className="text-xs text-slate-400">View and update scheduling status for e-waste pick-up requests.</p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
                            {[
                                { key: 'all', label: 'All', count: stats.total },
                                { key: 'pending', label: 'Pending', count: stats.pending },
                                { key: 'scheduled', label: 'Scheduled', count: stats.scheduled },
                                { key: 'completed', label: 'Completed', count: stats.completed },
                                { key: 'cancelled', label: 'Cancelled', count: stats.cancelled }
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setStatusFilter(tab.key)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                                        statusFilter === tab.key
                                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-250'
                                    }`}
                                >
                                    {tab.label} ({tab.count})
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table listing */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
                        {filteredPickups.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-slate-900/60">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recycler</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Device Type</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time Slot</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Address & Contact</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Notes / Update Comment</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700/60">
                                        {filteredPickups.map((p) => {
                                            const formattedDate = new Date(p.pickup_date).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            });

                                            return (
                                                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                                    
                                                    {/* Recycler Info */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                                                            {p.user ? p.user.name : 'Deleted Recycler'}
                                                        </div>
                                                        <div className="text-xs text-slate-400">
                                                            {p.user ? p.user.email : 'N/A'}
                                                        </div>
                                                    </td>

                                                    {/* Device info */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                                                            {p.device_type}
                                                        </div>
                                                        <div className="text-xs text-slate-400">
                                                            {[p.brand, p.model].filter(Boolean).join(' ') || 'Specs Not Provided'}
                                                        </div>
                                                    </td>

                                                    {/* Date & Time */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                                            {formattedDate}
                                                        </div>
                                                        <div className="text-xs text-slate-400">
                                                            {p.pickup_time}
                                                        </div>
                                                    </td>

                                                    {/* Address & Contact */}
                                                    <td className="px-6 py-4 max-w-xs">
                                                        <div className="text-xs font-medium text-gray-800 dark:text-gray-250 truncate" title={p.address}>
                                                            {p.address}
                                                        </div>
                                                        <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                                            📞 {p.contact_phone}
                                                        </div>
                                                    </td>

                                                    {/* Notes & Admin Comments Input */}
                                                    <td className="px-6 py-4">
                                                        {p.notes && (
                                                            <div className="text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800 mb-2 max-w-xs truncate" title={p.notes}>
                                                                <span className="font-bold text-slate-600 dark:text-slate-400">User: </span>
                                                                {p.notes}
                                                            </div>
                                                        )}
                                                        
                                                        {/* Input to write admin / status comments */}
                                                        {(p.status === 'Pending' || p.status === 'Scheduled') && (
                                                            <input
                                                                type="text"
                                                                value={notesInputs[p.id] || ''}
                                                                onChange={e => handleNoteChange(p.id, e.target.value)}
                                                                placeholder="Add collection / driver note..."
                                                                className="w-full text-xs rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 py-1 px-2"
                                                            />
                                                        )}
                                                    </td>

                                                    {/* Status Badge */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${getStatusStyle(p.status)}`}>
                                                            {p.status}
                                                        </span>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold space-x-1.5">
                                                        {p.status === 'Pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(p.id, 'Scheduled')}
                                                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-bold shadow-sm"
                                                                >
                                                                    Schedule
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(p.id, 'Cancelled')}
                                                                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:text-rose-400 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-lg transition-colors font-bold border border-rose-200 dark:border-rose-800"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        )}

                                                        {p.status === 'Scheduled' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(p.id, 'Completed')}
                                                                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors font-bold shadow-sm"
                                                                >
                                                                    Complete
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(p.id, 'Cancelled')}
                                                                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:text-rose-400 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-lg transition-colors font-bold border border-rose-200 dark:border-rose-800"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        )}

                                                        {p.status !== 'Pending' && p.status !== 'Scheduled' && (
                                                            <span className="text-slate-400 text-xs italic">Archived</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 px-4 space-y-4">
                                <div className="mx-auto w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400">
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Pickup Requests Found</h4>
                                    <p className="text-xs text-slate-400 mt-1 leading-normal max-w-[280px] mx-auto">
                                        There are no pickup requests matching this status filter in the system database.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
