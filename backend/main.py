from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from db import supabase
from schemas import ChartData, City, SimulationRequest, SimulationResponse, SimulationRun
from simulation_engine import run_simulation

app = FastAPI(title="Future Earth Simulator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/simulate", response_model=SimulationResponse)
def simulate(payload: SimulationRequest) -> SimulationResponse:
    results = run_simulation(payload)

    try:
        city_response = (
            supabase.table("cities")
            .select("id")
            .eq("name", payload.city)
            .limit(1)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to resolve city ID: {str(e)}")

    city_rows = city_response.data or []
    if not city_rows:
        raise HTTPException(status_code=404, detail="City not found.")

    city_id = city_rows[0]["id"]

    insert_payload = {
        "city_id": city_id,
        "ev_adoption": payload.ev_percent,
        "renewable_energy": payload.renewable_percent,
        "tree_plantation": payload.trees_planted,
        "public_transport": payload.public_transport_percent,
        "co2_result": results.co2_reduction,
        "aqi_result": results.aqi_improvement,
        "temperature_result": results.temperature_change,
        "sustainability_score": results.sustainability_score,
    }

    try:
        insert_response = supabase.table("simulation_runs").insert(insert_payload).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store simulation run: {str(e)}")

    return results


@app.get("/cities", response_model=list[City])
def get_cities() -> list[City]:
    try:
        response = (
            supabase.table("cities")
            .select("id,name,lat,lng,population,aqi_baseline")
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch cities: {str(e)}")

    cities = []
    for row in response.data or []:
        cities.append(
            {
                "id": row["id"],
                "name": row["name"],
                "lat": row["lat"],
                "lng": row["lng"],
                "population": row["population"],
                "aqi": row.get("aqi_baseline"),
            }
        )

    return cities


@app.get("/simulations", response_model=list[SimulationRun])
def get_simulations() -> list[SimulationRun]:
    try:
        response = (
            supabase.table("simulation_runs")
            .select(
                "city_id,ev_adoption,renewable_energy,tree_plantation,public_transport,co2_result,aqi_result,temperature_result,sustainability_score,created_at"
            )
            .order("created_at", desc=True)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch simulations: {str(e)}")

    return response.data or []


def _interpolate_series(start: float, end: float, steps: int) -> list[float]:
    if steps <= 1:
        return [round(end, 2)]

    step = (end - start) / (steps - 1)
    return [round(start + step * index, 2) for index in range(steps)]


@app.get("/chart-data", response_model=ChartData)
def get_chart_data() -> ChartData:
    years = [2025, 2030, 2035, 2040]
    base_co2 = 200.0
    base_aqi = 220.0

    try:
        latest_response = (
            supabase.table("simulation_runs")
            .select("co2_result,aqi_result")
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to build chart data: {str(e)}")

    latest = (latest_response.data or [])
    if latest:
        co2_reduction = float(latest[0].get("co2_result") or 0)
        aqi_improvement = float(latest[0].get("aqi_result") or 0)
        target_co2 = max(0.0, base_co2 - co2_reduction)
        target_aqi = max(0.0, base_aqi - aqi_improvement)
    else:
        target_co2 = base_co2
        target_aqi = base_aqi

    return {
        "years": years,
        "co2": _interpolate_series(base_co2, target_co2, len(years)),
        "aqi": _interpolate_series(base_aqi, target_aqi, len(years)),
    }
