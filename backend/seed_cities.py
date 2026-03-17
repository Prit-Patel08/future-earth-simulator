from db import supabase

cities = [
    {"name": "Mumbai", "lat": 19.0760, "lng": 72.8777, "population": 20411000, "aqi_baseline": 165},
    {"name": "Delhi", "lat": 28.6139, "lng": 77.2090, "population": 31181000, "aqi_baseline": 350},
    {"name": "Bangalore", "lat": 12.9716, "lng": 77.5946, "population": 12765000, "aqi_baseline": 95},
    {"name": "Kolkata", "lat": 22.5726, "lng": 88.3639, "population": 14974000, "aqi_baseline": 180},
    {"name": "Chennai", "lat": 13.0827, "lng": 80.2707, "population": 11235000, "aqi_baseline": 85},
    {"name": "Hyderabad", "lat": 17.3850, "lng": 78.4867, "population": 10269000, "aqi_baseline": 110},
    {"name": "Ahmedabad", "lat": 23.0225, "lng": 72.5714, "population": 8253000, "aqi_baseline": 140},
    {"name": "Pune", "lat": 18.5204, "lng": 73.8567, "population": 6987000, "aqi_baseline": 120}
]

for city in cities:
    # Check if city already exists
    response = supabase.table("cities").select("id").eq("name", city["name"]).execute()
    if not response.data:
        print(f"Adding {city['name']}...")
        supabase.table("cities").insert(city).execute()
    else:
        print(f"{city['name']} already exists.")

print("Seeding complete.")
