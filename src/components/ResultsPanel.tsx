"use client";

import React from 'react';
import { Wind, Leaf, Thermometer, Zap } from 'lucide-react';
import { Card } from "@/components/ui/card";

interface ResultsProps {
  co2: number;
  aqi: number;
  temp: number;
  score: number;
}

const ResultsPanel = ({ co2, aqi, temp, score }: ResultsProps) => {
  const stats = [
    { 
      label: 'CO2 Reduction', 
      value: `${co2}%`, 
      icon: Wind, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      desc: 'Annual emissions saved'
    },
    { 
      label: 'AQI Improvement', 
      value: `+${aqi}%`, 
      icon: Zap, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      desc: 'Air quality index gain'
    },
    { 
      label: 'Temp Change', 
      value: `${temp}°C`, 
      icon: Thermometer, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50',
      desc: 'Projected cooling effect'
    },
    { 
      label: 'Sustainability', 
      value: `${score}/100`, 
      icon: Leaf, 
      color: 'text-green-600', 
      bg: 'bg-green-50',
      desc: 'Overall ecosystem health'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-5 border-slate-100 shadow-sm hover:shadow-md transition-shadow bg-white group">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <h4 className="text-2xl font-bold text-slate-800">{stat.value}</h4>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500 border-t border-slate-50 pt-3">
            {stat.desc}
          </p>
        </Card>
      ))}
    </div>
  );
};

export default ResultsPanel;