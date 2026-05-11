import { useState } from 'react';

export default function SearchFilters({ onSearch, filters, setFilters }) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(inputValue);
    };

    const deviceTypes = ['All', 'Mobiles', 'Laptops', 'Batteries', 'Appliances', 'Televisions'];

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Search by City or PIN code..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                    />
                </div>
                <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                >
                    Search
                </button>
            </form>

            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2 mr-4">
                    <button
                        onClick={() => setFilters({ ...filters, openNow: !filters.openNow })}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                            filters.openNow 
                            ? 'bg-emerald-600 text-white shadow-md' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                        }`}
                    >
                        Open Now
                    </button>
                </div>

                <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>

                <div className="flex flex-wrap gap-2">
                    {deviceTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => setFilters({ ...filters, deviceType: type })}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                                filters.deviceType === type 
                                ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow-md' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <div className="flex-1"></div>

                <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 font-medium">Sort by:</span>
                    <select 
                        value={filters.sortBy || 'distance'}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                        className="text-xs border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-emerald-500 focus:border-emerald-500 py-1"
                    >
                        <option value="distance">Nearest</option>
                        <option value="rating">Highest Rated</option>
                        <option value="all">Show All</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
