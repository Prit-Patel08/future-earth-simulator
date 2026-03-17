"use client";

import React, { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useQuery } from '@tanstack/react-query';
import { getSimulationHistory } from '@/api/client';
import { showError } from '@/utils/toast';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const ChartsPanel = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["simulations"],
    queryFn: getSimulationHistory,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (error) {
      showError(error instanceof Error ? error.message : "Failed to load chart data.");
    }
  }, [error]);

  const runs = ((data as any[]) ?? []).slice(0, 10).reverse();
  const labels = runs.map((run: any, index: number) => {
    if (!run?.created_at) return `Run ${index + 1}`;
    return new Date(run.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  });

  const co2Data = {
    labels,
    datasets: [
      {
        label: "CO2",
        data: runs.map((run: { co2_result: number }) => run.co2_result),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const aqiData = {
    labels,
    datasets: [
      {
        label: "AQI",
        data: runs.map((run: { aqi_result: number }) => run.aqi_result),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#f8fafc",
        bodyColor: "#e2e8f0",
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8", font: { size: 12 } },
      },
      y: {
        grid: { color: "#f1f5f9" },
        ticks: { color: "#94a3b8", font: { size: 12 } },
      },
    },
  } as const;

  const latestScore = runs.length > 0 ? runs[runs.length - 1].sustainability_score : 0;
  const gaugeData = {
    labels: ["Score", "Remaining"],
    datasets: [
      {
        data: [latestScore, Math.max(0, 100 - latestScore)],
        backgroundColor: ["#10b981", "#e2e8f0"],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const gaugeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    rotation: -90,
    circumference: 180,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  } as const;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="p-6 border-slate-100 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800">CO2 Reduction Projection</h3>
          <p className="text-xs text-slate-500">Projected emissions reduction (normalized)</p>
        </div>
        <div className="h-[300px] w-full">
          {isLoading || runs.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center text-sm text-slate-400">
              {isLoading ? "Loading chart..." : "Run a simulation to populate the chart."}
            </div>
          ) : (
            <Line data={co2Data} options={commonOptions} />
          )}
        </div>
      </Card>

      <Card className="p-6 border-slate-100 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800">AQI Projection</h3>
          <p className="text-xs text-slate-500">Projected air quality improvement (normalized)</p>
        </div>
        <div className="h-[300px] w-full">
          {isLoading || runs.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center text-sm text-slate-400">
              {isLoading ? "Loading chart..." : "Run a simulation to populate the chart."}
            </div>
          ) : (
            <Line data={aqiData} options={commonOptions} />
          )}
        </div>
      </Card>

      <Card className="p-6 border-slate-100 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800">Sustainability Score</h3>
          <p className="text-xs text-slate-500">Latest simulation score</p>
        </div>
        <div className="h-[300px] w-full flex items-center justify-center">
          {isLoading || runs.length === 0 ? (
            <div className="text-sm text-slate-400">
              {isLoading ? "Loading score..." : "Run a simulation to see the score."}
            </div>
          ) : (
            <div className="relative h-[220px] w-full max-w-[260px]">
              <Doughnut data={gaugeData} options={gaugeOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800">
                <span className="text-3xl font-bold">{Math.round(latestScore)}</span>
                <span className="text-xs text-slate-500 uppercase tracking-widest">Score</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ChartsPanel;
