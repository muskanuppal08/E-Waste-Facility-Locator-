import { MapContainer as LeafletMap, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Fix for default marker icons in Leaflet + React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icon for selected facility
const selectedIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Component to handle map view updates
function MapUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo([center.lat, center.lng], 13);
        }
    }, [center, map]);
    return null;
}

export default function MapContainer({ userLocation, facilities, selectedFacility, onMarkerClick }) {
    return (
        <div className="h-full w-full">
            <LeafletMap 
                center={[userLocation.lat, userLocation.lng]} 
                zoom={12} 
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <MapUpdater center={selectedFacility ? { lat: selectedFacility.latitude, lng: selectedFacility.longitude } : userLocation} />

                {/* User Location Marker */}
                <Marker position={[userLocation.lat, userLocation.lng]}>
                    <Popup>Your current location</Popup>
                </Marker>

                {/* Facility Markers */}
                {facilities.map(facility => (
                    <Marker 
                        key={facility.id} 
                        position={[facility.latitude, facility.longitude]}
                        icon={selectedFacility?.id === facility.id ? selectedIcon : DefaultIcon}
                        eventHandlers={{
                            click: () => onMarkerClick(facility),
                        }}
                    >
                        <Popup>
                            <div className="p-1">
                                <h4 className="font-bold text-gray-900">{facility.name}</h4>
                                <p className="text-xs text-gray-600 mb-2">{facility.address}</p>
                                <a 
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-emerald-600 font-bold hover:underline"
                                >
                                    Get Directions
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </LeafletMap>
        </div>
    );
}
