"use client";

import React, { useEffect } from 'react';
import { Info } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { getCities } from '@/api/client';
import { showError } from '@/utils/toast';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
  population: number;
  aqi: number;
}

const formatPopulation = (value: number) =>
  new Intl.NumberFormat("en", { notation: "compact" }).format(value);

// Fix for Leaflet marker icons in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// MapController to safely manage markers and view updates using raw Leaflet
const MapController = ({ 
  center, 
  zoom, 
  cities, 
  selectedCity, 
  onReady, 
  onSelectCity 
}: { 
  center: [number, number]; 
  zoom: number; 
  cities: City[];
  selectedCity: City | null;
  onReady: () => void;
  onSelectCity: (city: City) => void;
}) => {
  const map = useMap();
  const markerLayerRef = React.useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!map) return;

    // Initialize the layer group for markers if it doesn't exist
    if (!markerLayerRef.current) {
      markerLayerRef.current = L.layerGroup().addTo(map);
    }

    const markerLayer = markerLayerRef.current;
    
    // Clear existing markers
    markerLayer.clearLayers();

    // Add new markers manually
    cities.forEach((city) => {
      const isSelected = selectedCity?.id === city.id;
      const marker = L.marker([city.lat, city.lng], {
        icon: isSelected ? selectedIcon : new L.Icon.Default()
      });

      // Bind popup with manual content to avoid React rendering issues inside Leaflet
      marker.bindPopup(`
        <div style="font-family: sans-serif;">
          <div style="font-weight: bold; font-size: 14px;">${city.name}</div>
          <div style="font-size: 12px; color: #64748b;">Population ${new Intl.NumberFormat("en", { notation: "compact" }).format(city.population)}</div>
          <div style="font-size: 12px; color: #64748b;">Baseline AQI ${city.aqi}</div>
        </div>
      `);

      marker.on('click', () => {
        onSelectCity(city);
      });

      marker.addTo(markerLayer);
    });

    // Update view
    map.setView(center, zoom, { animate: true });
    
    onReady();

    // Cleanup on unmount or before next effect
    return () => {
      // We don't clear here to avoid the '_leaflet_events' error during fast updates
      // Instead, we clear at the start of the next effect run
    };
  }, [center, map, zoom, cities, selectedCity, onReady, onSelectCity]);

  // Final cleanup on actual component unmount
  useEffect(() => {
    return () => {
      if (map && markerLayerRef.current) {
        try {
          map.removeLayer(markerLayerRef.current);
          markerLayerRef.current = null;
        } catch (e) {
          console.warn("Cleanly handled map cleanup error:", e);
        }
      }
    };
  }, [map]);

  return null;
};

const selectedMarkerSvg = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
    <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 23 12.5 41 12.5 41C12.5 41 25 23 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="#10b981" stroke="#0f172a" stroke-width="1"/>
    <circle cx="12.5" cy="12.5" r="4.5" fill="#ffffff"/>
  </svg>`
);

const selectedIcon = new L.Icon({
  iconUrl: `data:image/svg+xml,${selectedMarkerSvg}`,
  iconRetinaUrl: `data:image/svg+xml,${selectedMarkerSvg}`,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapPanel = ({ selectedCity, onSelectCity }: { selectedCity: City | null, onSelectCity: (city: City) => void }) => {
  const [isMounted, setIsMounted] = React.useState(false);
  const [mapReady, setMapReady] = React.useState(false);
  const { data: citiesData, isLoading, error } = useQuery({
    queryKey: ["cities"],
    queryFn: getCities,
    staleTime: 5 * 60 * 1000,
  });

  const cities = (citiesData as City[]) || [];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      showError(error instanceof Error ? error.message : "Failed to load cities.");
    }
  }, [error]);

  useEffect(() => {
    if (!selectedCity && cities.length > 0) {
      onSelectCity(cities[0]);
    }
  }, [cities, onSelectCity, selectedCity]);

  const activeCity = selectedCity || (cities.length > 0 ? cities[0] : null);
  
  // Safety check for map center
  const isValidCoordinate = (lat: any, lng: any): boolean => 
    typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);

  const mapCenter: [number, number] = activeCity && isValidCoordinate(activeCity.lat, activeCity.lng) 
    ? [activeCity.lat, activeCity.lng] 
    : [20, 77]; // Default to center of India if no city

  const mapZoom = activeCity ? 5 : 4;

  return (
    <Card className="relative w-full h-[500px] overflow-hidden bg-slate-50 border-slate-200 shadow-sm group">
      <div className="absolute inset-0 z-0">
        {isMounted ? (
          <MapContainer 
            center={mapCenter}
            zoom={mapZoom}
            className="h-full w-full"
            scrollWheelZoom={true}
            zoomControl={false}
            {...({ "data-map-ready": mapReady } as any)}
          >
            <TileLayer
              {...({
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              } as any)}
            />
            
            <MapController 
              center={mapCenter} 
              zoom={mapZoom} 
              cities={cities}
              selectedCity={selectedCity}
              onReady={() => setMapReady(true)} 
              onSelectCity={onSelectCity}
            />
          </MapContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400">
            Initializing Map...
          </div>
        )}
      </div>

      {/* City Info Overlay */}
      <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-72 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white shadow-xl z-20">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {activeCity ? activeCity.name : "Select a city"}
            </h3>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Selected Region</p>
          </div>
          <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg">
            <Info size={16} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Population</p>
            <p className="text-sm font-semibold text-slate-700">
              {activeCity ? formatPopulation(activeCity.population) : "--"}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Current AQI</p>
            <p className="text-sm font-semibold text-slate-700">
              {activeCity ? activeCity.aqi : "--"}
            </p>
          </div>
        </div>
      </div>

      <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white shadow-sm text-[10px] font-bold text-slate-500 uppercase tracking-widest z-20">
        {isLoading ? "Loading Cities" : "Live Satellite View"}
      </div>
    </Card>
  );
};

export default MapPanel;
