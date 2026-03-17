"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const data = [
  { year: '2024', co2: 100, aqi: 45 },
  { year: '2026', co2: 85, aqi: 52 },
  { year: '2028', co2: 70, aqi: 65 },
  { year: '2030', co2: 55, aqi: 78 },
  { year: '2032', co2: 40, aqi: 85 },
  { year: '2034', co2: 25, aqi: 92 },
];

const scoreData = [
  { name: 'Biodiversity', value: 75, color: '#10b981' },
  { name: 'Water Quality', value: 82, color: '#3b82f6' },
  { name: 'Waste Mgmt', value: 64, color: '#f59e0b' },
  { name: 'Energy Eff.', value: 91, color: '#8b5cf6' },
];

const ChartsPanel = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6 border-slate-100 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800">CO2 Emission Projection</h3>
          <p className="text-xs text-slate-500">Projected annual metric tons (normalized)</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="co2" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCo2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6 border-slate-100 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800">Sustainability Metrics</h3>
          <p className="text-xs text-slate-500">Current performance across key sectors</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoreData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}}
                width={100}
              />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
                {scoreData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default ChartsPanel;