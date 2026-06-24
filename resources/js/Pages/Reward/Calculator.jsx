import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

export default function Calculator({ pastCalculations }) {
    const user = usePage().props.auth.user;
    
    // Form state
    const [deviceType, setDeviceType] = useState('Mobile');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [condition, setCondition] = useState('Excellent');
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    
    // Result state
    const [result, setResult] = useState(null);
    // Local list of past calculations to prepend newly calculated ones immediately
    const [history, setHistory] = useState(pastCalculations || []);
    // Current user's cumulative eco points
    const [userEcoPoints, setUserEcoPoints] = useState(user ? user.eco_points : 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setResult(null);

        axios.post(route('calculator.calculate'), {
            device_type: deviceType,
            brand: brand,
            model: model,
            condition: condition
        })
        .then(response => {
            const data = response.data;
            setResult(data.calculation);
            if (data.user_eco_points !== null) {
                setUserEcoPoints(data.user_eco_points);
            }
            setHistory(prev => [data.calculation, ...prev]);
            // Clear inputs except type
            setBrand('');
            setModel('');
        })
        .catch(err => {
            if (err.response && err.response.data && err.response.data.errors) {
                setErrors(err.response.data.errors);
            } else {
                alert('Something went wrong. Please check your input and try again.');
            }
        })
        .finally(() => {
            setLoading(false);
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Device Reward Calculator
                    </h2>
                    {user && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2 flex items-center space-x-2">
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Cumulative Balance:</span>
                            <span className="text-emerald-500 dark:text-emerald-400 font-extrabold text-sm">{userEcoPoints} Eco Points</span>
                        </div>
                    )}
                </div>
            }
        >
            <Head title="Device Reward Calculator" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Top explanation banner */}
                    <div className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-3xl relative overflow-hidden shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 opacity-60" />
                        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="space-y-2 max-w-2xl">
                                <h3 className="text-2xl font-bold text-white">Value Your Old Devices & Help the Planet</h3>
                                <p className="text-slate-400 text-sm">
                                    Our reward calculator estimates recoverable metals, eco points, and carbon offsets for recycled electronics. Enter device details below to see how recycling contributes to resource conservation.
                                </p>
                            </div>
                            <div className="flex items-center space-x-4 shrink-0">
                                <div className="text-center p-3 bg-slate-900/50 rounded-2xl border border-slate-700 w-24">
                                    <p className="text-emerald-400 text-xs font-semibold">Excellent</p>
                                    <p className="text-white font-extrabold text-sm mt-1">100%</p>
                                    <p className="text-[10px] text-slate-500">Multiplier</p>
                                </div>
                                <div className="text-center p-3 bg-slate-900/50 rounded-2xl border border-slate-700 w-24">
                                    <p className="text-cyan-400 text-xs font-semibold">Good</p>
                                    <p className="text-white font-extrabold text-sm mt-1">80%</p>
                                    <p className="text-[10px] text-slate-500">Multiplier</p>
                                </div>
                                <div className="text-center p-3 bg-slate-900/50 rounded-2xl border border-slate-700 w-24">
                                    <p className="text-amber-400 text-xs font-semibold">Average</p>
                                    <p className="text-white font-extrabold text-sm mt-1">60%</p>
                                    <p className="text-[10px] text-slate-500">Multiplier</p>
                                </div>
                                <div className="text-center p-3 bg-slate-900/50 rounded-2xl border border-slate-700 w-24">
                                    <p className="text-rose-400 text-xs font-semibold">Poor</p>
                                    <p className="text-white font-extrabold text-sm mt-1">40%</p>
                                    <p className="text-[10px] text-slate-500">Multiplier</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Input Form */}
                        <div className="lg:col-span-5 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700/50 space-y-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4">
                                Enter Device Details
                            </h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Device Type */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Device Type
                                    </label>
                                    <select
                                        value={deviceType}
                                        onChange={(e) => setDeviceType(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-none"
                                    >
                                        <option value="Mobile">Mobile Phone</option>
                                        <option value="Laptop">Laptop</option>
                                        <option value="Battery">Battery</option>
                                        <option value="TV">Television</option>
                                        <option value="Printer">Printer</option>
                                    </select>
                                    {errors.device_type && <p className="text-xs text-rose-500 mt-1">{errors.device_type[0]}</p>}
                                </div>

                                {/* Brand */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Brand
                                    </label>
                                    <input
                                        type="text"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        placeholder="e.g. Apple, Samsung, Dell"
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-none"
                                        required
                                    />
                                    {errors.brand && <p className="text-xs text-rose-500 mt-1">{errors.brand[0]}</p>}
                                </div>

                                {/* Model */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Model
                                    </label>
                                    <input
                                        type="text"
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        placeholder="e.g. iPhone 13, Galaxy S21, Latitude 5420"
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-none"
                                        required
                                    />
                                    {errors.model && <p className="text-xs text-rose-500 mt-1">{errors.model[0]}</p>}
                                </div>

                                {/* Condition */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Condition
                                    </label>
                                    <select
                                        value={condition}
                                        onChange={(e) => setCondition(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-none"
                                    >
                                        <option value="Excellent">Excellent (Like new, fully operational)</option>
                                        <option value="Good">Good (Minor scuffs, fully operational)</option>
                                        <option value="Average">Average (Noticeable wear, partially working)</option>
                                        <option value="Poor">Poor (Broken screen, not booting, damaged)</option>
                                    </select>
                                    {errors.condition && <p className="text-xs text-rose-500 mt-1">{errors.condition[0]}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold rounded-xl transition-all duration-300 transform active:scale-95 shadow-md flex justify-center items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Analyzing Device...</span>
                                        </>
                                    ) : (
                                        <span>Calculate E-Waste Value</span>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Right Column: Calculations Result Card */}
                        <div className="lg:col-span-7 flex flex-col justify-stretch">
                            {result ? (
                                <div className="bg-slate-800 text-white p-8 rounded-3xl shadow-lg border border-slate-700 relative overflow-hidden flex-1 flex flex-col justify-between space-y-6">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                                    <div className="relative">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                                                    Results Generated
                                                </span>
                                                <h3 className="text-2xl font-extrabold mt-3">{result.brand} {result.model}</h3>
                                                <p className="text-slate-400 text-sm mt-1">{result.device_type} • Condition: {result.condition}</p>
                                            </div>
                                            
                                            {/* Eco points badge */}
                                            <div className="text-right bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-2xl p-4 shadow-inner">
                                                <p className="text-xs text-slate-400 uppercase font-semibold">Eco Score</p>
                                                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mt-1">
                                                    +{result.eco_points}
                                                </p>
                                                <p className="text-[10px] text-emerald-500 font-bold mt-1">Points Earned</p>
                                            </div>
                                        </div>

                                        {/* Carbon offset display */}
                                        <div className="mt-6 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/60 flex items-center space-x-4">
                                            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20 shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-semibold">Carbon Footprint Saved</p>
                                                <p className="text-lg font-bold text-white mt-0.5">
                                                    CO₂ Savings Offset: <span className="text-cyan-400 font-extrabold">{result.carbon_saved} kg CO₂</span>
                                                </p>
                                                <p className="text-xs text-slate-500">Recycling this device saves greenhouse emissions equivalent to driving a car for several miles.</p>
                                            </div>
                                        </div>

                                        {/* Recoverable Metals Table */}
                                        <div className="mt-6 space-y-3">
                                            <h4 className="text-sm font-bold text-slate-300">Recoverable Strategic Materials</h4>
                                            <div className="overflow-hidden border border-slate-700/60 rounded-2xl bg-slate-900/30">
                                                <table className="min-w-full divide-y divide-slate-800">
                                                    <thead className="bg-slate-900/80">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Strategic Metal</th>
                                                            <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Recovery Yield</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-800">
                                                        {result.metals_data && result.metals_data.map((metal, idx) => (
                                                            <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                                                                <td className="px-6 py-3.5 whitespace-nowrap text-sm font-bold text-white flex items-center space-x-2">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                                                    <span>{metal.name}</span>
                                                                </td>
                                                                <td className="px-6 py-3.5 whitespace-nowrap text-sm text-right font-extrabold text-emerald-400">
                                                                    {metal.amount}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center text-xs text-slate-500">
                                        <span>Formula: Base Points * Condition Multiplier</span>
                                        <span>Calculated just now</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-slate-800/20 dark:bg-gray-800/35 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-3xl p-8 text-center flex flex-col items-center justify-center space-y-4 flex-1">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-lg font-bold text-gray-800 dark:text-slate-200">Awaiting Input Details</h4>
                                        <p className="text-sm text-slate-500 max-w-sm">
                                            Fill out the form on the left with your device specifications and submit to obtain estimated point rewards, CO₂ offset numbers, and material recoveries.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom: Past Calculations History */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700/50 space-y-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4">
                            Estimation History
                        </h3>
                        
                        {history.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-slate-900/60">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Device Info</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Condition</th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Eco Points</th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Carbon Saved</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Metals Recovered</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700/60">
                                        {history.map((calc) => (
                                            <tr key={calc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(calc.created_at).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{calc.brand} {calc.model}</p>
                                                    <p className="text-xs text-gray-400">{calc.device_type}</p>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                        calc.condition === 'Excellent' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                                        calc.condition === 'Good' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-500/10 dark:text-cyan-400' :
                                                        calc.condition === 'Average' ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400' :
                                                        'bg-rose-100 text-rose-800 dark:bg-rose-500/10 dark:text-rose-400'
                                                    }`}>
                                                        {calc.condition}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-extrabold text-emerald-500 dark:text-emerald-400">
                                                    +{calc.eco_points}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-extrabold text-cyan-500 dark:text-cyan-400">
                                                    {calc.carbon_saved} kg
                                                </td>
                                                <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                    {calc.metals_data && calc.metals_data.map(m => `${m.name} (${m.amount})`).join(', ')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">
                                No calculations performed yet. Try calculating your first device estimation above!
                            </div>
                        )}
                    </div>
                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
