"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from 'lucide-react';

const FuturePredictionCard = () => {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white border-none shadow-2xl">
      <div className="absolute top-0 right-0 p-12 opacity-10">
        <Sparkles size={120} />
      </div>
      
      <div className="relative z-10 max-w-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6 border border-emerald-500/30">
          <Sparkles size={14} />
          AI Prediction Engine
        </div>
        
        <h2 className="text-3xl font-bold mb-4 leading-tight">
          Visualize the Earth in <span className="text-emerald-400">2035</span>
        </h2>
        
        <p className="text-slate-400 mb-8 leading-relaxed">
          Our advanced neural models process your policy decisions to generate a high-fidelity visual and data-driven prediction of the future environment.
        </p>
        
        <Button className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-6 rounded-2xl font-bold text-lg group">
          Show Future 2035
          <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
        <div>
          <p className="text-2xl font-bold text-emerald-400">-2.4°C</p>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Global Cooling</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-400">+40%</p>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Forest Cover</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-purple-400">Net Zero</p>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Carbon Status</p>
        </div>
      </div>
    </Card>
  );
};

export default FuturePredictionCard;