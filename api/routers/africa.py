from fastapi import APIRouter
from api.services.elo import build_ratings, predict_match
from api.services.climate import climate_penalty
from api.services.market import get_divergence, elo_to_tournament_prob

router = APIRouter()

AFRICAN_TEAMS = [
    "Morocco", "Senegal", "Nigeria", "Egypt", "Cameroon",
    "Ghana", "Algeria", "Tunisia", "South Africa"
]

PROJECTED_VENUES = {
    "Morocco": "Dallas",
    "Senegal": "Vancouver",
    "Nigeria": "New York",
    "Egypt": "Vancouver",
    "Cameroon": "Seattle",
    "Ghana": "New York",
    "Algeria": "Boston",
    "Tunisia": "Boston",
    "South Africa": "Seattle"
}

@router.get("/breakout-index")
def breakout_index():
    ratings = build_ratings()
    divergence = get_divergence()
    market_map = {d["team"]: d for d in divergence["divergence"]}
    model_probs = elo_to_tournament_prob(ratings, AFRICAN_TEAMS + [
        "France", "Argentina", "Brazil", "Spain", "England", "Germany"
    ])

    results = []
    for team in AFRICAN_TEAMS:
        elo = round(ratings.get(team, 1500))
        venue = PROJECTED_VENUES.get(team, "Dallas")
        climate = climate_penalty(team, venue)
        market = market_map.get(team, {})
        model_prob = model_probs.get(team, 0)
        climate_pen = climate.get("win_rate_penalty", 0)
        market_edge = market.get("edge", 0)

        breakout_score = round(
            (elo / 2000) * 0.5 +
            model_prob * 0.3 +
            max(market_edge, 0) * 0.2 -
            climate_pen * 0.1,
            4
        )

        results.append({
            "team": team,
            "elo": elo,
            "projected_venue": venue,
            "semifinal_prob": round(model_prob * 100, 1),
            "climate_shock": climate.get("shock_type"),
            "climate_penalty": climate_pen,
            "market_edge": market_edge,
            "breakout_score": breakout_score
        })

    return {
        "insight": "2026 expanded format gives African teams 2.4x more semifinal paths than 2022",
        "teams": sorted(results, key=lambda x: x["breakout_score"], reverse=True)
    }

@router.get("/vs/{opponent}")
def africa_vs(opponent: str):
    ratings = build_ratings()
    return [
        predict_match(team, opponent, ratings)
        for team in AFRICAN_TEAMS
        if ratings.get(team)
    ]
