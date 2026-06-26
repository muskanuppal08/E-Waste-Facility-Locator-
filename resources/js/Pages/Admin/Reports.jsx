import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Reports({ summaryStats }) {
    
    const reports = [
        {
            type: 'facilities',
            title: 'Certified Recycling Centers',
            description: 'List of all registered certified e-waste centers, including their operating address, location city, state, pin codes, telephone, and rating scores.',
            icon: (
                <svg className="h-6 w-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
            )
        },
        {
            type: 'pickups',
            title: 'Pickup Collection Logs',
            description: 'Complete history of scheduled e-waste collection requests, including device details, pickup dates, slots, customer addresses, contact phones, and statuses.',
            icon: (
                <svg className="h-6 w-6 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
            )
        },
        {
            type: 'users',
            title: 'User Recycler Performance',
            description: 'List of registered members in the system, showing their eco-points balances, dynamic green levels, registered emails, and unlocked achievements count.',
            icon: (
                <svg className="h-6 w-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            )
        }
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    System Reports & Data Exports
                </h2>
            }
        >
            <Head title="System Reports" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Stats Dashboard Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                            <p className="text-xs text-slate-400 font-bold">TOTAL RECYCLERS</p>
                            <p className="text-2xl font-black text-slate-800 dark:text-white mt-2">👤 {summaryStats.total_users}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                            <p className="text-xs text-slate-400 font-bold">COLLECTION REQUESTS</p>
                            <p className="text-2xl font-black text-slate-800 dark:text-white mt-2">🚚 {summaryStats.total_pickups}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{summaryStats.completed_pickups} requests completed</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                            <p className="text-xs text-slate-400 font-bold">ECO POINTS DISTRIBUTED</p>
                            <p className="text-2xl font-black text-slate-800 dark:text-white mt-2">🏆 {summaryStats.total_eco_points} <span className="text-xs text-slate-400 font-normal">pts</span></p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                            <p className="text-xs text-slate-400 font-bold">RECYCLING ESTIMATIONS</p>
                            <p className="text-2xl font-black text-slate-800 dark:text-white mt-2">📟 {summaryStats.total_calculations}</p>
                        </div>
                    </div>

                    {/* Export Actions Hub */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Download CSV Reports</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Generate and download platform database tables instantly in standard CSV file format.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {reports.map((report) => (
                                <div 
                                    key={report.type}
                                    className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200"
                                >
                                    <div className="space-y-4">
                                        <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl w-fit">
                                            {report.icon}
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                                                {report.title}
                                            </h4>
                                            <p className="text-xs text-slate-400 leading-relaxed">
                                                {report.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60">
                                        <span className="text-[10px] font-bold text-slate-400/80 bg-slate-100 dark:bg-slate-900 border border-slate-200/20 dark:border-slate-800 px-2 py-0.5 rounded-full uppercase tracking-wider">CSV Form</span>
                                        
                                        <a
                                            href={route('admin.reports.download', report.type)}
                                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-500/10 flex items-center gap-1.5"
                                        >
                                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="7 10 12 15 17 10" />
                                                <line x1="12" y1="15" x2="12" y2="3" />
                                            </svg>
                                            <span>Export</span>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
