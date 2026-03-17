"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import MapPanel from '@/components/MapPanel';
import ResultsPanel from '@/components/ResultsPanel';
import SimulationControls from '@/components/SimulationControls';
import ChartsPanel from '@/components/ChartsPanel';
import FuturePredictionCard from '@/components/FuturePredictionCard';
import SimulationHistory from '@/components/SimulationHistory';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { runSimulation } from '@/api/client';
import { showError, showSuccess } from '@/utils/toast';
import { useQueryClient } from '@tanstack/react-query';

interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
  population: number;
  aqi: number;
}

const Index = () => {
  const queryClient = useQueryClient();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

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

  const [isLoading, setIsLoading] = useState(false);

  const handlePolicyChange = (key: string, val: number[]) => {
    setPolicyValues(prev => ({ ...prev, [key]: val[0] }));
  };

  const handleRunSimulation = async () => {
    if (!selectedCity) {
      showError("Please select a city before running the simulation.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await runSimulation({
        city: selectedCity.name,
        ev_percent: policyValues.ev,
        trees_planted: Math.round(policyValues.trees * 10000),
        renewable_percent: policyValues.renewable,
        public_transport_percent: policyValues.transport,
      });

      setResults({
        co2: response.co2_reduction,
        aqi: response.aqi_improvement,
        temp: response.temperature_change,
        score: response.sustainability_score,
      });

      queryClient.invalidateQueries({ queryKey: ["simulations"] });

      showSuccess(`Simulation complete for ${selectedCity.name}!`);
    } catch (error: any) {
      showError(error?.message || "Simulation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
              Simulating a greener future for <span className="text-emerald-600 font-bold">{selectedCity?.name || "..."}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Online</span>
          </div>
        </div>

        {/* Top Section: Map & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MapPanel selectedCity={selectedCity} onSelectCity={setSelectedCity} />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <SimulationControls 
              values={policyValues} 
              onChange={handlePolicyChange} 
              onRun={handleRunSimulation}
              isLoading={isLoading}
            />
            <ResultsPanel {...results} />
          </div>
        </div>

        {/* Data Visualization */}
        <ChartsPanel />

        <SimulationHistory />

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
