import { apiRequest } from "./client";

export const runSimulation = (data) =>
  apiRequest("/simulate", {
    method: "POST",
    body: data,
  });
