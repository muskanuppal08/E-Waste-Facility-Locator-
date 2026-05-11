import { useState, useEffect } from 'react';
import axios from 'axios';
import DeviceCard from './DeviceCard';
import DeviceModal from './DeviceModal';
import AdminDeviceForm from './AdminDeviceForm';

export default function EducationSection({ isAdmin }) {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingDevice, setEditingDevice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/devices');
            setDevices(response.data);
        } catch (error) {
            console.error('Error fetching devices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddDevice = () => {
        setEditingDevice(null);
        setIsEditModalOpen(true);
    };

    const handleEditDevice = (device, e) => {
        e.stopPropagation();
        setEditingDevice(device);
        setIsEditModalOpen(true);
    };

    const handleDeleteDevice = async (id, e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this device?')) {
            try {
                await axios.delete(`/api/devices/${id}`);
                fetchDevices();
            } catch (error) {
                console.error('Error deleting device:', error);
            }
        }
    };

    const filteredDevices = devices.filter(d => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">E-Waste Education</h3>
                    <p className="text-sm text-gray-500 mt-1">Learn about the impact of electronic waste</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search devices..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 w-full md:w-64"
                        />
                        <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    {isAdmin && (
                        <button
                            onClick={handleAddDevice}
                            className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-sm"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            <div className="p-6">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {filteredDevices.map(device => (
                            <DeviceCard
                                key={device.id}
                                device={device}
                                isAdmin={isAdmin}
                                onClick={() => setSelectedDevice(device)}
                                onEdit={(e) => handleEditDevice(device, e)}
                                onDelete={(e) => handleDeleteDevice(device.id, e)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {selectedDevice && (
                <DeviceModal
                    device={selectedDevice}
                    onClose={() => setSelectedDevice(null)}
                />
            )}

            {isEditModalOpen && (
                <AdminDeviceForm
                    device={editingDevice}
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={() => {
                        setIsEditModalOpen(false);
                        fetchDevices();
                    }}
                />
            )}
        </div>
    );
}
