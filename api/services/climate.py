import json
from pathlib import Path

VENUES_PATH = Path("data/raw/venues.json")
CLIMATES_PATH = Path("data/raw/team_climates.json")
PENALTY_THRESHOLD = 15
PENALTY_PER_DEGREE = 0.012

def load_data():
    with open(VENUES_PATH) as f:
        venues = {v["city"]: v for v in json.load(f)["venues"]}
    with open(CLIMATES_PATH) as f:
        climates = json.load(f)
    return venues, climates

def climate_penalty(team: str, venue_city: str) -> dict:
    venues, climates = load_data()
    team_temp = climates.get(team)
    venue = venues.get(venue_city)

    if not team_temp or not venue:
        return {"error": "team or venue not found"}

    venue_temp = venue["avg_temp_june"]
    delta = venue_temp - team_temp
    shock_type = None
    penalty = 0.0

    if delta < -PENALTY_THRESHOLD:
        shock_type = "cold_shock"
        penalty = abs(delta) * PENALTY_PER_DEGREE
    elif delta > 10:
        shock_type = "warm_shock"
        penalty = delta * (PENALTY_PER_DEGREE / 2)

    return {
        "team": team,
        "venue": venue_city,
        "team_avg_temp": team_temp,
        "venue_avg_temp": venue_temp,
        "delta": round(delta, 1),
        "shock_type": shock_type,
        "win_rate_penalty": round(penalty, 3),
        "insight": f"{team} faces a {abs(delta)}°C {shock_type or 'neutral'} in {venue_city}"
    }

def top_climate_mismatches(teams: list, venue_city: str) -> list:
    results = [climate_penalty(t, venue_city) for t in teams]
    results = [r for r in results if "error" not in r]
    return sorted(results, key=lambda x: abs(x["delta"]), reverse=True)
