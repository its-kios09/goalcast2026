from fastapi import APIRouter, Query
from api.services.simulation import run_simulation, simulate_match
from api.services.elo import build_ratings

router = APIRouter()

@router.get("/tournament")
def tournament(iterations: int = Query(default=1000, le=10000)):
    return run_simulation(iterations)

@router.get("/match")
def match(home: str, away: str, iterations: int = Query(default=1000, le=10000)):
    ratings = build_ratings()
    wins = {home: 0, away: 0}
    for _ in range(iterations):
        winner = simulate_match(home, away, ratings)
        wins[winner] += 1
    return {
        "home": home,
        "away": away,
        "iterations": iterations,
        home: round(wins[home] / iterations * 100, 1),
        away: round(wins[away] / iterations * 100, 1),
    }
