export const FALLBACK_CITIES = [
  { id: "1", name: "Mumbai", lat: 19.0760, lng: 72.8777, population: 20411000, aqi: 165 },
  { id: "2", name: "Delhi", lat: 28.6139, lng: 77.2090, population: 31181000, aqi: 350 },
  { id: "3", name: "Bangalore", lat: 12.9716, lng: 77.5946, population: 12765000, aqi: 95 },
  { id: "4", name: "Kolkata", lat: 22.5726, lng: 88.3639, population: 14974000, aqi: 180 },
  { id: "5", name: "Chennai", lat: 13.0827, lng: 80.2707, population: 11235000, aqi: 85 },
  { id: "6", name: "Hyderabad", lat: 17.3850, lng: 78.4867, population: 10269000, aqi: 110 },
  { id: "7", name: "Ahmedabad", lat: 23.0225, lng: 72.5714, population: 8253000, aqi: 140 },
  { id: "8", name: "Pune", lat: 18.5204, lng: 73.8567, population: 6987000, aqi: 120 }
];

export const FALLBACK_HISTORY = [
  {
    city_id: "1",
    ev_adoption: 20,
    renewable_energy: 30,
    tree_plantation: 50,
    public_transport: 40,
    co2_result: 15.5,
    aqi_result: 25.0,
    temperature_result: -0.2,
    sustainability_score: 72,
    created_at: new Date().toISOString()
  }
];
