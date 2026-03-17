import { apiRequest } from "./client";

export const fetchChartData = () => apiRequest("/chart-data");
