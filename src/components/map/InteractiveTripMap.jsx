import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { formatCurrency } from '../../utils/currency';
import { Bed, Utensils, Compass, Navigation2, Layers } from 'lucide-react';

const DESTINATION_COORDINATES = {
  lagos: [6.5244, 3.3792],
  abuja: [9.0765, 7.3986],
  abeokuta: [7.1475, 3.3619],
  'cape-town': [-33.9249, 18.4241],
  nairobi: [-1.2921, 36.8219],
  accra: [5.6037, -0.1870],
  tokyo: [35.6762, 139.6503],
  bali: [-8.4095, 115.1889],
  paris: [48.8566, 2.3522],
  london: [51.5074, -0.1278],
  dubai: [25.2048, 55.2708],
  'new-york': [40.7128, -74.0060],
  cairo: [30.0444, 31.2357],
  rome: [41.9028, 12.4964],
};

export function InteractiveTripMap({
  destination,
  places = [],
  onSelectPlace,
  currency = 'USD',
  height = '420px',
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const [activeTypeFilter, setActiveTypeFilter] = useState('all');

  const destId = destination?.destinationId || destination?.id || 'lagos';
  const centerCoords = React.useMemo(() => {
    return (
      DESTINATION_COORDINATES[destId.toLowerCase()] ||
      (destination?.lat && destination?.lng ? [destination.lat, destination.lng] : [6.5244, 3.3792])
    );
  }, [destId, destination]);

  // 1. Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: centerCoords,
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      // Beautiful, fast, modern tile layer (CartoDB Voyager)
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 19,
          subdomains: 'abcd',
        }
      ).addTo(map);

      // Attribution
      L.control
        .attribution({ position: 'bottomright', prefix: '© OpenStreetMap contributors' })
        .addTo(map);

      // Zoom control
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView(centerCoords, 13);
    }

    return () => {
      // Map stays alive until unmounted
    };
  }, [centerCoords]);

  // 2. Render Place Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const filteredPlaces = activeTypeFilter === 'all'
      ? places
      : places.filter((p) => p.type === activeTypeFilter);

    filteredPlaces.forEach((place, index) => {
      // Use exact coordinates or compute radial offset from center
      const lat = place.location?.lat || centerCoords[0] + (Math.sin(index * 1.3) * 0.02);
      const lng = place.location?.lng || centerCoords[1] + (Math.cos(index * 1.3) * 0.025);

      const isHotel = place.type === 'hotel';
      const isRest = place.type === 'restaurant';
      const pinColor = isHotel ? '#1f4a35' : isRest ? '#d97706' : '#6366f1';
      const emoji = isHotel ? '🏨' : isRest ? '🍲' : '🎟️';

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background-color: ${pinColor};
            color: white;
            padding: 4px 8px;
            border-radius: 9999px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            border: 2px solid white;
            font-size: 11px;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 3px;
            white-space: nowrap;
            cursor: pointer;
            transform: translate(-50%, -50%);
          ">
            <span>${emoji}</span>
            <span>${formatCurrency(place.estimatedPrice, currency)}</span>
          </div>
        `,
        iconSize: [0, 0],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Popup with place info
      const popupHtml = `
        <div style="font-family: inherit; width: 200px; padding: 2px;">
          <img src="${place.imageUrl}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />
          <h4 style="font-size: 13px; font-weight: 800; margin: 0 0 2px 0; color: #111110;">${place.name}</h4>
          <p style="font-size: 11px; color: #8a8680; margin: 0 0 4px 0;">${place.category || place.type}</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 12px; font-weight: 800; color: #1f4a35;">${formatCurrency(place.estimatedPrice, currency)}</span>
            <span style="font-size: 11px; font-weight: 700; color: #111110;">⭐ ${place.rating || 4.7}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { closeButton: false, offset: [0, -10] });

      marker.on('click', () => {
        if (onSelectPlace) {
          onSelectPlace(place);
        }
      });

      markersGroup.addLayer(marker);
    });
  }, [places, activeTypeFilter, currency, centerCoords, onSelectPlace]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(centerCoords, 13, { duration: 1.2 });
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#e4e1db] shadow-xs bg-[#f5f2ed]">
      {/* Map Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height }} />

      {/* Floating Filter Chips on Map */}
      <div className="absolute top-3 left-3 z-[1000] flex gap-1.5 bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-md border border-[#e4e1db]">
        {[
          { id: 'all', label: 'All', icon: Layers },
          { id: 'hotel', label: 'Stays', icon: Bed },
          { id: 'restaurant', label: 'Food', icon: Utensils },
          { id: 'activity', label: 'Sights', icon: Compass },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTypeFilter(tab.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-700 flex items-center gap-1 transition-all cursor-pointer ${
              activeTypeFilter === tab.id
                ? 'bg-[#1f4a35] text-white shadow-2xs'
                : 'text-[#8a8680] hover:text-[#111110]'
            }`}
          >
            <tab.icon size={12} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Recenter Button */}
      <button
        onClick={handleRecenter}
        className="absolute top-3 right-3 z-[1000] w-9 h-9 bg-white/95 backdrop-blur-md rounded-xl flex items-center justify-center text-[#1f4a35] shadow-md border border-[#e4e1db] hover:bg-white transition-all cursor-pointer"
        title="Recenter Map"
      >
        <Navigation2 size={16} />
      </button>
    </div>
  );
}
