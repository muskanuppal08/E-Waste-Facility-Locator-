import { useState, useEffect } from 'react';
import axios from 'axios';

export default function FacilityDetails({ facility, onClose, onReviewSubmitted }) {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/facilities/${facility.id}`);
            setDetail(response.data);
        } catch (err) {
            console.error("Error fetching facility details:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (facility) {
            fetchDetails();
            setSuccess('');
            setError('');
            setComment('');
            setRating(5);
        }
    }, [facility]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            await axios.post(`/api/facilities/${facility.id}/review`, {
                rating,
                comment
            });
            setSuccess('Review submitted successfully!');
            setComment('');
            setRating(5);
            // Refresh details
            await fetchDetails();
            // Trigger parent update (to update list ratings)
            if (onReviewSubmitted) {
                onReviewSubmitted();
            }
        } catch (err) {
            console.error("Error submitting review:", err);
            setError(err.response?.data?.message || 'Failed to submit review. Make sure you are logged in.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!facility) return null;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-2">
                <button 
                    onClick={onClose}
                    className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">
                        Facility Details
                    </h3>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Basic Info */}
                <div>
                    <div className="flex justify-between items-start">
                        <h4 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            {facility.name}
                        </h4>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                            facility.is_open_now 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                            {facility.is_open_now ? 'Open Now' : 'Closed'}
                        </span>
                    </div>

                    {/* Ratings overview */}
                    <div className="flex items-center space-x-1.5 mt-2">
                        <div className="flex items-center text-amber-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg 
                                    key={star}
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className={`h-4.5 w-4.5 ${star <= Math.round(detail?.rating || facility.rating || 0) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            {parseFloat(detail?.rating || facility.rating || 0).toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                            ({detail?.total_reviews || facility.total_reviews || 0} reviews)
                        </span>
                    </div>
                </div>

                {/* Contact & Location Details */}
                <div className="space-y-3 bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-start space-x-3">
                        <svg className="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-4 0 3 3 0 014 0z" />
                        </svg>
                        <div className="text-sm">
                            <p className="font-semibold text-gray-850 dark:text-gray-250">Address</p>
                            <p className="text-gray-650 dark:text-gray-400">{facility.address}</p>
                            {(facility.city || facility.state || facility.pincode) && (
                                <p className="text-gray-650 dark:text-gray-450 font-medium">
                                    {[facility.city, facility.state, facility.pincode].filter(Boolean).join(', ')}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <svg className="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <div className="text-sm">
                            <p className="font-semibold text-gray-850 dark:text-gray-250">Phone</p>
                            <p className="text-gray-650 dark:text-gray-400">{facility.phone}</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <svg className="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm">
                            <p className="font-semibold text-gray-850 dark:text-gray-250">Operating Hours</p>
                            <p className="text-gray-650 dark:text-gray-400">
                                {facility.open_time ? facility.open_time.substring(0, 5) : '09:00'} - {facility.close_time ? facility.close_time.substring(0, 5) : '18:00'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Accepted Device Types */}
                <div>
                    <h5 className="text-sm font-bold text-gray-850 dark:text-gray-200 mb-2">Accepted Device Types</h5>
                    <div className="flex flex-wrap gap-1.5">
                        {facility.accepted_items_array?.map((item, idx) => (
                            <span 
                                key={idx} 
                                className="text-xs px-3 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30 rounded-xl font-medium"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Get Directions Button */}
                <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition duration-200 text-sm shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 gap-2 cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Get Directions on Google Maps
                </a>

                <hr className="border-gray-150 dark:border-gray-700" />

                {/* Reviews Section */}
                <div className="space-y-4">
                    <h5 className="text-sm font-extrabold text-gray-900 dark:text-white">
                        Reviews & Ratings ({detail?.reviews?.length || 0})
                    </h5>

                    {loading ? (
                        <div className="text-center py-4 text-xs text-gray-500">Loading reviews...</div>
                    ) : detail?.reviews && detail.reviews.length > 0 ? (
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                            {detail.reviews.map((rev) => (
                                <div key={rev.id} className="p-3 bg-gray-50 dark:bg-gray-900/25 rounded-2xl border border-gray-100/50 dark:border-gray-800">
                                    <div className="flex justify-between items-start">
                                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                                            {rev.user?.name || 'Anonymous User'}
                                        </p>
                                        <div className="flex text-amber-500">
                                            {Array.from({ length: rev.rating }).map((_, i) => (
                                                <svg key={i} className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{rev.comment}</p>
                                    <p className="text-[10px] text-gray-400 mt-2 font-medium">
                                        {new Date(rev.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
                    )}
                </div>

                <hr className="border-gray-150 dark:border-gray-700" />

                {/* Add Review Form */}
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white">Write a Review</h5>

                    {success && <div className="text-xs font-semibold text-green-600 p-2.5 bg-green-50 dark:bg-green-950/20 rounded-xl">{success}</div>}
                    {error && <div className="text-xs font-semibold text-red-600 p-2.5 bg-red-50 dark:bg-red-950/20 rounded-xl">{error}</div>}

                    {/* Stars Selector */}
                    <div>
                        <label className="block text-xs text-gray-500 font-bold mb-1">Your Rating</label>
                        <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="p-1 hover:scale-115 transition duration-150 cursor-pointer text-amber-500 focus:outline-none"
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className={`h-7 w-7 ${star <= rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Review text */}
                    <div>
                        <label htmlFor="comment" className="block text-xs text-gray-500 font-bold mb-1">Your Comment</label>
                        <textarea
                            id="comment"
                            rows="3"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share details of your experience at this center..."
                            className="w-full text-xs rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                            required
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:hover:bg-slate-100 dark:text-slate-900 text-white rounded-xl text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                    >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    );
}
