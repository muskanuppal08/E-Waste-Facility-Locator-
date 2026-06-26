import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Users({ users }) {
    const { flash, auth } = usePage().props;
    const currentUser = auth.user;

    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all'); // all, admin, user
    
    // Points modal states
    const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [pointsChange, setPointsChange] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleRoleToggle = (id, currentRole) => {
        const targetRole = currentRole === 'admin' ? 'user' : 'admin';
        if (confirm(`Are you sure you want to change this user's role to ${targetRole}?`)) {
            router.post(route('admin.users.role', id), {
                role: targetRole
            }, {
                preserveScroll: true
            });
        }
    };

    const handleDeleteUser = (id) => {
        if (confirm('Are you sure you want to delete this user? This action is irreversible and deletes all associated reviews and pickup logs.')) {
            router.delete(route('admin.users.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const openPointsModal = (user) => {
        setSelectedUser(user);
        setPointsChange('');
        setIsPointsModalOpen(true);
    };

    const handlePointsSubmit = (e) => {
        e.preventDefault();
        if (!selectedUser || !pointsChange) return;

        setProcessing(true);
        router.post(route('admin.users.points', selectedUser.id), {
            points: parseInt(pointsChange, 10)
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsPointsModalOpen(false);
                setSelectedUser(null);
                setPointsChange('');
                setProcessing(false);
            },
            onError: () => {
                setProcessing(false);
            }
        });
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeStyle = (role) => {
        return role === 'admin'
            ? 'bg-purple-500/10 text-purple-600 border-purple-500/20'
            : 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    };

    const getLevelBadgeStyle = (level) => {
        switch (level) {
            case 'Earth Saver':
                return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-black';
            case 'Green Warrior':
                return 'bg-sky-500/10 text-sky-600 border-sky-500/20 font-bold';
            default:
                return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    User Management Dashboard
                </h2>
            }
        >
            <Head title="Manage Users" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">

                    {/* Status Alert Panels */}
                    {flash?.status && (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl text-sm font-semibold flex items-center space-x-2 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{flash.status}</span>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-2xl text-sm font-semibold flex items-center space-x-2 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>{flash.error}</span>
                        </div>
                    )}

                    {/* Filters Hub */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="w-full md:w-auto">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Registered Members</h3>
                            <p className="text-xs text-slate-500">Configure roles, monitor green level achievements, and award adjustments.</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row w-full md:w-auto items-stretch sm:items-center gap-3">
                            {/* Search bar */}
                            <div className="relative flex-1 sm:flex-none">
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full sm:w-64 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                                />
                                <svg className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            {/* Role Filter Tabs */}
                            <div className="flex bg-slate-150 dark:bg-slate-900/50 p-1.5 rounded-xl border border-slate-200/40 dark:border-slate-800 shrink-0">
                                {[
                                    { key: 'all', label: 'All' },
                                    { key: 'admin', label: 'Admin' },
                                    { key: 'user', label: 'User' }
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setRoleFilter(tab.key)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-205 ${
                                            roleFilter === tab.key
                                                ? 'bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-sm'
                                                : 'text-slate-550 hover:text-slate-900 dark:hover:text-slate-200'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
                        {filteredUsers.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-250 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-slate-900/60">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member Details</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Platform Role</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Green Level</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Eco Balance</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unlocked Badges</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700/60">
                                        {filteredUsers.map((u) => {
                                            const isSelf = currentUser && u.id === currentUser.id;
                                            return (
                                                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                                    
                                                    {/* User Info */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="h-9 w-9 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-extrabold text-xs shadow-inner">
                                                                {u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                                                                    <span>{u.name}</span>
                                                                    {isSelf && (
                                                                        <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">You</span>
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-slate-400">{u.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Role */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${getRoleBadgeStyle(u.role)}`}>
                                                            {u.role}
                                                        </span>
                                                    </td>

                                                    {/* Level */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${getLevelBadgeStyle(u.green_level)}`}>
                                                            {u.green_level}
                                                        </span>
                                                    </td>

                                                    {/* Eco Points */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-black text-gray-900 dark:text-white">
                                                            🏆 {u.eco_points} <span className="text-xs text-slate-400 font-normal">pts</span>
                                                        </div>
                                                    </td>

                                                    {/* Badges count */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-xs font-bold text-slate-700 dark:text-slate-350">
                                                            🎖️ {u.badges_count} Badge{u.badges_count !== 1 ? 's' : ''}
                                                        </div>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold space-x-1.5">
                                                        {/* Adjust points (users only or any) */}
                                                        <button
                                                            onClick={() => openPointsModal(u)}
                                                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors font-bold border border-slate-200/50 dark:border-slate-700/60 shadow-inner"
                                                        >
                                                            Adjust Points
                                                        </button>

                                                        {/* Toggle Role (admin/user) */}
                                                        <button
                                                            onClick={() => handleRoleToggle(u.id, u.role)}
                                                            disabled={isSelf}
                                                            className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 dark:text-purple-400 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 rounded-lg transition-colors font-bold disabled:opacity-30 border border-purple-200/50 dark:border-purple-800/40"
                                                        >
                                                            {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                                                        </button>

                                                        {/* Delete */}
                                                        <button
                                                            onClick={() => handleDeleteUser(u.id)}
                                                            disabled={isSelf}
                                                            className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 dark:text-rose-450 dark:hover:bg-rose-500/10 rounded-lg transition-colors font-bold disabled:opacity-30"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 px-4 space-y-4">
                                <div className="mx-auto w-12 h-12 bg-slate-150 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400">
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Users Matching Search</h4>
                                    <p className="text-xs text-slate-400 mt-1 leading-normal max-w-[280px] mx-auto">
                                        Adjust your filter tags or search keyword to find standard or administrator members.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Points adjustment Modal */}
            {isPointsModalOpen && selectedUser && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl p-6 border border-slate-150 dark:border-slate-700/60 shadow-xl space-y-6 animate-fade-in">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Adjust Eco-Points</h3>
                                <p className="text-xs text-slate-400 mt-0.5">User: {selectedUser.name}</p>
                            </div>
                            <button
                                onClick={() => setIsPointsModalOpen(false)}
                                className="text-slate-450 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handlePointsSubmit} className="space-y-4">
                            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1">
                                <p>Current Eco Balance: <span className="font-extrabold text-slate-800 dark:text-white">{selectedUser.eco_points} pts</span></p>
                                <p>Green Level Tier: <span className="font-extrabold text-slate-800 dark:text-white">{selectedUser.green_level}</span></p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    Points Adjustment Value
                                </label>
                                <input
                                    type="number"
                                    value={pointsChange}
                                    onChange={e => setPointsChange(e.target.value)}
                                    placeholder="e.g. 500 to add, -200 to subtract"
                                    className="w-full text-sm rounded-xl border-gray-350 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                />
                                <p className="text-[10px] text-slate-400 mt-1">
                                    Enter positive integers to reward points, or negative integers to deduct them. Total points will lock at a minimum of 0.
                                </p>
                            </div>

                            <div className="flex justify-end space-x-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsPointsModalOpen(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || !pointsChange}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/10 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Apply Adjustment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
