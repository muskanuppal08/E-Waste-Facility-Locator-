import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Reviews({ reviews }) {
    const { flash } = usePage().props;
    const [statusFilter, setStatusFilter] = useState('all'); // all, pending, approved

    const handleApprove = (id) => {
        if (confirm('Are you sure you want to approve this review?')) {
            router.post(route('admin.reviews.approve', id), {}, {
                preserveScroll: true
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
            router.delete(route('admin.reviews.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const filteredReviews = reviews.filter(review => {
        if (statusFilter === 'pending') return !review.approved;
        if (statusFilter === 'approved') return review.approved;
        return true;
    });

    const renderStars = (rating) => {
        return (
            <div className="flex items-center space-x-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`h-4.5 w-4.5 ${
                            star <= rating ? 'text-amber-400 fill-current' : 'text-slate-300 dark:text-slate-600'
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Review Moderation Dashboard
                </h2>
            }
        >
            <Head title="Manage Reviews" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Flash status messages */}
                    {flash?.status && (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl text-sm font-semibold flex items-center space-x-2 shadow-sm animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{flash.status}</span>
                        </div>
                    )}

                    {/* Filter controls */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Review Submissions</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Moderating reviews filters public ratings on locator search.</p>
                        </div>
                        
                        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                                    statusFilter === 'all'
                                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                            >
                                All ({reviews.length})
                            </button>
                            <button
                                onClick={() => setStatusFilter('pending')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                                    statusFilter === 'pending'
                                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                            >
                                Pending ({reviews.filter(r => !r.approved).length})
                            </button>
                            <button
                                onClick={() => setStatusFilter('approved')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                                    statusFilter === 'approved'
                                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                            >
                                Approved ({reviews.filter(r => r.approved).length})
                            </button>
                        </div>
                    </div>

                    {/* Table listing */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
                        {filteredReviews.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-slate-900/60">
                                        <tr>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reviewer</th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Center / Facility</th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Review Comment</th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                            <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700/60">
                                        {filteredReviews.map((review) => (
                                            <tr key={review.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                                {/* Reviewer */}
                                                <td className="px-6 py-4.5 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                                                        {review.user ? review.user.name : 'Deleted User'}
                                                    </div>
                                                    <div className="text-xs text-slate-400">
                                                        {review.user ? review.user.email : 'N/A'}
                                                    </div>
                                                </td>

                                                {/* Facility */}
                                                <td className="px-6 py-4.5 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                                                        {review.ewaste_center ? review.ewaste_center.name : 'Deleted Center'}
                                                    </div>
                                                    <div className="text-xs text-slate-400">
                                                        {review.ewaste_center ? `${review.ewaste_center.city}, ${review.ewaste_center.state}` : 'N/A'}
                                                    </div>
                                                </td>

                                                {/* Rating */}
                                                <td className="px-6 py-4.5 whitespace-nowrap">
                                                    {renderStars(review.rating)}
                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1 block">
                                                        Score: {review.rating} / 5
                                                    </span>
                                                </td>

                                                {/* Comment */}
                                                <td className="px-6 py-4.5">
                                                    <p className="text-sm text-gray-700 dark:text-slate-300 max-w-xs md:max-w-sm whitespace-normal break-words">
                                                        {review.comment || <span className="text-slate-400 italic">No comment provided</span>}
                                                    </p>
                                                    <span className="text-[10px] text-slate-400 block mt-1">
                                                        Submitted on {new Date(review.created_at).toLocaleDateString()}
                                                    </span>
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-4.5 whitespace-nowrap">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                        review.approved
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                            : 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400'
                                                    }`}>
                                                        {review.approved ? 'Approved' : 'Pending'}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4.5 whitespace-nowrap text-right text-sm font-semibold">
                                                    <div className="flex justify-end items-center space-x-2.5">
                                                        {!review.approved && (
                                                            <button
                                                                onClick={() => handleApprove(review.id)}
                                                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                                                            >
                                                                Approve
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(review.id)}
                                                            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                                No reviews found matching the selected status filter.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
