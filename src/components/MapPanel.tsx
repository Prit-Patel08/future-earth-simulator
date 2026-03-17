"use client";

import React from 'react';
import { MapPin, Info } from 'lucide-react';
import { Card } from "@/components/ui/card";

interface City {
  id: string;
  name: string;
  population: string;
  currentAQI: number;
  coords: { x: string, y: string };
}

const cities: City[] = [
  { id: '1', name: 'New York', population: '8.4M', currentAQI: 42, coords: { x: '25%', y: '35%' } },
  { id: '2', name: 'London', population: '8.9M', currentAQI: 38, coords: { x: '48%', y: '30%' } },
  { id: '3', name: 'Tokyo', population: '13.9M', currentAQI: 55, coords: { x: '85%', y: '40%' } },
  { id: '4', name: 'Paris', population: '2.1M', currentAQI: 45, coords: { x: '47%', y: '35%' } },
];

const MapPanel = ({ selectedCity, onSelectCity }: { selectedCity: City, onSelectCity: (city: City) => void }) => {
  return (
    <Card className="relative w-full h-[500px] overflow-hidden bg-slate-50 border-slate-200 shadow-sm group">
      {/* Map Background Placeholder */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-40 grayscale hover:grayscale-0 transition-all duration-700" />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* City Markers */}
      {cities.map((city) => (
        <button
          key={city.id}
          onClick={() => onSelectCity(city)}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125 z-10 ${
            selectedCity.id === city.id ? 'scale-125' : 'scale-100'
          }`}
          style={{ left: city.coords.x, top: city.coords.y }}
        >
          <div className={`p-1.5 rounded-full shadow-lg ${
            selectedCity.id === city.id ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20' : 'bg-white text-emerald-600'
          }`}>
            <MapPin size={20} />
          </div>
        </button>
      ))}

      {/* City Info Overlay */}
      <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-72 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white shadow-xl z-20">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{selectedCity.name}</h3>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Selected Region</p>
          </div>
          <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg">
            <Info size={16} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Population</p>
            <p className="text-sm font-semibold text-slate-700">{selectedCity.population}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Current AQI</p>
            <p className="text-sm font-semibold text-slate-700">{selectedCity.currentAQI}</p>
          </div>
        </div>
      </div>

      <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white shadow-sm text-[10px] font-bold text-slate-500 uppercase tracking-widest z-20">
        Live Satellite View
      </div>
    </Card>
  );
};

export default MapPanel;