import { apiRequest } from "./client";

export const fetchSimulations = () => apiRequest("/simulations");
