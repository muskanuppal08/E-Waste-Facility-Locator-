export default function FacilityCard({ facility, selected, onClick }) {
    return (
        <div 
            onClick={onClick}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selected 
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
            }`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white leading-tight">
                        {facility.name}
                    </h4>
                    {facility.rating > 0 && (
                        <div className="flex items-center mt-1 text-amber-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-[10px] font-bold ml-1">{parseFloat(facility.rating).toFixed(1)} ({facility.total_reviews})</span>
                        </div>
                    )}
                </div>
                {facility.distance && (
                    <span className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">
                        {parseFloat(facility.distance).toFixed(1)} km
                    </span>
                )}
            </div>
            
            <p className="text-xs text-gray-500 mt-1 mb-3">
                {facility.address}
            </p>

            <div className="flex flex-wrap gap-1 mb-3">
                {facility.accepted_items_array?.map((item, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md">
                        {item}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center space-x-2">
                    <span className={`h-2 w-2 rounded-full ${facility.is_open_now ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                        {facility.is_open_now ? 'Open Now' : 'Closed'}
                    </span>
                </div>
                
                <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Get Directions
                </a>
            </div>
        </div>
    );
}
