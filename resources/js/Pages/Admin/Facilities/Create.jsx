import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        address: '',
        phone: '',
        latitude: '',
        longitude: '',
        open_time: '09:00',
        close_time: '18:00',
        accepted_items: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.facilities.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Add New E-Waste Facility
                </h2>
            }
        >
            <Head title="Add Facility" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border border-gray-200 dark:border-gray-700">
                        <form onSubmit={submit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Facility Name</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                </div>

                                {/* Address */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Full Address</label>
                                    <textarea
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                                        rows="3"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        required
                                    ></textarea>
                                    {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Contact Phone</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        required
                                    />
                                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                                </div>

                                {/* Accepted Items */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Items (Comma separated)</label>
                                    <input
                                        type="text"
                                        placeholder="Mobiles, Laptops, Batteries..."
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                                        value={data.accepted_items}
                                        onChange={e => setData('accepted_items', e.target.value)}
                                        required
                                    />
                                    {errors.accepted_items && <p className="mt-1 text-xs text-red-500">{errors.accepted_items}</p>}
                                </div>

                                {/* Coordinates */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Latitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                                        value={data.latitude}
                                        onChange={e => setData('latitude', e.target.value)}
                                        required
                                    />
                                    {errors.latitude && <p className="mt-1 text-xs text-red-500">{errors.latitude}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Longitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                                        value={data.longitude}
                                        onChange={e => setData('longitude', e.target.value)}
                                        required
                                    />
                                    {errors.longitude && <p className="mt-1 text-xs text-red-500">{errors.longitude}</p>}
                                </div>

                                {/* Operating Hours */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Open Time</label>
                                    <input
                                        type="time"
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                                        value={data.open_time}
                                        onChange={e => setData('open_time', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Close Time</label>
                                    <input
                                        type="time"
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                                        value={data.close_time}
                                        onChange={e => setData('close_time', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={route('admin.facilities.index')}
                                    className="text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
                                >
                                    Save Facility
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
