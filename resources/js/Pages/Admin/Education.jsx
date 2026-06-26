import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import EducationSection from '@/Components/Education/EducationSection';

export default function Education() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    E-Waste Educational Content Manager
                </h2>
            }
        >
            <Head title="Manage Education" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <EducationSection isAdmin={true} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
