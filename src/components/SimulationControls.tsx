"use client";

import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from 'lucide-react';

interface ControlsProps {
  values: {
    ev: number;
    trees: number;
    renewable: number;
    transport: number;
  };
  onChange: (key: string, val: number[]) => void;
  onRun: () => void;
}

const SimulationControls = ({ values, onChange, onRun }: ControlsProps) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Policy Parameters</h3>
          <p className="text-sm text-slate-500">Adjust sliders to simulate environmental impact</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-full text-slate-500 border-slate-200">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700">EV Adoption Rate</label>
            <span className="text-sm font-mono bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{values.ev}%</span>
          </div>
          <Slider 
            value={[values.ev]} 
            onValueChange={(val) => onChange('ev', val)} 
            max={100} 
            step={1} 
            className="py-4"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700">Trees Planted</label>
            <span className="text-sm font-mono bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded">{(values.trees * 10000).toLocaleString()}</span>
          </div>
          <Slider 
            value={[values.trees]} 
            onValueChange={(val) => onChange('trees', val)} 
            max={100} 
            step={1} 
            className="py-4"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700">Renewable Energy Usage</label>
            <span className="text-sm font-mono bg-orange-50 text-orange-600 px-2 py-0.5 rounded">{values.renewable}%</span>
          </div>
          <Slider 
            value={[values.renewable]} 
            onValueChange={(val) => onChange('renewable', val)} 
            max={100} 
            step={1} 
            className="py-4"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700">Public Transport Usage</label>
            <span className="text-sm font-mono bg-purple-50 text-purple-600 px-2 py-0.5 rounded">{values.transport}%</span>
          </div>
          <Slider 
            value={[values.transport]} 
            onValueChange={(val) => onChange('transport', val)} 
            max={100} 
            step={1} 
            className="py-4"
          />
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Button 
          onClick={onRun}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-6 rounded-2xl text-lg font-bold shadow-lg shadow-emerald-200 transition-all hover:scale-105 active:scale-95"
        >
          <Play className="w-5 h-5 mr-2 fill-current" />
          Run Simulation
        </Button>
      </div>
    </div>
  );
};

export default SimulationControls;