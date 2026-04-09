from fastapi import APIRouter
from api.services.climate import climate_penalty, top_climate_mismatches
from api.services.elo import build_ratings, predict_match

router = APIRouter()
ratings = build_ratings()

AFRICAN_TEAMS = ["Morocco", "Senegal", "Nigeria", "Egypt", "Cameroon",
                 "Ghana", "Algeria", "Tunisia", "South Africa"]

@router.get("/climate")
def climate(team: str, venue: str):
    return climate_penalty(team, venue)

@router.get("/african-climate-risk")
def african_climate_risk(venue: str = "Vancouver"):
    return top_climate_mismatches(AFRICAN_TEAMS, venue)

@router.get("/top10")
def top_upsets():
    matchups = [
        ("France", "Morocco"), ("Brazil", "Senegal"),
        ("Argentina", "Nigeria"), ("Spain", "Egypt"),
        ("England", "Cameroon"), ("Germany", "Ghana"),
    ]
    results = []
    for home, away in matchups:
        pred = predict_match(home, away, ratings)
        upset_prob = pred["away_win"]
        results.append({**pred, "upset_probability": upset_prob})
    return sorted(results, key=lambda x: x["upset_probability"], reverse=True)
