from schemas import SimulationRequest, SimulationResponse


def run_simulation(payload: SimulationRequest) -> SimulationResponse:
    co2_reduction = (
        (payload.ev_percent * 0.4)
        + (payload.renewable_percent * 0.3)
        + (payload.public_transport_percent * 0.2)
        + ((payload.trees_planted / 1_000_000) * 0.1)
    )

    aqi_improvement = co2_reduction * 0.8
    temperature_change = -(co2_reduction * 0.05)
    sustainability_score = min(100.0, co2_reduction * 1.5)

    return SimulationResponse(
        co2_reduction=co2_reduction,
        aqi_improvement=aqi_improvement,
        temperature_change=temperature_change,
        sustainability_score=sustainability_score,
    )
