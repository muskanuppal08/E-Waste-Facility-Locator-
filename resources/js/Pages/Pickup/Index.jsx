import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';

export default function Index({ pastPickups }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        device_type: '',
        brand: '',
        model: '',
        pickup_date: '',
        pickup_time: '',
        address: '',
        contact_phone: '',
        notes: '',
    });

    const deviceTypes = [
        {
            value: 'Mobile',
            label: 'Mobile Phone',
            icon: (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
            )
        },
        {
            value: 'Laptop',
            label: 'Laptop / PC',
            icon: (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="2" y1="20" x2="22" y2="20" />
                    <line x1="12" y1="17" x2="12" y2="20" />
                </svg>
            )
        },
        {
            value: 'Battery',
            label: 'Battery',
            icon: (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="16" height="12" rx="2" ry="2" />
                    <line x1="6" y1="11" x2="10" y2="11" />
                    <line x1="8" y1="9" x2="8" y2="13" />
                    <line x1="22" y1="11" x2="22" y2="13" />
                </svg>
            )
        },
        {
            value: 'TV',
            label: 'TV / Monitor',
            icon: (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="13" rx="2" />
                    <line x1="12" y1="16" x2="12" y2="21" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                </svg>
            )
        },
        {
            value: 'Printer',
            label: 'Printer',
            icon: (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                </svg>
            )
        },
        {
            value: 'Other',
            label: 'Other Equipment',
            icon: (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.89 2.24a2 2 0 0 0-1.78 0L3.5 6.24a2 2 0 0 0-1.12 1.78v7.96a2 2 0 0 0 1.12 1.78l7.61 4a2 2 0 0 0 1.78 0l7.61-4a2 2 0 0 0 1.12-1.78V8a2 2 0 0 0-1.12-1.78z" />
                    <polyline points="2.32 6.16 12 11 21.68 6.16" />
                    <line x1="12" y1="22.76" x2="12" y2="11" />
                </svg>
            )
        }
    ];

    const timeSlots = [
        { value: 'Morning (9 AM - 12 PM)', label: 'Morning', time: '9 AM - 12 PM' },
        { value: 'Afternoon (12 PM - 3 PM)', label: 'Afternoon', time: '12 PM - 3 PM' },
        { value: 'Evening (3 PM - 6 PM)', label: 'Evening', time: '3 PM - 6 PM' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('pickups.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleCancel = (id) => {
        if (confirm('Are you sure you want to cancel this pickup request?')) {
            router.post(route('pickups.cancel', id));
        }
    };

    const todayStr = new Date().toISOString().split('T')[0];

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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Home Pickup Requests
                </h2>
            }
        >
            <Head title="Home Pickups" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Status / Flash Alerts */}
                    {flash?.status && (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl text-sm font-semibold flex items-center space-x-2 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{flash.status}</span>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-2xl text-sm font-semibold flex items-center space-x-2 shadow-sm animate-shake">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>{flash.error}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* Request Form */}
                        <div className="lg:col-span-7 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700/50 space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Schedule a Free Home Pickup</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Fill in the details below to schedule an eco-friendly doorstep collection for your retired hardware.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                
                                {/* Device Type Grid */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                                        Select Device Type <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {deviceTypes.map((item) => {
                                            const isSelected = data.device_type === item.value;
                                            return (
                                                <button
                                                    key={item.value}
                                                    type="button"
                                                    onClick={() => setData('device_type', item.value)}
                                                    className={`p-4 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-center space-y-2 group ${
                                                        isSelected
                                                            ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm ring-2 ring-emerald-500/10'
                                                            : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                                                    }`}
                                                >
                                                    <div className={`p-2 rounded-xl transition-all duration-300 ${
                                                        isSelected
                                                            ? 'bg-emerald-500 text-white'
                                                            : 'bg-slate-200/50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:scale-110'
                                                    }`}>
                                                        {item.icon}
                                                    </div>
                                                    <span className="text-xs tracking-tight">{item.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.device_type && (
                                        <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.device_type}</p>
                                    )}
                                </div>

                                {/* Brand and Model inputs */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                            Brand / Manufacturer <span className="text-slate-400 text-xs font-normal">(Optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.brand}
                                            onChange={e => setData('brand', e.target.value)}
                                            placeholder="e.g. Apple, Samsung, Dell"
                                            className="w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                        />
                                        {errors.brand && <p className="mt-1 text-xs text-red-500">{errors.brand}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                            Model Name / Number <span className="text-slate-400 text-xs font-normal">(Optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.model}
                                            onChange={e => setData('model', e.target.value)}
                                            placeholder="e.g. iPhone 12, Latitude 5420"
                                            className="w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                        />
                                        {errors.model && <p className="mt-1 text-xs text-red-500">{errors.model}</p>}
                                    </div>
                                </div>

                                {/* Pickup Date & Slot */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                            Preferred Date <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            min={todayStr}
                                            value={data.pickup_date}
                                            onChange={e => setData('pickup_date', e.target.value)}
                                            className="w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                            required
                                        />
                                        {errors.pickup_date && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.pickup_date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                            Time Slot <span className="text-rose-500">*</span>
                                        </label>
                                        <select
                                            value={data.pickup_time}
                                            onChange={e => setData('pickup_time', e.target.value)}
                                            className="w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                            required
                                        >
                                            <option value="">Choose slot...</option>
                                            {timeSlots.map(slot => (
                                                <option key={slot.value} value={slot.value}>{slot.value}</option>
                                            ))}
                                        </select>
                                        {errors.pickup_time && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.pickup_time}</p>}
                                    </div>
                                </div>

                                {/* Contact Phone */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                        Contact Phone Number <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.contact_phone}
                                        onChange={e => setData('contact_phone', e.target.value)}
                                        placeholder="e.g. +91 98765 43210"
                                        className="w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                        required
                                    />
                                    {errors.contact_phone && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.contact_phone}</p>}
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                        Complete Pickup Address <span className="text-rose-500">*</span>
                                    </label>
                                    <textarea
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        rows="3"
                                        placeholder="Street address, Apartment / Suite number, City, State, ZIP code"
                                        className="w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                        required
                                    ></textarea>
                                    {errors.address && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.address}</p>}
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                        Additional Notes <span className="text-slate-400 text-xs font-normal">(Optional)</span>
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        rows="2"
                                        placeholder="Instructions for pickup partner (e.g. Call before arrival, buzzer number 4B)"
                                        className="w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                    ></textarea>
                                    {errors.notes && <p className="mt-1 text-xs text-red-500">{errors.notes}</p>}
                                </div>

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-2xl font-bold text-sm tracking-wide transition-all duration-200 shadow-md shadow-emerald-500/10 hover:shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Scheduling...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                <polyline points="22 4 12 14.01 9 11.01" />
                                            </svg>
                                            <span>Schedule Pickup Request</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Request History Log */}
                        <div className="lg:col-span-5 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700/50 flex flex-col justify-between space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Pickup Log</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Track status updates and history of scheduled pickups.</p>
                            </div>

                            <div className="space-y-4 overflow-y-auto max-h-[600px] pr-1 flex-1">
                                {pastPickups.length === 0 ? (
                                    <div className="text-center py-12 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
                                        <div className="mx-auto w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400">
                                            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                <line x1="16" y1="2" x2="16" y2="6" />
                                                <line x1="8" y1="2" x2="8" y2="6" />
                                                <line x1="3" y1="10" x2="21" y2="10" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Pickups Logged Yet</h4>
                                            <p className="text-xs text-slate-400 mt-1 leading-normal max-w-[240px] mx-auto">
                                                Fill out the form on the left to schedule your first home e-waste pickup collection.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    pastPickups.map((pickup) => {
                                        const formattedDate = new Date(pickup.pickup_date).toLocaleDateString(undefined, {
                                            weekday: 'short',
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        });

                                        return (
                                            <div 
                                                key={pickup.id}
                                                className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 space-y-3 shadow-sm hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200"
                                            >
                                                <div className="flex justify-between items-start gap-4">
                                                    <div>
                                                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                                                            <span>{pickup.device_type} Pickup</span>
                                                            {(pickup.brand || pickup.model) && (
                                                                <span className="text-[10px] font-normal text-slate-400 bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                                                    {[pickup.brand, pickup.model].filter(Boolean).join(' ')}
                                                                </span>
                                                            )}
                                                        </h4>
                                                        <p className="text-[10px] text-slate-400 mt-0.5">Submitted on {new Date(pickup.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border shrink-0 ${getStatusStyle(pickup.status)}`}>
                                                        {pickup.status}
                                                    </span>
                                                </div>

                                                <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800/80 pt-3 text-xs text-slate-600 dark:text-slate-400">
                                                    <div className="flex items-start gap-2">
                                                        <svg className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <div>
                                                            <p className="font-semibold text-slate-800 dark:text-slate-200">{formattedDate}</p>
                                                            <p className="text-[10px] text-slate-400">{pickup.pickup_time}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-2">
                                                        <svg className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <p className="leading-relaxed">{pickup.address}</p>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                        </svg>
                                                        <p>{pickup.contact_phone}</p>
                                                    </div>

                                                    {pickup.notes && (
                                                        <div className="bg-slate-100/50 dark:bg-slate-800/50 p-2.5 rounded-xl text-[11px] text-slate-500 border border-slate-200/20 mt-2">
                                                            <span className="font-bold text-slate-700 dark:text-slate-300">Note: </span>
                                                            {pickup.notes}
                                                        </div>
                                                    )}
                                                </div>

                                                {pickup.status === 'Pending' && (
                                                    <div className="pt-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCancel(pickup.id)}
                                                            className="w-full py-2 border border-rose-500/30 bg-rose-500/5 text-rose-600 hover:bg-rose-500 hover:text-white dark:text-rose-400 dark:hover:bg-rose-500 dark:hover:text-white rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-sm"
                                                        >
                                                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                                <line x1="6" y1="6" x2="18" y2="18" />
                                                            </svg>
                                                            <span>Cancel Request</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="text-[10px] text-center text-slate-400 border-t border-slate-100 dark:border-slate-700/60 pt-4">
                                Our recycling partner will review and assign status updates.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
