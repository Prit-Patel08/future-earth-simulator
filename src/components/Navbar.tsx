"use client";

import React from 'react';
import { Globe, Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-emerald-500 rounded-lg">
          <Globe className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600">
          Future Earth Simulator
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Home</a>
        <a href="#" className="text-sm font-medium text-emerald-600 border-b-2 border-emerald-600 pb-1">Simulator</a>
        <a href="#" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">About</a>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6">
          Sign In
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;