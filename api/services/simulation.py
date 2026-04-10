import random
from api.services.elo import build_ratings

def win_prob(ra: float, rb: float) -> float:
    return 1 / (1 + 10 ** ((rb - ra) / 400))

def simulate_match(team_a: str, team_b: str, ratings: dict) -> str:
    ra = ratings.get(team_a, 1500)
    rb = ratings.get(team_b, 1500)
    p = win_prob(ra, rb)
    return team_a if random.random() < p else team_b

GROUPS = {
    "A": ["Argentina", "Morocco", "USA", "Poland"],
    "B": ["France", "Senegal", "Mexico", "Australia"],
    "C": ["Spain", "Nigeria", "Canada", "Switzerland"],
    "D": ["Brazil", "Egypt", "Germany", "Japan"],
    "E": ["England", "Cameroon", "Colombia", "Ecuador"],
    "F": ["Portugal", "Ghana", "Netherlands", "South Korea"],
    "G": ["Belgium", "Algeria", "Croatia", "Tunisia"],
    "H": ["Uruguay", "Turkey", "Denmark", "South Africa"],
    "I": ["Italy", "Ivory Coast", "Norway", "Venezuela"],
    "J": ["Serbia", "Chile", "Czechia", "Uzbekistan"],
    "K": ["Greece", "Paraguay", "Bolivia", "Iraq"],
    "L": ["Panama", "Honduras", "Jamaica", "New Zealand"],
}

def simulate_group(teams: list, ratings: dict) -> list:
    points = {t: 0 for t in teams}
    matchups = [(teams[i], teams[j]) for i in range(len(teams)) for j in range(i+1, len(teams))]
    for a, b in matchups:
        winner = simulate_match(a, b, ratings)
        points[winner] += 3
    return sorted(teams, key=lambda t: points[t], reverse=True)[:2]

def simulate_knockout(teams: list, ratings: dict) -> str:
    while len(teams) > 1:
        next_round = []
        for i in range(0, len(teams), 2):
            if i + 1 < len(teams):
                winner = simulate_match(teams[i], teams[i+1], ratings)
                next_round.append(winner)
            else:
                next_round.append(teams[i])
        teams = next_round
    return teams[0]

def simulate_tournament(ratings: dict) -> str:
    qualifiers = []
    for group_teams in GROUPS.values():
        qualifiers.extend(simulate_group(group_teams, ratings))
    random.shuffle(qualifiers)
    return simulate_knockout(qualifiers, ratings)

def run_simulation(iterations: int = 10000) -> dict:
    ratings = build_ratings()
    wins = {}
    for _ in range(iterations):
        winner = simulate_tournament(ratings)
        wins[winner] = wins.get(winner, 0) + 1
    results = {
        team: round(count / iterations * 100, 2)
        for team, count in sorted(wins.items(), key=lambda x: x[1], reverse=True)
    }
    return {
        "iterations": iterations,
        "win_probabilities": results
    }
