import json
import math
from pathlib import Path
from api.services.elo import build_ratings

MARKET_PATH = Path("data/raw/market_odds.json")

TRACKED_TEAMS = [
    "France", "Argentina", "England", "Brazil", "Spain", "Germany",
    "Portugal", "Netherlands", "USA", "Morocco", "Senegal", "Croatia",
    "Colombia", "Turkey", "Nigeria", "Egypt"
]

def load_market() -> dict:
    with open(MARKET_PATH) as f:
        return json.load(f)

def elo_to_tournament_prob(ratings: dict, teams: list) -> dict:
    def win_prob(ra, rb):
        return 1 / (1 + 10 ** ((rb - ra) / 400))

    raw = {}
    for team in teams:
        ra = ratings.get(team, 1500)
        score = 0
        opponents = [t for t in teams if t != team]
        for opp in opponents:
            rb = ratings.get(opp, 1500)
            score += math.log(win_prob(ra, rb) + 1e-9)
        raw[team] = math.exp(score / len(opponents))

    total = sum(raw.values())
    return {t: round(v / total, 4) for t, v in raw.items()}

def get_divergence() -> dict:
    ratings = build_ratings()
    market_data = load_market()
    market_odds = market_data["world_cup_winner"]
    model_probs = elo_to_tournament_prob(ratings, TRACKED_TEAMS)

    results = []
    for team in TRACKED_TEAMS:
        market_prob = market_odds.get(team, 0)
        model_prob = model_probs.get(team, 0)
        edge = round(model_prob - market_prob, 4)
        results.append({
            "team": team,
            "model_prob": model_prob,
            "market_prob": market_prob,
            "edge": edge,
            "edge_pct": f"{'+' if edge > 0 else ''}{round(edge * 100, 1)}%",
            "signal": "undervalued" if edge > 0.01 else "overvalued" if edge < -0.01 else "fair"
        })

    return {
        "source": "Polymarket",
        "note": "Seeded April 2026 — live feed activates when market opens pre-tournament",
        "divergence": sorted(results, key=lambda x: x["edge"], reverse=True)
    }
