import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import MapContainer from './Partials/MapContainer';
import FacilityCard from './Partials/FacilityCard';
import SearchFilters from './Partials/SearchFilters';

export default function Locator({ auth }) {
    const [userLocation, setUserLocation] = useState(null);
    const [facilities, setFacilities] = useState([]);
    const [filteredFacilities, setFilteredFacilities] = useState([]);
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        openNow: false,
        deviceType: 'All',
    });

    // Detect user location
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    fetchNearbyFacilities(latitude, longitude);
                },
                (error) => {
                    console.error("Error detecting location:", error);
                    // Fallback to Delhi coordinates for demo
                    const fallback = { lat: 28.6139, lng: 77.2090 };
                    setUserLocation(fallback);
                    fetchNearbyFacilities(fallback.lat, fallback.lng);
                }
            );
        }
    }, []);

    const fetchNearbyFacilities = async (lat, lng, sortBy = 'distance') => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/facilities/nearby?lat=${lat}&lng=${lng}&sort=${sortBy}`);
            setFacilities(response.data);
            setFilteredFacilities(response.data);
        } catch (error) {
            console.error("Error fetching facilities:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userLocation) {
            fetchNearbyFacilities(userLocation.lat, userLocation.lng, filters.sortBy);
        }
    }, [filters.sortBy, userLocation]);

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (!query) {
            setFilteredFacilities(facilities);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`/api/facilities/search?query=${query}`);
            setFilteredFacilities(response.data);
        } catch (error) {
            console.error("Error searching facilities:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let result = [...facilities];
        
        if (filters.openNow) {
            result = result.filter(f => f.is_open_now);
        }
        
        if (filters.deviceType !== 'All') {
            result = result.filter(f => f.accepted_items.includes(filters.deviceType));
        }
        
        setFilteredFacilities(result);
    }, [filters, facilities]);

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">E-Waste Facility Locator</h2>}
        >
            <Head title="Facility Locator" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <SearchFilters 
                                onSearch={handleSearch} 
                                filters={filters} 
                                setFilters={setFilters} 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                        {/* Map Section */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden relative border border-gray-200 dark:border-gray-700">
                            {userLocation ? (
                                <MapContainer 
                                    userLocation={userLocation} 
                                    facilities={filteredFacilities} 
                                    selectedFacility={selectedFacility}
                                    onMarkerClick={setSelectedFacility}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    Detecting your location...
                                </div>
                            )}
                        </div>

                        {/* List Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col border border-gray-200 dark:border-gray-700">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Nearby Facilities</h3>
                                <p className="text-sm text-gray-500">{filteredFacilities.length} centers found</p>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {loading ? (
                                    <div className="text-center py-10 text-gray-500">Searching...</div>
                                ) : filteredFacilities.length > 0 ? (
                                    filteredFacilities.map(facility => (
                                        <FacilityCard 
                                            key={facility.id} 
                                            facility={facility} 
                                            selected={selectedFacility?.id === facility.id}
                                            onClick={() => setSelectedFacility(facility)}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-gray-500">No facilities found in this area.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
