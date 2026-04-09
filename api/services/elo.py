import pandas as pd
from pathlib import Path

DATA_PATH = Path("data/raw/results.csv")
DEFAULT_RATING = 1500
K_FACTORS = {
    "FIFA World Cup": 60,
    "UEFA Euro": 50,
    "Copa América": 50,
    "Africa Cup of Nations": 50,
    "FIFA World Cup qualification": 40,
    "Friendly": 20,
}

def get_k(tournament: str) -> int:
    for key, k in K_FACTORS.items():
        if key in tournament:
            return k
    return 30

def expected(ra: float, rb: float) -> float:
    return 1 / (1 + 10 ** ((rb - ra) / 400))

def build_ratings() -> dict:
    df = pd.read_csv(DATA_PATH)
    df["date"] = pd.to_datetime(df["date"])
    df = df[df["date"].dt.year >= 1990].sort_values("date")

    ratings = {}

    for _, row in df.iterrows():
        home = row["home_team"]
        away = row["away_team"]
        hs = row["home_score"]
        as_ = row["away_score"]
        tournament = str(row["tournament"])

        ra = ratings.get(home, DEFAULT_RATING)
        rb = ratings.get(away, DEFAULT_RATING)

        if hs > as_:
            actual_h, actual_a = 1, 0
        elif hs < as_:
            actual_h, actual_a = 0, 1
        else:
            actual_h, actual_a = 0.5, 0.5

        ea = expected(ra, rb)
        k = get_k(tournament)

        ratings[home] = ra + k * (actual_h - ea)
        ratings[away] = rb + k * (actual_a - (1 - ea))

    return ratings

def predict_match(home: str, away: str, ratings: dict) -> dict:
    ra = ratings.get(home, DEFAULT_RATING)
    rb = ratings.get(away, DEFAULT_RATING)
    ea = expected(ra, rb)
    draw_factor = 0.22
    hw = round(ea * (1 - draw_factor), 3)
    aw = round((1 - ea) * (1 - draw_factor), 3)
    draw = round(1 - hw - aw, 3)
    return {
        "home": home,
        "away": away,
        "home_elo": round(ra),
        "away_elo": round(rb),
        "home_win": hw,
        "draw": draw,
        "away_win": aw,
    }
