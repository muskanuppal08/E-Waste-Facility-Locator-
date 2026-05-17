import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useUser } from '@clerk/clerk-react';
import MainLayout from '@/Layouts/MainLayout';
import axios from 'axios';



const MOCK_LEADERBOARD = [
    { rank: 1, name: "Sarah J.", points: 12450, badge: "Earth Saver" },
    { rank: 2, name: "David M.", points: 10200, badge: "Green Warrior" },
    { rank: 3, name: "You", points: 8450, badge: "Eco Beginner", isCurrentUser: true },
    { rank: 4, name: "Priya S.", points: 7100, badge: "Eco Beginner" },
    { rank: 5, name: "Alex K.", points: 5300, badge: "Recruit" },
];

// Weekly Impact Data for CSS Chart
const WEEKLY_IMPACT = [40, 65, 30, 85, 55, 90, 70]; 

export default function Dashboard() {
    const { user, isLoaded } = useUser();
    
    const [stats, setStats] = useState({
        points: 0,
        co2: 0,
        metals: 0,
        devices: 0,
        pickups: [],
        leaderboard: []
    });

    useEffect(() => {
        // Once Clerk confirms who is logged in, ask Laravel for their specific stats
        if (isLoaded && user) {
            const email = user.primaryEmailAddress?.emailAddress;
            axios.get(`/api/user/stats?email=${email}`)
                .then(res => setStats(res.data))
                .catch(err => console.error(err));
        }
    }, [isLoaded, user]);

    // Prevent rendering weird states if Clerk is still loading
    if (!isLoaded) return <div className="flex items-center justify-center min-h-screen bg-stone-950"><div className="w-8 h-8 border-2 rounded-full border-emerald-500 border-t-transparent animate-spin"></div></div>;

    return (
        <MainLayout>
            <Head title="User Dashboard | EcoLocator" />

            <div className="relative min-h-screen pb-24 overflow-hidden font-sans bg-stone-950">
                {/* Background Ambient Glow */}
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-900/10 blur-[150px] rounded-full pointer-events-none"></div>

                <div className="relative z-10 px-4 pt-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* 1. Gamification Header */}
                    <div className="relative flex flex-col items-center justify-between p-8 mb-8 overflow-hidden border shadow-2xl bg-stone-900/60 backdrop-blur-xl border-stone-800 rounded-3xl md:flex-row">
                        {/* Internal Accent Glow */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
                        
                        <div className="flex items-center gap-6 mb-6 md:mb-0">
                            <div className="relative">
                                <img 
                                    src={user?.imageUrl || "https://ui-avatars.com/api/?name=User&background=0D8B46&color=fff"} 
                                    alt="Profile" 
                                    className="w-20 h-20 rounded-2xl border-2 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)] object-cover"
                                />
                                <div className="absolute p-1 rounded-full -bottom-2 -right-2 bg-stone-900">
                                    <div className="bg-emerald-500 text-stone-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">Lv. 1</div>
                                </div>
                            </div>
                            <div>
                                <h1 className="mb-1 text-3xl font-black tracking-tight text-white">
                                    Welcome back, {user?.firstName || 'Eco Warrior'}!
                                </h1>
                                <p className="flex items-center gap-2 font-semibold text-emerald-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                                    Eco Beginner Rank
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-8 text-center md:text-right">
                            <div>
                                <p className="mb-1 text-sm font-medium tracking-widest uppercase text-stone-400">Total Eco Points</p>
                                <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                                    {stats.points}
                                </p>
                            </div>
                            
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        
                        {/* Main Left Column (Stats & Pickups) */}
                        <div className="space-y-8 lg:col-span-2">
                            
                            {/* 2. Personal Impact Stats (CSS Bar Chart) */}
                            <div className="p-6 border bg-stone-900/40 border-stone-800 rounded-2xl backdrop-blur-md">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-white">Carbon Savings Activity</h2>
                                    <span className="text-sm font-medium text-stone-500">Last 7 Days</span>
                                </div>
                                
                                <div className="flex items-end justify-between h-40 gap-2 mb-4">
                                    {WEEKLY_IMPACT.map((height, idx) => (
                                        <div key={idx} className="flex flex-col items-center w-full group">
                                            {/* Bar */}
                                            <div className="relative w-full overflow-hidden transition-colors bg-stone-800 rounded-t-md group-hover:bg-stone-700" style={{ height: '100%' }}>
                                                <div 
                                                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-md transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                                    style={{ height: `${height}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between text-xs font-bold tracking-wider uppercase text-stone-500">
                                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-4 pt-6 mt-8 border-t border-stone-800">
                                    <div>
                                        <p className="mb-1 text-xs font-bold tracking-wider uppercase text-stone-400">Devices Recycled</p>
                                        <p className="text-2xl font-black text-white">{stats.devices}</p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs font-bold tracking-wider uppercase text-stone-400">CO₂ Offset (kg)</p>
                                        <p className="text-2xl font-black text-white">{stats.co2}</p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs font-bold tracking-wider uppercase text-stone-400">Metals Yield</p>
                                        <p className="text-2xl font-black text-white">{stats.metals} <span className="text-sm font-medium text-stone-500">kg</span></p>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Active Pickups Table */}
                            <div className="p-6 border bg-stone-900/40 border-stone-800 rounded-2xl backdrop-blur-md">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-white">Active Pickups</h2>
                                    <a href="/pickup/create" className="text-sm font-bold transition-colors text-emerald-400 hover:text-emerald-300">
                                        + Schedule New
                                    </a>
                                </div>
                                
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="text-xs font-bold tracking-wider uppercase border-b border-stone-800 text-stone-500">
                                                <th className="pb-3 pl-2">Request ID</th>
                                                <th className="pb-3">Device Target</th>
                                                <th className="pb-3">Scheduled For</th>
                                                <th className="pb-3 pr-2 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {stats.pickups.map((pickup, idx) => (
                                                <tr key={idx} className="transition-colors border-b border-stone-800/50 hover:bg-stone-800/20">
                                                    <td className="py-4 pl-2 font-medium text-stone-300">{pickup.request_id}</td>
                                                    <td className="py-4 font-bold text-white"><span className="capitalize">{pickup.device_type}</span></td>
                                                    <td className="py-4 text-stone-400">
                                                        <span className="block text-white">{pickup.scheduled_date}</span>
                                                        <span className="text-xs">{pickup.time_slot}</span>
                                                    </td>
                                                    <td className="py-4 pr-2 text-right">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${pickup.statusColor}`}>
                                                            {pickup.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>

                        {/* Right Column (Leaderboard) */}
                        <div className="space-y-8">
                            
                            {/* 4. Leaderboard Widget */}
                            <div className="sticky p-6 border bg-stone-900/40 border-stone-800 rounded-2xl backdrop-blur-md top-28">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                                        <span className="text-amber-400">🏆</span> Top Recyclers
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    {stats.leaderboard.map((user, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                                                user.isCurrentUser 
                                                ? 'bg-emerald-900/20 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                                                : 'bg-stone-950/50 border-stone-800 hover:border-stone-700'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
                                                    user.rank === 1 ? 'bg-amber-400 text-amber-950' : 
                                                    user.rank === 2 ? 'bg-stone-300 text-stone-900' : 
                                                    user.rank === 3 && !user.isCurrentUser ? 'bg-orange-400 text-orange-950' : 
                                                    'bg-stone-800 text-stone-400'
                                                }`}>
                                                    {user.rank}
                                                </div>
                                                <div>
                                                    <p className={`font-bold text-sm ${user.isCurrentUser ? 'text-emerald-400' : 'text-white'}`}>
                                                        {user.name}
                                                    </p>
                                                    <p className="text-xs text-stone-500">{user.badge}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-white">{user.points.toLocaleString()}</p>
                                                <p className="text-[10px] text-emerald-500 font-bold uppercase">Pts</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full py-3 mt-6 text-sm font-semibold transition-colors border bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl border-stone-700">
                                    View Full Rankings
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
}