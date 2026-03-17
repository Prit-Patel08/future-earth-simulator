"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import MapPanel from '@/components/MapPanel';
import ResultsPanel from '@/components/ResultsPanel';
import SimulationControls from '@/components/SimulationControls';
import ChartsPanel from '@/components/ChartsPanel';
import FuturePredictionCard from '@/components/FuturePredictionCard';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess } from '@/utils/toast';

const Index = () => {
  const [selectedCity, setSelectedCity] = useState({ 
    id: '1', 
    name: 'New York', 
    population: '8.4M', 
    currentAQI: 42, 
    coords: { x: '25%', y: '35%' } 
  });

  const [policyValues, setPolicyValues] = useState({
    ev: 45,
    trees: 60,
    renewable: 30,
    transport: 55
  });

  const [results, setResults] = useState({
    co2: 24,
    aqi: 18,
    temp: -0.8,
    score: 72
  });

  const handlePolicyChange = (key: string, val: number[]) => {
    setPolicyValues(prev => ({ ...prev, [key]: val[0] }));
  };

  const runSimulation = () => {
    // Mock simulation logic
    const newCo2 = Math.floor((policyValues.ev + policyValues.renewable + policyValues.transport) / 4);
    const newAqi = Math.floor((policyValues.trees + policyValues.ev) / 3);
    const newScore = Math.floor((policyValues.ev + policyValues.trees + policyValues.renewable + policyValues.transport) / 4);
    
    setResults({
      co2: newCo2,
      aqi: newAqi,
      temp: -(newCo2 / 20).toFixed(1) as any,
      score: newScore
    });

    showSuccess(`Simulation complete for ${selectedCity.name}!`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Environmental Dashboard
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Simulating a greener future for <span className="text-emerald-600 font-bold">{selectedCity.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Online</span>
          </div>
        </div>

        {/* Top Section: Map & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MapPanel selectedCity={selectedCity} onSelectCity={setSelectedCity} />
          </div>
          <div className="lg:col-span-1">
            <ResultsPanel {...results} />
          </div>
        </div>

        {/* Simulation Controls */}
        <SimulationControls 
          values={policyValues} 
          onChange={handlePolicyChange} 
          onRun={runSimulation} 
        />

        {/* Data Visualization */}
        <ChartsPanel />

        {/* Future Prediction */}
        <FuturePredictionCard />

        <footer className="pt-12 pb-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              © 2024 Future Earth Simulator. Data provided by Global Climate Initiative.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-slate-400 hover:text-emerald-600">Privacy Policy</a>
              <a href="#" className="text-sm text-slate-400 hover:text-emerald-600">Terms of Service</a>
              <a href="#" className="text-sm text-slate-400 hover:text-emerald-600">Contact</a>
            </div>
          </div>
          <MadeWithDyad />
        </footer>
      </main>
    </div>
  );
};

export default Index;