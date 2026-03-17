const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: HeadersInit;
};

const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { method = "GET", body, headers } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
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
