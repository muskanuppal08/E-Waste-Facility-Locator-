export default function DeviceModal({ device, onClose }) {
    if (!device) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                <div className="relative p-8 overflow-y-auto max-h-[90vh]">
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" />
                        </svg>
                    </button>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl text-emerald-600">
                            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white">{device.name}</h2>
                            <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                device.risk_level === 'High' ? 'bg-red-100 text-red-600' : 
                                device.risk_level === 'Medium' ? 'bg-amber-100 text-amber-600' : 
                                'bg-emerald-100 text-emerald-600'
                            }`}>
                                {device.risk_level} Risk Level
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Harmful Materials */}
                        <div className="space-y-3">
                            <h5 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="h-5 w-5 bg-red-100 dark:bg-red-900/30 text-red-600 rounded flex items-center justify-center text-[10px]">1</span>
                                Harmful Materials
                            </h5>
                            <div className="flex flex-wrap gap-2">
                                {device.harmful_materials?.map((material, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm">
                                        {material}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Recycling Benefits */}
                        <div className="space-y-3">
                            <h5 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="h-5 w-5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded flex items-center justify-center text-[10px]">2</span>
                                Recycling Benefits
                            </h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {device.recycling_benefits}
                            </p>
                        </div>

                        {/* Environmental Impact */}
                        <div className="space-y-3">
                            <h5 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="h-5 w-5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded flex items-center justify-center text-[10px]">3</span>
                                Environmental Impact
                            </h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {device.environmental_impact}
                            </p>
                        </div>

                        {/* Health Effects */}
                        <div className="space-y-3">
                            <h5 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="h-5 w-5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded flex items-center justify-center text-[10px]">4</span>
                                Human Health Effects
                            </h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {device.health_effects}
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <button 
                            onClick={onClose}
                            className="w-full py-4 bg-slate-900 dark:bg-emerald-600 text-white font-bold rounded-2xl hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors shadow-lg"
                        >
                            Got it, Thanks!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
