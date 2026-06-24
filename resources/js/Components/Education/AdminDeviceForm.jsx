import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDeviceForm({ device, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        risk_level: 'Medium',
        harmful_materials: '',
        environmental_impact: '',
        health_effects: '',
        recycling_benefits: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (device) {
            setFormData({
                name: device.name,
                risk_level: device.risk_level,
                harmful_materials: device.harmful_materials.join(', '),
                environmental_impact: device.environmental_impact,
                health_effects: device.health_effects,
                recycling_benefits: device.recycling_benefits,
            });
        }
    }, [device]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const payload = {
            ...formData,
            harmful_materials: formData.harmful_materials.split(',').map(s => s.trim()).filter(s => s !== ''),
        };

        try {
            if (device) {
                await axios.put(`/api/devices/${device.id}`, payload);
            } else {
                await axios.post('/api/devices', payload);
            }
            onSuccess();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
                        {device ? 'Edit Device Info' : 'Add New Device'}
                    </h3>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Device Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-emerald-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Risk Level</label>
                        <select
                            value={formData.risk_level}
                            onChange={(e) => setFormData({ ...formData, risk_level: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Harmful Materials (comma separated)</label>
                        <input
                            type="text"
                            value={formData.harmful_materials}
                            onChange={(e) => setFormData({ ...formData, harmful_materials: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-emerald-500"
                            placeholder="Lead, Mercury, Cadmium"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Environmental Impact</label>
                        <textarea
                            value={formData.environmental_impact}
                            onChange={(e) => setFormData({ ...formData, environmental_impact: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-emerald-500 min-h-[80px]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Health Effects</label>
                        <textarea
                            value={formData.health_effects}
                            onChange={(e) => setFormData({ ...formData, health_effects: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-emerald-500 min-h-[80px]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Recycling Benefits</label>
                        <textarea
                            value={formData.recycling_benefits}
                            onChange={(e) => setFormData({ ...formData, recycling_benefits: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-emerald-500 min-h-[80px]"
                            required
                        />
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-colors shadow-lg disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
