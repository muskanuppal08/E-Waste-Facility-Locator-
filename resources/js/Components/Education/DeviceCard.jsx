export default function DeviceCard({ device, isAdmin, onClick, onEdit, onDelete }) {
    const riskColors = {
        High: 'bg-red-500',
        Medium: 'bg-amber-500',
        Low: 'bg-emerald-500'
    };

    const riskBorders = {
        High: 'hover:border-red-500',
        Medium: 'hover:border-amber-500',
        Low: 'hover:border-emerald-500'
    };

    return (
        <div 
            onClick={onClick}
            className={`group relative p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-transparent ${riskBorders[device.risk_level]} transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1`}
        >
            <div className="flex flex-col items-center text-center">
                <div className={`mb-4 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-transform group-hover:scale-110`}>
                    {/* Placeholder for icons based on device.icon */}
                    <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{device.name}</h4>
                <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${riskColors[device.risk_level]}`}></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{device.risk_level} Risk</span>
                </div>
            </div>

            {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={onEdit}
                        className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                    <button 
                        onClick={onDelete}
                        className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}
