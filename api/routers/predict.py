from fastapi import APIRouter
from api.services.elo import build_ratings, predict_match

router = APIRouter()
ratings = build_ratings()

@router.get("/health")
def health():
    return {"status": "ok", "router": "predict", "teams_rated": len(ratings)}

@router.get("/match")
def predict(home: str, away: str):
    return predict_match(home, away, ratings)

@router.get("/top")
def top_teams(n: int = 20):
    sorted_teams = sorted(ratings.items(), key=lambda x: x[1], reverse=True)
    return [{"team": t, "elo": round(r)} for t, r in sorted_teams[:n]]
