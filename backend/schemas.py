from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class SimulationRequest(BaseModel):
    city: str = Field(..., min_length=1, description="City name")
    ev_percent: float = Field(..., ge=0, le=100, description="Percent of EV adoption")
    trees_planted: int = Field(..., ge=0, description="Number of trees planted")
    renewable_percent: float = Field(..., ge=0, le=100, description="Percent renewable energy")
    public_transport_percent: float = Field(..., ge=0, le=100, description="Percent public transport usage")


class SimulationResponse(BaseModel):
    co2_reduction: float
    aqi_improvement: float
    temperature_change: float
    sustainability_score: float


class City(BaseModel):
    id: str
    name: str
    lat: float
    lng: float
    population: int
    aqi: int


class SimulationRun(BaseModel):
    city_id: Optional[str] = None
    ev_adoption: float
    renewable_energy: float
    tree_plantation: float
    public_transport: float
    co2_result: float
    aqi_result: float
    temperature_result: float
    sustainability_score: float
    created_at: Optional[datetime] = None


class ChartData(BaseModel):
    years: list[int]
    co2: list[float]
    aqi: list[float]
