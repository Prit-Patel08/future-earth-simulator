"use client";

import React, { useEffect, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from '@tanstack/react-query';
import { getCities, getSimulationHistory } from '@/api/client';
import { showError } from '@/utils/toast';

interface City {
  id: string;
  name: string;
}

interface SimulationRun {
  city_id: string | null;
  ev_adoption: number;
  renewable_energy: number;
  tree_plantation: number;
  public_transport: number;
  co2_result: number;
  aqi_result: number;
  temperature_result: number;
  sustainability_score: number;
  created_at?: string;
}

const SimulationHistory = () => {
  const { data: simulations = [], isLoading: isLoadingRuns, error: runsError } = useQuery({
    queryKey: ["simulations"],
    queryFn: getSimulationHistory,
    staleTime: 60 * 1000,
  });

  const { data: cities = [], error: citiesError } = useQuery({
    queryKey: ["cities"],
    queryFn: getCities,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (runsError) {
      showError(runsError instanceof Error ? runsError.message : "Failed to load simulations.");
    }
  }, [runsError]);

  useEffect(() => {
    if (citiesError) {
      showError(citiesError instanceof Error ? citiesError.message : "Failed to load cities.");
    }
  }, [citiesError]);

  const cityMap = useMemo(() => {
    return new Map((cities as City[]).map((city) => [city.id, city.name]));
  }, [cities]);

  const rows = (simulations as SimulationRun[]).slice(0, 10);

  return (
    <Card className="p-6 border-slate-100 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800">Policy Impact History</h3>
        <p className="text-xs text-slate-500">Latest simulation runs and outcomes</p>
      </div>

      {isLoadingRuns ? (
        <div className="text-sm text-slate-400">Loading simulation history...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>City</TableHead>
              <TableHead>EV Adoption</TableHead>
              <TableHead>Renewables</TableHead>
              <TableHead>AQI Result</TableHead>
              <TableHead>Sustainability</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-400">
                  No simulations yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((run, index) => {
                const dateLabel = run.created_at
                  ? new Date(run.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "--";

                return (
                  <TableRow key={`${run.city_id ?? "city"}-${index}`}>
                    <TableCell className="font-semibold text-slate-700">
                      {run.city_id ? cityMap.get(run.city_id) || "Unknown" : "Unknown"}
                    </TableCell>
                    <TableCell>{Math.round(run.ev_adoption)}%</TableCell>
                    <TableCell>{Math.round(run.renewable_energy)}%</TableCell>
                    <TableCell>{run.aqi_result.toFixed(1)}</TableCell>
                    <TableCell>{Math.round(run.sustainability_score)}/100</TableCell>
                    <TableCell>{dateLabel}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};

export default SimulationHistory;
