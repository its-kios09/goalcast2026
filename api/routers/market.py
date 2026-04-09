from fastapi import APIRouter
from api.services.market import get_divergence

router = APIRouter()

@router.get("/divergence")
def divergence():
    return get_divergence()

@router.get("/undervalued")
def undervalued():
    return [t for t in get_divergence() if t["signal"] == "undervalued"]

@router.get("/overvalued")
def overvalued():
    return [t for t in get_divergence() if t["signal"] == "overvalued"]
