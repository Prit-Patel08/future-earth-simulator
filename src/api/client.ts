import { FALLBACK_CITIES, FALLBACK_HISTORY } from './fallbackData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: HeadersInit;
};

const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { method = "GET", body, headers } = options;

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json() as T;
  } catch (error) {
    console.error(`API request to ${path} failed:`, error);
    
    // Graceful fallback for demo purposes
    if (path === "/cities") return FALLBACK_CITIES as unknown as T;
    if (path === "/simulations") return FALLBACK_HISTORY as unknown as T;
    if (path === "/simulate" && method === "POST") {
      // Mock successful simulation response
      return {
        co2_reduction: 15.0,
        aqi_improvement: 20.0,
        temperature_change: -0.1,
        sustainability_score: 75.0,
        message: "Simulation successful (Demo Mode)"
      } as unknown as T;
    }
    
    throw error;
  }
};

export const getCities = () => apiRequest("/cities");

export const runSimulation = (payload: {
  city: string;
  ev_percent: number;
  trees_planted: number;
  renewable_percent: number;
  public_transport_percent: number;
}) =>
  apiRequest("/simulate", {
    method: "POST",
    body: payload,
  });

export const getSimulationHistory = () => apiRequest("/simulations");
