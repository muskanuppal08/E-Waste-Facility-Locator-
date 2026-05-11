import { Head, Link } from '@inertiajs/react';

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
            <Head title="E-Waste Facility Locator - Home" />
            
            <div className="max-w-4xl w-full text-center space-y-12">
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                        E-Waste Facility Locator
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Dispose of your electronic waste responsibly. Join our community and find the nearest certified recycling centers.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 pt-8">
                    {/* User Option */}
                    <div className="group relative bg-slate-800/50 border border-slate-700 p-8 rounded-3xl hover:border-emerald-500/50 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                        <div className="relative space-y-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="space-y-2 text-left">
                                <h2 className="text-2xl font-bold text-white">Login as User</h2>
                                <p className="text-slate-400">Find centers, track your recycling, and earn reward points.</p>
                            </div>
                            <div className="space-y-3">
                                <Link
                                    href={route('login')}
                                    className="block w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors text-center"
                                >
                                    Enter User Portal
                                </Link>
                                <Link
                                    href={route('locator')}
                                    className="block w-full py-3 px-6 bg-slate-700 hover:bg-slate-600 text-emerald-400 font-bold rounded-xl transition-colors text-center border border-emerald-500/30"
                                >
                                    Find Nearest Centers
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Admin Option */}
                    <div className="group relative bg-slate-800/50 border border-slate-700 p-8 rounded-3xl hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)]">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                        <div className="relative space-y-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/20 rounded-2xl text-cyan-400 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div className="space-y-2 text-left">
                                <h2 className="text-2xl font-bold text-white">Login as Admin</h2>
                                <p className="text-slate-400">Manage facility data, verify recycling centers, and view analytics.</p>
                            </div>
                            <Link
                                href={route('admin.login')}
                                className="block w-full py-4 px-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-colors text-center"
                            >
                                Admin Access
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="pt-8 flex items-center justify-center space-x-6 text-slate-500 text-sm">
                    <span>© 2024 E-Waste Facility Locator</span>
                    <span>•</span>
                    <Link href={route('register')} className="hover:text-white transition-colors">Create User Account</Link>
                </div>
            </div>
        </div>
    );
}
