import { apiRequest } from "./client";

export const fetchCities = () => apiRequest("/cities");
