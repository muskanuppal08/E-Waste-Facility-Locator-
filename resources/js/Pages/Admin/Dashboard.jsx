import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import EducationSection from '@/Components/Education/EducationSection';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-lg font-bold mb-4">Welcome to the Administrator Portal</h3>
                            <p className="text-slate-400">
                                You have full access to manage recycling facilities, view user reports, and monitor system performance.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <div className="p-6 bg-slate-700/50 rounded-xl border border-slate-600">
                                    <h4 className="font-bold text-cyan-400">Facilities</h4>
                                    <p className="text-2xl font-bold">24</p>
                                    <p className="text-xs text-slate-500 mt-1">Total active centers</p>
                                </div>
                                <div className="p-6 bg-slate-700/50 rounded-xl border border-slate-600">
                                    <h4 className="font-bold text-emerald-400">Users</h4>
                                    <p className="text-2xl font-bold">1,240</p>
                                    <p className="text-xs text-slate-500 mt-1">Registered recyclers</p>
                                </div>
                                <div className="p-6 bg-slate-700/50 rounded-xl border border-slate-600">
                                    <h4 className="font-bold text-amber-400">Reports</h4>
                                    <p className="text-2xl font-bold">12</p>
                                    <p className="text-xs text-slate-500 mt-1">Pending verification</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <EducationSection isAdmin={true} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
