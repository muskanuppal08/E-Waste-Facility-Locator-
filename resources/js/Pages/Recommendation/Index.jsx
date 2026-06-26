import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Index() {
    const [query, setQuery] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // Get user coordinates for proximity calculations
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                },
                (err) => {
                    console.error("Proximity access denied. Falling back to Delhi.", err);
                    setUserLocation({ lat: 28.6139, lng: 77.2090 });
                }
            );
        } else {
            setUserLocation({ lat: 28.6139, lng: 77.2090 });
        }
    }, []);

    const handleSubmit = async (e, text = null) => {
        if (e) e.preventDefault();
        const searchQuery = text || query;
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const payload = {
                query: searchQuery,
                lat: userLocation?.lat,
                lng: userLocation?.lng
            };
            const response = await axios.post(route('recommendations.suggest'), payload);
            setResult(response.data);
            if (text) setQuery(text); // Sync input box
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "An error occurred during matching. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const samplePrompts = [
        "I have a broken Dell laptop.",
        "Recycle an old working iPhone.",
        "Where can I dump a dead battery?",
        "I want to dispose of a dusty average printer."
    ];

    const getConditionBadgeStyle = (condition) => {
        switch (condition) {
            case 'Excellent':
                return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'Good':
                return 'bg-sky-500/10 text-sky-600 border-sky-500/20';
            case 'Average':
                return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
            case 'Poor':
                return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            default:
                return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="flex items-center space-x-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`h-3.5 w-3.5 ${
                            star <= rating ? 'text-amber-400 fill-current' : 'text-slate-350 dark:text-slate-600'
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="text-[10px] text-slate-400 font-bold ml-1">({rating})</span>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    AI Recommendation Assistant
                </h2>
            }
        >
            <Head title="AI Assistant" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Assistant Header Intro */}
                    <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-3xl p-8 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]" />
                        
                        <div className="relative space-y-2 z-10 text-center md:text-left">
                            <span className="bg-white/20 border border-white/30 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full">
                                Advanced NLP Matching
                            </span>
                            <h3 className="text-2xl font-black">Ask our AI Recycling Assistant</h3>
                            <p className="text-emerald-150 text-sm max-w-xl leading-relaxed">
                                Enter details about the device you want to recycle (e.g. *"I have a broken Dell laptop"*). The AI will identify the model type, condition, calculate points, suggest nearby centers, and display safety guidelines.
                            </p>
                        </div>
                        <div className="relative z-10 p-5 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center shrink-0">
                            <svg className="h-16 w-16 text-emerald-300 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                    </div>

                    {/* Query Panel */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <textarea
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    rows="2"
                                    placeholder="Type details about your electronic waste here..."
                                    className="w-full pl-4 pr-32 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 dark:text-white"
                                    required
                                ></textarea>
                                
                                <button
                                    type="submit"
                                    disabled={loading || !query.trim()}
                                    className="absolute right-3.5 bottom-3.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/10 disabled:opacity-40 flex items-center space-x-1.5"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                                            <span>Consulting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span>Consult AI</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Clickable Prompts Grid */}
                        <div className="space-y-2.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Example queries to test:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                {samplePrompts.map((promptText, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => handleSubmit(e, promptText)}
                                        className="p-3.5 text-left bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 rounded-2xl text-xs text-slate-600 dark:text-slate-350 transition-all font-medium leading-relaxed hover:shadow-sm"
                                    >
                                        "{promptText}"
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Loader */}
                    {loading && (
                        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-4">
                            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">AI is analyzing specifications</h4>
                                <p className="text-xs text-slate-400 mt-1">Extracting device category, brand details, and calculating nearby proximity...</p>
                            </div>
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="p-5 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-450 rounded-2xl text-xs font-semibold flex items-center space-x-3 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Results dashboard grid */}
                    {result && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
                            
                            {/* Device & Rewards Summary (Left Column) */}
                            <div className="md:col-span-6 space-y-6">
                                
                                {/* Device Specs parsed */}
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-4">
                                    <h4 className="text-sm font-black text-slate-850 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 pb-2">Matched Device Specs</h4>
                                    
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Device</p>
                                            <p className="text-sm font-extrabold text-slate-800 dark:text-gray-200 mt-1">{result.device_type}</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Brand</p>
                                            <p className="text-sm font-extrabold text-slate-800 dark:text-gray-200 mt-1">{result.brand}</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Condition</p>
                                            <span className={`text-xs font-black uppercase px-2 py-0.5 mt-1.5 rounded-full border inline-block ${getConditionBadgeStyle(result.condition)}`}>
                                                {result.condition}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Reward calculation values */}
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-6">
                                    <h4 className="text-sm font-black text-slate-850 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 pb-2">Recycling Rewards Estimate</h4>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/10 flex items-center space-x-3">
                                            <div className="text-3xl">🏆</div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold">ECO POINTS</p>
                                                <p className="text-xl font-black text-slate-850 dark:text-white">{result.rewards.eco_points} pts</p>
                                            </div>
                                        </div>
                                        <div className="bg-cyan-500/5 dark:bg-cyan-500/10 p-5 rounded-2xl border border-cyan-500/10 flex items-center space-x-3">
                                            <div className="text-3xl">🌱</div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold">CARBON OFFSET</p>
                                                <p className="text-xl font-black text-slate-850 dark:text-white">{result.rewards.carbon_offset} kg</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Metals recoveries */}
                                    {result.rewards.metals.length > 0 && (
                                        <div className="space-y-2.5">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Metal Recovery:</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {result.rewards.metals.map((metal, idx) => (
                                                    <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                                                        <span className="font-bold text-slate-500">{metal.name}</span>
                                                        <span className="font-black text-slate-800 dark:text-gray-200 bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded-md">{metal.amount}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recycler & Safety Instructions (Right Column) */}
                            <div className="md:col-span-6 space-y-6">
                                
                                {/* Proximity Recycler Card */}
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-4">
                                    <h4 className="text-sm font-black text-slate-850 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 pb-2">Recommended Closest Recycler</h4>
                                    
                                    {result.closest_recycler ? (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h5 className="font-bold text-slate-900 dark:text-white text-base">{result.closest_recycler.name}</h5>
                                                    <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">📍 Delhi/NCR Certified Partner</p>
                                                </div>
                                                {result.closest_recycler.distance !== undefined && (
                                                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-450 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                                                        {result.closest_recycler.distance} km away
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-350 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                                                <div className="flex items-start gap-2">
                                                    <svg className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                    <p>{result.closest_recycler.address}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <svg className="h-4 w-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    <p>{result.closest_recycler.phone}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <svg className="h-4 w-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                                                        Hours: {result.closest_recycler.open_time.substring(0, 5)} - {result.closest_recycler.close_time.substring(0, 5)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                                                <span className="text-slate-400">User Rating:</span>
                                                {renderStars(result.closest_recycler.rating)}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-400">No centers currently accept {result.device_type} in your area.</p>
                                    )}
                                </div>

                                {/* Safety instructions and environmental guidelines */}
                                {result.instructions && (
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-4">
                                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-2">
                                            <h4 className="text-sm font-black text-slate-850 dark:text-white uppercase tracking-wider">Recycling Instructions</h4>
                                            
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                                                result.instructions.risk_level === 'High' 
                                                    ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' 
                                                    : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                            }`}>
                                                {result.instructions.risk_level} Risk Device
                                            </span>
                                        </div>

                                        <div className="space-y-4 text-xs text-slate-600 dark:text-slate-350">
                                            
                                            {/* Toxic materials list */}
                                            {result.instructions.harmful_materials.length > 0 && (
                                                <div className="space-y-1">
                                                    <p className="font-bold text-slate-800 dark:text-slate-200">⚠️ Contains Toxic Materials:</p>
                                                    <p className="leading-relaxed">
                                                        This device contains chemical hazards: <span className="font-semibold text-rose-500 dark:text-rose-450">{result.instructions.harmful_materials.join(', ')}</span>. Improper dumping damages ecological systems.
                                                    </p>
                                                </div>
                                            )}

                                            {/* Health hazard warning */}
                                            <div className="space-y-1">
                                                <p className="font-bold text-slate-800 dark:text-slate-200">☠️ Health Hazards:</p>
                                                <p className="leading-relaxed">{result.instructions.health_effects}</p>
                                            </div>

                                            {/* Recycling benefits */}
                                            <div className="space-y-1">
                                                <p className="font-bold text-slate-800 dark:text-slate-200">♻️ Environmental Benefits:</p>
                                                <p className="leading-relaxed">{result.instructions.recycling_benefits}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
