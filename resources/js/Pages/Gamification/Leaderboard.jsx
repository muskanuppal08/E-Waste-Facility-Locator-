import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Leaderboard({ rankings, allBadges, earnedBadgeIds }) {
    const currentUser = usePage().props.auth.user;

    const renderBadgeIcon = (iconName, unlocked = true) => {
        const colorClass = unlocked ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600';
        const className = `h-10 w-10 ${colorClass} transition-all duration-300 transform group-hover:scale-110`;

        switch (iconName) {
            case 'Leaf':
                return (
                    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2Z" />
                        <path d="M19 2c-2.26 4.33-5.27 7.14-8 10" />
                    </svg>
                );
            case 'Flame':
                return (
                    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                    </svg>
                );
            case 'MessageSquare':
                return (
                    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                );
            case 'Shield':
                return (
                    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                );
            case 'Cpu':
                return (
                    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
                        <rect x="9" y="9" width="6" height="6" />
                        <line x1="9" y1="1" x2="9" y2="4" />
                        <line x1="15" y1="1" x2="15" y2="4" />
                        <line x1="9" y1="20" x2="9" y2="23" />
                        <line x1="15" y1="20" x2="15" y2="23" />
                        <line x1="20" y1="9" x2="23" y2="9" />
                        <line x1="20" y1="15" x2="23" y2="15" />
                        <line x1="1" y1="9" x2="4" y2="9" />
                        <line x1="1" y1="15" x2="4" y2="15" />
                    </svg>
                );
            case 'Globe':
                return (
                    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                );
            default:
                return (
                    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                );
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Leaderboard & Badges Hub
                </h2>
            }
        >
            <Head title="Leaderboard & Badges" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    
                    {/* User Progress Stats Header */}
                    {currentUser && (
                        <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]" />
                            
                            <div className="relative space-y-3 z-10 text-center md:text-left">
                                <span className="bg-white/20 border border-white/30 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full">
                                    My Level Status
                                </span>
                                <h3 className="text-3xl font-black">{currentUser.green_level}</h3>
                                <p className="text-emerald-100 text-sm max-w-md">
                                    Earn more eco points by calculating e-waste items and sharing feedback to level up to Green Warrior or Earth Saver!
                                </p>
                            </div>

                            <div className="relative z-10 w-full md:w-80 bg-white/10 border border-white/25 rounded-2xl p-5 backdrop-blur-md space-y-4">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-emerald-100 font-semibold">Total Balance</p>
                                        <p className="text-2xl font-black">{currentUser.eco_points} pts</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-emerald-100 font-semibold">Next Level</p>
                                        <p className="text-sm font-extrabold">{currentUser.next_level_progress.next_level}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-1.5">
                                    <div className="w-full bg-white/25 rounded-full h-3 overflow-hidden shadow-inner">
                                        <div 
                                            className="bg-white h-full rounded-full transition-all duration-500 shadow-md"
                                            style={{ width: `${currentUser.next_level_progress.percent}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-emerald-100 font-bold">
                                        <span>{currentUser.next_level_progress.current} pts</span>
                                        <span>{currentUser.next_level_progress.target} pts</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Badges Showcase Grid */}
                        <div className="lg:col-span-7 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700/50 space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Eco Achievements & Badges</h3>
                                <p className="text-xs text-slate-500 mt-1">Unlock badges by performing recycling calculations, leaving center reviews, and leveling up.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {allBadges.map((badge) => {
                                    const isEarned = earnedBadgeIds.includes(badge.id);
                                    return (
                                        <div 
                                            key={badge.id}
                                            className={`group relative p-5 rounded-2xl border transition-all duration-300 flex items-center space-x-4 ${
                                                isEarned
                                                    ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 dark:border-emerald-500/30 shadow-sm'
                                                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-100 dark:border-slate-800/80'
                                            }`}
                                        >
                                            <div className={`p-3 rounded-xl shrink-0 ${
                                                isEarned 
                                                    ? 'bg-emerald-500/10 border border-emerald-500/30' 
                                                    : 'bg-slate-200/50 dark:bg-slate-800 border border-slate-300/40 dark:border-slate-700/60'
                                            }`}>
                                                {renderBadgeIcon(badge.icon, isEarned)}
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-1.5">
                                                    <h4 className={`text-sm font-bold ${
                                                        isEarned ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                                                    }`}>
                                                        {badge.name}
                                                    </h4>
                                                    {!isEarned && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-slate-400 leading-normal">
                                                    {badge.description}
                                                </p>
                                                <span className="text-[9px] font-bold text-slate-400/80 bg-slate-200/40 dark:bg-slate-800/80 px-2 py-0.5 rounded-full inline-block mt-1">
                                                    Requires: {badge.rule_value} {badge.rule_type}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Leaderboard Rankings */}
                        <div className="lg:col-span-5 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700/50 flex flex-col justify-between space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Global Leaderboard</h3>
                                <p className="text-xs text-slate-500 mt-1">Top green contributors ranked by total points.</p>
                            </div>

                            <div className="space-y-3 overflow-y-auto max-h-[420px] pr-1">
                                {rankings.map((user) => {
                                    const isMe = currentUser && user.id === currentUser.id;
                                    return (
                                        <div 
                                            key={user.id}
                                            className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all duration-200 ${
                                                isMe 
                                                    ? 'bg-emerald-500/10 border-emerald-500/30 ring-2 ring-emerald-500/10' 
                                                    : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                {/* Rank Medal or Number */}
                                                <div className="w-8 flex justify-center shrink-0">
                                                    {user.rank === 1 ? (
                                                        <span className="text-2xl">🥇</span>
                                                    ) : user.rank === 2 ? (
                                                        <span className="text-2xl">🥈</span>
                                                    ) : user.rank === 3 ? (
                                                        <span className="text-2xl">🥉</span>
                                                    ) : (
                                                        <span className="text-xs font-black text-slate-400 dark:text-slate-500">#{user.rank}</span>
                                                    )}
                                                </div>

                                                {/* User Avatar Initials */}
                                                <div className="h-9 w-9 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-extrabold text-xs shadow-inner">
                                                    {user.initials}
                                                </div>

                                                <div>
                                                    <p className={`text-xs font-bold ${
                                                        isMe ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'
                                                    }`}>
                                                        {user.name} {isMe && <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded ml-1">Me</span>}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                                        <span>{user.green_level}</span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                                        <span>🏆 {user.badges_count} Badges</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0">
                                                <p className="text-xs font-black text-slate-900 dark:text-white">
                                                    {user.eco_points}
                                                </p>
                                                <p className="text-[9px] text-slate-400">Points</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="text-[10px] text-center text-slate-400 border-t border-slate-100 dark:border-slate-700/60 pt-4">
                                Ranks are updated instantly whenever a calculator action completes.
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
